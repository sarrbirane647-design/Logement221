import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
function MapLocation({ city }) {
  // ================================
  // 📍 COORDONNÉES DES VILLES
  // ================================
  const cityCoordinates = {
    dakar: [14.7167, -17.4677],
    thies: [14.7886, -16.9260],
    "saint-louis": [16.0326, -16.4818],
    "saint louis": [16.0326, -16.4818],
    touba: [14.8623, -15.8754],
    kaolack: [14.1510, -16.0726],
    ziguinchor: [12.5833, -16.2719],
    diourbel: [14.6550, -16.2315],
    louga: [15.6144, -16.2244],
    mbour: [14.4208, -16.9667],
    rufisque: [14.7159, -17.2731],
    tivaouane: [14.9492, -16.8179]
  };
  // ================================
  // 🔎 NORMALISER LE NOM DE LA VILLE
  // ================================
  const normalizeCity = (value) => {
    return value
      ?.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };
  const normalizedCity = normalizeCity(city);
  // ================================
  // 📍 POSITION
  // ================================
  const defaultPosition = [14.7167, -17.4677];
  const position =
    cityCoordinates[normalizedCity] ||
    defaultPosition;
  console.log(
    "📍 VILLE :",
    city,
    "→",
    normalizedCity,
    "→",
    position
  );
  return (
    <div
      className="map-container"
      style={{
        width: "100%",
        height: "400px"
      }}
    >
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            📍 {city || "Dakar"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
export default MapLocation;