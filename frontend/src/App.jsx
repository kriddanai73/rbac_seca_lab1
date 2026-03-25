import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import PaymentApprovalForm from './pages/PaymentApprovalForm';
import CashAdvanceForm from './pages/CashAdvanceForm';
import CashAllowanceForm from './pages/CashAllowanceForm';
import PendingApprovalPage from './pages/PendingApprovalPage';
import ApproverDashboard from './pages/ApproverDashboard';
import ApprovalDetail from './pages/ApprovalDetail';
import LoginPage from './pages/LoginPage';
import MyDocuments from './pages/MyDocuments';
import { FileText, Landmark, Receipt, ClipboardList, FolderOpen, LogOut, User } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeForm, setActiveForm] = useState('home');
  const [selectedDocNo, setSelectedDocNo] = useState(null);
  const [printFormData, setPrintFormData] = useState(null);
  const [printFormType, setPrintFormType] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const result = await res.json();
          if (result.success) {
            setCurrentUser(result.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Check auth error:', error);
        }
      }
      setIsInitializing(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    // Every user starts at home/menu
    setActiveForm('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setActiveForm('home');
    setSelectedDocNo(null);
  };

  const handleViewDetail = (docNo) => {
    setSelectedDocNo(docNo);
    setActiveForm('approvalDetail');
  };

  const handlePrint = (docNo, sheetName) => {
    const savedJson = localStorage.getItem(`formData_${docNo}`);
    if (!savedJson) {
      Swal.fire({
        title: 'ไม่พบข้อมูลฟอร์ม',
        text: 'ไม่พบข้อมูลฟอร์มที่บันทึกไว้ กรุณากรอกฟอร์มใหม่แล้วส่งอีกครั้ง',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#dc2626'
      });
      return;
    }
    const data = JSON.parse(savedJson);
    data.status = 'approved'; // Override to approved for print
    setPrintFormData(data);

    // Map sheetName to form type
    const typeMap = { PaymentApproval: 'printPayment', CashAdvance: 'printAdvance', CashAllowance: 'printAllowance' };
    setPrintFormType(typeMap[sheetName] || 'printPayment');
    setActiveForm(typeMap[sheetName] || 'printPayment');
  };

  const isApprover = currentUser && (currentUser.role === 'approver' || currentUser.role === 'admin');
  const isApproverOnly = currentUser && currentUser.role === 'approver'; // hides form tabs, admin sees all

  if (isInitializing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-light)', fontWeight: 'bold' }}>กำลังโหลดระบบเอกสารอนุมัติ...</p>
      </div>
    );
  }

  // If not logged in, show login page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* User bar */}
      <div className="no-print" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--card-bg)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={16} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
              {currentUser.email} • {currentUser.role === 'approver' ? 'ผู้อนุมัติ' : currentUser.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'} • {currentUser.department}
            </div>
          </div>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}
          style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <LogOut size={14} /> ออกจากระบบ
        </button>
      </div>

      {/* Navigation */}
      <div className="no-print" style={{
        marginBottom: '2rem', display: 'flex', gap: '0.75rem', background: 'var(--card-bg)',
        padding: '1rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)',
        justifyContent: 'center', flexWrap: 'wrap'
      }}>
        {!isApproverOnly && (
          <>
            <button
              className={`btn ${activeForm === 'payment' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveForm('payment')}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <FileText size={18} /> ใบขออนุมัติจ่ายเงิน
            </button>
            <button
              className={`btn ${activeForm === 'advance' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveForm('advance')}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <Landmark size={18} /> ใบขอเบิกเงินทดรองจ่าย
            </button>
            <button
              className={`btn ${activeForm === 'allowance' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveForm('allowance')}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <Receipt size={18} /> ใบเบิกค่าใช้จ่าย
            </button>

            <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
          </>
        )}

        <button
          className={`btn ${activeForm === 'myDocs' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveForm('myDocs')}
          style={{ padding: '0.75rem 1.5rem' }}
        >
          <FolderOpen size={18} /> เอกสารของฉัน
        </button>

        {isApprover && (
          <button
            className={`btn ${activeForm === 'approver' || activeForm === 'approvalDetail' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveForm('approver')}
            style={{
              padding: '0.75rem 1.5rem',
              background: (activeForm === 'approver' || activeForm === 'approvalDetail') ? '#7c3aed' : undefined,
              borderColor: '#7c3aed',
              color: (activeForm === 'approver' || activeForm === 'approvalDetail') ? 'white' : '#7c3aed'
            }}
          >
            <ClipboardList size={18} /> หน้าผู้อนุมัติ
          </button>
        )}
      </div>

      <div id="pdf-export-container">
        {activeForm === 'home' && (
          <div className="form-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <FileText size={40} color="white" />
            </div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>ยินดีต้อนรับเข้าสู่ระบบเอกสารอนุมัติ</h2>
            <p style={{ color: 'var(--text-light)', maxWidth: '500px', margin: '0 auto' }}>
              กรุณาคลิกเลือกประเภทของแบบฟอร์มด้านบนที่ต้องการใช้งาน เพื่อเริ่มต้นการกรอกข้อมูล หรือดูประวัติเอกสารของคุณ
            </p>
          </div>
        )}
        {activeForm === 'payment' && <PaymentApprovalForm onSuccess={() => setActiveForm('pending')} />}
        {activeForm === 'advance' && <CashAdvanceForm onSuccess={() => setActiveForm('pending')} />}
        {activeForm === 'allowance' && <CashAllowanceForm onSuccess={() => setActiveForm('pending')} />}
        {activeForm === 'pending' && <PendingApprovalPage onBackHome={() => setActiveForm('payment')} />}
        {activeForm === 'myDocs' && <MyDocuments userEmail={currentUser.email} onPrint={handlePrint} />}
        {activeForm === 'approver' && <ApproverDashboard onViewDetail={handleViewDetail} />}
        {activeForm === 'approvalDetail' && <ApprovalDetail docNo={selectedDocNo} onBack={() => setActiveForm('approver')} />}
        {activeForm === 'printPayment' && printFormData && <PaymentApprovalForm initialData={printFormData} />}
        {activeForm === 'printAdvance' && printFormData && <CashAdvanceForm initialData={printFormData} />}
        {activeForm === 'printAllowance' && printFormData && <CashAllowanceForm initialData={printFormData} />}
      </div>
    </div>
  );
}

export default App;
