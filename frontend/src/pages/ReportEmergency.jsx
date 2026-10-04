import { useState } from 'react';
import EmergencyForm from '../components/EmergencyForm';

export default function ReportEmergency({ setPage }) {
  const [created, setCreated] = useState(null);

  return (
    <main className="page-section narrow report-page">
      <div className="page-title">
        <span className="eyebrow">Community reporting</span>
        <h1>Report an emergency</h1>
        <p>Send clear information so response teams can assess the situation.</p>
      </div>
      {!created ? (
        <EmergencyForm onCreated={setCreated} />
      ) : (
        <section className="panel success-card" aria-live="polite">
          <div className="success-icon" aria-hidden="true">✓</div>
          <span className="eyebrow">Report received</span>
          <h2>Your incident is in the system.</h2>
          <p>Incident <strong>#{created.incident.id}</strong> has been created and analyzed.</p>
          <div className="analysis-grid">
            <div><span>Incident type</span><b>{created.analysis.emergency_type}</b></div>
            <div><span>Priority</span><b>{created.analysis.priority}</b></div>
            <div><span>People at risk</span><b>{created.analysis.people_at_risk}</b></div>
            <div><span>Trapped</span><b>{created.analysis.trapped ? 'Reported' : 'Not detected'}</b></div>
          </div>
          <p className="small-note">The analysis is advisory and should be verified by a trained responder.</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => setCreated(null)}>Submit another report</button>
            <button className="secondary-button" type="button" onClick={() => setPage('home')}>Back to overview</button>
          </div>
        </section>
      )}
    </main>
  );
}
