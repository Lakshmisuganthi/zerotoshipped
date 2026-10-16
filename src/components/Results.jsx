import { useEffect, useRef, useState } from 'react';

import ScoreRing from './ScoreRing.jsx';
import SkillChips from './SkillChips.jsx';

function verdictFor(score) {
  if (score >= 80) {
    return ['Strong match', 'This resume already proves most of what the role asks for.'];
  }
  if (score >= 55) {
    return ['Promising', 'A solid base. Close the gaps below and it reads much stronger.'];
  }
  if (score >= 30) {
    return ['Needs work', 'Several core skills are missing from the page entirely.'];
  }
  return ['Early days', 'Add the missing skills — a line or a project each is enough.'];
}

/* The old version counted the score up with setInterval and wrote it into the
 * DOM. Same effect here, but the number is state, so React re-renders it. */
function useCountUp(target, duration = 700) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setShown(0);
      return undefined;
    }

    const tick = Math.max(12, duration / target);
    const timer = setInterval(() => {
      setShown((current) => {
        if (current + 1 >= target) {
          clearInterval(timer);
          return target;
        }
        return current + 1;
      });
    }, tick);

    return () => clearInterval(timer);
  }, [target, duration]);

  return shown;
}

export default function Results({ result, onReset }) {
  const shownScore = useCountUp(result.score);
  const [headline, detail] = verdictFor(result.score);
  const sectionRef = useRef(null);

  // Bring the results into view once, the way scrollIntoView did before.
  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section
      className="panel results"
      ref={sectionRef}
      aria-labelledby="results-heading"
    >
      <h2 id="results-heading" className="panel-title">
        Results for <span className="file-name">{result.fileName}</span>
      </h2>

      <div className="results-grid">
        <div className="score-card">
          <ScoreRing score={result.score} label={shownScore} />
          <p className="verdict">{headline}</p>
          <p className="verdict-detail">{detail}</p>
          <p className="sr-only">Score: {shownScore} out of 100</p>
        </div>

        <div className="skills">
          <SkillChips heading="Skills present" kind="present" skills={result.present} />
          <SkillChips heading="Skills missing" kind="missing" skills={result.missing} />
        </div>
      </div>

      <button className="button" type="button" onClick={onReset}>
        Scan another resume
      </button>
    </section>
  );
}
