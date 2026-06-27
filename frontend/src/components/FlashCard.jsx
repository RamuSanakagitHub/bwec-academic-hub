import React, { useState } from 'react';

export default function FlashCard({ question, answer, topic, difficulty, cardNumber, total }) {
  const [flipped, setFlipped] = useState(false);

  const diffColor = { easy: '#00e676', medium: '#ff9800', hard: '#f44336' };

  return (
    <div style={{ width: '100%' }}>
      {/* Card counter */}
      {total && (
        <div style={{ textAlign: 'center', marginBottom: 8, fontSize: '0.8rem', color: '#4a6080' }}>
          CARD {cardNumber} OF {total}
        </div>
      )}

      {/* Progress bar */}
      {total && (
        <div style={{ background: '#1a2f45', height: 3, borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(cardNumber / total) * 100}%`, background: 'linear-gradient(90deg,#00b4d8,#00d4ff)', borderRadius: 2, transition: 'width 0.3s ease' }} />
        </div>
      )}

      {/* 3D Flip Scene */}
      <div
        className={`flashcard-scene ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(f => !f)}
        title="Click to flip"
      >
        <div className="flashcard-inner">
          {/* Front */}
          <div className="flashcard-face flashcard-front">
            <div style={{ position: 'absolute', top: 16, left: 16 }}>
              <span className={`badge badge-${difficulty}`}>{topic?.toUpperCase() || 'TOPIC'}</span>
            </div>
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: diffColor[difficulty] || '#ff9800', textTransform: 'uppercase' }}>{difficulty?.toUpperCase()}</span>
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6, color: '#e2e8f0', maxWidth: '80%' }}>
              {question}
            </p>
            <div className="flip-hint">
              <span style={{ fontSize: '1rem' }}>↻</span>
              <span>TAP TO FLIP AND REVEAL ANSWER</span>
            </div>
          </div>

          {/* Back */}
          <div className="flashcard-face flashcard-back">
            <div style={{ position: 'absolute', top: 16, left: 16 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00e676', textTransform: 'uppercase', letterSpacing: '1px' }}>✓ ANSWER</span>
            </div>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#c8f7dc', maxWidth: '85%', fontWeight: 400 }}>
              {answer}
            </p>
            <div className="flip-hint" style={{ color: '#1a5e30' }}>
              <span>↻</span> <span>TAP TO SEE QUESTION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
