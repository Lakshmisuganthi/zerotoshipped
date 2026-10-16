/* 0 to Shipped — resume parser (mock)
 *
 * Everything here runs in the browser. No file is uploaded, no server exists.
 *
 * The one function you replace when you build the real parser is
 * `analyseResume(file)` below. It is handed the File object and must return:
 *
 *   { score: number 0-100, present: string[], missing: string[] }
 */

export const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML', 'CSS',
  'Git', 'REST APIs', 'SQL', 'Testing', 'Accessibility', 'Docker',
];

/* A tiny string hash (djb2). Same name + size always gives the same number,
 * which is what makes this demo feel like a parser instead of a random
 * number generator: scan the same file twice and you get the same result. */
function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function analyseResume(file) {
  const seed = hash(`${file.name}:${file.size}`);

  // Decide which skills this (fake) resume "has".
  const present = SKILLS.filter((_, i) => (seed >> i) % 3 !== 0);
  const missing = SKILLS.filter((skill) => !present.includes(skill));

  // The score is derived from the skills, not invented separately, so the
  // number and the two lists never contradict each other.
  const score = Math.round((present.length / SKILLS.length) * 100);

  return { score, present, missing };
}
