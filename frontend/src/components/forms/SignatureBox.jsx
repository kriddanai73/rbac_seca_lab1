import React from 'react';

const SignatureBox = ({ title, name, role, dateLbl, signData, onChange }) => {
  return (
    <div className="signature-box" style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
      <div className="signature-title">{title}</div>
      <div className="signature-line" style={{ marginTop: '2.5rem' }}></div>
      
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center'}}>
          <span>(</span>
          <input 
            type="text" 
            className="signature-name-input"
            value={signData?.name || name || ''}
            onChange={(e) => onChange && onChange('name', e.target.value)}
            placeholder="ชื่อ-นามสกุล"
          />
          <span>)</span>
        </div>
        
        {role && <div style={{fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center'}}>{role}</div>}
        
        <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', justifyContent: 'center'}}>
          <span style={{fontSize: '0.875rem'}}>{dateLbl || 'วันที่'}:</span>
          <input 
            type="date" 
            className="signature-name-input"
            value={signData?.date || ''}
            onChange={(e) => onChange && onChange('date', e.target.value)}
            style={{ width: '130px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureBox;
