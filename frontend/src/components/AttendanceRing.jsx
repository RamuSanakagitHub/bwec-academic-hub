import React from 'react';

export default function AttendanceRing({ percentage = 0, size = 80, strokeWidth = 8, label = '' }) {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percentage / 100) * circ;
  const color = percentage >= 75 ? '#00e676' : percentage >= 60 ? '#ff9800' : '#f44336';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1a2f45" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size > 70 ? '1rem' : '0.75rem', fontWeight: 800, color }}>{percentage}%</span>
        </div>
      </div>
      {label && <span style={{ fontSize: '0.72rem', color: '#8fa3bf', textAlign: 'center' }}>{label}</span>}
    </div>
  );
}
