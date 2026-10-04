import { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { updateIncidentStatus } from '../services/api';

export default function IncidentDetails({ incident, setPage }) {
  const [current, setCurrent] = useState(incident);
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  if (!current) {
    return (
      <main className="page-section narrow">
        <div className="empty-state">Select an incident from the control room to view its details.</div>
        <button className="secondary-button" type="button" onClick={() => setPage('dashboard')}>Back to control room</button>
      </main>
    );
  }

  const analysis = current.analysis || {};

  async function changeStatus(status) {
    setUpdating(true);
    setMessage('');
    try {
      setCurrent(await updateIncidentStatus(current.id, status));
      setMessage('Incident status updated.');
    } catch (requestError) {
      setMessage(requestError.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <main className="page-section narrow details-page">
      <button className="back-button" type="button" onClick={() => setPage('dashboard')}>← Back to control room</button>
      <section className="panel details-panel">
        <div className="incident-detail-header">
          <div><span className="eyebrow">Incident INC-{String(current.id).padStart(4, '0')}</span><h1>{analysis.emergency_type || 'Emergency report'}</h1></div>
          <StatusBadge priority={analysis.priority} status={current.status} />
        </div>
        <div className="detail-meta"><span>Reported by <b>{current.reporter_name || 'Anonymous'}</b></span><span>{current.created_at ? new Date(current.created_at).toLocaleString() : 'Time unavailable'}</span></div>
        <p className="large-description">{current.description}</p>
        <div className="analysis-heading"><span className="eyebrow">Structured assessment</span><span className="advisory-label">AI-assisted · verify before action</span></div>
        <div className="analysis-grid">
          <div><span>Severity</span><b>{analysis.severity || 'Unclassified'}</b></div>
          <div><span>Priority score</span><b>{analysis.score ?? '—'}</b></div>
          <div><span>People at risk</span><b>{analysis.people_at_risk ?? '—'}</b></div>
          <div><span>Vulnerable people</span><b>{analysis.vulnerable ? 'Detected' : 'Not detected'}</b></div>
          <div><span>People trapped</span><b>{analysis.trapped ? 'Reported' : 'Not reported'}</b></div>
          <div><span>Current status</span><b>{current.status}</b></div>
        </div>
        <div className="recommendation-box">
          <span className="eyebrow">AI-generated suggestion</span>
          <h3>Potentially required resources</h3>
          {analysis.required_resources?.length ? (
            <div className="resource-tags">{analysis.required_resources.map((resource) => <span key={resource}>{resource}</span>)}</div>
          ) : <p>No resources were suggested by the analyzer.</p>}
          <p>Recommendations are advisory only. Verify needs and availability before dispatch.</p>
        </div>
        <div className="approval-box">
          <div><span className="eyebrow">Responder actions</span><h3>Update incident status</h3></div>
          <div className="hero-actions">
            <button className="secondary-button" type="button" disabled={updating} onClick={() => changeStatus('Investigating')}>Mark investigating</button>
            <button className="primary-button" type="button" disabled={updating} onClick={() => changeStatus('Dispatched')}>Mark dispatched</button>
            <button className="secondary-button" type="button" disabled={updating} onClick={() => changeStatus('Resolved')}>Mark resolved</button>
          </div>
          {message && <p className={message.includes('updated') ? 'success-note' : 'error-note'} role="status">{message}</p>}
        </div>
      </section>
    </main>
  );
}
