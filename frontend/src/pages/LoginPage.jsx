import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { login, register, loading } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', branch: 'ECE', year: '2', rollNumber: '' });
  const [error, setError] = useState('');

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const result = mode === 'login'
      ? await login(form.email, form.password)
      : await register({ ...form, year: parseInt(form.year) });
    if (!result.success) setError(result.message);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg,#00b4d8,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>🎓</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            <span style={{ color: '#fff' }}>BWEC</span> <span className="text-gradient">Academic Hub</span>
          </h1>
          <p style={{ color: '#8fa3bf', marginTop: 6, fontSize: '0.9rem' }}>B.Tech Study Ecosystem — ECE · CSE · AIML</p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', background: '#0d1b2a', borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit', transition: 'all 0.2s', background: mode === m ? 'linear-gradient(135deg,#00b4d8,#00d4ff)' : 'transparent', color: mode === m ? '#000' : '#8fa3bf' }}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8fa3bf', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="Your full name" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8fa3bf', display: 'block', marginBottom: 6 }}>Roll Number</label>
                <input className="form-input" name="rollNumber" value={form.rollNumber} onChange={handle} placeholder="20B01A0401" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#8fa3bf', display: 'block', marginBottom: 6 }}>Branch</label>
                  <select className="form-input" name="branch" value={form.branch} onChange={handle}>
                    <option>ECE</option><option>CSE</option><option>AIML</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#8fa3bf', display: 'block', marginBottom: 6 }}>Year</label>
                  <select className="form-input" name="year" value={form.year} onChange={handle}>
                    <option value="1">1st Year</option><option value="2">2nd Year</option>
                    <option value="3">3rd Year</option><option value="4">4th Year</option>
                  </select>
                </div>
              </div>
            </>
          )}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#8fa3bf', display: 'block', marginBottom: 6 }}>Email</label>
            <input className="form-input" name="email" type="email" value={form.email} onChange={handle} placeholder="student@bwec.ac.in" required />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#8fa3bf', display: 'block', marginBottom: 6 }}>Password</label>
            <input className="form-input" name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required />
          </div>
          {error && <div style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f44336', fontSize: '0.85rem' }}>{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4, padding: '13px' }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: '#4a6080' }}>
          BWEC — Bharat Welfare Engineering College
        </p>
      </div>
    </div>
  );
}
