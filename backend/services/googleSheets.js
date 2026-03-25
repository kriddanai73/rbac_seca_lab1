const { google } = require('googleapis');
const path = require('path');

// Configure Auth using the credentials.json file
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Appends data to a Google Sheet
 * @param {string} sheetName - The name of the sheet tab (e.g., 'PaymentApproval' or 'CashAdvance')
 * @param {object} data - The form data object
 */
const appendToSheet = async (sheetName, data) => {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  
  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID is not defined in .env file');
  }

  // Convert data object to an array of values based on form type
  // This is a generic mapper, you may need to adjust the order to match your Sheet columns
  const values = transformDataToRow(sheetName, data);

  const resource = {
    values: [values],
  };

  try {
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:A`, // Appends to the first available row in the specified sheet tab
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource,
    });
    
    return result;
  } catch (error) {
    console.error(`Error appending to sheet (${sheetName}):`, error.message);
    throw error;
  }
};

/**
 * Transforms JSON form data into an array of values for Google Sheets.
 * The order of values here MUST match the column order in your Google Sheet.
 */
function transformDataToRow(formType, data) {
  // Common fields (e.g., timestamp)
  const timestamp = new Date().toISOString();

  // Format items nicely for readability in the sheet
  let itemsString = '';
  if (data.items && Array.isArray(data.items)) {
    itemsString = data.items
      .filter(item => item.description || item.amount || item.acName)
      .map(item => `- ${item.description || item.acName || 'รายการ'} : ${item.amount || '0'} บาท`)
      .join('\n');
  }

  // Create different row structures based on the form type
  switch (formType) {
    case 'PaymentApproval':
      // Map properties to array based on the form fields
      return [
        timestamp,
        data.docNo || '',
        data.date || '',
        data.payeeName || '',
        data.payeeAddress || '',
        data.paymentMethod || '',
        data.bankName || '',
        data.bankAccount || '',
        itemsString,
        data.totalAmount || '',
        data.totalAmountText || '',
        data.purpose || '',
        data.deductionName || '',
        data.deductionAmount || '',
        data.netAmount || '',
        data.approvers ? JSON.stringify(data.approvers) : '',
        data.status || 'draft',
        JSON.stringify(data)
      ];
      
    case 'CashAdvance':
      return [
        timestamp,
        data.docNo || '',
        data.date || '',
        data.employeeName || '',
        data.department || '',
        data.objective || '',
        itemsString,
        data.totalAmount || '',
        data.totalAmountText || '',
        data.dueDate || '',
        data.approvers ? JSON.stringify(data.approvers) : '',
        data.status || 'draft',
        JSON.stringify(data)
      ];

    case 'CashAllowance':
      return [
        timestamp,
        data.docNo || '',
        data.date || '',
        data.employeeName || '',
        data.department || '',
        itemsString,
        data.totalAmount || '',
        data.totalAmountText || '',
        data.approvers ? JSON.stringify(data.approvers) : '',
        data.status || 'draft',
        JSON.stringify(data)
      ];

    default:
      // Fallback: just dump all values in whatever order they come
      return [timestamp, ...Object.keys(data).map(k => typeof data[k] === 'object' ? JSON.stringify(data[k]) : data[k])];
  }
}

/**
 * The sheet tabs we support
 */
const SHEET_TABS = ['PaymentApproval', 'CashAdvance', 'CashAllowance'];

/**
 * Reads all rows from a sheet tab and returns them as objects.
 * Assumes row 1 is NOT a header (raw data rows starting from row 1).
 * The docNo is always in column B (index 1) and status is the LAST column.
 */
const getRowsFromSheet = async (sheetName) => {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is not defined in .env file');

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    });
    return result.data.values || [];
  } catch (error) {
    // If sheet tab doesn't exist, return empty
    if (error.code === 400) return [];
    throw error;
  }
};

/**
 * Gets all pending documents across all sheet tabs.
 */
const getPendingDocuments = async () => {
  const allPending = [];

  for (const tab of SHEET_TABS) {
    const rows = await getRowsFromSheet(tab);
    rows.forEach((row, index) => {
      const status = row[row.length - 2]; // second-to-last column is status (last is JSON)
      if (status === 'pending') {
        // Try to parse formData JSON from last column
        let formData = null;
        try { formData = JSON.parse(row[row.length - 1]); } catch(e) {}
        
        allPending.push({
          sheetName: tab,
          rowIndex: index + 1, // 1-indexed for Sheets API
          timestamp: row[0] || '',
          docNo: row[1] || '',
          date: row[2] || '',
          totalAmount: row.length > 3 ? (row[9] || row[7] || '') : '',
          status: status,
          formData,
          rawRow: row
        });
      }
    });
  }

  return allPending;
};

/**
 * Gets a single document by its docNo across all sheet tabs.
 */
const getDocumentByDocNo = async (docNo) => {
  for (const tab of SHEET_TABS) {
    const rows = await getRowsFromSheet(tab);
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][1] === docNo) {
        // Try to parse formData JSON from last column
        let formData = null;
        try { formData = JSON.parse(rows[i][rows[i].length - 1]); } catch(e) {}
        
        return {
          sheetName: tab,
          rowIndex: i + 1,
          timestamp: rows[i][0] || '',
          docNo: rows[i][1] || '',
          date: rows[i][2] || '',
          status: rows[i][rows[i].length - 2] || '', // second-to-last is status
          formData,
          rawRow: rows[i]
        };
      }
    }
  }
  return null;
};

/**
 * Updates the status column of a document identified by docNo.
 */
const updateDocumentStatus = async (docNo, newStatus) => {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is not defined in .env file');

  const doc = await getDocumentByDocNo(docNo);
  if (!doc) throw new Error(`Document ${docNo} not found`);

  const statusColIndex = doc.rawRow.length - 2; // second-to-last (last is JSON)
  // Convert column index to letter (A=0, B=1, ...)
  const colLetter = String.fromCharCode(65 + statusColIndex);
  const range = `${doc.sheetName}!${colLetter}${doc.rowIndex}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [[newStatus]] },
  });

  return { docNo, oldStatus: doc.status, newStatus, sheetName: doc.sheetName };
};

/**
 * Gets a user by email from the Users tab.
 * Users tab has a header row: name, email, role, department, password
 */
const getUserByEmail = async (email) => {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is not defined in .env file');

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Users!A:E',
    });
    const rows = result.data.values || [];
    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] && row[1].trim().toLowerCase() === email.trim().toLowerCase()) {
        return {
          name: row[0] || '',
          email: row[1] || '',
          password: row[2] || '',
          role: row[3] || 'requester',
          department: row[4] || '',
          rowIndex: i + 1 // needed for password update
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading Users tab:', error.message);
    throw error;
  }
};

/**
 * Gets all documents, optionally filtered by requester email.
 * Looks for the email in column index that stores requester info.
 */
const getAllDocuments = async (filterEmail, filterStatus) => {
  const allDocs = [];

  for (const tab of SHEET_TABS) {
    const rows = await getRowsFromSheet(tab);
    rows.forEach((row, index) => {
      const status = row[row.length - 2] || ''; // second-to-last (last is JSON)
      const docNo = row[1] || '';
      const date = row[2] || '';
      const timestamp = row[0] || '';

      // Apply status filter if provided
      if (filterStatus && status !== filterStatus) return;

      allDocs.push({
        sheetName: tab,
        rowIndex: index + 1,
        timestamp,
        docNo,
        date,
        totalAmount: row.length > 3 ? (row[9] || row[7] || '') : '',
        status,
        rawRow: row
      });
    });
  }

  return allDocs;
};

/**
 * Updates a user's password in the Users sheet (used for auto-hashing plain passwords).
 */
const updateUserPassword = async (rowIndex, hashedPassword) => {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is not defined in .env file');

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Users!C${rowIndex}`,
    valueInputOption: 'RAW',
    resource: { values: [[hashedPassword]] },
  });
};

module.exports = {
  appendToSheet,
  getPendingDocuments,
  getDocumentByDocNo,
  updateDocumentStatus,
  getUserByEmail,
  updateUserPassword,
  getAllDocuments
};
