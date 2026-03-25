require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { appendToSheet, getPendingDocuments, getDocumentByDocNo, updateDocumentStatus, getUserByEmail, getAllDocuments, updateUserPassword } = require('./services/googleSheets');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main route for form submission
app.post('/api/forms/submit', authMiddleware, async (req, res) => {
  try {
    const { formType, formData } = req.body;
    
    // Validate request
    if (!formType || !formData) {
      return res.status(400).json({ success: false, message: 'Missing formType or formData' });
    }

    // Call Google Sheets service
    const result = await appendToSheet(formType, formData);
    
    res.status(200).json({ success: true, message: 'Data saved to Google Sheets successfully!', result });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ===== Phase 2: Approval APIs =====

// Get all pending documents
app.get('/api/approvals/pending', authMiddleware, async (req, res) => {
  try {
    const docs = await getPendingDocuments();
    res.status(200).json({ success: true, data: docs });
  } catch (error) {
    console.error('Error fetching pending docs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get my documents (for requester) — MUST be before :docNo route
app.get('/api/forms/my-documents', authMiddleware, async (req, res) => {
  try {
    const docs = await getAllDocuments();
    res.status(200).json({ success: true, data: docs });
  } catch (error) {
    console.error('Error fetching my documents:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a single document by docNo
app.get('/api/forms/:docNo', authMiddleware, async (req, res) => {
  try {
    const doc = await getDocumentByDocNo(req.params.docNo);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve a document
app.post('/api/approvals/:docNo/approve', authMiddleware, async (req, res) => {
  try {
    const result = await updateDocumentStatus(req.params.docNo, 'approved');
    res.status(200).json({ success: true, message: 'Document approved!', data: result });
  } catch (error) {
    console.error('Error approving document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reject a document
app.post('/api/approvals/:docNo/reject', authMiddleware, async (req, res) => {
  try {
    const result = await updateDocumentStatus(req.params.docNo, 'rejected');
    res.status(200).json({ success: true, message: 'Document rejected.', data: result });
  } catch (error) {
    console.error('Error rejecting document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== Auth APIs =====

// Login by email
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'กรุณาระบุ email และรหัสผ่าน' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้ในระบบ กรุณาติดต่อผู้ดูแลระบบ' });
    }

    if (!user.password) {
      return res.status(401).json({ success: false, message: 'ผู้ใช้นี้ยังไม่ได้ตั้งรหัสผ่านในระบบ' });
    }

    let isMatch = false;
    // Check if password is already hashed
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password, check match and auto-hash it
      if (user.password === password) {
        isMatch = true;
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateUserPassword(user.rowIndex, hashedPassword);
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { name: user.name, email: user.email, role: user.role, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    const { password: _, rowIndex: __, ...userData } = user;

    res.status(200).json({ success: true, data: userData, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user from token
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
