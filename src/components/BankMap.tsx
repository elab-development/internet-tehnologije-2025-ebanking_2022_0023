"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import locations from "@/data/locations.json";
import "leaflet/dist/leaflet.css";

const center = [44.8176, 20.4633]; // Beograd
const atmIcon = new L.Icon({
  iconUrl: "/icons/atm-machine.png",
  iconSize: [32, 32],         
  iconAnchor: [16, 32],       
  popupAnchor: [0, -32],      
});

const branchIcon = new L.Icon({
  iconUrl: "/icons/bank.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});




export default function BankMap() {
    const [showATM, setShowATM] = useState(true);
    const [showBranches, setShowBranches] = useState(true);
    // // fix za marker ikone u Next.js
    // delete (L.Icon.Default.prototype as any)._getIconUrl;
    // L.Icon.Default.mergeOptions({
    //     iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    //     iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    //     shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    // });

  return (
    <div>
        <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "15px" }}>
                <input
                type="checkbox"
                checked={showATM}
                onChange={() => setShowATM(!showATM)}
                style={{ marginRight: "2px" }}
                />
                Bankomati
            </label>

            <label>
                <input
                type="checkbox"
                checked={showBranches}
                onChange={() => setShowBranches(!showBranches)}
                style={{ marginRight: "2px" }}
                />
                Filijale
            </label>
        </div>


        <MapContainer
        center={center as any}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        scrollWheelZoom={true}
        >
        <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations
            .filter((loc) => {
                if (loc.type === "atm" && !showATM) return false;
                if (loc.type === "branch" && !showBranches) return false;
                return true;
            })
            .map((loc) => (
                <Marker
                key={loc.id}
                position={[loc.lat, loc.lng] as any}
                icon={loc.type === "atm" ? atmIcon : branchIcon}
                >
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

        <div style={{
            marginTop: "10px",
            padding: "8px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "fit-content",
            fontSize: "14px",
            }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                <img src="/icons/atm-machine.png" alt="ATM Icon" style={{ width: 24, height: 24, marginRight: 8 }} />
                Bankomati
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <img src="/icons/bank.png" alt="Branch Icon" style={{ width: 24, height: 24, marginRight: 8 }} />
                Filijale
            </div>
        </div>
    </div>
  );
}