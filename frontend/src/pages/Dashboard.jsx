import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import AttendanceRing from '../components/AttendanceRing';

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function Dashboard() {
  const { user } = useApp();
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [recentScores, setRecentScores] = useState([]);

  useEffect(() => {
    if (!user) return;
    axios.get(`/api/subjects?branch=${user.branch}&year=${user.year}`).then(r => setSubjects(r.data)).catch(() => {});
    axios.get('/api/attendance').then(r => setAttendance(r.data)).catch(() => {});
    setRecentScores(user.quizScores?.slice(-5).reverse() || []);
  }, [user]);

  const avgAtt = attendance.length
    ? Math.round(attendance.reduce((s, a) => s + a.percentage, 0) / attendance.length)
    : 0;
  const warnings = attendance.filter(a => a.warning).length;

  return (
    <div>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d2040 50%, #0a2035 100%)', borderRadius: 16, border: '1px solid #1a2f45', padding: '28px 32px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <span className="badge badge-orange" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>★ B.TECH HUB BWEC</span>
              <span className="badge badge-cyan">{user?.branch} • SEM {user?.semester || user?.year * 2}</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
              {greet()}, <span className="text-gradient">{user?.name?.split(' ')[0]}!</span>
            </h1>
            <p style={{ color: '#8fa3bf', fontSize: '0.9rem', maxWidth: 500, lineHeight: 1.6 }}>
              Curriculum configured for BWEC. Your personalized study routes, diagnostic mock cards, and topic explainers are ready.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Link to="/syllabus" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '0.82rem' }}>📖 Browse Syllabus</Link>
              <Link to="/quiz" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.82rem' }}>Practice Quiz →</Link>
            </div>
          </div>
          <div className="card" style={{ minWidth: 160, textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}>
            <AttendanceRing percentage={avgAtt} size={90} />
            <div style={{ marginTop: 8, fontSize: '0.72rem', color: '#8fa3bf', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mastery Rank</div>
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.75rem', color: '#ff9800' }}>🔥</span>
              <span style={{ fontSize: '0.78rem', color: '#00d4ff' }}>{user?.streakCount || 0} day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Active Subjects', value: subjects.length, sub: 'Browse chapters →', icon: '📚', link: '/syllabus', color: '#00d4ff' },
          { label: 'Quiz Attempts', value: user?.quizScores?.length || 0, sub: 'View history →', icon: '✦', link: '/quiz', color: '#00e676' },
          { label: 'Attendance Warnings', value: warnings, sub: warnings > 0 ? 'Action needed!' : 'Looking good!', icon: '⚠', link: '/attendance', color: warnings > 0 ? '#f44336' : '#00e676' },
          { label: 'Safe Attendance %', value: `${avgAtt}%`, sub: `${attendance.length} subjects tracked`, icon: '📊', link: '/attendance', color: avgAtt >= 75 ? '#00e676' : '#f44336' },
        ].map(s => (
          <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.4rem', marginTop: 2 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#8fa3bf', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#4a6080', marginTop: 4 }}>{s.sub}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Subjects grid + Recent scores */}
      <div className="col-layout">
        {/* Subjects */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontWeight: 700 }}>Your Subjects — {user?.branch} Year {user?.year}</h3>
                <p style={{ color: '#8fa3bf', fontSize: '0.8rem', marginTop: 2 }}>Click any subject to view its syllabus and units</p>
              </div>
              <Link to="/syllabus" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>View All</Link>
            </div>
            <div className="grid-2">
              {subjects.slice(0, 8).map(s => (
                <Link key={s._id} to={`/syllabus/${s._id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#162236', borderRadius: 10, padding: '14px 16px', border: '1px solid #1a2f45', transition: 'border-color 0.15s' }}>
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem', marginBottom: 8, display: 'inline-block' }}>{s.code}</span>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.4, marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#4a6080' }}>Sem {s.semester} • {s.credits} credits</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent quiz scores */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8fa3bf' }}>📈 Recent Quiz History</h3>
            {recentScores.length === 0 ? (
              <div style={{ color: '#4a6080', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
                No quizzes attempted yet.<br />
                <Link to="/quiz" style={{ color: '#00d4ff', textDecoration: 'none', marginTop: 8, display: 'inline-block' }}>Start a Quiz →</Link>
              </div>
            ) : recentScores.map((qs, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < recentScores.length - 1 ? '1px solid #1a2f45' : 'none' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 500 }}>Quiz Attempt</div>
                  <div style={{ fontSize: '0.72rem', color: '#4a6080', marginTop: 2 }}>{new Date(qs.date).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: qs.accuracy >= 60 ? '#00e676' : '#f44336' }}>{qs.accuracy}%</div>
                  <div style={{ fontSize: '0.72rem', color: '#4a6080' }}>{qs.score}/{qs.total}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance warning */}
          {warnings > 0 && (
            <div style={{ background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.8rem', color: '#f44336', fontWeight: 700, marginBottom: 6 }}>⚠ ACCREDITATION WARNING</div>
              <div style={{ fontSize: '0.8rem', color: '#ffb3b0', lineHeight: 1.5 }}>
                {warnings} subject{warnings > 1 ? 's have' : ' has'} attendance below 75%. You must attend consecutive lectures to meet university requirements.
              </div>
              <Link to="/attendance" style={{ color: '#f44336', fontSize: '0.8rem', textDecoration: 'none', marginTop: 8, display: 'inline-block' }}>Check Attendance →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
