import React from 'react';
import { Save, Printer, RotateCcw, Download } from 'lucide-react';

const FormActions = ({ onSave, onReset, onPrint, onDownloadPdf, isSaving }) => {
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
      {/* ล้างข้อมูล */}
      <button 
        type="button" 
        onClick={onReset} 
        className="btn btn-outline"
        disabled={isSaving}
      >
        <RotateCcw size={16} /> ล้างข้อมูล
      </button>

      {/* บันทึก */}
      <button 
        type="button" 
        onClick={onSave} 
        className="btn btn-primary"
        disabled={isSaving}
      >
        <Save size={16} /> บันทึกข้อมูล
      </button>

      {/* พิมพ์ */}
      <button 
        type="button" 
        onClick={onPrint} 
        className="btn btn-primary"
        style={{ backgroundColor: '#0f172a' }}
      >
        <Printer size={16} /> พิมพ์
      </button>

      {/* 🔥 ใหม่: บันทึก PDF */}
      <button 
        type="button" 
        onClick={onDownloadPdf}
        className="btn btn-success"
        style={{ backgroundColor: '#16a34a' }}
      >
        <Download size={16} /> บันทึก PDF
      </button>
    </div>
  );
};

export default FormActions;