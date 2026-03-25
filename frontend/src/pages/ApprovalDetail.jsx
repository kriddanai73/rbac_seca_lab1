import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import PaymentApprovalForm from './PaymentApprovalForm';
import CashAdvanceForm from './CashAdvanceForm';
import CashAllowanceForm from './CashAllowanceForm';
import { FileText, CheckCircle, XCircle, ArrowLeft, Loader } from 'lucide-react';

const FORM_TYPE_LABELS = {
  PaymentApproval: 'ใบขออนุมัติจ่ายเงิน',
  CashAdvance: 'ใบขอเบิกเงินทดรองจ่าย',
  CashAllowance: 'ใบเบิกค่าใช้จ่าย'
};

const ApprovalDetail = ({ docNo, onBack }) => {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectField, setShowRejectField] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/forms/${docNo}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const json = await res.json();
        if (json.success) {
          setDoc(json.data);
        } else {
          setError(json.message || 'ไม่พบเอกสาร');
        }
      } catch (err) {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [docNo]);

  const handleApprove = async () => {
    Swal.fire({
      title: 'ยืนยันการอนุมัติ?',
      text: 'คุณต้องการอนุมัติเอกสารนี้ใช่หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'อนุมัติ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#94a3b8'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setProcessing(true);
        try {
          const res = await fetch(`http://localhost:5000/api/approvals/${docNo}/approve`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          const json = await res.json();
          if (json.success) {
            setResult({ type: 'approved' });
          } else {
            Swal.fire('เกิดข้อผิดพลาด', json.message, 'error');
          }
        } catch (err) {
          Swal.fire('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
        } finally {
          setProcessing(false);
        }
      }
    });
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      Swal.fire('แจ้งเตือน', 'กรุณาระบุเหตุผลที่ไม่อนุมัติ', 'warning');
      return;
    }
    setProcessing(true);
    try {
      const res = await fetch(`http://localhost:5000/api/approvals/${docNo}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      const json = await res.json();
      if (json.success) {
        setResult({ type: 'rejected' });
      } else {
        Swal.fire('เกิดข้อผิดพลาด', json.message, 'error');
      }
    } catch (err) {
      Swal.fire('ข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Success result screen
  if (result) {
    const isApproved = result.type === 'approved';
    return (
      <div className="form-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ color: isApproved ? '#16a34a' : '#dc2626', marginBottom: '20px' }}>
          {isApproved ? <CheckCircle size={64} /> : <XCircle size={64} />}
        </div>
        <h2 style={{ color: isApproved ? '#16a34a' : '#dc2626', marginBottom: '16px' }}>
          {isApproved ? 'อนุมัติเรียบร้อยแล้ว!' : 'ไม่อนุมัติเรียบร้อยแล้ว'}
        </h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
          เอกสารเลขที่ <strong>{docNo}</strong> ถูก{isApproved ? 'อนุมัติ' : 'ปฏิเสธ'}เรียบร้อยแล้ว<br />
          สถานะถูกอัปเดตใน Google Sheets แล้ว
        </p>
        <button className="btn btn-primary" onClick={onBack} style={{ padding: '10px 24px' }}>
          <ArrowLeft size={16} /> กลับหน้ารายการ
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="form-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px' }}>
        <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '12px', color: 'var(--text-light)' }}>กำลังโหลดข้อมูลเอกสาร...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#dc2626' }}>{error}</p>
        <button className="btn btn-outline" onClick={onBack} style={{ marginTop: '16px' }}>
          <ArrowLeft size={16} /> กลับ
        </button>
      </div>
    );
  }

  // Render the actual form component based on sheet type using formData from Sheets
  const renderFormPreview = () => {
    if (!doc.formData) {
      return (
        <div style={{ background: '#fef9c3', padding: '16px', borderRadius: '8px', color: '#92400e', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          ⚠️ ไม่พบข้อมูลฟอร์มเต็ม (เอกสารนี้อาจถูกส่งก่อนอัปเดตระบบ)
        </div>
      );
    }

    const previewData = { ...doc.formData, status: doc.status };

    switch (doc.sheetName) {
      case 'PaymentApproval':
        return <PaymentApprovalForm initialData={previewData} readOnly previewMode={true} />;
      case 'CashAdvance':
        return <CashAdvanceForm initialData={previewData} readOnly previewMode={true} />;
      case 'CashAllowance':
        return <CashAllowanceForm initialData={previewData} readOnly previewMode={true} />;
      default:
        return <p>ไม่รู้จักประเภทเอกสาร: {doc.sheetName}</p>;
    }
  };

  return (
    <div>
      {/* Top bar with back button and info */}
      <div className="no-print form-card" style={{ maxWidth: '1000px', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-outline" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> กลับ
          </button>
          <div>
            <div style={{ fontWeight: 'bold', color: '#7c3aed' }}>
              รายละเอียดเอกสาร: {doc.docNo}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              {FORM_TYPE_LABELS[doc.sheetName] || doc.sheetName} • สถานะ: <span style={{ color: doc.status === 'pending' ? '#eab308' : '#16a34a', fontWeight: 'bold' }}>{doc.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render the actual form */}
      {renderFormPreview()}

      {/* Action Buttons */}
      {doc.status === 'pending' && (
        <div className="no-print form-card" style={{ maxWidth: '1000px', margin: '1rem auto', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!showRejectField ? (
            <>
              <button onClick={handleApprove} disabled={processing}
                style={{
                  background: '#16a34a', color: 'white', padding: '14px 40px', fontSize: '1.1rem',
                  borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
                }}>
                <CheckCircle size={22} /> อนุมัติ
              </button>
              <button onClick={() => setShowRejectField(true)} disabled={processing}
                style={{
                  background: '#dc2626', color: 'white', padding: '14px 40px', fontSize: '1.1rem',
                  borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
                }}>
                <XCircle size={22} /> ไม่อนุมัติ
              </button>
            </>
          ) : (
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#dc2626' }}>
                เหตุผลที่ไม่อนุมัติ:
              </label>
              <textarea
                className="form-input"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="กรุณาระบุเหตุผล..."
                rows={3}
                style={{ width: '100%', marginBottom: '12px' }}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setShowRejectField(false)}>ยกเลิก</button>
                <button onClick={handleReject} disabled={processing}
                  style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}>
                  ยืนยันไม่อนุมัติ
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApprovalDetail;
