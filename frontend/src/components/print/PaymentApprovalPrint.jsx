import React from 'react';

const PaymentApprovalPrint = ({ formData = {}, previewMode = false }) => {
  const knownDepartments = [
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

  const isOtherDepartment =
    formData.departmentType === 'อื่นๆ' ||
    (!!formData.departmentType && !knownDepartments.includes(formData.departmentType));

  const otherDepartmentText =
    formData.otherDepartment ||
    (isOtherDepartment && formData.departmentType !== 'อื่นๆ' ? formData.departmentType : '');

  const items =
    formData.items && formData.items.length > 0
      ? formData.items
      : [{ description: '', qty: '', unitPrice: '', amount: '' }];

  const dottedStyle = {
    display: 'inline-block',
    borderBottom: '1px dotted #000',
    minHeight: '18px',
    lineHeight: '18px',
    padding: '0 4px',
    boxSizing: 'border-box',
    verticalAlign: 'bottom'
  };

  const checkBoxStyle = {
    display: 'inline-flex',
    width: '14px',
    height: '14px',
    border: '1px solid #000',
    marginRight: '4px',
    boxSizing: 'border-box',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    lineHeight: '14px',
    flexShrink: 0
  };

  return (
    <div
      id="payment-approval-pdf"
      className={`paper-container ${previewMode ? '' : 'print-only'}`}
      style={{
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '10mm 10mm 8mm',
        boxSizing: 'border-box',
        background: '#fff',
        color: '#000',
        fontFamily: '"TH Sarabun New", "Sarabun", sans-serif',
        fontSize: '12px'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h2 style={{ color: '#1e3a8a', fontSize: '18px', margin: '0 0 5px 0' }}>
          บริษัท ทีแม็กซ์ คอร์ปอเรชั่น จำกัด (สำนักงานใหญ่)
        </h2>
        <p style={{ color: '#1e3a8a', fontSize: '12px', margin: '0 0 3px 0' }}>
          655/8-9 ซอยลาดพร้าว 101 (วัดบึงทองหลาง) แขวงคลองเจ้าคุณสิงห์ เขตวังทองหลาง กรุงเทพมหานคร 10130
        </p>
        <p
          style={{
            color: '#1e3a8a',
            fontSize: '12px',
            margin: '0 0 10px 0',
            borderBottom: '1px solid #1e3a8a',
            paddingBottom: '10px'
          }}
        >
          TAX ID : 0-1055-45117-48-1 Tel : 0-2731-4788 Fax : 0-2731-4933,0-2736-9688
        </p>
        <h3 style={{ fontSize: '20px', margin: '12px 0' }}>ใบขออนุมัติจ่ายเงิน</h3>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <div style={{ width: '320px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '4px' }}>
            <span style={{ width: '42px', fontWeight: 'bold' }}>เลขที่</span>
            <span style={{ ...dottedStyle, flex: 1 }}>{formData.docNo}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <span style={{ width: '42px', fontWeight: 'bold' }}>วันที่</span>
            <span style={{ ...dottedStyle, flex: 1 }}>{formData.date}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>เรื่อง ขออนุมัติเบิกจ่ายเงิน</div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flexWrap: 'wrap',
            marginBottom: '8px'
          }}
        >
          <span style={{ fontWeight: 'bold' }}>เรียน</span>
          {['กรรมการผู้จัดการ', 'ผู้อำนวยการ', 'ผู้จัดการ'].map((opt) => (
            <label key={opt} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={checkBoxStyle}>{formData.to === opt ? '✓' : ''}</span>
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '8px',
            paddingLeft: '90px'
          }}
        >
          <span>โปรดพิจารณาอนุมัติเบิกจ่าย เพื่อใช้ในงาน :-</span>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={checkBoxStyle}>{formData.location === 'สำนักงานใหญ่' ? '✓' : ''}</span>
            <span>สำนักงานใหญ่</span>
          </label>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={checkBoxStyle}>{formData.location === 'สาขา' ? '✓' : ''}</span>
            <span>สาขา</span>
            <span style={{ ...dottedStyle, minWidth: '180px' }}>
              {formData.location === 'สาขา' ? formData.branchName : ''}
            </span>
          </label>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '8px',
            paddingLeft: '35px'
          }}
        >
          {['บริหาร', 'ธุรการทั่วไป', 'บัญชีการเงิน', 'ขาย', 'จัดซื้อ', 'วิศวกรรม', 'ซ่อมบำรุง'].map((type) => (
            <label key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={checkBoxStyle}>{formData.departmentType === type ? '✓' : ''}</span>
              <span>{type}</span>
            </label>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '12px',
            paddingLeft: '35px'
          }}
        >
          {['บริการติดตั้ง', 'คลังสินค้า', 'จัดส่ง', 'ส่วนกลาง'].map((type) => (
            <label key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={checkBoxStyle}>{formData.departmentType === type ? '✓' : ''}</span>
              <span>{type}</span>
            </label>
          ))}

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={checkBoxStyle}>{isOtherDepartment ? '✓' : ''}</span>
            <span>อื่นๆ</span>
            <span style={{ ...dottedStyle, minWidth: '180px' }}>
              {isOtherDepartment ? otherDepartmentText : ''}
            </span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1 }}>
            <span style={{ fontWeight: 'bold', marginRight: '6px' }}>จ่ายให้</span>
            <span style={{ ...dottedStyle, flex: 1 }}>{formData.payTo}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', width: '300px' }}>
            <span style={{ fontWeight: 'bold', marginRight: '6px' }}>วันที่ต้องการ</span>
            <span style={{ ...dottedStyle, flex: 1 }}>{formData.requireDate}</span>
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
            <th style={{ border: '1px solid #000', width: '8%', padding: '6px 4px' }}>ลำดับ</th>
            <th style={{ border: '1px solid #000', width: '42%', padding: '6px 4px' }}>รายละเอียด</th>
            <th style={{ border: '1px solid #000', width: '15%', padding: '6px 4px' }}>ปริมาณ</th>
            <th style={{ border: '1px solid #000', width: '15%', padding: '6px 4px' }}>หน่วยละ</th>
            <th style={{ border: '1px solid #000', width: '20%', padding: '6px 4px' }}>จำนวนเงิน</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: '6px 4px', height: '28px' }}>
                {index + 1}
              </td>
              <td style={{ border: '1px solid #000', padding: '6px 6px' }}>{item.description}</td>
              <td style={{ border: '1px solid #000', textAlign: 'center', padding: '6px 4px' }}>{item.qty}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: '6px 8px' }}>{item.unitPrice}</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: '6px 8px' }}>{item.amount}</td>
            </tr>
          ))}

          <tr>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000', padding: '6px 8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>หักเงินมัดจำ</span>
                <span style={{ ...dottedStyle, width: '40px', textAlign: 'center' }}>{formData.depositPercent}</span>
                <span>% อ้างถึงเอกสารเลขที่</span>
                <span style={{ ...dottedStyle, width: '150px' }}>{formData.depositRef}</span>
              </div>
            </td>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: '6px 8px' }}>
              {formData.depositAmount}
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000', textAlign: 'center', fontWeight: 'bold', padding: '6px 8px' }}>
              คงเหลือ
            </td>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: '6px 8px' }}>
              {formData.balance}
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000', textAlign: 'center', fontWeight: 'bold', padding: '6px 8px' }}>
              บวก ภาษีมูลค่าเพิ่ม 7%
            </td>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: '6px 8px' }}>
              {formData.vatAmount}
            </td>
          </tr>

          <tr>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000', textAlign: 'center', fontWeight: 'bold', padding: '6px 8px' }}>
              รวมเงินทั้งสิ้น
            </td>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000' }}></td>
            <td style={{ border: '1px solid #000', textAlign: 'right', padding: '6px 8px' }}>
              {formData.totalAmount}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', width: '520px', gap: '4px' }}>
          <span>ภาษีหัก ณ ที่จ่าย</span>
          <span style={{ ...dottedStyle, width: '50px', textAlign: 'center' }}>
            {formData.withholdingTaxPercent}
          </span>
          <span>% เป็นจำนวนเงิน</span>
          <span style={{ ...dottedStyle, width: '160px', textAlign: 'right' }}>
            {formData.withholdingTaxAmount}
          </span>
          <span>บาท</span>
        </div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '2px solid #000',
          tableLayout: 'fixed'
        }}
      >
        <tbody>
          <tr>
            {[0, 1, 2, 3, 4].map((i) => (
              <td
                key={i}
                style={{
                  border: '1px solid #000',
                  height: '58px',
                  borderTop: 'none',
                  borderLeft: i === 0 ? 'none' : '1px solid #000',
                  borderRight: i === 4 ? 'none' : '1px solid #000'
                }}
              ></td>
            ))}
          </tr>
          <tr>
            <td
              style={{
                border: '1px solid #000',
                borderBottom: 'none',
                borderLeft: 'none',
                padding: '10px 5px',
                verticalAlign: 'top'
              }}
            >
              <div style={{ textAlign: 'center', fontWeight: 'bold', minHeight: '40px' }}>ผู้เบิกเงิน</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '11px', marginTop: '15px' }}>
                วันที่ <span style={{ ...dottedStyle, minWidth: '40px', marginLeft: '4px' }}>{formData.requesterDate}</span>
              </div>
            </td>
            <td
              style={{
                border: '1px solid #000',
                borderBottom: 'none',
                padding: '10px 5px',
                verticalAlign: 'top'
              }}
            >
              <div style={{ textAlign: 'center', fontWeight: 'bold', minHeight: '40px' }}>
                ผู้จ่ายเงิน
                <div style={{ fontSize: '11px', fontWeight: 'normal' }}>แผนกการเงิน</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '11px', marginTop: '15px' }}>
                วันที่ <span style={{ ...dottedStyle, minWidth: '40px', marginLeft: '4px' }}>{formData.payerDate}</span>
              </div>
            </td>
            <td
              style={{
                border: '1px solid #000',
                borderBottom: 'none',
                padding: '10px 5px',
                verticalAlign: 'top'
              }}
            >
              <div style={{ textAlign: 'center', fontWeight: 'bold', minHeight: '40px' }}>
                ผู้ตรวจสอบ
                <div style={{ fontSize: '11px', fontWeight: 'normal' }}>ผู้จัดการ(ต้นสังกัด)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '11px', marginTop: '15px' }}>
                วันที่ <span style={{ ...dottedStyle, minWidth: '40px', marginLeft: '4px' }}>{formData.checker1Date}</span>
              </div>
            </td>
            <td
              style={{
                border: '1px solid #000',
                borderBottom: 'none',
                padding: '10px 5px',
                verticalAlign: 'top'
              }}
            >
              <div style={{ textAlign: 'center', fontWeight: 'bold', minHeight: '40px' }}>
                ผู้ตรวจสอบ
                <div style={{ fontSize: '11px', fontWeight: 'normal' }}>ผู้จัดการ(การเงิน)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '11px', marginTop: '15px' }}>
                วันที่ <span style={{ ...dottedStyle, minWidth: '40px', marginLeft: '4px' }}>{formData.checker2Date}</span>
              </div>
            </td>
            <td
              style={{
                border: '1px solid #000',
                borderBottom: 'none',
                borderRight: 'none',
                padding: '10px 5px',
                verticalAlign: 'top'
              }}
            >
              <div style={{ textAlign: 'center', fontWeight: 'bold', minHeight: '40px' }}>
                ผู้อนุมัติ
                <div style={{ fontSize: '11px', fontWeight: 'normal' }}>ผู้จัดการ/ผู้อำนวยการ</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: '11px', marginTop: '15px' }}>
                วันที่ <span style={{ ...dottedStyle, minWidth: '40px', marginLeft: '4px' }}>{formData.approverDate}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ fontSize: '9px', marginTop: '5px' }}>FR-TMAX-ACC-001-20200417</div>
    </div>
  );
};

export default PaymentApprovalPrint;