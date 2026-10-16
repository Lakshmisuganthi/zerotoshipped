import { useCallback, useRef, useState } from 'react';

import SiteHeader from './components/SiteHeader.jsx';
import Hero from './components/Hero.jsx';
import ScanPanel from './components/ScanPanel.jsx';
import Results from './components/Results.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import { analyseResume } from './lib/parseResume.js';

export default function App() {
  // The three pieces of state the static version kept in the DOM: what the
  // status line says, and whether there is a result to show yet.
  const [status, setStatus] = useState({ message: '', kind: '' });
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      setStatus({ message: `"${file.name}" is not a PDF. Pick a .pdf file.`, kind: 'error' });
      return;
    }

    setResult(null);
    setStatus({ message: `Scanning ${file.name}…`, kind: 'busy' });

    // Fake the thinking time so the drop feels like something happened.
    setTimeout(() => {
      setResult({ fileName: file.name, ...analyseResume(file) });
      setStatus({ message: `${file.name} scanned.`, kind: '' });
    }, 550);
  }, []);

  const handleReset = () => {
    setResult(null);
    setStatus({ message: '', kind: '' });
    fileInputRef.current?.click();
  };

  return (
    <>
      <SiteHeader />

      <main id="top">
        <Hero />

        <ScanPanel status={status} onFile={handleFile} inputRef={fileInputRef} />

        {result && <Results result={result} onReset={handleReset} />}

        <HowItWorks />
      </main>

      <SiteFooter />
    </>
  );
}
