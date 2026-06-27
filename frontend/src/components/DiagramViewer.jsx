import React from 'react';

function WaveformSVG({ label }) {
  const w = 400, h = 100;
  const points = Array.from({ length: 80 }, (_, i) => {
    const x = (i / 79) * w;
    const y = h / 2 - Math.sin(i * 0.25) * 35 * Math.exp(-i * 0.012);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', maxWidth: 400, height: 100 }}>
      <rect width={w} height={h} fill="transparent" />
      <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="#1a2f45" strokeWidth="1" />
      <polyline points={points} fill="none" stroke="#00d4ff" strokeWidth="2" />
      <text x="4" y="14" fill="#4a6080" fontSize="10">{label}</text>
    </svg>
  );
}

function FlowchartSVG({ label }) {
  return (
    <svg viewBox="0 0 300 220" style={{ width: '100%', maxWidth: 300, height: 220 }}>
      <rect width="300" height="220" fill="transparent" />
      {/* Start */}
      <ellipse cx="150" cy="24" rx="60" ry="18" fill="none" stroke="#00d4ff" strokeWidth="1.5" />
      <text x="150" y="28" textAnchor="middle" fill="#00d4ff" fontSize="11">START</text>
      <line x1="150" y1="42" x2="150" y2="60" stroke="#4a6080" strokeWidth="1" markerEnd="url(#arrow)" />
      {/* Process 1 */}
      <rect x="90" y="60" width="120" height="36" rx="4" fill="none" stroke="#00b4d8" strokeWidth="1.5" />
      <text x="150" y="82" textAnchor="middle" fill="#e2e8f0" fontSize="10">Process Input</text>
      <line x1="150" y1="96" x2="150" y2="114" stroke="#4a6080" strokeWidth="1" />
      {/* Decision */}
      <polygon points="150,114 210,148 150,182 90,148" fill="none" stroke="#ff9800" strokeWidth="1.5" />
      <text x="150" y="152" textAnchor="middle" fill="#ff9800" fontSize="10">Condition?</text>
      <line x1="210" y1="148" x2="250" y2="148" stroke="#4a6080" strokeWidth="1" />
      <text x="224" y="144" fill="#4a6080" fontSize="9">No</text>
      <line x1="150" y1="182" x2="150" y2="202" stroke="#4a6080" strokeWidth="1" />
      <text x="156" y="196" fill="#4a6080" fontSize="9">Yes</text>
      {/* End */}
      <ellipse cx="150" cy="210" rx="50" ry="14" fill="none" stroke="#00e676" strokeWidth="1.5" />
      <text x="150" y="214" textAnchor="middle" fill="#00e676" fontSize="11">END</text>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#4a6080" />
        </marker>
      </defs>
      <text x="4" y="12" fill="#4a6080" fontSize="9">{label}</text>
    </svg>
  );
}

function GraphSVG({ label }) {
  const w = 360, h = 120;
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = 30 + (i / 39) * (w - 60);
    const y = h - 20 - (Math.log(i + 1) / Math.log(40)) * (h - 40);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', maxWidth: 360, height: 120 }}>
      <rect width={w} height={h} fill="transparent" />
      <line x1="30" y1="10" x2="30" y2={h - 20} stroke="#4a6080" strokeWidth="1" />
      <line x1="30" y1={h - 20} x2={w - 10} y2={h - 20} stroke="#4a6080" strokeWidth="1" />
      <polyline points={pts} fill="none" stroke="#00d4ff" strokeWidth="2" />
      <text x="4" y="14" fill="#4a6080" fontSize="9">{label}</text>
    </svg>
  );
}

function BlockDiagramSVG({ label }) {
  return (
    <svg viewBox="0 0 360 80" style={{ width: '100%', maxWidth: 360, height: 80 }}>
      <rect width="360" height="80" fill="transparent" />
      {[['Input', 10], ['Process A', 100], ['Process B', 200], ['Output', 290]].map(([txt, x], i) => (
        <g key={i}>
          <rect x={x} y="20" width="70" height="36" rx="4" fill="none" stroke="#00b4d8" strokeWidth="1.5" />
          <text x={x + 35} y="42" textAnchor="middle" fill="#e2e8f0" fontSize="10">{txt}</text>
          {i < 3 && <line x1={x + 70} y1="38" x2={x + 100} y2="38" stroke="#4a6080" strokeWidth="1.5" markerEnd="url(#arr2)" />}
        </g>
      ))}
      <defs>
        <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#4a6080" />
        </marker>
      </defs>
      <text x="4" y="14" fill="#4a6080" fontSize="9">{label}</text>
    </svg>
  );
}

export default function DiagramViewer({ type, label }) {
  if (!type || type === 'none') return null;
  return (
    <div className="diagram-box">
      {type === 'waveform' && <WaveformSVG label={label} />}
      {type === 'flowchart' && <FlowchartSVG label={label} />}
      {type === 'graph' && <GraphSVG label={label} />}
      {type === 'block' && <BlockDiagramSVG label={label} />}
      {type === 'circuit' && <BlockDiagramSVG label={label} />}
    </div>
  );
}
