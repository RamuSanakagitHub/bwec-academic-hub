import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/', label: 'Syllabus Dashboard', icon: '⊞' },
  { path: '/syllabus', label: 'Syllabus & Units', icon: '📖' },
  { path: '/quiz', label: 'Quiz & Mocks', icon: '✦' },
  { path: '/flashcards', label: 'Flashcards UI', icon: '🃏' },
  { path: '/attendance', label: 'Attendance', icon: '📊' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleNav = () => { if (onClose) onClose(); };

  return (
    <aside className={`sidebar${open ? ' sidebar-open' : ''}`} style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: '240px',
      background: '#060e1a', borderRight: '1px solid #1a2f45',
      display: 'flex', flexDirection: 'column', zIndex: 100,
      transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)'
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1a2f45' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#00b4d8,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}><span style={{ color: '#fff' }}>B.Tech</span> <span style={{ color: '#00d4ff' }}>Hub</span></div>
            <div style={{ fontSize: '0.65rem', color: '#4a6080', letterSpacing: '0.5px', textTransform: 'uppercase' }}>BWEC Study Ecosystem</div>
          </div>
        </div>
        {user && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>{user.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#4a6080', marginTop: 2 }}>{user.branch} • SEM {user.semester || user.year * 2}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.65rem', color: '#4a6080', letterSpacing: '1px', textTransform: 'uppercase', padding: '8px 8px 12px', fontWeight: 600 }}>
          Academic Workboards
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={handleNav}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8, marginBottom: 2,
              textDecoration: 'none', fontSize: '0.85rem',
              background: isActive ? 'rgba(0,212,255,0.12)' : 'transparent',
              color: isActive ? '#00d4ff' : '#8fa3bf',
              borderLeft: isActive ? '2px solid #00d4ff' : '2px solid transparent',
              transition: 'all 0.15s'
            })}
          >
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1a2f45' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: '#8fa3bf' }}>🔥 {user.streakCount || 0} day streak</span>
            <span style={{ fontSize: '0.8rem', color: '#00d4ff' }}>⚡ {user.xp || 0} XP</span>
          </div>
        )}
        <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)', color: '#f44336', padding: '8px', borderRadius: 6, cursor: 'pointer', fontSize: '0.82rem' }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
