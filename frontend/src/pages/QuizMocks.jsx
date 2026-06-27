import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';

const LETTERS = ['A', 'B', 'C', 'D'];

function QuizRunner({ quiz, onDone }) {
  const { user, setUser } = useApp();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [time, setTime] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer.current);
  }, []);

  const q = quiz.questions[current];

  const select = (idx) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [current]: idx }));
  };

  const submit = async () => {
    clearInterval(timer.current);
    const answersArr = quiz.questions.map((_, i) => answers[i] ?? -1);
    try {
      const { data } = await axios.post(`/api/quizzes/${quiz._id}/submit`, { answers: answersArr, timeTaken: time });
      setResult(data);
      setSubmitted(true);
      if (user) setUser(u => ({ ...u, xp: (u.xp || 0) + data.score * 10 }));
    } catch { setSubmitted(true); }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (submitted && result) {
    return (
      <div>
        <div className="card" style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>{result.accuracy >= 80 ? '🎉' : result.accuracy >= 50 ? '👍' : '📚'}</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Quiz Complete!</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, margin: '16px 0' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 800, color: '#00d4ff' }}>{result.score}/{result.total}</div><div style={{ fontSize: '0.75rem', color: '#8fa3bf', textTransform: 'uppercase' }}>Score</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 800, color: result.accuracy >= 60 ? '#00e676' : '#f44336' }}>{result.accuracy}%</div><div style={{ fontSize: '0.75rem', color: '#8fa3bf', textTransform: 'uppercase' }}>Accuracy</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 800, color: '#ff9800' }}>{fmt(time)}</div><div style={{ fontSize: '0.75rem', color: '#8fa3bf', textTransform: 'uppercase' }}>Time</div></div>
          </div>
          <div style={{ color: '#00d4ff', fontWeight: 700, marginBottom: 16 }}>+{result.score * 10} XP Earned!</div>
          <button onClick={onDone} className="btn-primary">Back to Quizzes</button>
        </div>
        <div>
          {result.results.map((r, i) => (
            <div key={i} className="card" style={{ marginBottom: 10, borderLeft: `3px solid ${r.isCorrect ? '#00e676' : '#f44336'}` }}>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem' }}>Q{i + 1}. {r.question}</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <span style={{ fontSize: '0.82rem', color: r.isCorrect ? '#00e676' : '#f44336' }}>{r.isCorrect ? '✓ Correct' : '✗ Wrong'}</span>
                {!r.isCorrect && <span style={{ fontSize: '0.82rem', color: '#8fa3bf' }}>Correct: {LETTERS[r.correct]}</span>}
              </div>
              {r.explanation && <div style={{ fontSize: '0.82rem', color: '#8fa3bf', background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '8px 12px', lineHeight: 1.5 }}>{r.explanation}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <span className="badge badge-cyan" style={{ marginRight: 8 }}>{quiz.subject?.code}</span>
          <span style={{ color: '#8fa3bf', fontSize: '0.85rem' }}>Q{current + 1} of {quiz.questions.length}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: 'monospace', color: '#ff9800', fontWeight: 700 }}>⏱ {fmt(time)}</span>
          <span style={{ fontSize: '0.8rem', color: '#4a6080' }}>{Object.keys(answers).length}/{quiz.questions.length} answered</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: '#1a2f45', height: 4, borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${((current + 1) / quiz.questions.length) * 100}%`, background: 'linear-gradient(90deg,#00b4d8,#00d4ff)', transition: 'width 0.3s ease' }} />
      </div>

      {/* Question */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className={`badge badge-${q.difficulty}`}>{q.difficulty?.toUpperCase()}</span>
          {q.topic && <span style={{ fontSize: '0.75rem', color: '#4a6080' }}>{q.topic}</span>}
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.6, color: '#e2e8f0' }}>{q.question}</h3>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => select(idx)} className={`quiz-option ${answers[current] === idx ? 'selected' : ''}`}>
            <span className="option-letter" style={{ background: answers[current] === idx ? '#00d4ff' : '#1a2f45', color: answers[current] === idx ? '#000' : '#8fa3bf' }}>{LETTERS[idx]}</span>
            {opt}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <button onClick={() => setCurrent(c => Math.max(0, c - 1))} className="btn-ghost" disabled={current === 0} style={{ opacity: current === 0 ? 0.4 : 1 }}>← Prev</button>
        <div style={{ display: 'flex', gap: 6 }}>
          {quiz.questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${i === current ? '#00d4ff' : answers[i] !== undefined ? '#00e676' : '#1a2f45'}`, background: i === current ? 'rgba(0,212,255,0.2)' : answers[i] !== undefined ? 'rgba(0,230,118,0.1)' : 'transparent', cursor: 'pointer', fontSize: '0.75rem', color: i === current ? '#00d4ff' : answers[i] !== undefined ? '#00e676' : '#4a6080', fontFamily: 'inherit' }}>
              {i + 1}
            </button>
          ))}
        </div>
        {current < quiz.questions.length - 1
          ? <button onClick={() => setCurrent(c => c + 1)} className="btn-primary">Next →</button>
          : <button onClick={submit} className="btn-primary" style={{ background: 'linear-gradient(135deg,#00c853,#00e676)' }}>Submit Quiz</button>}
      </div>
    </div>
  );
}

export default function QuizMocks() {
  const [params] = useSearchParams();
  const subjectFilter = params.get('subject');
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();

  useEffect(() => {
    const url = subjectFilter ? `/api/quizzes?subject=${subjectFilter}` : `/api/quizzes`;
    axios.get(url).then(r => setQuizzes(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [subjectFilter]);

  const startQuiz = async (id) => {
    const { data } = await axios.get(`/api/quizzes/${id}`);
    setActiveQuiz(data);
  };

  if (activeQuiz) return (
    <div>
      <button onClick={() => setActiveQuiz(null)} style={{ marginBottom: 16, background: 'transparent', border: 'none', color: '#00d4ff', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}>← Back to Quizzes</button>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontWeight: 800 }}>{activeQuiz.title}</h2>
        <p style={{ color: '#8fa3bf', fontSize: '0.85rem', marginTop: 4 }}>{activeQuiz.description}</p>
      </div>
      <QuizRunner quiz={activeQuiz} onDone={() => setActiveQuiz(null)} />
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span>✦</span>
          <h1 style={{ fontSize: '1.3rem' }}>TOPIC-WISE DIAGNOSTIC MOCKS & ASSESSMENTS</h1>
        </div>
        <p>Test your B.Tech engineering curriculum comprehension. Dynamic milestone tracking.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#4a6080' }}>Loading quizzes…</div>
      ) : (
        <div className="grid-2">
          {quizzes.map(q => (
            <div key={q._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{q.subject?.code}-{q.type?.toUpperCase()}</span>
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{q.type?.toUpperCase()}</span>
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>{q.title}</h3>
              <p style={{ color: '#8fa3bf', fontSize: '0.8rem', marginBottom: 14 }}>
                {q.questions?.length || 0} Tricky MCQs with explanations.
              </p>
              <button onClick={() => startQuiz(q._id)} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                ▶ ATTEMPT QUIZ
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && quizzes.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#4a6080' }}>No quizzes found. Seed the database first.</div>
      )}
    </div>
  );
}
