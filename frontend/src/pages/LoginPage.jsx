import React, { useState } from 'react';
import { LogIn, Mail, AlertCircle } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('กรุณากรอก Email และรหัสผ่าน');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const json = await res.json();

      if (json.success) {
        localStorage.setItem('token', json.token);
        onLogin(json.data);
      } else {
        setError(json.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <LogIn size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', color: '#1e293b', margin: '0 0 8px' }}>
            ระบบเอกสารอนุมัติ
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            เข้าสู่ระบบด้วย Email ของคุณ
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px',
            marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151', fontSize: '0.9rem' }}>
            อีเมล
          </label>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
                border: '2px solid #e5e7eb', fontSize: '1rem', outline: 'none',
                transition: 'border-color 0.2s', boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151', fontSize: '0.9rem' }}>
            รหัสผ่าน
          </label>
          <div style={{ position: 'relative', marginBottom: '30px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔒</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
                border: '2px solid #e5e7eb', fontSize: '1rem', outline: 'none',
                transition: 'border-color 0.2s', boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
              cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <LogIn size={18} /> {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
