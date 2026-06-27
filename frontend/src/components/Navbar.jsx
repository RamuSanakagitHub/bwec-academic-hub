import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/syllabus?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header style={{
      height: '60px', background: '#070d1a',
      borderBottom: '1px solid #1a2f45',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 90
    }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 520, gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4a6080', fontSize: '0.9rem' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subjects, topics, codes…"
            style={{
              width: '100%', background: '#0d1b2a', border: '1px solid #1a2f45',
              borderRadius: 8, padding: '8px 12px 8px 36px', color: '#e2e8f0',
              fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit'
            }}
          />
        </div>
        <button type="submit" style={{ background: 'linear-gradient(135deg,#00b4d8,#00d4ff)', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.5px' }}>
          SEARCH
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: '0.82rem', color: '#ff9800' }}>🔥 {user?.streakCount || 0} Days</span>
        <span style={{ fontSize: '0.82rem', color: '#00d4ff' }}>⚡ {user?.xp || 0} XP</span>
        {user && (
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#00b4d8,#0070a8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
