import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { db } from "../firebase";
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase";

// Fix default marker icons for Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom green marker for donors
const donorIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;border-radius:50% 50% 50% 0;
    background:#16a34a;border:3px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;">
    <span style="transform:rotate(45deg);font-size:16px;">🍱</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -40],
});

// Blue marker for recipients
const recipientIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;border-radius:50% 50% 50% 0;
    background:#2563eb;border:3px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;">
    <span style="transform:rotate(45deg);font-size:16px;">🤲</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -40],
});

// Component to recenter map
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, 13); }, [center, map]);
  return null;
};

const FoodMap = () => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState("all"); // "all" | "available" | "claimed"
  const [userLocation, setUserLocation] = useState([20.5937, 78.9629]); // India default
  const [showAddForm, setShowAddForm] = useState(false);
  const [newListing, setNewListing] = useState({
    title: "", description: "", quantity: "", type: "donor",
  });
  const [adding, setAdding] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  // Get user's real location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {} // fallback to default
    );
  }, []);

  // Real-time Firestore listener
  useEffect(() => {
    let q = collection(db, "listings");
    if (filter !== "all") {
      q = query(collection(db, "listings"), where("status", "==", filter));
    }
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setListings(data);
      setLiveCount(data.filter((l) => l.status === "available").length);
    });
    return () => unsub();
  }, [filter]);

  const handleAddListing = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) { alert("Please log in to add a listing."); return; }
    setAdding(true);
    try {
      await addDoc(collection(db, "listings"), {
        ...newListing,
        lat: userLocation[0] + (Math.random() - 0.5) * 0.02, // slight offset for demo
        lng: userLocation[1] + (Math.random() - 0.5) * 0.02,
        status: "available",
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Anonymous",
        createdAt: serverTimestamp(),
      });
      setNewListing({ title: "", description: "", quantity: "", type: "donor" });
      setShowAddForm(false);
    } catch (err) {
      alert("Error adding listing: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "Just now";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Math.floor((Date.now() - date) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div style={styles.wrapper}>
      {/* Header bar */}
      <div style={styles.topBar}>
        <div style={styles.liveChip}>
          <span style={styles.liveDot} />
          {liveCount} available now
        </div>

        <div style={styles.filters}>
          {["all", "available", "claimed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button style={styles.addBtn} onClick={() => setShowAddForm((v) => !v)}>
          {showAddForm ? "✕ Close" : "+ Add Listing"}
        </button>
      </div>

      {/* Add Listing Panel */}
      {showAddForm && (
        <div style={styles.addPanel}>
          <form onSubmit={handleAddListing} style={styles.addForm}>
            <div style={styles.formRow}>
              <input
                placeholder="Food item name (e.g. Rice & Dal)"
                value={newListing.title}
                onChange={(e) => setNewListing((p) => ({ ...p, title: e.target.value }))}
                required
                style={styles.formInput}
              />
              <input
                placeholder="Quantity (e.g. 10 meals)"
                value={newListing.quantity}
                onChange={(e) => setNewListing((p) => ({ ...p, quantity: e.target.value }))}
                required
                style={{ ...styles.formInput, maxWidth: 160 }}
              />
            </div>
            <input
              placeholder="Short description or pickup instructions"
              value={newListing.description}
              onChange={(e) => setNewListing((p) => ({ ...p, description: e.target.value }))}
              style={{ ...styles.formInput, width: "100%", boxSizing: "border-box" }}
            />
            <div style={styles.formRow}>
              <select
                value={newListing.type}
                onChange={(e) => setNewListing((p) => ({ ...p, type: e.target.value }))}
                style={styles.formSelect}
              >
                <option value="donor">I am donating food</option>
                <option value="recipient">I need food</option>
              </select>
              <button type="submit" style={styles.submitBtn} disabled={adding}>
                {adding ? "Adding..." : "Add to Map"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={userLocation}
        zoom={13}
        style={styles.map}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <RecenterMap center={userLocation} />

        {listings.map((listing) =>
          listing.lat && listing.lng ? (
            <Marker
              key={listing.id}
              position={[listing.lat, listing.lng]}
              icon={listing.type === "donor" ? donorIcon : recipientIcon}
            >
              <Popup>
                <div style={styles.popup}>
                  <div style={styles.popupBadge(listing.status)}>
                    {listing.status === "available" ? "Available" : "Claimed"}
                  </div>
                  <strong style={styles.popupTitle}>{listing.title}</strong>
                  <p style={styles.popupDesc}>{listing.description}</p>
                  <p style={styles.popupMeta}>
                    🍽️ {listing.quantity} &nbsp;·&nbsp; ⏱ {formatTime(listing.createdAt)}
                  </p>
                  <p style={styles.popupUser}>By {listing.userName}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>

      {/* Legend */}
      <div style={styles.legend}>
        <span style={styles.legendItem}><span style={{ color: "#16a34a" }}>🍱</span> Donor</span>
        <span style={styles.legendItem}><span style={{ color: "#2563eb" }}>🤲</span> Recipient</span>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>Updates live via Firebase</span>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: "flex", flexDirection: "column", height: "100vh" },
  topBar: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 16px", background: "#fff",
    borderBottom: "1px solid #e5e7eb", flexWrap: "wrap",
  },
  liveChip: {
    display: "flex", alignItems: "center", gap: 6,
    background: "#f0fdf4", border: "1px solid #bbf7d0",
    borderRadius: 20, padding: "4px 12px",
    fontSize: 13, fontWeight: 500, color: "#16a34a",
  },
  liveDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "#16a34a", animation: "pulse 1.5s infinite",
  },
  filters: { display: "flex", gap: 6 },
  filterBtn: {
    padding: "5px 14px", border: "1px solid #e5e7eb",
    borderRadius: 20, background: "#fff", cursor: "pointer",
    fontSize: 13, color: "#6b7280",
  },
  filterActive: { background: "#16a34a", color: "#fff", border: "1px solid #16a34a" },
  addBtn: {
    marginLeft: "auto", padding: "7px 16px",
    background: "#16a34a", color: "#fff",
    border: "none", borderRadius: 8,
    cursor: "pointer", fontSize: 13, fontWeight: 600,
  },
  addPanel: {
    background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "12px 16px",
  },
  addForm: { display: "flex", flexDirection: "column", gap: 10 },
  formRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  formInput: {
    flex: 1, padding: "8px 12px", border: "1px solid #e5e7eb",
    borderRadius: 8, fontSize: 13, outline: "none",
  },
  formSelect: {
    flex: 1, padding: "8px 12px", border: "1px solid #e5e7eb",
    borderRadius: 8, fontSize: 13, background: "#fff", outline: "none",
  },
  submitBtn: {
    padding: "8px 20px", background: "#16a34a", color: "#fff",
    border: "none", borderRadius: 8, cursor: "pointer",
    fontSize: 13, fontWeight: 600,
  },
  map: { flex: 1 },
  legend: {
    display: "flex", alignItems: "center", gap: 16,
    padding: "8px 16px", background: "#fff",
    borderTop: "1px solid #e5e7eb", fontSize: 13,
  },
  legendItem: { display: "flex", alignItems: "center", gap: 4 },
  popup: { minWidth: 180 },
  popupBadge: (status) => ({
    display: "inline-block", padding: "2px 8px",
    borderRadius: 10, fontSize: 11, fontWeight: 600,
    marginBottom: 6,
    background: status === "available" ? "#dcfce7" : "#f3f4f6",
    color: status === "available" ? "#16a34a" : "#6b7280",
  }),
  popupTitle: { display: "block", fontSize: 15, marginBottom: 4 },
  popupDesc: { fontSize: 13, color: "#6b7280", margin: "0 0 6px" },
  popupMeta: { fontSize: 12, color: "#9ca3af", margin: "0 0 4px" },
  popupUser: { fontSize: 12, color: "#9ca3af", margin: 0 },
};

export default FoodMap;
