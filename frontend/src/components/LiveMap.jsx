import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LiveMap({ incidents = [] }) {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={[22.7196, 75.8577]}
        zoom={12}
        scrollWheelZoom
        aria-label="Map of reported incidents"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {incidents.map((incident) => {
          const latitude = Number(incident.latitude);
          const longitude = Number(incident.longitude);
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
          return (
            <CircleMarker
              key={incident.id}
              center={[latitude, longitude]}
              radius={9}
              pathOptions={{
                color: incident.analysis?.priority === 'Critical' ? '#bd3b3b' : '#177f70',
                fillColor: incident.analysis?.priority === 'Critical' ? '#e25a52' : '#31b99f',
                fillOpacity: 0.9,
                weight: 3,
              }}
            >
              <Popup>
                <strong>Incident #{incident.id}</strong>
                <br />
                {incident.analysis?.emergency_type || 'Emergency report'}
                <br />
                Priority: {incident.analysis?.priority || 'Unclassified'}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
