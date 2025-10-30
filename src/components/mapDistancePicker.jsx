// components/MapDistancePicker.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix de íconos por defecto en Leaflet (Webpack/Vite)
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Haversine en km
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function ClickToSetDest({ onSetDestination }) {
  useMapEvents({
    click(e) {
      onSetDestination({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

/**
 * Props:
 * - defaultOrigin: { lat, lng }  // Ej: ubicación de la tienda
 * - value: { origin: {lat,lng} | null, destination: {lat,lng} | null }
 * - onChange: (coords) => void   // coords: { origin, destination, distanceKm }
 * - height (string) opcional
 */
export default function MapDistancePicker({
  defaultOrigin = { lat: 14.6349, lng: -90.5069 }, // Guatemala City centro
  value,
  onChange,
  height = "360px",
}) {
  const [origin, setOrigin] = useState(value?.origin ?? defaultOrigin);
  const [destination, setDestination] = useState(value?.destination ?? null);

  const distanceKm = useMemo(() => {
    if (!origin || !destination) return 0;
    return Number(haversineKm(origin.lat, origin.lng, destination.lat, destination.lng).toFixed(2));
  }, [origin, destination]);

  useEffect(() => {
    onChange?.({ origin, destination, distanceKm });
  }, [origin, destination, distanceKm, onChange]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocalización no soportada.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setOrigin(coords);
      },
      (err) => {
        console.error(err);
        alert("No se pudo obtener tu ubicación.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Centro del mapa: si hay destino, céntrate entre ambos; si no, en origin
  const center = destination
    ? {
        lat: (origin.lat + destination.lat) / 2,
        lng: (origin.lng + destination.lng) / 2,
      }
    : origin;

  const zoom = destination ? 11 : 12;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="px-3 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600"
        >
          Usar mi ubicación como origen
        </button>
        <span className="text-slate-300 text-sm">
          Origen: {origin ? `${origin.lat.toFixed(5)}, ${origin.lng.toFixed(5)}` : "—"}
        </span>
        <span className="text-slate-300 text-sm">
          Destino: {destination ? `${destination.lat.toFixed(5)}, ${destination.lng.toFixed(5)}` : "haz clic en el mapa"}
        </span>
        <span className="text-slate-100 font-semibold">
          Distancia aprox.: {distanceKm} km
        </span>
      </div>

      <div style={{ height }} className="rounded-xl overflow-hidden border border-slate-700">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickToSetDest onSetDestination={setDestination} />

          {origin && (
            <Marker position={[origin.lat, origin.lng]} />
          )}
          {destination && (
            <Marker position={[destination.lat, destination.lng]} />
          )}
        </MapContainer>
      </div>

      <p className="text-xs text-slate-400">
        Consejo: haz clic en el mapa para colocar el destino. Puedes usar tu ubicación actual como origen.
      </p>
    </div>
  );
}