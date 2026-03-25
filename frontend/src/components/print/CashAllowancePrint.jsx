import React from 'react';

const CashAllowancePrint = ({ formData = {}, previewMode = false, formRowsLeft = [], formRowsRight = [] }) => {

  const selectedDepartment = (
    formData.departmentType ||
    formData.department ||
    ''
  ).toString().trim();

  console.log('PRINT selectedDepartment =', selectedDepartment);

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

  const cellStyle = {
    border: '1px solid #000',
    padding: '3px 5px',
    fontSize: '10px',
    verticalAlign: 'middle',
    lineHeight: 1.1,
    whiteSpace: 'nowrap'
  };

  const thStyle = {
    ...cellStyle,
    fontWeight: 'bold',
    textAlign: 'center',
    background: '#fff'
  };

  const lineTextStyle = {
    display: 'inline-block',
    borderBottom: '1px solid #000',
    minHeight: '16px',
    lineHeight: '16px',
    padding: '0 4px',
    verticalAlign: 'bottom',
    boxSizing: 'border-box'
  };

  const renderDepartmentOption = (label) => {
  const isSelected = selectedDepartment === label.trim();

  return (
    <span
      key={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        marginRight: '10px',
        marginBottom: '4px',
        width: '22%',   // 👈 ตัวนี้คือทำให้ขึ้น 2 แถว
        fontSize: '11px'
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          width: '12px',
          height: '12px',
          border: '1px solid #000',
          marginRight: '4px',
          boxSizing: 'border-box',
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          lineHeight: '12px',
          fontWeight: 'bold'
        }}
      >
        {isSelected ? '✓' : ''}
      </span>
      {label}
    </span>
  );
};

  const maxRows = Math.max(formRowsLeft.length, formRowsRight.length, 1);

  return (
    <div
      className={`paper-container ${previewMode ? '' : 'print-only'}`}
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '10mm 12mm 8mm 12mm',
        boxSizing: 'border-box',
        background: '#fff',
        color: '#000',
        fontFamily: 'Arial, "TH Sarabun New", "Sarabun", sans-serif',
        fontSize: '11px'
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'start',
            marginBottom: '8px'
          }}
        >
          <div style={{ fontWeight: '700', fontSize: '13px' }}>
            TMAX CORPORATION CO.,LTD. ( HEAD OFFICE )
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '700', fontSize: '13px' }}>CASH ALLOWANCE FORM</div>
            <div style={{ fontSize: '10px', fontWeight: '700' }}>(แบบฟอร์มขอเบิกเงินสด)</div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            columnGap: '18px',
            rowGap: '6px',
            alignItems: 'end',
            marginBottom: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <span style={{ fontWeight: '700', marginRight: '6px' }}>NAME :</span>
            <span style={{ ...lineTextStyle, flex: 1 }}>{formData.name || ''}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'end' }}>
            <span style={{ fontWeight: '700', marginRight: '6px' }}>NO. :</span>
            <span style={{ ...lineTextStyle, flex: 1 }}>{formData.docNo || ''}</span>
          </div>

          <div />

          <div style={{ display: 'flex', alignItems: 'end' }}>
            <span style={{ fontWeight: '700', marginRight: '6px' }}>DATE :</span>
            <span style={{ ...lineTextStyle, flex: 1 }}>{formData.date || ''}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
          <span style={{ fontWeight: '700', marginRight: '6px', paddingTop: '2px' }}>ฝ่าย :</span>
          <div 
  style={{ 
    flex: 1, 
    display: 'flex',
    flexWrap: 'wrap',
    lineHeight: 1.4
  }}
>
  {departmentOptions.map(renderDepartmentOption)}
</div>
        </div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          border: '1.5px solid #000'
        }}
      >
        <thead>
          <tr>
            <th style={{ ...thStyle, width: '11%' }}>A/C CODE</th>
            <th style={{ ...thStyle, width: '26%' }}>A/C NAME</th>
            <th style={{ ...thStyle, width: '13%' }}>AMOUNT</th>
            <th style={{ ...thStyle, width: '11%' }}>A/C CODE</th>
            <th style={{ ...thStyle, width: '26%' }}>A/C NAME</th>
            <th style={{ ...thStyle, width: '13%' }}>AMOUNT</th>
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
                <td style={cellStyle}>{right.code || ''}</td>
                <td style={cellStyle}>
                  {right.code === '' ? (formData.otherNames?.[idx] || '') : (right.name || '')}
                </td>
                <td style={cellStyle}>{formData.amountsRight?.[idx] || ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          marginTop: '10px',
          marginBottom: '10px',
          border: '1.5px solid #000'
        }}
      >
        <tbody>
          <tr>
            <td style={{ ...cellStyle, width: '17%', fontWeight: '700' }}>
              ได้เบิกเงินทดรองจ่ายไป :
            </td>
            <td style={{ ...cellStyle, width: '26%' }}>
              {formData.advanceAmount || ''}
            </td>
            <td style={{ ...cellStyle, width: '7%', textAlign: 'center', fontWeight: '700' }}>
              บาท
            </td>
            <td style={{ ...cellStyle, width: '16%', fontWeight: '700' }}>
              คืนเงิน/เบิกเพิ่ม
            </td>
            <td style={{ ...cellStyle, width: '27%' }}>
              {formData.returnAmount || ''}
            </td>
            <td style={{ ...cellStyle, width: '7%', textAlign: 'center', fontWeight: '700' }}>
              บาท
            </td>
          </tr>

          <tr>
            <td style={{ ...cellStyle, fontWeight: '700', whiteSpace: 'nowrap' }}>
              รายละเอียด :
            </td>
            <td style={cellStyle} colSpan={2}>
              {formData.details || ''}
            </td>

            <td style={{ ...cellStyle, fontWeight: '700', whiteSpace: 'nowrap' }}>
              ทะเบียนรถ :
            </td>
            <td style={cellStyle} colSpan={2}>
              {formData.carNumber || ''}
            </td>
          </tr>
        </tbody>
      </table>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          marginTop: '16px',
          border: '1.5px solid #000'
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                ...cellStyle,
                width: '50%',
                height: '56px',
                padding: '10px 10px 12px 10px',
                verticalAlign: 'top'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ fontWeight: '700', fontSize: '11px' }}>ผู้ขอเบิก</span>
                <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                  Date : {formData.requesterDate || '...............'}
                </span>
              </div>
            </td>

            <td
              style={{
                ...cellStyle,
                width: '50%',
                height: '56px',
                padding: '10px 10px 12px 10px',
                verticalAlign: 'top'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ fontWeight: '700', fontSize: '11px' }}>ผู้จ่ายเงิน</span>
                <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                  Date : {formData.payerDate || '...............'}
                </span>
              </div>
            </td>
          </tr>

          <tr>
            <td
              style={{
                ...cellStyle,
                width: '50%',
                height: '56px',
                padding: '10px 10px 12px 10px',
                verticalAlign: 'top'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ fontWeight: '700', fontSize: '11px' }}>ผู้รับเงิน</span>
                <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                  Date : {formData.receiverDate || '...............'}
                </span>
              </div>
            </td>

            <td
              style={{
                ...cellStyle,
                width: '50%',
                height: '56px',
                padding: '10px 10px 12px 10px',
                verticalAlign: 'top'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ fontWeight: '700', fontSize: '11px' }}>ผู้อนุมัติ</span>
                <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                  Date : {formData.approverDate || '...............'}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          width: '100%',
          textAlign: 'right',
          marginTop: '12px',
          fontSize: '10px',
          whiteSpace: 'nowrap'
        }}
      >
        FM-AC-002 , UPDATE : 28/07/2560
      </div>
    </div>
  );
};

export default CashAllowancePrint;