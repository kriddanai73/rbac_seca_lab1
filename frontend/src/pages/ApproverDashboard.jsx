import React, { useEffect, useState } from 'react';
import { ClipboardList, RefreshCw, Eye, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';

const FORM_TYPE_LABELS = {
  PaymentApproval: 'ใบขออนุมัติจ่ายเงิน',
  CashAdvance: 'ใบขอเบิกเงินทดรองจ่าย',
  CashAllowance: 'ใบเบิกค่าใช้จ่าย'
};

const STATUS_CONFIG = {
  pending: { label: 'รออนุมัติ', color: '#eab308', bg: '#fef9c3', icon: Clock },
  approved: { label: 'อนุมัติแล้ว', color: '#16a34a', bg: '#dcfce7', icon: CheckCircle },
  rejected: { label: 'ไม่อนุมัติ', color: '#dc2626', bg: '#fee2e2', icon: XCircle },
  draft: { label: 'แบบร่าง', color: '#6b7280', bg: '#f3f4f6', icon: ClipboardList },
};

const ApproverDashboard = ({ onViewDetail }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPending = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/approvals/pending', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const json = await res.json();
      if (json.success) {
        setDocuments(json.data);
      } else {
        setError(json.message || 'ไม่สามารถดึงข้อมูลได้');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  return (
    <div className="form-card" style={{ maxWidth: '1000px', margin: '0 auto 40px auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.8rem',
        marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem'
      }}>
        <div style={{
          background: '#7c3aed', padding: '12px', borderRadius: '12px', color: 'white', display: 'flex'
        }}>
          <ClipboardList size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="page-title" style={{ margin: 0, textAlign: 'left', color: '#7c3aed' }}>
            หน้าผู้อนุมัติ (Approver Dashboard)
          </h2>
          <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>
            รายการเอกสารที่รอการอนุมัติ
          </p>
        </div>
        <button className="btn btn-outline" onClick={fetchPending} disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> รีเฟรช
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fee2e2', color: '#dc2626', padding: '12px 16px',
          borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem'
        }}>{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
          กำลังโหลดข้อมูล...
        </div>
      )}

      {/* Empty */}
      {!loading && !error && documents.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
          <CheckCircle size={48} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p>ไม่มีเอกสารที่รอการอนุมัติ</p>
        </div>
      )}

      {/* Table */}
      {!loading && documents.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>เลขเอกสาร</th>
                <th style={thStyle}>ประเภท</th>
                <th style={thStyle}>วันที่</th>
                <th style={thStyle}>สถานะ</th>
                <th style={thStyle}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => {
                const cfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
                const Icon = cfg.icon;
                return (
                  <tr key={doc.docNo + idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={tdStyle}>{idx + 1}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{doc.docNo}</td>
                    <td style={tdStyle}>{FORM_TYPE_LABELS[doc.sheetName] || doc.sheetName}</td>
                    <td style={tdStyle}>{doc.date || '-'}</td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: cfg.bg, color: cfg.color, padding: '4px 10px',
                        borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem'
                      }}>
                        <Icon size={14} /> {cfg.label}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        onClick={() => onViewDetail && onViewDetail(doc.docNo)}>
                        <Eye size={14} /> ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = { padding: '12px 10px', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-light)', borderBottom: '2px solid var(--border-color)' };
const tdStyle = { padding: '12px 10px' };

export default ApproverDashboard;
