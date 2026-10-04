import { useState } from 'react';
import { createIncident } from '../services/api';

export default function EmergencyForm({ onCreated }) {
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('22.7196');
  const [longitude, setLongitude] = useState('75.8577');
  const [reporterName, setReporterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await createIncident({
        description,
        latitude: Number(latitude),
        longitude: Number(longitude),
        reporter_name: reporterName || 'Anonymous',
      });
      onCreated(result);
      setDescription('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel emergency-form" onSubmit={submit}>
      <div className="form-intro"><span className="form-symbol" aria-hidden="true">!</span><div><span className="eyebrow">Incident intake</span><h2>What is happening?</h2></div></div>
      <p className="form-hint">Share the details you know. Your report will be organized for responders.</p>
      <label>
        Your name <span className="optional-label">Optional</span>
        <input value={reporterName} onChange={(event) => setReporterName(event.target.value)} placeholder="Name or leave blank" />
      </label>
      <label>
        Describe the emergency
        <textarea
          required
          minLength={5}
          rows={6}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What happened? Is anyone injured, trapped, or in immediate danger?"
        />
      </label>
      <div className="form-location-heading"><span>Incident location</span><small>Enter coordinates known to you</small></div>
      <div className="two-column">
        <label>Latitude<input type="number" required step="any" min="-90" max="90" value={latitude} onChange={(event) => setLatitude(event.target.value)} /></label>
        <label>Longitude<input type="number" required step="any" min="-180" max="180" value={longitude} onChange={(event) => setLongitude(event.target.value)} /></label>
      </div>
      {error && <div className="error-box" role="alert">{error}</div>}
      <button className="primary-button submit-button" type="submit" disabled={loading}>
        {loading ? 'Sending report…' : 'Submit emergency report'} <span aria-hidden="true">→</span>
      </button>
      <p className="small-note">This prototype is not a replacement for local emergency services. AI recommendations require human review.</p>
    </form>
  );
}
