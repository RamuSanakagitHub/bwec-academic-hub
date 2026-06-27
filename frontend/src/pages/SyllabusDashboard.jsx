import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const YEARS = [1, 2, 3, 4];
const BRANCHES = ['ECE', 'CSE', 'AIML'];

export default function SyllabusDashboard() {
  const { user } = useApp();
  const [params] = useSearchParams();
  const [subjects, setSubjects] = useState([]);
  const [branch, setBranch] = useState(user?.branch || 'ECE');
  const [year, setYear] = useState(user?.year || 2);
  const [loading, setLoading] = useState(false);

  const q = params.get('q') || '';

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/subjects?branch=${branch}&year=${year}`)
      .then(r => setSubjects(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [branch, year]);

  const filtered = q
    ? subjects.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.code.toLowerCase().includes(q.toLowerCase()))
    : subjects;

  return (
    <div>
      <div className="page-header">
        <h1>📖 Syllabus & Units</h1>
        <p>All B.Tech subjects — ECE · CSE · AIML — 1st to Final Year</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', background: '#0d1b2a', borderRadius: 8, padding: 4, gap: 2 }}>
          {BRANCHES.map(b => (
            <button key={b} onClick={() => setBranch(b)} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit', background: branch === b ? 'linear-gradient(135deg,#00b4d8,#00d4ff)' : 'transparent', color: branch === b ? '#000' : '#8fa3bf', transition: 'all 0.15s' }}>
              {b}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {YEARS.map(y => (
            <button key={y} onClick={() => setYear(y)} style={{ width: 44, height: 36, borderRadius: 6, border: `1px solid ${year === y ? '#00d4ff' : '#1a2f45'}`, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit', background: year === y ? 'rgba(0,212,255,0.15)' : 'transparent', color: year === y ? '#00d4ff' : '#8fa3bf', transition: 'all 0.15s' }}>
              Y{y}
            </button>
          ))}
        </div>
        {q && <span style={{ color: '#8fa3bf', fontSize: '0.85rem' }}>Search: "{q}" — {filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#4a6080' }}>Loading subjects…</div>
      ) : (
        <>
          <div style={{ marginBottom: 10, fontSize: '0.82rem', color: '#4a6080' }}>
            {filtered.length} subject{filtered.length !== 1 ? 's' : ''} · {branch} · Year {year} (Sem {year * 2 - 1} & {year * 2})
          </div>
          <div className="grid-2">
            {filtered.map(s => (
              <Link key={s._id} to={`/syllabus/${s._id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ transition: 'transform 0.15s, border-color 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span className="badge badge-cyan">{s.code}</span>
                    <span style={{ fontSize: '0.75rem', color: '#4a6080' }}>Sem {s.semester}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 6, lineHeight: 1.4 }}>{s.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#8fa3bf', lineHeight: 1.5, marginBottom: 12 }}>{s.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge badge-${s.branch === 'COMMON' ? 'green' : 'cyan'}`} style={{ fontSize: '0.7rem' }}>{s.branch}</span>
                    <span style={{ color: '#00d4ff', fontSize: '0.8rem', fontWeight: 600 }}>View Units →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#4a6080' }}>
              No subjects found. Try a different branch or year.
            </div>
          )}
        </>
      )}
    </div>
  );
}
