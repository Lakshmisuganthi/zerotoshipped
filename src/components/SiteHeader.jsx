export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top">
        <span className="brand-mark">0&rarr;</span>
        <span>0 to Shipped</span>
      </a>
      <nav className="nav">
        <a href="#how">How it works</a>
        <a href="#scan">Scan my resume</a>
      </nav>
    </header>
  );
}
