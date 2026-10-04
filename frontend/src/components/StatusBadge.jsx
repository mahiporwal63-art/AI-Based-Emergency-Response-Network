export default function StatusBadge({ priority, status }) {
  const value = priority || status || 'Unknown';
  const className = String(value).toLowerCase().replace(/\s+/g, '-');
  return <span className={`badge badge-${className}`}><i />{value}</span>;
}
