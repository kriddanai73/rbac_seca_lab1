import React from 'react';

const CashAdvancePrint = ({ formData = {} }) => {
  const departmentGroups = ['HO', 'PK', 'CB', 'SP', 'CM'];
  const departmentTypes = [
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

  const isOtherGroup =
    formData.departmentGroup === 'Other' ||
    (!!formData.departmentGroup && !departmentGroups.includes(formData.departmentGroup));

  const otherGroupText =
    formData.otherDepartmentGroup ||
    formData.departmentGroupDisplay ||
    (isOtherGroup && formData.departmentGroup !== 'Other' ? formData.departmentGroup : '');

  const isOtherDepartment =
    formData.departmentType === 'อื่นๆ' ||
    (!!formData.departmentType && !departmentTypes.includes(formData.departmentType));

  const otherDepartmentText =
    formData.otherDepartmentType ||
    formData.departmentTypeDisplay ||
    (isOtherDepartment && formData.departmentType !== 'อื่นๆ' ? formData.departmentType : '');

  const items = formData?.items?.length
    ? formData.items
    : Array.from({ length: 6 }, () => ({
      acCode: '',
      acName: '',
      description: '',
      amount: ''
    }));

  const dottedInputStyle = {
    borderBottom: '1px dotted #000',
    minHeight: '18px',
    display: 'inline-flex',
    alignItems: 'flex-end',
    padding: '0 4px'
  };

  return (
    <div
      className="paper-container print-only"
      style={{
        width: '100%',
        maxWidth: '210mm',
        margin: '0 auto',
        padding: '12mm 10mm',
        boxSizing: 'border-box',
        fontFamily: '"TH Sarabun New", "Sarabun", sans-serif',
        fontSize: '12px',
        color: '#000',
        background: '#fff'
      }}
    >
      <div
        className="paper-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: '10px'
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              lineHeight: 1.2
            }}
          >
            TMAX CORPORATION CO., LTD.
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ whiteSpace: 'nowrap', fontWeight: '600' }}>EM CODE :</span>
            <span style={{ ...dottedInputStyle, flex: 1, minWidth: '140px' }}>{formData.emCode}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{ whiteSpace: 'nowrap', fontWeight: '600' }}>NAME :</span>
            <span style={{ ...dottedInputStyle, flex: 1, minWidth: '140px' }}>{formData.name}</span>
          </div>
        </div>

        <div
          style={{
            width: '260px',
            textAlign: 'center',
            flexShrink: 0
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              lineHeight: 1.2
            }}
          >
            CASH ADVANCE FORM
          </h3>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '13px',
              lineHeight: 1.2
            }}
          >
            (แบบฟอร์มการเบิกเงินสดล่วงหน้า)
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 14px',
            marginBottom: '6px',
            alignItems: 'center'
          }}
        >
          {departmentGroups.map((g, i) => (
            <label
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              <input type="checkbox" checked={formData.departmentGroup === g} readOnly />
              <span>{g}</span>
            </label>
          ))}

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            <input type="checkbox" checked={isOtherGroup} readOnly />
            <span>Other</span>
            <span
              style={{
                ...dottedInputStyle,
                minWidth: '150px'
              }}
            >
              {isOtherGroup ? otherGroupText : ''}
            </span>
          </label>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 12px',
            marginBottom: '8px',
            alignItems: 'center'
          }}
        >
          <span style={{ fontWeight: '600' }}>ฝ่าย :</span>

          {departmentTypes.map((t, i) => (
            <label
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px'
              }}
            >
              <input type="radio" checked={formData.departmentType === t} readOnly />
              <span>{t}</span>
            </label>
          ))}

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            <input type="radio" checked={isOtherDepartment} readOnly />
            <span>อื่นๆ</span>
            <span
              style={{
                ...dottedInputStyle,
                minWidth: '150px'
              }}
            >
              {isOtherDepartment ? otherDepartmentText : ''}
            </span>
          </label>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '24px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: '600' }}>NO :</span>
            <span style={{ ...dottedInputStyle, width: '140px' }}>{formData.docNo}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: '600' }}>DATE :</span>
            <span style={{ ...dottedInputStyle, width: '140px' }}>{formData.date}</span>
          </div>
        </div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          marginBottom: '10px'
        }}
      >
        <thead>
          <tr>
            <th style={{ width: '15%', border: '1px solid #000', padding: '6px 4px', fontSize: '12px', textAlign: 'center' }}>A/C CODE</th>
            <th style={{ width: '25%', border: '1px solid #000', padding: '6px 4px', fontSize: '12px', textAlign: 'center' }}>A/C NAME</th>
            <th style={{ width: '42%', border: '1px solid #000', padding: '6px 4px', fontSize: '12px', textAlign: 'center' }}>DESCRIPTION</th>
            <th style={{ width: '18%', border: '1px solid #000', padding: '6px 4px', fontSize: '12px', textAlign: 'center' }}>AMOUNT</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #000', padding: '6px 6px', height: '28px', verticalAlign: 'middle', wordBreak: 'break-word' }}>{item.acCode}</td>
              <td style={{ border: '1px solid #000', padding: '6px 6px', height: '28px', verticalAlign: 'middle', wordBreak: 'break-word' }}>{item.acName}</td>
              <td style={{ border: '1px solid #000', padding: '6px 6px', height: '28px', verticalAlign: 'middle', wordBreak: 'break-word' }}>{item.description}</td>
              <td style={{ border: '1px solid #000', padding: '6px 6px', height: '28px', verticalAlign: 'middle', textAlign: 'right', wordBreak: 'break-word' }}>{item.amount}</td>
            </tr>
          ))}

          <tr>
            <td colSpan="3" style={{ border: '1px solid #000', borderRight: 'none', padding: '6px 8px', verticalAlign: 'middle' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                <span style={{ fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>หมายเหตุ :</span>
                <span
                  style={{
                    flex: 1,
                    minHeight: '18px',
                    borderBottom: '1px dotted #000',
                    display: 'inline-flex',
                    alignItems: 'flex-end',
                    padding: '0 2px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {formData.remark}
                </span>
              </div>
            </td>

            <td style={{ border: '1px solid #000', padding: '6px 8px', verticalAlign: 'middle' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
                <span style={{ fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>ทะเบียนรถ :</span>
                <span
                  style={{
                    flex: 1,
                    minHeight: '18px',
                    borderBottom: '1px dotted #000',
                    display: 'inline-flex',
                    alignItems: 'flex-end',
                    padding: '0 2px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {formData.carNumber}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          border: '1px solid #000',
          borderBottom: 'none',
          marginBottom: '8px'
        }}
      >
        {[
          { label: 'ผู้ขอเบิก', val: formData.requesterDate },
          { label: 'ผู้จ่ายเงิน', val: formData.payerDate },
          { label: 'ผู้รับเงิน', val: formData.receiverDate },
          { label: 'ผู้อนุมัติ', val: formData.approverDate }
        ].map((s, i) => (
          <div
            key={i}
            style={{
              borderBottom: '1px solid #000',
              borderRight: i % 2 === 0 ? '1px solid #000' : 'none',
              minHeight: '56px',
              padding: '8px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '8px',
                width: '100%'
              }}
            >
              <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>{s.label}</span>

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '120px',
                  justifyContent: 'flex-end'
                }}
              >
                <span style={{ whiteSpace: 'nowrap' }}>Date :</span>
                <span
                  style={{
                    minWidth: '70px',
                    borderBottom: '1px dotted #000',
                    minHeight: '18px',
                    display: 'inline-flex',
                    alignItems: 'flex-end',
                    padding: '0 2px'
                  }}
                >
                  {s.val}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          textAlign: 'right',
          fontSize: '11px',
          marginTop: '4px'
        }}
      >
        FM-AC-002 , UPDATE : 28/07/2560
      </div>
    </div>
  );
};

export default CashAdvancePrint;
