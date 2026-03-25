import React from 'react';
import { Save, Printer, RotateCcw, Send } from 'lucide-react';

const FormActions = ({ onSaveDraft, onSubmitApproval, onReset, onPrint, isSaving, status }) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isApproved = status === 'approved';

  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end',
        marginTop: '2rem',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1rem',
        flexWrap: 'wrap'
      }}
      className="no-print"
    >
      <button
        type="button"
        onClick={onReset}
        className="btn btn-outline"
        disabled={isSaving}
      >
        <RotateCcw size={16} /> ล้างข้อมูล
      </button>

      <button
        type="button"
        onClick={onSaveDraft}
        className="btn btn-outline"
        disabled={isSaving}
        style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
      >
        <Save size={16} /> บันทึกร่าง
      </button>

      <button
        type="button"
        onClick={onSubmitApproval}
        className="btn btn-primary"
        disabled={isSaving}
      >
        <Send size={16} /> ส่งขออนุมัติ
      </button>

      <button
        type="button"
        onClick={onPrint}
        className="btn btn-primary"
        style={{ 
          backgroundColor: isApproved ? '#0f172a' : '#94a3b8', 
          cursor: isApproved ? 'pointer' : 'not-allowed',
          borderColor: isApproved ? '#0f172a' : '#94a3b8'
        }}
        disabled={!isApproved}
        title={!isApproved ? 'เอกสารนี้ยังไม่ได้รับการอนุมัติ' : ''}
      >
        <Printer size={16} /> พิมพ์
      </button>
    </div>
  );
};

export default FormActions;