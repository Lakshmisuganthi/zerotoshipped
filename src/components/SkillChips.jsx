export default function SkillChips({ heading, kind, skills }) {
  return (
    <div className="skills-column">
      <h3 className="skills-heading">
        <span className={`dot dot-${kind}`} aria-hidden="true" />
        {heading}
        <span className="count">{skills.length}</span>
      </h3>
      <ul className="chips">
        {skills.map((skill, i) => (
          <li
            key={skill}
            className={`is-${kind}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
