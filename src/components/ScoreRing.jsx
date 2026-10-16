/* `score` drives the arc; `label` is what the number in the middle reads, so
 * the two can animate at different paces (the arc transitions, the number
 * counts up) without disagreeing about where the arc ends. */
export default function ScoreRing({ score, label = score }) {
  // Circumference of the r=52 circle in the SVG below: 2 * PI * 52.
  const ringLength = 2 * Math.PI * 52;
  const level = score >= 80 ? 'high' : score >= 55 ? 'mid' : 'low';

  return (
    <div className="score-card">
      <div className="ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="ring-track" cx="60" cy="60" r="52" />
          {/* CSS transitions the dash offset, so React only has to set the
              target value and the arc animates itself. */}
          <circle
            className={`ring-value is-${level}`}
            cx="60"
            cy="60"
            r="52"
            style={{ strokeDasharray: ringLength, strokeDashoffset: ringLength * (1 - score / 100) }}
          />
        </svg>
        <div className="ring-label">
          <span className="score">{label}</span>
          <span className="score-out">/ 100</span>
        </div>
      </div>
    </div>
  );
}
