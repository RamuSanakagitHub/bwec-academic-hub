import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import AttendanceRing from '../components/AttendanceRing';

export default function AttendancePage() {
  const { user } = useApp();
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initForm, setInitForm] = useState({ subjectId: '', totalClasses: '', attendedClasses: '' });
  const [msg, setMsg] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/attendance'),
      axios.get(`/api/subjects?branch=${user.branch}&year=${user.year}`)
    ]).then(([a, s]) => { setAttendance(a.data); setSubjects(s.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const attMap = {};
  attendance.forEach(a => { attMap[a.subject._id || a.subject] = a; });

  const avgPct = attendance.length ? Math.round(attendance.reduce((s, a) => s + a.percentage, 0) / attendance.length) : 0;
  const safeSubjects = attendance.filter(a => a.percentage >= 75).length;
  const warnSubjects = attendance.filter(a => a.warning).length;

  const handleInit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.put('/api/attendance/init', {
        subjectId: initForm.subjectId,
        totalClasses: parseInt(initForm.totalClasses),
        attendedClasses: parseInt(initForm.attendedClasses)
      });
      setMsg('✓ Attendance updated!');
      setInitForm({ subjectId: '', totalClasses: '', attendedClasses: '' });
      fetchData();
    } catch { setMsg('Failed to update.'); }
  };

  const classesNeeded = (att) => {
    if (!att) return null;
    const { attendedClasses, totalClasses } = att;
    if (att.percentage >= 75) return null;
    let t = totalClasses, a = attendedClasses;
    while (a / t < 0.75) { t++; a++; }
    return t - totalClasses;
  };

  return (
    <div>
      <div className="page-header">
        <h1>📊 Student Attendance</h1>
        <p>Track attendance percentage and strikes for each subject. 75% minimum required.</p>
      </div>

      {/* Summary */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Overall Average', value: `${avgPct}%`, color: avgPct >= 75 ? '#00e676' : '#f44336', icon: '📊' },
          { label: 'Safe Subjects', value: safeSubjects, color: '#00e676', icon: '✓' },
          { label: 'Warnings', value: warnSubjects, color: warnSubjects > 0 ? '#f44336' : '#00e676', icon: '⚠' },
          { label: 'Streak Count', value: `${user?.streakCount || 0} days`, color: '#ff9800', icon: '🔥' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#8fa3bf', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Subject attendance cards */}
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 14, color: '#8fa3bf', textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.5px' }}>Subject-wise Attendance</h3>
          {loading ? (
            <div style={{ color: '#4a6080', textAlign: 'center', padding: 40 }}>Loading…</div>
          ) : subjects.length === 0 ? (
            <div style={{ color: '#4a6080', padding: 20 }}>No subjects found.</div>
          ) : (
            <div className="grid-2">
              {subjects.map(s => {
                const att = attendance.find(a => (a.subject._id || a.subject) === s._id || a.subject?.code === s.code);
                const pct = att?.percentage || 0;
                const needed = classesNeeded(att);
                return (
                  <div key={s._id} className="card" style={{ borderLeft: `3px solid ${pct >= 75 ? '#00e676' : pct >= 60 ? '#ff9800' : '#f44336'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <span className="badge badge-cyan" style={{ marginBottom: 6, display: 'inline-block' }}>{s.code}</span>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.3 }}>{s.name}</div>
                      </div>
                      <AttendanceRing percentage={pct} size={56} strokeWidth={6} />
                    </div>
                    {att ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.8rem', color: '#8fa3bf' }}>
                          <span>Attended: {att.attendedClasses}/{att.totalClasses}</span>
                          <span>Strikes: <span style={{ color: att.strikes > 3 ? '#f44336' : '#ff9800' }}>{att.strikes || 0}</span></span>
                        </div>
                        <div className="att-bar-track">
                          <div className="att-bar-fill" style={{ width: `${pct}%`, background: pct >= 75 ? '#00e676' : pct >= 60 ? '#ff9800' : '#f44336' }} />
                        </div>
                        {att.warning && needed && (
                          <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#ff9800', background: 'rgba(255,152,0,0.1)', borderRadius: 4, padding: '4px 8px' }}>
                            ⚠ Attend {needed} more consecutive class{needed > 1 ? 'es' : ''} to reach 75%
                          </div>
                        )}
                        {pct >= 75 && (
                          <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#00e676' }}>✓ Safe attendance</div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: '#4a6080' }}>No attendance recorded yet</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Init form */}
        <div>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Update Attendance</h3>
            <form onSubmit={handleInit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8fa3bf', display: 'block', marginBottom: 6 }}>Subject</label>
                <select className="form-input" value={initForm.subjectId} onChange={e => setInitForm(f => ({ ...f, subjectId: e.target.value }))} required>
                  <option value="">Select subject…</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.code} – {s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8fa3bf', display: 'block', marginBottom: 6 }}>Total Classes Conducted</label>
                <input className="form-input" type="number" min="0" value={initForm.totalClasses} onChange={e => setInitForm(f => ({ ...f, totalClasses: e.target.value }))} placeholder="e.g. 40" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#8fa3bf', display: 'block', marginBottom: 6 }}>Classes Attended</label>
                <input className="form-input" type="number" min="0" value={initForm.attendedClasses} onChange={e => setInitForm(f => ({ ...f, attendedClasses: e.target.value }))} placeholder="e.g. 32" required />
              </div>
              {msg && <div style={{ fontSize: '0.82rem', color: msg.startsWith('✓') ? '#00e676' : '#f44336' }}>{msg}</div>}
              <button type="submit" className="btn-primary">Update</button>
            </form>
          </div>

          {/* Strikes info */}
          <div className="card" style={{ marginTop: 14 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 10, color: '#e2e8f0' }}>Attendance Rules — BWEC</h4>
            {[
              ['≥ 75%', 'Safe — eligible for exams', '#00e676'],
              ['65–74%', 'Warning — attend makeup classes', '#ff9800'],
              ['< 65%', 'Detained — cannot appear in exams', '#f44336'],
              ['3 strikes', 'Academic advisory issued', '#ff9800'],
            ].map(([val, desc, col]) => (
              <div key={val} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                <span style={{ color: col, fontWeight: 700, fontSize: '0.82rem', minWidth: 60 }}>{val}</span>
                <span style={{ color: '#8fa3bf', fontSize: '0.8rem', lineHeight: 1.4 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
