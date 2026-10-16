/* 0 to Shipped — resume parser (mock)
 *
 * Everything here runs in the browser. No file is uploaded, no server exists.
 *
 * The one function you replace when you build the real parser is
 * `analyseResume(file)` further down. It is handed the File object and must
 * return:
 *
 *   { score: number 0-100, present: string[], missing: string[] }
 *
 * Everything after it (rendering, the ring animation, the chip lists) is
 * presentation and can stay as it is.
 */

const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML', 'CSS',
  'Git', 'REST APIs', 'SQL', 'Testing', 'Accessibility', 'Docker',
];

const RING_LENGTH = 327; // 2 * PI * 52, the radius in index.html

const els = {
  dropzone: document.getElementById('dropzone'),
  input: document.getElementById('file-input'),
  status: document.getElementById('status'),
  results: document.getElementById('results'),
  resultFile: document.getElementById('result-file'),
  score: document.getElementById('score'),
  ring: document.getElementById('ring-value'),
  verdict: document.getElementById('verdict'),
  verdictDetail: document.getElementById('verdict-detail'),
  presentList: document.getElementById('present-list'),
  missingList: document.getElementById('missing-list'),
  presentCount: document.getElementById('present-count'),
  missingCount: document.getElementById('missing-count'),
  reset: document.getElementById('reset'),
};

/* ---------------- the mock parser ---------------- */

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

function analyseResume(file) {
  const seed = hash(`${file.name}:${file.size}`);

  // Decide which skills this (fake) resume "has".
  const present = SKILLS.filter((_, i) => (seed >> i) % 3 !== 0);
  const missing = SKILLS.filter((skill) => !present.includes(skill));

  // The score is derived from the skills, not invented separately, so the
  // number and the two lists never contradict each other.
  const score = Math.round((present.length / SKILLS.length) * 100);

  return { score, present, missing };
}

/* ---------------- rendering ---------------- */

function setStatus(message, kind = '') {
  els.status.textContent = message;
  els.status.className = `status${kind ? ` is-${kind}` : ''}`;
}

function renderChips(listEl, skills, kind) {
  listEl.innerHTML = '';
  skills.forEach((skill, i) => {
    const li = document.createElement('li');
    li.className = `is-${kind}`;
    li.textContent = skill;
    li.style.animationDelay = `${i * 40}ms`;
    listEl.append(li);
  });
}

function verdictFor(score) {
  if (score >= 80) return ['Strong match', 'This resume already proves most of what the role asks for.'];
  if (score >= 55) return ['Promising', 'A solid base. Close the gaps below and it reads much stronger.'];
  if (score >= 30) return ['Needs work', 'Several core skills are missing from the page entirely.'];
  return ['Early days', 'Add the missing skills — a line or a project each is enough.'];
}

function showResults(file, result) {
  els.resultFile.textContent = file.name;

  // Score ring: shift the dash offset so the arc fills from 0 to `score`%.
  els.ring.style.strokeDashoffset = String(RING_LENGTH);
  els.ring.classList.remove('is-low', 'is-mid', 'is-high');
  els.ring.classList.add(
    result.score >= 80 ? 'is-high' : result.score >= 55 ? 'is-mid' : 'is-low'
  );

  const [headline, detail] = verdictFor(result.score);
  els.verdict.textContent = headline;
  els.verdictDetail.textContent = detail;

  renderChips(els.presentList, result.present, 'present');
  renderChips(els.missingList, result.missing, 'missing');
  els.presentCount.textContent = result.present.length;
  els.missingCount.textContent = result.missing.length;

  els.results.hidden = false;
  els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Count the number up alongside the arc, and kick the arc off on the next
  // frame so the browser actually animates the transition.
  let shown = 0;
  const tick = Math.max(12, 700 / Math.max(result.score, 1));
  const timer = setInterval(() => {
    shown += 1;
    if (shown >= result.score) {
      shown = result.score;
      clearInterval(timer);
    }
    els.score.textContent = shown;
  }, tick);

  requestAnimationFrame(() => {
    els.ring.style.strokeDashoffset = String(RING_LENGTH * (1 - result.score / 100));
  });
}

/* ---------------- file handling ---------------- */

function handleFile(file) {
  if (!file) return;

  const isPdf =
    file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  if (!isPdf) {
    setStatus(`"${file.name}" is not a PDF. Pick a .pdf file.`, 'error');
    return;
  }

  setStatus(`Scanning ${file.name}…`, 'busy');
  els.results.hidden = true;

  // Fake the thinking time so the drop feels like something happened.
  setTimeout(() => {
    const result = analyseResume(file);
    showResults(file, result);
    setStatus(`${file.name} scanned.`);
  }, 550);
}

els.input.addEventListener('change', (event) => {
  handleFile(event.target.files[0]);
  event.target.value = ''; // so picking the same file again still fires
});

['dragenter', 'dragover'].forEach((type) => {
  els.dropzone.addEventListener(type, (event) => {
    event.preventDefault();
    els.dropzone.classList.add('is-dragging');
  });
});

['dragleave', 'drop'].forEach((type) => {
  els.dropzone.addEventListener(type, (event) => {
    event.preventDefault();
    els.dropzone.classList.remove('is-dragging');
  });
});

els.dropzone.addEventListener('drop', (event) => {
  handleFile(event.dataTransfer.files[0]);
});

els.reset.addEventListener('click', () => {
  els.results.hidden = true;
  setStatus('');
  els.input.click();
});
