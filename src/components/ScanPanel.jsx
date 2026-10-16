import { useState } from 'react';

export default function ScanPanel({ status, onFile, inputRef }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    onFile(event.dataTransfer.files[0]);
  };

  return (
    <section className="panel" id="scan" aria-labelledby="scan-heading">
      <h2 id="scan-heading" className="panel-title">
        Scan a resume
      </h2>

      <label
        className={`dropzone${isDragging ? ' is-dragging' : ''}`}
        htmlFor="file-input"
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        <svg className="dropzone-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <span className="dropzone-title">Drop your PDF here</span>
        <span className="dropzone-hint">
          or <span className="link-looking">browse your files</span> &middot; PDF only
        </span>
        <input
          type="file"
          id="file-input"
          ref={inputRef}
          className="sr-only"
          accept="application/pdf,.pdf"
          onChange={(event) => {
            onFile(event.target.files[0]);
            event.target.value = ''; // so picking the same file again still fires
          }}
        />
      </label>

      <p className={`status${status.kind ? ` is-${status.kind}` : ''}`} role="status" aria-live="polite">
        {status.message}
      </p>

      <p className="demo-note">
        Demo build: the parsing is faked, so results are generated in the browser
        from the file's name and size. Swap the one function noted in{' '}
        <code>src/lib/parseResume.js</code> for a real parser when you have one.
      </p>
    </section>
  );
}
