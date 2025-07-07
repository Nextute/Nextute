// components/MapSelector.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Setup default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Marker selection logic
const LocationPicker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const MapSelector = ({ position, setPosition }) => {
  const defaultCenter = [25.0961, 85.3131]; // Bihar, India

  return (
    <div>
      <div className="h-[14.8rem] w-full rounded-lg overflow-hidden border border-gray-600">
        <MapContainer
          center={defaultCenter}
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker setPosition={setPosition} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>

      {position && (
        <p className="mt-2 text-sm text-gray-600">
          📍 Selected Location:{" "}
          <strong>
            {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </strong>
        </p>
      )}
    </div>
  );
};

export default MapSelector;
