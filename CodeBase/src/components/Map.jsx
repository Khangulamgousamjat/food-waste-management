import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { auth } from "../firebase";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const donorIcon = L.divIcon({
  className: "",
  html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:#16a34a;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:16px;">🍱</span></div>`,
  iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -40],
});

const recipientIcon = L.divIcon({
  className: "",
  html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:#2563eb;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:16px;">🤲</span></div>`,
  iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -40],
});

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, 13); }, [center, map]);
  return null;
};

const FoodMap = () => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState("available"); // show available by default
  const [userLocation, setUserLocation] = useState([20.5937, 78.9629]);
  const [liveCount, setLiveCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (snap.exists()) setUserProfile(snap.data());
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "listings"), (snap) => {
      let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Auto-expire check
      data.forEach(async (listing) => {
        if (listing.status === "available" && listing.expiryTime && listing.expiryTime < Date.now()) {
          await updateDoc(doc(db, "listings", listing.id), { status: "expired" });
          listing.status = "expired";
        }
      });

      if (filter !== "all") {
        data = data.filter((l) => l.status === filter);
      }
      setListings(data);
      setLiveCount(snap.docs.filter((d) => d.data().status === "available").length);
    });
    return () => unsub();
  }, [filter]);

  const claimFood = async (listing) => {
    if (!auth.currentUser) return alert("Please log in.");
    try {
      await updateDoc(doc(db, "listings", listing.id), {
        status: "claimed",
        claimedBy: auth.currentUser.uid,
      });
      if (listing.donorId) {
        await updateDoc(doc(db, "users", listing.donorId), {
          points: increment(5),
        });
      }
      alert("Food claimed successfully!");
    } catch (err) {
      alert("Failed to claim food: " + err.message);
    }
  };

  const formatCountdown = (expiryTime) => {
    if (!expiryTime) return null;
    const diff = expiryTime - currentTime;
    if (diff <= 0) return { text: "Expired", color: "#9ca3af", urgent: true };

    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);

    if (hours >= 4) return { text: `Expires in ${hours} hours`, color: "#16a34a", urgent: false };
    if (hours >= 2) return { text: `Expiring soon - ${hours} hours left`, color: "#d97706", urgent: false };
    const remainingMins = mins % 60;
    const hText = hours > 0 ? `${hours}h ` : "";
    return { text: `Urgent! Expires in ${hText}${remainingMins} mins`, color: "#dc2626", urgent: true };
  };

  const getFoodTypeInfo = (type) => {
    if (type === "veg") return "🌿 Veg";
    if (type === "nonveg") return "🍗 Non-Veg";
    if (type === "vegan") return "🌱 Vegan";
    return "🍽️ Unknown";
  };

  const isRecipient = userProfile?.role === "recipient";

  return (
    <div style={styles.wrapper}>
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
      </div>

      <MapContainer center={userLocation} zoom={13} style={styles.map} zoomControl={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <RecenterMap center={userLocation} />

        {listings.map((listing) => {
          if (!listing.lat || !listing.lng) return null;
          const countdown = formatCountdown(listing.expiryTime);
          
          return (
            <Marker key={listing.id} position={[listing.lat, listing.lng]} icon={donorIcon}>
              <Popup maxWidth={250}>
                <div style={styles.popup}>
                  {listing.imageUrl ? (
                    <img src={listing.imageUrl} alt={listing.title} style={styles.popupImg} />
                  ) : (
                    <div style={styles.popupImgPlaceholder}>No Image</div>
                  )}
                  
                  <div style={styles.popupContent}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <strong style={styles.popupTitle}>{listing.title}</strong>
                      <span style={styles.popupBadge(listing.status)}>
                        {listing.status === "available" ? "Available" : "Claimed"}
                      </span>
                    </div>

                    <div style={styles.popupTypeBadge}>{getFoodTypeInfo(listing.foodType)}</div>
                    <p style={styles.popupDesc}>{listing.description}</p>
                    
                    <ul style={styles.popupList}>
                      <li><strong>Qty:</strong> {listing.quantity}</li>
                      <li><strong>Prep:</strong> {listing.cookedType?.replace('_', ' ')}</li>
                      <li><strong>Donor:</strong> {listing.donorName}</li>
                      <li><strong>Pickup:</strong> {listing.pickupLocation}</li>
                      <li><strong>Contact:</strong> {listing.contactNumber}</li>
                    </ul>

                    {countdown && listing.status === "available" && (
                      <div style={{...styles.popupCountdown, color: countdown.color, background: countdown.urgent ? "#fee2e2" : "#f0fdf4"}}>
                        ⏱ {countdown.text}
                      </div>
                    )}

                    {isRecipient && listing.status === "available" && (
                      <button style={styles.claimBtn} onClick={() => claimFood(listing)}>
                        Claim This Food
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

const styles = {
  wrapper: { display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" },
  topBar: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#fff", borderBottom: "1px solid #e5e7eb", flexWrap: "wrap" },
  liveChip: { display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 500, color: "#16a34a" },
  liveDot: { width: 8, height: 8, borderRadius: "50%", background: "#16a34a", animation: "pulse 1.5s infinite" },
  filters: { display: "flex", gap: 6 },
  filterBtn: { padding: "5px 14px", border: "1px solid #e5e7eb", borderRadius: 20, background: "#fff", cursor: "pointer", fontSize: 13, color: "#6b7280" },
  filterActive: { background: "#16a34a", color: "#fff", border: "1px solid #16a34a" },
  map: { flex: 1 },
  popup: { minWidth: 200, padding: 0, margin: "-14px -20px", overflow: "hidden", borderRadius: 12, display: "flex", flexDirection: "column" },
  popupImg: { width: "100%", height: 100, objectFit: "cover" },
  popupImgPlaceholder: { width: "100%", height: 80, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 12 },
  popupContent: { padding: 12, display: "flex", flexDirection: "column", gap: 4 },
  popupTitle: { fontSize: 15, m: 0, color: "#111827" },
  popupBadge: (status) => ({ padding: "2px 6px", borderRadius: 10, fontSize: 10, fontWeight: 700, background: status === "available" ? "#dcfce7" : "#f3f4f6", color: status === "available" ? "#16a34a" : "#6b7280" }),
  popupTypeBadge: { fontSize: 11, fontWeight: 600, color: "#4b5563", background: "#f3f4f6", padding: "2px 6px", borderRadius: 4, display: "inline-block", alignSelf: "flex-start", marginBottom: 4 },
  popupDesc: { fontSize: 12, color: "#6b7280", margin: "4px 0" },
  popupList: { margin: "4px 0", padding: 0, listStyle: "none", fontSize: 11, color: "#4b5563", display: "flex", flexDirection: "column", gap: 2 },
  popupCountdown: { fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 4, textAlign: "center", marginTop: 4 },
  claimBtn: { padding: "8px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, marginTop: 8 },
};

export default FoodMap;
