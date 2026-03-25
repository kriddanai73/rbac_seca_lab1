import React, { useEffect, useState } from 'react';
import { FileText, RefreshCw, Printer, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

const FORM_TYPE_LABELS = {
  PaymentApproval: 'ใบขออนุมัติจ่ายเงิน',
  CashAdvance: 'ใบขอเบิกเงินทดรองจ่าย',
  CashAllowance: 'ใบเบิกค่าใช้จ่าย'
};

const STATUS_CONFIG = {
  draft: { label: 'แบบร่าง', color: '#6b7280', bg: '#f3f4f6', icon: FileText },
  pending: { label: 'รออนุมัติ', color: '#eab308', bg: '#fef9c3', icon: Clock },
  approved: { label: 'อนุมัติแล้ว', color: '#16a34a', bg: '#dcfce7', icon: CheckCircle },
  rejected: { label: 'ไม่อนุมัติ', color: '#dc2626', bg: '#fee2e2', icon: XCircle },
};

const MyDocuments = ({ userEmail, onPrint }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchDocs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/forms/my-documents', {
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

  useEffect(() => { fetchDocs(); }, []);

  const filtered = filter === 'all' ? documents : documents.filter(d => d.status === filter);

  return (
    <div className="form-card" style={{ maxWidth: '1000px', margin: '0 auto 40px auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.8rem',
        marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem'
      }}>
        <div style={{
          background: 'var(--primary-color)', padding: '12px', borderRadius: '12px', color: 'white', display: 'flex'
        }}>
          <FileText size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="page-title" style={{ margin: 0, textAlign: 'left', color: 'var(--primary-color)' }}>
            เอกสารของฉัน
          </h2>
          <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>
            รายการเอกสารทั้งหมดที่คุณส่ง
          </p>
        </div>
        <button className="btn btn-outline" onClick={fetchDocs} disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={16} /> รีเฟรช
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'ทั้งหมด' },
          { key: 'draft', label: 'แบบร่าง' },
          { key: 'pending', label: 'รออนุมัติ' },
          { key: 'approved', label: 'อนุมัติแล้ว' },
          { key: 'rejected', label: 'ไม่อนุมัติ' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 16px', borderRadius: '20px', border: '1px solid',
              fontSize: '0.8rem', fontWeight: filter === f.key ? 'bold' : 'normal',
              background: filter === f.key ? 'var(--primary-color)' : 'white',
              color: filter === f.key ? 'white' : 'var(--text-light)',
              borderColor: filter === f.key ? 'var(--primary-color)' : 'var(--border-color)',
              cursor: 'pointer'
            }}
          >
            {f.label} {f.key === 'all' ? `(${documents.length})` : `(${documents.filter(d => d.status === f.key).length})`}
          </button>
        ))}
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
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-light)' }}>
          <FileText size={48} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p>ไม่มีเอกสาร</p>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>เลขเอกสาร</th>
                <th style={thStyle}>ประเภท</th>
                <th style={thStyle}>วันที่</th>
                <th style={thStyle}>สถานะ</th>
                <th style={thStyle}>พิมพ์</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, idx) => {
                const cfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.draft;
                const Icon = cfg.icon;
                const canPrint = doc.status === 'approved';
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
                      {canPrint ? (
                        <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                          onClick={() => onPrint && onPrint(doc.docNo, doc.sheetName)}>
                          <Printer size={14} /> พิมพ์
                        </button>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                          {doc.status === 'pending' ? 'รออนุมัติ' : doc.status === 'rejected' ? 'ถูกปฏิเสธ' : '-'}
                        </span>
                      )}
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

export default MyDocuments;
