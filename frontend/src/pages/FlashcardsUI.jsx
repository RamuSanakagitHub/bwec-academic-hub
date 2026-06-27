import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FlashCard from '../components/FlashCard';

export default function FlashcardsUI() {
  const [params] = useSearchParams();
  const subjectFilter = params.get('subject');
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [diffFilter, setDiffFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [selSubject, setSelSubject] = useState(subjectFilter || 'All');

  useEffect(() => {
    axios.get('/api/subjects').then(r => setSubjects(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (selSubject !== 'All') q.set('subject', selSubject);
    if (diffFilter !== 'All') q.set('difficulty', diffFilter.toLowerCase());
    axios.get(`/api/flashcards?${q.toString()}`)
      .then(r => { setCards(r.data); setCurrent(0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selSubject, diffFilter]);

  const filtered = cards;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span>🃏</span>
          <h1 style={{ fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>INTERACTIVE REVISION FLASHCARDS</h1>
        </div>
        <p>Flip cards to verify equations, derivations, and complex terminology definitions.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <select
          value={selSubject}
          onChange={e => { setSelSubject(e.target.value); setCurrent(0); }}
          className="form-input"
          style={{ width: 'auto', minWidth: 200 }}
        >
          <option value="All">All Subjects</option>
          {subjects.map(s => <option key={s._id} value={s._id}>{s.code} – {s.name}</option>)}
        </select>
        <div style={{ display: 'flex', background: '#0d1b2a', borderRadius: 8, padding: 4, gap: 2 }}>
          {['All', 'Easy', 'Medium', 'Hard'].map(d => (
            <button key={d} onClick={() => { setDiffFilter(d); setCurrent(0); }} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, background: diffFilter === d ? 'linear-gradient(135deg,#00b4d8,#00d4ff)' : 'transparent', color: diffFilter === d ? '#000' : '#8fa3bf', transition: 'all 0.15s' }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#4a6080' }}>Loading flashcards…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#4a6080' }}>No flashcards found for this filter.</div>
      ) : (
        <div>
          {/* Subject info */}
          {filtered[current]?.subject && (
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
              <span className="badge badge-cyan">{filtered[current].subject.code}</span>
              <span style={{ color: '#8fa3bf', fontSize: '0.82rem', marginLeft: 8 }}>{filtered[current].subject.name}</span>
            </div>
          )}

          <FlashCard
            question={filtered[current]?.question}
            answer={filtered[current]?.answer}
            topic={filtered[current]?.topic}
            difficulty={filtered[current]?.difficulty}
            cardNumber={current + 1}
            total={filtered.length}
          />

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 20 }}>
            <button
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #1a2f45', background: '#0d1b2a', cursor: current === 0 ? 'not-allowed' : 'pointer', color: current === 0 ? '#1a2f45' : '#00d4ff', fontSize: '1.2rem' }}>
              ‹
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              {filtered.slice(Math.max(0, current - 3), current + 4).map((_, i) => {
                const idx = Math.max(0, current - 3) + i;
                return (
                  <button key={idx} onClick={() => setCurrent(idx)} style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', background: idx === current ? '#00d4ff' : '#1a2f45', transition: 'all 0.15s' }} />
                );
              })}
            </div>
            <button
              onClick={() => setCurrent(c => Math.min(filtered.length - 1, c + 1))}
              disabled={current === filtered.length - 1}
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #1a2f45', background: '#0d1b2a', cursor: current === filtered.length - 1 ? 'not-allowed' : 'pointer', color: current === filtered.length - 1 ? '#1a2f45' : '#00d4ff', fontSize: '1.2rem' }}>
              ›
            </button>
          </div>

          {/* Tip */}
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.78rem', color: '#4a6080' }}>
            Click the card to flip and reveal the answer
          </p>
        </div>
      )}
    </div>
  );
}
