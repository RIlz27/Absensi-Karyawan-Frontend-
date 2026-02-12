import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icon marker yang sering ilang di React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Fungsi buat geser peta otomatis pas kantor dipilih
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

const AbsensiMap = ({ lat, lng, radius, namaKantor }) => {
  const position = [lat || -6.2, lng || 106.8166]; // Default Jakarta

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border shadow-sm">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={position} />

        {/* Style Peta: CartoDB Positron (Modern & Clean) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // <--- Ini kuncinya bro
        />

        {/* Titik Lokasi Kantor */}
        <Marker position={position}>
          {/* Tooltip atau Popup bisa ditambah di sini */}
        </Marker>

        {/* Lingkaran Radius Absen */}
        <Circle
          center={position}
          pathOptions={{
            fillColor: "#3b82f6",
            color: "#2563eb",
            weight: 2,
            opacity: 0.5,
            fillOpacity: 0.2,
          }}
          radius={radius || 100} // radius dalam meter
        />
      </MapContainer>
    </div>
  );
};

export default AbsensiMap;
