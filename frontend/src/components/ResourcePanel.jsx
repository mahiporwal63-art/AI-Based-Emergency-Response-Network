function resourceIcon(type) {
  if (type === 'Ambulance') return 'A';
  if (type === 'Fire Truck') return 'F';
  if (type === 'Rescue Team') return 'R';
  return '•';
}

export default function ResourcePanel({ resources = [] }) {
  const available = resources.filter((resource) => resource.available).length;

  return (
    <section className="panel resource-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">Field capacity</span><h2>Response resources</h2></div>
        <span className="count-pill">{available} available</span>
      </div>
      {resources.length ? (
        <div className="resource-grid">
          {resources.map((resource) => (
            <div className="resource-item" key={resource.id}>
              <span className={`resource-icon resource-${resource.type === 'Fire Truck' ? 'fire' : resource.type === 'Ambulance' ? 'medical' : 'rescue'}`} aria-hidden="true">
                {resourceIcon(resource.type)}
              </span>
              <div className="resource-description"><b>{resource.name}</b><p>{resource.type}</p></div>
              <span className={`resource-status ${resource.available ? 'available' : 'busy'}`}>
                <i />{resource.available ? 'Available' : resource.status || 'Busy'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">No resources have been added yet.</div>
      )}
    </section>
  );
}
