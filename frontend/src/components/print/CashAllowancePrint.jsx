import React from 'react';

const CashAllowancePrint = ({ formData = {}, formRowsLeft = [], formRowsRight = [] }) => {
  const departmentOptions = [
    'บริหาร',
    'ธุรการทั่วไป',
    'บัญชีการเงิน',
    'ขาย',
    'จัดซื้อ',
    'วิศวกรรม',
    'ซ่อมบำรุง',
    'บริการติดตั้ง',
    'คลังสินค้า',
    'จัดส่ง',
    'ส่วนกลาง'
  ];

  const dottedStyle = {
    display: 'inline-block',
    borderBottom: '1px dotted #000',
    minHeight: '18px',
    lineHeight: '18px',
    padding: '0 4px',
    boxSizing: 'border-box',
    verticalAlign: 'bottom'
  };

  const cellStyle = {
    border: '1px solid #000',
    padding: '6px 6px',
    fontSize: '12px',
    verticalAlign: 'middle'
  };

  const thStyle = {
    ...cellStyle,
    fontWeight: 'bold',
    textAlign: 'center',
    background: '#f3f3f3'
  };

  const renderDepartmentOption = (label) => (
    <label
      key={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        marginRight: '10px',
        marginBottom: '4px'
      }}
    >
      <input
        type="radio"
        checked={formData.departmentType === label}
        readOnly
      />
      <span>{label}</span>
    </label>
  );

  const maxRows = Math.max(formRowsLeft.length, formRowsRight.length);

  return (
    <div
      className="paper-container print-only"
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '10mm',
        boxSizing: 'border-box',
        background: '#fff',
        color: '#000',
        fontFamily: '"TH Sarabun New", "Sarabun", sans-serif',
        fontSize: '12px'
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px'
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
              TMAX CORPORATION CO.,LTD. ( HEAD OFFICE )
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>CASH ALLOWANCE FORM</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>(แบบฟอร์มขอเบิกเงินสด)</div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '20px',
            marginBottom: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <span style={{ fontWeight: 'bold', marginRight: '6px' }}>NAME :</span>
            <span style={{ ...dottedStyle, flex: 1 }}>{formData.name || ''}</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '6px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '6px' }}>NO. :</span>
              <span style={{ ...dottedStyle, flex: 1 }}>{formData.docNo || ''}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontWeight: 'bold', marginRight: '6px' }}>DATE:</span>
              <span style={{ ...dottedStyle, flex: 1 }}>{formData.date || ''}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '8px' }}>ฝ่าย :</span>
          <div style={{ display: 'inline-block' }}>
            {departmentOptions.slice(0, 7).map(renderDepartmentOption)}
            <div />
            {departmentOptions.slice(7).map(renderDepartmentOption)}
          </div>
        </div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          border: '2px solid #000'
        }}
      >
        <thead>
          <tr>
            <th style={{ ...thStyle, width: '12%' }}>A/C CODE</th>
            <th style={{ ...thStyle, width: '22%' }}>A/C NAME</th>
            <th style={{ ...thStyle, width: '16%' }}>AMOUNT (BAHT)</th>
            <th style={{ ...thStyle, width: '12%' }}>A/C CODE</th>
            <th style={{ ...thStyle, width: '22%' }}>A/C NAME</th>
            <th style={{ ...thStyle, width: '16%' }}>AMOUNT (BAHT)</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, idx) => {
            const left = formRowsLeft[idx] || { code: '', name: '' };
            const right = formRowsRight[idx] || { code: '', name: '' };

            return (
              <tr key={idx}>
                <td style={cellStyle}>{left.code || ''}</td>
                <td style={cellStyle}>{left.name || ''}</td>
                <td style={cellStyle}>{formData.amountsLeft?.[idx] || ''}</td>
                <td style={cellStyle}>{right.code || (right.name ? 'อื่นๆ' : '')}</td>
                <td style={cellStyle}>{right.name || ''}</td>
                <td style={cellStyle}>{formData.amountsRight?.[idx] || ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1 }}>
            <span style={{ fontWeight: 'bold', marginRight: '6px' }}>
              ได้เบิกเงินทดรองจ่ายไป
            </span>
            <span style={{ ...dottedStyle, flex: 1 }}>{formData.advanceAmount || ''}</span>
            <span style={{ marginLeft: '6px' }}>บาท</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1 }}>
            <span style={{ fontWeight: 'bold', marginRight: '6px' }}>คืนเงิน/เบิกเพิ่ม</span>
            <span style={{ ...dottedStyle, flex: 1 }}>{formData.returnAmount || ''}</span>
            <span style={{ marginLeft: '6px' }}>บาท</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '6px' }}>รายละเอียด</span>
          <span style={{ ...dottedStyle, flex: 1 }}>{formData.details || ''}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', width: '320px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '6px' }}>ทะเบียนรถ</span>
          <span style={{ ...dottedStyle, flex: 1 }}>{formData.carNumber || ''}</span>
        </div>
      </div>

      <div
        style={{
          marginTop: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          textAlign: 'center'
        }}
      >
        {[
          { label: 'ผู้ขอเบิก', value: formData.requesterDate },
          { label: 'ผู้จ่ายเงิน', value: formData.payerDate },
          { label: 'ผู้รับเงิน', value: formData.receiverDate },
          { label: 'ผู้อนุมัติ', value: formData.approverDate }
        ].map((item) => (
          <div key={item.label}>
            <div style={{ marginBottom: '30px' }}>....................................</div>
            <div>{item.label}</div>
            <div style={{ marginTop: '6px' }}>
              วันที่ <span style={{ ...dottedStyle, minWidth: '100px' }}>{item.value || ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CashAllowancePrint;