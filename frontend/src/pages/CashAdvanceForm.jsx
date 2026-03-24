import React, { useState } from 'react';
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
  approverDate: ''
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

const CashAdvanceForm = () => {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === 'departmentGroup' && value !== 'Other') {
        updated.otherDepartmentGroup = '';
      }

      if (name === 'departmentType' && value !== 'อื่นๆ') {
        updated.otherDepartmentType = '';
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

  const handleSave = () => {
    alert('บันทึกข้อมูลสำเร็จ! ลองกดสั่งพิมพ์เพื่อดูเอกสารจริง');
  };

  const handleReset = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?')) {
      setFormData(initialFormState);
    }
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
          onSave={handleSave}
          onReset={handleReset}
          onPrint={() => window.print()}
        />
      </div>

      <CashAdvancePrint formData={printData} />
    </div>
  );
};

export default CashAdvanceForm;