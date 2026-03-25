import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import TextInput from '../components/forms/TextInput';
import DateInput from '../components/forms/DateInput';
import SelectInput from '../components/forms/SelectInput';
import TableInput from '../components/forms/TableInput';
import FormActions from '../components/common/FormActions';
import CashAdvancePrint from '../components/print/CashAdvancePrint';
import { Landmark } from 'lucide-react';

const initialFormState = {
  emCode: '',
  name: '',
  departmentGroup: '',
  otherDepartmentGroup: '',
  departmentType: '',
  otherDepartmentType: '',
  docNo: '',
  date: '',
  items: [
    { acCode: '11103010', acName: 'เงินทดรองจ่าย', description: '', amount: '' },
    { acCode: '', acName: '', description: '', amount: '' },
    { acCode: '', acName: '', description: '', amount: '' },
    { acCode: '', acName: '', description: '', amount: '' }
  ],
  remark: '',
  carNumber: '',
  requesterDate: '',
  payerDate: '',
  receiverDate: '',
  approverDate: '',
  status: 'draft'
};

const departmentGroupOptions = ['HO', 'PK', 'CB', 'SP', 'CM', 'Other'];
const departmentTypeOptions = [
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
  'ส่วนกลาง',
  'อื่นๆ'
];

const DOC_PREFIX = 'CV';
const DOC_COUNTER_KEY = 'cashAdvanceDocCounters';

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

const CashAdvanceForm = ({ initialData, readOnly, onSuccess, previewMode = false }) => {
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
    let name = '';
    let value = '';

    if (eOrValue?.target) {
      name = eOrValue.target.name;
      value = eOrValue.target.value;
    } else if (eOrValue && typeof eOrValue === 'object') {
      name = eOrValue.name;
      value = eOrValue.value;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === 'departmentGroup' && value !== 'Other') {
        updated.otherDepartmentGroup = '';
      }

      if (name === 'departmentType' && value !== 'อื่นๆ') {
        updated.otherDepartmentType = '';
      }

      if (name === 'date') {
        const currentYear = getYearFromDate(prev.date);
        const newYear = getYearFromDate(value);

        if (!prev.docNo || currentYear !== newYear) {
          updated.docNo = createNextDocNo(newYear);
        }
      }

      return updated;
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { acCode: '', acName: '', description: '', amount: '' }]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const saveData = async (statusValue) => {
    try {
      setIsSaving(true);
      const payload = {
        formType: 'CashAdvance',
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
        localStorage.setItem(`formData_${formData.docNo}`, JSON.stringify({ ...formData, status: statusValue }));
        if (statusValue === 'pending' && onSuccess) {
          onSuccess();
        } else {
          Swal.fire('สำเร็จ', 'บันทึกร่างข้อมูลสำเร็จ!', 'success');
          setFormData(prev => ({ ...prev, status: statusValue }));
        }
      } else {
        Swal.fire('เกิดข้อผิดพลาด', `รายละเอียด: ${result.error || result.message}`, 'error');
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

  const printData = {
    ...formData,
    departmentGroupDisplay:
      formData.departmentGroup === 'Other'
        ? formData.otherDepartmentGroup
        : formData.departmentGroup,
    departmentTypeDisplay:
      formData.departmentType === 'อื่นๆ'
        ? formData.otherDepartmentType
        : formData.departmentType
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
            <Landmark size={28} />
          </div>

          <div>
            <h2
              className="page-title"
              style={{ margin: 0, textAlign: 'left', color: 'var(--primary-color)' }}
            >
              ใบขอเบิกเงินทดรองจ่าย (Cash Advance)
            </h2>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>
              กรอกข้อมูลด้านล่างให้ครบถ้วน แบบฟอร์มกระดาษจริงจะถูกสร้างตอนพิมพ์
            </p>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">ส่วนที่ 1: ข้อมูลผู้เบิกและสังกัด</h3>

          <div className="form-grid">
            <TextInput
              label="EM Code"
              name="emCode"
              value={formData.emCode}
              onChange={handleChange}
              placeholder="ระบุรหัสพนักงาน..."
            />
            <TextInput
              label="ชื่อ-นามสกุล"
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
              placeholder="CV-2026-0001"
              readOnly
            />
            <DateInput
              label="วันที่เอกสาร"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <SelectInput
              label="ประเภทธุรกิจ"
              name="departmentGroup"
              value={formData.departmentGroup}
              onChange={handleChange}
              options={departmentGroupOptions.map((g) => ({
                label: g,
                value: g
              }))}
            />

            {formData.departmentGroup === 'Other' && (
              <div style={{ marginTop: '12px', maxWidth: '420px' }}>
                <TextInput
                  label="ระบุ Other"
                  name="otherDepartmentGroup"
                  value={formData.otherDepartmentGroup}
                  onChange={handleChange}
                  placeholder="พิมพ์ข้อมูล Other..."
                />
              </div>
            )}

            <div style={{ marginTop: '16px' }}>
              <SelectInput
                label="แผนก/ฝ่าย"
                name="departmentType"
                value={formData.departmentType}
                onChange={handleChange}
                options={departmentTypeOptions.map((g) => ({
                  label: g,
                  value: g
                }))}
              />
            </div>

            {formData.departmentType === 'อื่นๆ' && (
              <div style={{ marginTop: '12px', maxWidth: '420px' }}>
                <TextInput
                  label="ระบุฝ่ายอื่นๆ"
                  name="otherDepartmentType"
                  value={formData.otherDepartmentType}
                  onChange={handleChange}
                  placeholder="พิมพ์ชื่อฝ่าย/แผนก..."
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">ส่วนที่ 2: รายการเบิกเงิน</h3>
          <TableInput
            title=""
            items={formData.items}
            columns={[
              { label: 'A/C Code', name: 'acCode', width: '20%' },
              { label: 'A/C Name', name: 'acName', width: '25%' },
              { label: 'Description', name: 'description', width: '40%' },
              { label: 'Amount (Baht)', name: 'amount', type: 'number', width: '15%' }
            ]}
            onChange={handleItemChange}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
          />

          <div className="form-grid" style={{ marginTop: '1.5rem' }}>
            <TextInput
              label="หมายเหตุ"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
            />
            <TextInput
              label="ทะเบียนรถ"
              name="carNumber"
              value={formData.carNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">ส่วนที่ 3: วันที่เซ็นเอกสาร</h3>
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

      <CashAdvancePrint formData={printData} previewMode={previewMode} />
    </div>
  );
};

export default CashAdvanceForm;