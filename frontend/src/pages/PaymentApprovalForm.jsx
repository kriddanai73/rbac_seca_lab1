import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import TextInput from '../components/forms/TextInput';
import DateInput from '../components/forms/DateInput';
import TableInput from '../components/forms/TableInput';
import FormActions from '../components/common/FormActions';
import PaymentApprovalPrint from '../components/print/PaymentApprovalPrint';
import { FileText } from 'lucide-react';
import SelectInput from '../components/forms/SelectInput';

const initialFormState = {
  docNo: '',
  date: '',
  to: '',
  location: '',
  branchName: '',
  departmentType: '',
  otherDepartment: '',
  payTo: '',
  requireDate: '',
  items: [{ description: '', qty: 1, unitPrice: 0, amount: 0 }],
  depositPercent: 0,
  depositRef: '',
  depositAmount: '0.00',
  balance: '0.00',
  vatAmount: '0.00',
  totalAmount: '0.00',
  withholdingTaxPercent: 0,
  withholdingTaxAmount: '0.00',
  requesterDate: '',
  payerDate: '',
  checker1Date: '',
  checker2Date: '',
  approverDate: '',
  status: 'draft'
};

const DOC_PREFIX = 'PA';
const DOC_COUNTER_KEY = 'paymentApprovalDocCounters';

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

const PaymentApprovalForm = ({ initialData, readOnly, onSuccess, previewMode = false }) => {
  const [formData, setFormData] = useState(initialData || initialFormState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) return; // Skip auto-docNo if pre-filled
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

      if (name === 'departmentType' && value !== 'อื่นๆ') {
        updated.otherDepartment = '';
      }

      if (name === 'location' && value !== 'สาขา') {
        updated.branchName = '';
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

  const calculateTotals = (data) => {
    const subtotal = data.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const depositAmount = (subtotal * (Number(data.depositPercent) || 0)) / 100;
    const balance = subtotal - depositAmount;
    const vatAmount = balance * 0.07;
    const totalAmount = balance + vatAmount;
    const withholdingTaxAmount = (balance * (Number(data.withholdingTaxPercent) || 0)) / 100;

    return {
      ...data,
      depositAmount: depositAmount.toFixed(2),
      balance: balance.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      withholdingTaxAmount: withholdingTaxAmount.toFixed(2)
    };
  };

  const handleTableChange = (rowIndex, field, value) => {
    const newItems = [...formData.items];
    newItems[rowIndex] = { ...newItems[rowIndex], [field]: value };

    if (field === 'qty' || field === 'unitPrice') {
      const qty = Number(newItems[rowIndex].qty) || 0;
      const price = Number(newItems[rowIndex].unitPrice) || 0;
      newItems[rowIndex].amount = qty * price;
    }

    setFormData((prev) => calculateTotals({ ...prev, items: newItems }));
  };

  const addTableRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', qty: 1, unitPrice: 0, amount: 0 }]
    }));
  };

  const removeTableRow = (index) => {
    if (formData.items.length <= 1) return;

    setFormData((prev) => {
      const newItems = prev.items.filter((_, i) => i !== index);
      return calculateTotals({ ...prev, items: newItems });
    });
  };

  const handleCalculateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => calculateTotals({ ...prev, [name]: value }));
  };

  const saveData = async (statusValue) => {
    try {
      setIsSaving(true);
      const payload = {
        formType: 'PaymentApproval',
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
        // Save full form data in localStorage for printing later
        const savedData = { ...formData, status: statusValue };
        localStorage.setItem(`formData_${formData.docNo}`, JSON.stringify(savedData));
        
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
        const year = new Date().getFullYear().toString();

        setFormData({
          ...initialFormState,
          docNo: createNextDocNo(year)
        });
      }
    });
  };

  const printData = {
    ...formData,
    departmentType:
      formData.departmentType === 'อื่นๆ'
        ? 'อื่นๆ'
        : formData.departmentType
  };

  return (
    <div>
      <div
        className={`form-card screen-only ${previewMode ? 'print-only' : ''}`}
        style={{ width: '100%', margin: '0 auto 20px auto', padding: '0 12px' }}
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
            <FileText size={28} />
          </div>

          <div>
            <h2
              className="page-title"
              style={{ margin: 0, textAlign: 'left', color: 'var(--primary-color)' }}
            >
              ใบขออนุมัติจ่ายเงิน
            </h2>
            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>
              กรอกข้อมูลด้านล่างให้ครบถ้วน ระบบจะสร้างฟอร์มกระดาษตอนสั่งพิมพ์ให้อัตโนมัติ
            </p>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">ส่วนที่ 1: ข้อมูลเอกสารทั่วไป</h3>
          <div className="form-grid">
            <TextInput
              label="เลขที่เอกสาร"
              name="docNo"
              value={formData.docNo}
              onChange={handleChange}
              placeholder="PA-2026-0001"
              readOnly
            />

            <DateInput
              label="วันที่"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            <SelectInput
              label="เรียนถึง"
              name="to"
              value={formData.to}
              onChange={handleChange}
              options={[
                { label: 'กรรมการผู้จัดการ', value: 'กรรมการผู้จัดการ' },
                { label: 'ผู้อำนวยการ', value: 'ผู้อำนวยการ' },
                { label: 'ผู้จัดการ', value: 'ผู้จัดการ' }
              ]}
            />

            <TextInput
              label="จ่ายให้"
              name="payTo"
              value={formData.payTo}
              onChange={handleChange}
              placeholder="ชื่อบริษัท หรือ บุคคล"
            />

            <DateInput
              label="วันที่ต้องการ"
              name="requireDate"
              value={formData.requireDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">
            ส่วนที่ 2: หมวดหมู่และแผนก (โปรดพิจารณาอนุมัติเบิกจ่าย เพื่อใช้ในงาน)
          </h3>

          <div className="responsive-grid-2">
            <SelectInput
              label="ที่ตั้ง"
              name="location"
              value={formData.location}
              onChange={handleChange}
              options={[
                { label: 'สำนักงานใหญ่', value: 'สำนักงานใหญ่' },
                { label: 'สาขา', value: 'สาขา' }
              ]}
            />

          {formData.location === 'สาขา' && (
            <SelectInput
              label="ชื่อสาขา"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              options={[
                { label: 'ชลบุรี', value: 'ชลบุรี' },
                { label: 'เชียงใหม่', value: 'เชียงใหม่' },
                { label: 'ภูเก็ต', value: 'ภูเก็ต' },
                { label: 'เพชรบุรี', value: 'เพชรบุรี' }
            ]}
          />
        )}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <SelectInput
              label="แผนก"
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
                'ส่วนกลาง',
                'อื่นๆ'
              ].map((t) => ({
                label: t,
                value: t
              }))}
            />

            {formData.departmentType === 'อื่นๆ' && (
              <div style={{ marginTop: '12px', maxWidth: '420px' }}>
                <TextInput
                  label="โปรดระบุแผนกอื่นๆ"
                  name="otherDepartment"
                  value={formData.otherDepartment}
                  onChange={handleChange}
                  placeholder="พิมพ์ชื่อแผนก..."
                />
              </div>
            )}
          </div>
        </div>

        <TableInput
          title="ส่วนที่ 3: รายการค่าใช้จ่าย"
          items={formData.items}
          columns={[
            { label: 'รายละเอียด', name: 'description', width: '50%' },
            { label: 'ปริมาณ', name: 'qty', type: 'number', width: '15%' },
            { label: 'หน่วยละ', name: 'unitPrice', type: 'number', width: '15%' },
            { label: 'จำนวนเงิน', name: 'amount', type: 'number', width: '20%', disabled: true }
          ]}
          onChange={handleTableChange}
          onAdd={addTableRow}
          onRemove={removeTableRow}
        />

        <div className="form-section">
          <h3 className="section-title">ส่วนที่ 4: สรุปยอดและภาษี</h3>
          <div className="form-grid">
            <div
              className="summary-box"
              style={{
                gridColumn: '1 / -1',
                maxWidth: '600px',
                marginLeft: 'auto',
                background: 'var(--bg-color)'
              }}
            >
              <div className="summary-row" style={{ alignItems: 'center' }}>
                <span>หัก เงินมัดจำ (%):</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    name="depositPercent"
                    className="form-input"
                    value={formData.depositPercent}
                    onChange={handleCalculateChange}
                    style={{ width: '80px' }}
                  />
                  <input
                    type="text"
                    name="depositRef"
                    className="form-input"
                    value={formData.depositRef}
                    onChange={handleChange}
                    placeholder="อ้างถึงใบมัดจำ"
                    style={{ width: '160px' }}
                  />
                </div>
              </div>

              <div className="summary-row">
                <span>คงเหลือ:</span>
                <span style={{ fontWeight: 'bold' }}>{formData.balance || '0.00'} บาท</span>
              </div>

              <div className="summary-row">
                <span>บวก ภาษีมูลค่าเพิ่ม 7%:</span>
                <span style={{ fontWeight: 'bold' }}>{formData.vatAmount || '0.00'} บาท</span>
              </div>

              <div className="summary-row total">
                <span>รวมเงินทั้งสิ้น:</span>
                <span style={{ fontSize: '1.2rem' }}>{formData.totalAmount || '0.00'} บาท</span>
              </div>

              <div
                className="summary-row"
                style={{
                  alignItems: 'center',
                  marginTop: '1rem',
                  borderTop: '1px dashed var(--border-color)',
                  paddingTop: '1rem'
                }}
              >
                <span>หักภาษี ณ ที่จ่าย (%):</span>
                <input
                  type="number"
                  name="withholdingTaxPercent"
                  className="form-input"
                  value={formData.withholdingTaxPercent}
                  onChange={handleCalculateChange}
                  style={{ width: '80px', marginLeft: 'auto' }}
                />
              </div>

              <div className="summary-row" style={{ color: 'var(--text-dark)' }}>
                <span>เป็นจำนวนเงิน:</span>
                <span>{formData.withholdingTaxAmount || '0.00'} บาท</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">ส่วนที่ 5: วันที่เซ็นเอกสาร</h3>
          <div
            className="form-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}
          >
            <DateInput
              label="วันที่ผู้เบิกเงิน"
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
              label="วันที่ผู้ตรวจสอบ(ต้นสังกัด)"
              name="checker1Date"
              value={formData.checker1Date}
              onChange={handleChange}
            />
            <DateInput
              label="วันที่ผู้ตรวจสอบ(การเงิน)"
              name="checker2Date"
              value={formData.checker2Date}
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

      <PaymentApprovalPrint formData={printData} previewMode={previewMode} />
    </div>
  );
};

export default PaymentApprovalForm;