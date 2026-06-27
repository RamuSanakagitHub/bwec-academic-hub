import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DiagramViewer from '../components/DiagramViewer';

export default function SyllabusUnits() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [units, setUnits] = useState([]);
  const [activeUnit, setActiveUnit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`/api/subjects/${subjectId}`),
      axios.get(`/api/units?subject=${subjectId}`)
    ]).then(([s, u]) => { setSubject(s.data); setUnits(u.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [subjectId]);

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#4a6080' }}>Loading…</div>;
  if (!subject) return <div style={{ padding: 40, color: '#f44336' }}>Subject not found.</div>;

  const unit = units[activeUnit];

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 16, fontSize: '0.82rem', color: '#4a6080' }}>
        <Link to="/syllabus" style={{ color: '#00d4ff', textDecoration: 'none' }}>Syllabus</Link>
        <span> / </span>
        <span style={{ color: '#8fa3bf' }}>{subject.name}</span>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <span className="badge badge-cyan">{subject.code}</span>
          <span className="badge badge-green">{subject.branch}</span>
          <span className="tag">Year {subject.year} · Sem {subject.semester}</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{subject.name}</h1>
        <p style={{ color: '#8fa3bf', marginTop: 4, fontSize: '0.88rem' }}>{subject.description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Unit list */}
        <div>
          <div style={{ fontSize: '0.72rem', color: '#4a6080', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8, padding: '0 4px' }}>Units</div>
          {units.map((u, i) => (
            <button key={u._id} onClick={() => setActiveUnit(i)} style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 8, border: `1px solid ${activeUnit === i ? '#00d4ff' : '#1a2f45'}`, background: activeUnit === i ? 'rgba(0,212,255,0.1)' : '#0d1b2a', cursor: 'pointer', marginBottom: 6, color: activeUnit === i ? '#00d4ff' : '#8fa3bf', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px', marginBottom: 2 }}>UNIT {u.unitNumber}</div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.3 }}>{u.title}</div>
            </button>
          ))}
          <div style={{ marginTop: 12 }}>
            <Link to={`/quiz?subject=${subjectId}`} className="btn-primary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', fontSize: '0.8rem', padding: '10px' }}>Take Quiz</Link>
            <Link to={`/flashcards?subject=${subjectId}`} className="btn-ghost" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', fontSize: '0.8rem', padding: '9px', marginTop: 8 }}>Flashcards</Link>
          </div>
        </div>

        {/* Unit content */}
        {unit ? (
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.7rem', color: '#4a6080', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>Unit {unit.unitNumber}</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>{unit.title}</h2>
              {unit.overview && <p style={{ color: '#8fa3bf', fontSize: '0.88rem', lineHeight: 1.6 }}>{unit.overview}</p>}
            </div>

            {unit.topics?.map((topic, ti) => (
              <div key={ti} className="card" style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#00d4ff', marginBottom: 10 }}>
                  {ti + 1}. {topic.title}
                </h3>
                <p style={{ color: '#c8d8e8', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 12 }}>{topic.explanation}</p>

                {topic.diagramType && topic.diagramType !== 'none' && (
                  <DiagramViewer type={topic.diagramType} label={topic.diagramLabel} />
                )}

                {topic.keyPoints?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8fa3bf', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Key Points</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {topic.keyPoints.map((kp, j) => (
                        <li key={j} style={{ display: 'flex', gap: 8, fontSize: '0.85rem', color: '#c8d8e8' }}>
                          <span style={{ color: '#00d4ff', fontWeight: 700, flexShrink: 0 }}>›</span>
                          {kp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {topic.formulas?.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8fa3bf', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Formulas</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {topic.formulas.map((f, j) => (
                        <div key={j} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1a2f45', borderRadius: 6, padding: '8px 14px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#00e676' }}>{f}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#4a6080', textAlign: 'center', padding: 40 }}>Select a unit from the left</div>
        )}
      </div>
    </div>
  );
}
