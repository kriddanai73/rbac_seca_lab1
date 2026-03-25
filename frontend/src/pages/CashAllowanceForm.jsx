import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
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
  otherNames: Array(8).fill(''),
  advanceAmount: '',
  returnAmount: '',
  details: '',
  carNumber: '',
  requesterDate: '',
  payerDate: '',
  receiverDate: '',
  approverDate: '',
  status: 'draft'
};

const DOC_PREFIX = 'CA';
const DOC_COUNTER_KEY = 'cashAllowanceDocCounters';

const padNumber = (num, length = 4) => String(num).padStart(length, '0');

const getYearFromDate = (dateValue) => {
  if (!dateValue) return new Date().getFullYear().toString();

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().getFullYear().toString();
  }

  return parsed.getFullYear().toString();
};

const createNextDocNo = (year) => {
  const savedCounters = JSON.parse(localStorage.getItem(DOC_COUNTER_KEY) || '{}');
  const currentCounter = Number(savedCounters[year] || 0) + 1;

  savedCounters[year] = currentCounter;
  localStorage.setItem(DOC_COUNTER_KEY, JSON.stringify(savedCounters));

  return `${DOC_PREFIX}-${year}-${padNumber(currentCounter, 4)}`;
};

const CashAllowanceForm = ({ initialData, readOnly, onSuccess, previewMode = false }) => {
  const [formData, setFormData] = useState(initialData || initialFormState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) return;
    setFormData((prev) => {
      if (prev.docNo) return prev;

      const year = getYearFromDate(prev.date);
      return {
        ...prev,
        docNo: createNextDocNo(year)
      };
    });
  }, []);

  const handleChange = (eOrValue) => {
    if (eOrValue?.target) {
      const { name, value } = eOrValue.target;

      setFormData((prev) => {
        const updated = {
          ...prev,
          [name]: value
        };

        if (name === 'date') {
          const currentYear = getYearFromDate(prev.date);
          const newYear = getYearFromDate(value);

          if (!prev.docNo || currentYear !== newYear) {
            updated.docNo = createNextDocNo(newYear);
          }
        }

        return updated;
      });
      return;
    }

    if (eOrValue && typeof eOrValue === 'object' && 'name' in eOrValue) {
      const { name, value } = eOrValue;

      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmountChange = (side, index, value) => {
    const arr = side === 'left' ? [...formData.amountsLeft] : [...formData.amountsRight];
    arr[index] = value;

    setFormData((prev) => ({
      ...prev,
      [side === 'left' ? 'amountsLeft' : 'amountsRight']: arr
    }));
  };

  const handleOtherNameChange = (index, value) => {
    const arr = [...formData.otherNames];
    arr[index] = value;

    setFormData((prev) => ({
      ...prev,
      otherNames: arr
    }));
  };

  const saveData = async (statusValue) => {
    try {
      setIsSaving(true);

      const payload = {
        formType: 'CashAllowance',
        formData: { ...formData, status: statusValue }
      };

      const response = await fetch('http://localhost:5000/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        if (statusValue === 'pending' && onSuccess) {
          onSuccess();
        } else {
          Swal.fire('สำเร็จ', 'บันทึกร่างข้อมูลสำเร็จ!', 'success');
          setFormData(prev => ({ ...prev, status: statusValue }));
        }
      } else {
        Swal.fire('เกิดข้อผิดพลาด', result.message, 'error');
      }
    } catch (error) {
      console.error('Save error:', error);
      Swal.fire('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ หรือเซิร์ฟเวอร์ยังไม่เปิด', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = () => saveData('draft');
  const handleSubmitApproval = () => {
    Swal.fire({
      title: 'ส่งขออนุมัติ?',
      text: 'คุณต้องการส่งเอกสารนี้เพื่อขออนุมัติใช่หรือไม่? เมื่อส่งแล้วข้อมูลอาจถูกล็อกไม่ให้แก้ไข',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ส่งขออนุมัติ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#94a3b8'
    }).then((result) => {
      if (result.isConfirmed) saveData('pending');
    });
  };

  const handleReset = () => {
    Swal.fire({
      title: 'ยืนยันการล้างข้อมูล?',
      text: 'ข้อมูลรูปฟอร์มทั้งหมดจะหายไป คุณแน่ใจหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ล้างข้อมูล',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#94a3b8'
    }).then((result) => {
      if (result.isConfirmed) {
        const newYear = new Date().getFullYear().toString();
        const newDocNo = createNextDocNo(newYear);

        setFormData({
          ...initialFormState,
          docNo: newDocNo
        });
      }
    });
  };

  return (
    <div>
      <div
        className={`form-card screen-only ${previewMode ? 'print-only' : ''}`}
        style={{ width: '100%', margin: '0 auto 20px auto', padding: '0 12px' }}   >
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
              placeholder="CA-2026-0001"
              readOnly
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
                      borderRadius: '6px',
                      gap: '10px'
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
                หมวดที่ 2 (62-08 ขึ้นไป และ อื่นๆ)
              </h4>

              <div className="form-group" style={{ display: 'grid', gap: '10px' }}>
                {formRowsRight.map((row, idx) => {
                  const isOtherRow = row.code === '';

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px',
                        background: 'var(--bg-color)',
                        borderRadius: '6px',
                        gap: '10px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                          {isOtherRow ? 'อื่นๆ' : row.code}
                        </div>

                        {isOtherRow ? (
                          <input
                            type="text"
                            className="form-input"
                            placeholder="ระบุรายการ..."
                            value={formData.otherNames[idx]}
                            onChange={(e) => handleOtherNameChange(idx, e.target.value)}
                            style={{ marginTop: '6px', maxWidth: '260px' }}
                          />
                        ) : (
                          <div style={{ fontSize: '13px' }}>{row.name}</div>
                        )}
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
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="form-grid"
            style={{
              marginTop: '1.5rem',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px'
            }}
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
          onSaveDraft={handleSaveDraft}
          onSubmitApproval={handleSubmitApproval}
          onReset={handleReset}
          onPrint={() => window.print()}
          isSaving={isSaving}
          status={formData.status}
        />
      </div>

      <CashAllowancePrint formData={formData} formRowsLeft={formRowsLeft} formRowsRight={formRowsRight} previewMode={previewMode} />
    </div>
  );
};

export default CashAllowanceForm;