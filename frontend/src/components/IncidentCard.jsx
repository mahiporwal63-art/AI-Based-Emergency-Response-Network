import StatusBadge from './StatusBadge';

export default function IncidentCard({ incident, onClick }) {
  const analysis = incident.analysis || {};
  const latitude = Number(incident.latitude);
  const longitude = Number(incident.longitude);

  return (
    <button className="incident-card" type="button" onClick={() => onClick(incident)}>
      <div className="incident-top">
        <span className="incident-id">INC-{String(incident.id).padStart(4, '0')}</span>
        <StatusBadge priority={analysis.priority} status={incident.status} />
      </div>
      <h3>{analysis.emergency_type || 'Emergency report'}</h3>
      <p>{incident.description}</p>
      <div className="mini-stats">
        <span>{analysis.people_at_risk ?? 0} people at risk</span>
        <span>{Number.isFinite(latitude) && Number.isFinite(longitude)
          ? `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
          : 'Location unavailable'}</span>
      </div>
    </button>
  );
}
