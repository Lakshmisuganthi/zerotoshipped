export default function HowItWorks() {
  const steps = [
    ['Upload', 'Pick a PDF. The file is read in your browser and never leaves it.'],
    ['Score', 'Its contents are matched against the skills a junior role asks for.'],
    ['Ship', 'Add what is missing, re-scan, and watch the score climb.'],
  ];

  return (
    <section className="how" id="how">
      <h2 className="panel-title">How it works</h2>
      <ol className="steps">
        {steps.map(([title, body], i) => (
          <li key={title}>
            <span className="step-num">{i + 1}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
