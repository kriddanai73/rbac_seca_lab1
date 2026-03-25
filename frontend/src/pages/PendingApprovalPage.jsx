import React from 'react';
import { Send, Clock } from 'lucide-react';

const PendingApprovalPage = ({ onBackHome }) => {
  return (
    <div className="form-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
        <Send size={64} style={{ margin: '0 auto' }} />
      </div>
      
      <h2 style={{ color: 'var(--primary-color)', marginBottom: '16px' }}>
        ส่งขออนุมัติเรียบร้อยแล้ว
      </h2>
      
      <p style={{ color: 'var(--text-light)', marginBottom: '32px', lineHeight: '1.6' }}>
        เอกสารของคุณถูกส่งเข้าสู่ระบบและกำลังรอการอนุมัติ<br/>
        จากนั้นระบบจะรีเฟรชสถานะให้คุณทราบเมื่อดำเนินการเสร็จสิ้น<br/>
        <br/>
        สถานะปัจจุบัน: <span style={{ fontWeight: 'bold', color: '#eab308', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> รออนุมัติ (Pending)</span>
      </p>

      <button 
        className="btn btn-primary" 
        onClick={onBackHome}
        style={{ padding: '10px 24px' }}
      >
        กลับไปหน้าฟอร์ม
      </button>
    </div>
  );
};

export default PendingApprovalPage;
