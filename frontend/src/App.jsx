import React, { useState } from 'react';
import PaymentApprovalForm from './pages/PaymentApprovalForm';
import CashAdvanceForm from './pages/CashAdvanceForm';
import CashAllowanceForm from './pages/CashAllowanceForm';
import { FileText, Landmark, Receipt } from 'lucide-react';

function App() {
  const [activeForm, setActiveForm] = useState('payment');

  return (
    <div className="app-container">
      <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', background: 'var(--card-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeForm === 'payment' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveForm('payment')}
          style={{padding: '0.75rem 1.5rem'}}
        >
          <FileText size={18} /> ใบขออนุมัติจ่ายเงิน
        </button>
        <button 
          className={`btn ${activeForm === 'advance' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveForm('advance')}
          style={{padding: '0.75rem 1.5rem'}}
        >
          <Landmark size={18} /> ใบขอเบิกเงินทดรองจ่าย
        </button>
        <button 
          className={`btn ${activeForm === 'allowance' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveForm('allowance')}
          style={{padding: '0.75rem 1.5rem'}}
        >
          <Receipt size={18} /> ใบเบิกค่าใช้จ่าย
        </button>
      </div>

      <div id="pdf-export-container">
        {activeForm === 'payment' && <PaymentApprovalForm />}
        {activeForm === 'advance' && <CashAdvanceForm />}
        {activeForm === 'allowance' && <CashAllowanceForm />}
      </div>
    </div>
  );
}

export default App;
