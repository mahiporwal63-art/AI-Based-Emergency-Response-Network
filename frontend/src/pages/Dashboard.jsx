import { useCallback, useEffect, useState } from 'react';
import IncidentCard from '../components/IncidentCard';
import LiveMap from '../components/LiveMap';
import ResourcePanel from '../components/ResourcePanel';
import { getIncidents, getResources } from '../services/api';

export default function Dashboard({ openIncident }) {
  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [nextIncidents, nextResources] = await Promise.all([
        getIncidents(),
        getResources(),
      ]);
      setIncidents(nextIncidents);
      setResources(nextResources);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const intervalId = window.setInterval(load, 10000);
    return () => window.clearInterval(intervalId);
  }, [load]);

  const activeCount = incidents.filter((incident) => incident.status !== 'Resolved').length;
  const criticalCount = incidents.filter(
    (incident) => incident.analysis?.priority === 'Critical',
  ).length;
  const availableCount = resources.filter((resource) => resource.available).length;
  const orderedIncidents = [...incidents].sort(
    (a, b) => (b.analysis?.score ?? 0) - (a.analysis?.score ?? 0),
  );

  return (
    <main className="page-section dashboard-page">
      <div className="page-heading-row">
        <div className="page-title">
          <span className="eyebrow">Operations / Overview</span>
          <h1>Control room</h1>
          <p>Monitor incoming incidents and response capacity.</p>
        </div>
        <div className="connection-state"><span className="live-dot" /> Auto-refresh · 10 sec</div>
      </div>
      {error && <div className="error-box" role="alert">{error}</div>}
      <div className="stat-grid">
        <div className="stat-card"><span>Active incidents</span><strong>{activeCount}</strong><small>Awaiting resolution</small></div>
        <div className="stat-card stat-alert"><span>Critical priority</span><strong>{criticalCount}</strong><small>Requires urgent review</small></div>
        <div className="stat-card"><span>Resources available</span><strong>{availableCount}</strong><small>Ready for coordination</small></div>
        <div className="stat-card"><span>Total reports</span><strong>{incidents.length}</strong><small>All recorded incidents</small></div>
      </div>
      <div className="dashboard-grid">
        <section className="panel map-panel">
          <div className="panel-heading"><div><span className="eyebrow">Geographic overview</span><h2>Incident map</h2></div><span className="map-key"><i /> Incident</span></div>
          {loading && incidents.length === 0
            ? <div className="map-loading">Connecting to incident feed…</div>
            : <LiveMap incidents={incidents} />}
        </section>
        <section className="incident-feed">
          <div className="panel-heading"><div><span className="eyebrow">Triage queue</span><h2>Priority incidents</h2></div><span className="count-pill">{incidents.length}</span></div>
          <div className="incident-list">
            {loading && incidents.length === 0
              ? <div className="empty-state">Loading incidents…</div>
              : orderedIncidents.length
                ? orderedIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} onClick={openIncident} />
                ))
                : <div className="empty-state">No incidents have been reported yet.</div>}
          </div>
        </section>
      </div>
      <ResourcePanel resources={resources} />
    </main>
  );
}
