const steps = [
  ['01', 'Report', 'Capture a location and a clear description of what is happening.'],
  ['02', 'Understand', 'AI structures the report into a type, severity and resource needs.'],
  ['03', 'Coordinate', 'Control-room staff review and coordinate the response.'],
];

export default function Home({ setPage }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="live-dot" /> Emergency coordination platform</span>
          <h1>Clarity when<br />every second <span>matters.</span></h1>
          <p>
            Turn incoming reports into organized incidents, actionable context,
            and a shared view for response teams.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => setPage('report')}>
              <span aria-hidden="true">+</span> Report an emergency
            </button>
            <button className="text-button" type="button" onClick={() => setPage('dashboard')}>
              Open control room <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="hero-note">
            <span className="note-icon" aria-hidden="true">✓</span>
            Built to support people on the ground—not replace their judgment.
          </div>
        </div>
        <div className="hero-visual" aria-label="Illustration of an emergency response dashboard">
          <div className="visual-topline">
            <span><span className="live-dot" /> RESPONSE STATUS</span>
            <span className="visual-pill">COORDINATED</span>
          </div>
          <div className="visual-map">
            <div className="map-road road-one" />
            <div className="map-road road-two" />
            <div className="map-road road-three" />
            <div className="map-block block-one" />
            <div className="map-block block-two" />
            <div className="map-block block-three" />
            <div className="map-block block-four" />
            <span className="map-marker marker-one"><i /></span>
            <span className="map-marker marker-two"><i /></span>
            <span className="map-marker marker-three"><i /></span>
            <span className="map-label">INCIDENT #104</span>
          </div>
          <div className="visual-summary">
            <div><span className="summary-label">NEW REPORT</span><strong>Flooding · North district</strong><small>AI analysis ready for review</small></div>
            <span className="priority-indicator"><i /> HIGH</span>
          </div>
          <div className="visual-footer"><span>RESPONSE NETWORK</span><span>HUMAN-LED · AI-ASSISTED</span></div>
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
        </div>
      </section>

      <section className="workflow-section">
        <div className="section-heading">
          <div><span className="eyebrow">A clear path to action</span><h2>From report to response.</h2></div>
          <p>One shared workflow helps teams understand the situation and make informed decisions.</p>
        </div>
        <div className="workflow-grid">
          {steps.map(([number, title, description]) => (
            <article className="workflow-card" key={number}>
              <span className="workflow-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="safety-banner">
          <span className="safety-icon" aria-hidden="true">i</span>
          <p><strong>Human oversight matters.</strong> AI-generated classifications and recommendations are advisory and should be verified by trained responders.</p>
        </div>
      </section>
    </main>
  );
}
