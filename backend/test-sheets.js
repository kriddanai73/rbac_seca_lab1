require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function test() {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    console.log("Testing Spreadsheet ID:", spreadsheetId);
    
    // First let's just get the spreadsheet metadata to see the sheet names
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    console.log("Success! connected to Spreadsheet.");
    console.log("Available Sheet Tabs:");
    response.data.sheets.forEach(s => console.log(" - " + s.properties.title));
  } catch (err) {
    console.error("Error connecting to Google Sheets:");
    console.error(err.message);
  }
}

test();
