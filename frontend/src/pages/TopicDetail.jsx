import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DiagramViewer from '../components/DiagramViewer';

export default function TopicDetail() {
  const { subjectId, unitId } = useParams();
  const [unit, setUnit] = useState(null);

  useEffect(() => {
    axios.get(`/api/units/${unitId}`).then(r => setUnit(r.data)).catch(() => {});
  }, [unitId]);

  if (!unit) return <div style={{ textAlign: 'center', padding: 40, color: '#4a6080' }}>Loading…</div>;

  return (
    <div>
      <div style={{ marginBottom: 16, fontSize: '0.82rem', color: '#4a6080' }}>
        <Link to="/syllabus" style={{ color: '#00d4ff', textDecoration: 'none' }}>Syllabus</Link>
        <span> / </span>
        <Link to={`/syllabus/${subjectId}`} style={{ color: '#00d4ff', textDecoration: 'none' }}>{unit.subject?.name}</Link>
        <span> / Unit {unit.unitNumber}</span>
      </div>
      <div className="page-header">
        <div style={{ marginBottom: 6 }}><span className="badge badge-cyan">{unit.subject?.code}</span></div>
        <h1>{unit.title}</h1>
        <p>{unit.overview}</p>
      </div>
      {unit.topics?.map((topic, i) => (
        <div key={i} className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00d4ff', marginBottom: 12 }}>{topic.title}</h2>
          <p style={{ color: '#c8d8e8', lineHeight: 1.75, fontSize: '0.9rem', marginBottom: 14 }}>{topic.explanation}</p>
          <DiagramViewer type={topic.diagramType} label={topic.diagramLabel} />
          {topic.keyPoints?.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8fa3bf', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Key Points</div>
              {topic.keyPoints.map((kp, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: '0.88rem', color: '#c8d8e8' }}>
                  <span style={{ color: '#00d4ff' }}>›</span>{kp}
                </div>
              ))}
            </div>
          )}
          {topic.formulas?.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8fa3bf', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Formulas</div>
              {topic.formulas.map((f, j) => (
                <div key={j} style={{ background: '#0a0f1a', border: '1px solid #1a2f45', borderRadius: 6, padding: '8px 14px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#00e676', marginBottom: 6 }}>{f}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
