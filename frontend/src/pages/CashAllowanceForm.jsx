import React, { useState } from 'react';
import TextInput from '../components/forms/TextInput';
import DateInput from '../components/forms/DateInput';
import SelectInput from '../components/forms/SelectInput';
import FormActions from '../components/common/FormActions';
import CashAllowancePrint from '../components/print/CashAllowancePrint';
import { Receipt } from 'lucide-react';

const formRowsLeft = [
  { code: '62-04-1010', name: 'ค่าน้ำมันรถ/ค่าแก๊ส' },
  { code: '62-04-1020', name: 'ค่าทางด่วน' },
  { code: '62-04-1030', name: 'ค่าที่จอดรถ/ค่าแท็กซี่/อื่นๆ' },
  { code: '62-04-1040', name: 'ค่าใช้จ่ายเดินทาง/ค่าที่พัก' },
  { code: '62-05-1010', name: 'ค่าขนส่ง' },
  { code: '62-07-1010', name: 'ค่าซ่อมแซมอาคาร' },
  { code: '62-07-1020', name: 'ค่าซ่อมแซมเครื่องมือและอุปกรณ์' },
  { code: '62-07-1030', name: 'ค่าซ่อมแซมยานพาหนะ' }
];

const formRowsRight = [
  { code: '62-08-1010', name: 'ค่ารับรองลูกค้า' },
  { code: '62-12-2010', name: 'ค่าธรรมเนียมธนาคาร' },
  { code: '62-90-1010', name: 'ค่าเบี้ยเลี้ยง' },
  { code: '62-90-1070', name: 'ค่าใช้จ่ายทดสอบผลิตภัณฑ์' },
  { code: '62-90-1110', name: 'ค่าส่งไปรษณีย์ อากรแสตมป์' },
  { code: '', name: 'อื่นๆ' },
  { code: '', name: 'อื่นๆ' },
  { code: '', name: 'อื่นๆ' }
];

const initialFormState = {
  name: '',
  departmentType: '',
  docNo: '',
  date: '',
  amountsLeft: Array(8).fill(''),
  amountsRight: Array(8).fill(''),
  advanceAmount: '',
  returnAmount: '',
  details: '',
  carNumber: '',
  requesterDate: '',
  payerDate: '',
  receiverDate: '',
  approverDate: ''
};

const CashAllowanceForm = () => {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (side, index, value) => {
    const arr = side === 'left' ? [...formData.amountsLeft] : [...formData.amountsRight];
    arr[index] = value;
    setFormData((prev) => ({
      ...prev,
      [side === 'left' ? 'amountsLeft' : 'amountsRight']: arr
    }));
  };

  const handleSave = () => {
    alert('บันทึกข้อมูลสำเร็จ! ลองกดสั่งพิมพ์เพื่อดูเอกสารจริง');
  };

  const handleReset = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?')) {
      setFormData(initialFormState);
    }
  };

  return (
    <div>
      <div
        className="form-card screen-only"
        style={{ maxWidth: '1000px', margin: '0 auto 40px auto' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            marginBottom: '2.5rem',
            borderBottom: '2px solid var(--border-color)',
            paddingBottom: '1rem'
          }}
        >
          <div
            style={{
              background: 'var(--primary-color)',
              padding: '12px',
              borderRadius: '12px',
              color: 'white',
              display: 'flex'
            }}
          >
            <Receipt size={28} />
          </div>
          <div>
            <h2
              className="page-title"
              style={{ margin: 0, textAlign: 'left', color: 'var(--primary-color)' }}
            >
              ใบเบิกค่าใช้จ่าย (Cash Allowance)
            </h2>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>
              ตารางเบิกตามประเภทบัญชี แบบฟอร์มกระดาษจริงจะถูกสร้างตอนพิมพ์
            </p>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">ส่วนที่ 1: ข้อมูลผู้เบิก</h3>
          <div className="form-grid">
            <TextInput
              label="ชื่อ-นามสกุล (NAME)"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ระบุชื่อพนักงาน..."
            />
            <TextInput
              label="เลขที่เอกสาร (NO.)"
              name="docNo"
              value={formData.docNo}
              onChange={handleChange}
            />
            <DateInput
              label="วันที่เอกสาร"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <SelectInput
              label="ฝ่าย (Department)"
              name="departmentType"
              value={formData.departmentType}
              onChange={handleChange}
              options={[
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
              ].map((t) => ({
                label: t,
                value: t
              }))}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">ส่วนที่ 2: รายการเบิกตามรหัสบัญชี</h3>
          <div className="responsive-grid-2" style={{ gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--text-light)' }}>
                หมวดที่ 1 (62-04 ถึง 62-07)
              </h4>
              <div className="form-group" style={{ display: 'grid', gap: '10px' }}>
                {formRowsLeft.map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px',
                      background: 'var(--bg-color)',
                      borderRadius: '6px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{row.code}</div>
                      <div style={{ fontSize: '13px' }}>{row.name}</div>
                    </div>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '120px' }}
                      placeholder="จำนวน (บาท)"
                      value={formData.amountsLeft[idx]}
                      onChange={(e) => handleAmountChange('left', idx, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--text-light)' }}>
                หมวดที่ 2 (62-08 ขึนไป และ อื่นๆ)
              </h4>
              <div className="form-group" style={{ display: 'grid', gap: '10px' }}>
                {formRowsRight.map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px',
                      background: 'var(--bg-color)',
                      borderRadius: '6px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                        {row.code || 'อื่นๆ'}
                      </div>
                      <div style={{ fontSize: '13px' }}>{row.name}</div>
                    </div>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '120px' }}
                      placeholder="จำนวน (บาท)"
                      value={formData.amountsRight[idx]}
                      onChange={(e) => handleAmountChange('right', idx, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="form-grid"
            style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}
          >
            <TextInput
              label="ได้เบิกเงินทดรองจ่ายไป (บาท)"
              name="advanceAmount"
              type="number"
              value={formData.advanceAmount}
              onChange={handleChange}
            />
            <TextInput
              label="คืนเงิน/เบิกเพิ่ม (บาท)"
              name="returnAmount"
              type="number"
              value={formData.returnAmount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">ส่วนที่ 3: รายละเอียดเพิ่มเติม</h3>
          <div className="form-grid">
            <div style={{ gridColumn: '1 / -1' }}>
              <TextInput
                label="รายละเอียด"
                name="details"
                value={formData.details}
                onChange={handleChange}
              />
            </div>
            <TextInput
              label="ทะเบียนรถ"
              name="carNumber"
              value={formData.carNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">ส่วนที่ 4: วันที่เซ็นเอกสาร</h3>
          <div className="form-grid">
            <DateInput
              label="วันที่ผู้ขอเบิก"
              name="requesterDate"
              value={formData.requesterDate}
              onChange={handleChange}
            />
            <DateInput
              label="วันที่ผู้จ่ายเงิน"
              name="payerDate"
              value={formData.payerDate}
              onChange={handleChange}
            />
            <DateInput
              label="วันที่ผู้รับเงิน"
              name="receiverDate"
              value={formData.receiverDate}
              onChange={handleChange}
            />
            <DateInput
              label="วันที่ผู้อนุมัติ"
              name="approverDate"
              value={formData.approverDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <FormActions
          onSave={handleSave}
          onReset={handleReset}
          onPrint={() => window.print()}
        />
      </div>

      <CashAllowancePrint
        formData={formData}
        formRowsLeft={formRowsLeft}
        formRowsRight={formRowsRight}
      />
    </div>
  );
};

export default CashAllowanceForm;