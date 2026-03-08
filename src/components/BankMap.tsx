"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import locations from "@/data/locations.json";
import "leaflet/dist/leaflet.css";

const center = [44.8176, 20.4633]; // Beograd

// fix za marker ikone u Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function BankMap() {
  return (
    <MapContainer
      center={center as any}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>
            <b>{loc.name}</b>
            <br />
            {loc.address}
            <br />
            Tip: {loc.type === "atm" ? "Bankomat" : "Filijala"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}