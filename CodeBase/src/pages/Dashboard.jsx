import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";

const BADGES = [
  { id: "first", label: "First Donation", emoji: "🌱", points: 10 },
  { id: "five", label: "5 Donations", emoji: "⭐", points: 50 },
  { id: "ten", label: "Community Hero", emoji: "🏆", points: 100 },
  { id: "hundred_meals", label: "100 Meals", emoji: "🍽️", points: 200 },
];

const Dashboard = () => {
  const user = auth.currentUser;
  const [userProfile, setUserProfile] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, claimed: 0 });

  // Fetch user profile in real-time
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) setUserProfile(snap.data());
    });
    return () => unsub();
  }, [user]);

  // Fetch my listings in real-time
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "listings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMyListings(data);
      setStats({
        total: data.length,
        available: data.filter((l) => l.status === "available").length,
        claimed: data.filter((l) => l.status === "claimed").length,
      });
    });
    return () => unsub();
  }, [user]);

  // Fetch leaderboard in real-time
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("points", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLeaderboard(snap.docs.slice(0, 10).map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const markAsClaimed = async (listingId) => {
    await updateDoc(doc(db, "listings", listingId), { status: "claimed" });
    // Award points
    if (userProfile) {
      const newPoints = (userProfile.points || 0) + 15;
      await updateDoc(doc(db, "users", user.uid), { points: newPoints });
    }
  };

  const markAsAvailable = async (listingId) => {
    await updateDoc(doc(db, "listings", listingId), { status: "available" });
  };

  const handleSignOut = () => signOut(auth);

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const earnedBadges = BADGES.filter(
    (b) => (userProfile?.points || 0) >= b.points
  );
  const nextBadge = BADGES.find((b) => (userProfile?.points || 0) < b.points);
  const progressToNext = nextBadge
    ? Math.min(100, ((userProfile?.points || 0) / nextBadge.points) * 100)
    : 100;

  if (!user) {
    return (
      <div style={styles.center}>
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>FoodShare</div>

        <div style={styles.userCard}>
          <div style={styles.avatar}>
            {(user.displayName || user.email || "U")[0].toUpperCase()}
          </div>
          <div>
            <div style={styles.userName}>{user.displayName || "User"}</div>
            <div style={styles.userEmail}>{user.email}</div>
            <div style={styles.userRole}>{userProfile?.role || "donor"}</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {["overview", "listings", "badges", "leaderboard"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ ...styles.navItem, ...(activeTab === tab ? styles.navActive : {}) }}
            >
              {{
                overview: "📊 Overview",
                listings: "🍱 My Listings",
                badges: "🏅 Badges",
                leaderboard: "🏆 Leaderboard",
              }[tab]}
            </button>
          ))}
        </nav>

        <button style={styles.signOutBtn} onClick={handleSignOut}>
          Sign Out
        </button>

        <p style={styles.sidebarFooter}>Made with ❤️ by<br /><strong>Gous Khan</strong></p>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <h2 style={styles.pageTitle}>Welcome back, {user.displayName?.split(" ")[0] || "there"}! 👋</h2>

            {/* Stat cards */}
            <div style={styles.statsGrid}>
              {[
                { label: "Total Listings", value: stats.total, color: "#16a34a", bg: "#f0fdf4" },
                { label: "Available", value: stats.available, color: "#2563eb", bg: "#eff6ff" },
                { label: "Claimed", value: stats.claimed, color: "#7c3aed", bg: "#f5f3ff" },
                { label: "Points Earned", value: userProfile?.points || 0, color: "#d97706", bg: "#fffbeb" },
              ].map((s) => (
                <div key={s.label} style={{ ...styles.statCard, background: s.bg }}>
                  <div style={{ ...styles.statNum, color: s.color }}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Points progress */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Points Progress</span>
                <span style={styles.pointsBadge}>{userProfile?.points || 0} pts</span>
              </div>
              {nextBadge ? (
                <>
                  <p style={styles.progressLabel}>
                    Next badge: {nextBadge.emoji} {nextBadge.label} ({nextBadge.points} pts)
                  </p>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progressToNext}%` }} />
                  </div>
                  <p style={styles.progressSub}>
                    {nextBadge.points - (userProfile?.points || 0)} more points to go
                  </p>
                </>
              ) : (
                <p style={{ color: "#16a34a", fontWeight: 600 }}>
                  🎉 You've earned all badges!
                </p>
              )}
            </div>

            {/* Recent listings */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Recent Listings</span>
                <button style={styles.viewAllBtn} onClick={() => setActiveTab("listings")}>
                  View all →
                </button>
              </div>
              {myListings.slice(0, 3).map((l) => (
                <ListingRow key={l.id} listing={l} onClaim={markAsClaimed} onReopen={markAsAvailable} formatDate={formatDate} />
              ))}
              {myListings.length === 0 && (
                <p style={styles.empty}>No listings yet. Add your first one from the map!</p>
              )}
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <div>
            <h2 style={styles.pageTitle}>My Listings</h2>
            <div style={styles.card}>
              {myListings.length === 0 ? (
                <p style={styles.empty}>No listings yet. Go to the map to add food donations.</p>
              ) : (
                myListings.map((l) => (
                  <ListingRow key={l.id} listing={l} onClaim={markAsClaimed} onReopen={markAsAvailable} formatDate={formatDate} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <div>
            <h2 style={styles.pageTitle}>Badges & Achievements</h2>
            <div style={styles.badgesGrid}>
              {BADGES.map((badge) => {
                const earned = (userProfile?.points || 0) >= badge.points;
                return (
                  <div key={badge.id} style={{ ...styles.badgeCard, opacity: earned ? 1 : 0.4 }}>
                    <div style={styles.badgeEmoji}>{badge.emoji}</div>
                    <div style={styles.badgeLabel}>{badge.label}</div>
                    <div style={styles.badgePts}>{badge.points} pts</div>
                    {earned && <div style={styles.badgeEarned}>Earned!</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div>
            <h2 style={styles.pageTitle}>Community Leaderboard</h2>
            <div style={styles.card}>
              {leaderboard.map((u, i) => (
                <div
                  key={u.id}
                  style={{
                    ...styles.leaderRow,
                    background: u.id === user.uid ? "#f0fdf4" : "transparent",
                    borderLeft: u.id === user.uid ? "3px solid #16a34a" : "3px solid transparent",
                  }}
                >
                  <span style={styles.rank}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <div style={styles.leaderAvatar}>
                    {(u.name || u.email || "U")[0].toUpperCase()}
                  </div>
                  <div style={styles.leaderInfo}>
                    <div style={styles.leaderName}>{u.name || "Anonymous"} {u.id === user.uid ? "(You)" : ""}</div>
                    <div style={styles.leaderRole}>{u.role}</div>
                  </div>
                  <div style={styles.leaderPoints}>{u.points || 0} pts</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const ListingRow = ({ listing, onClaim, onReopen, formatDate }) => (
  <div style={listingStyles.row}>
    <div style={{ flex: 1 }}>
      <div style={listingStyles.title}>{listing.title}</div>
      <div style={listingStyles.meta}>
        {listing.quantity} · {formatDate(listing.createdAt)}
      </div>
    </div>
    <div style={listingStyles.right}>
      <span style={listingStyles.badge(listing.status)}>
        {listing.status === "available" ? "Available" : "Claimed"}
      </span>
      {listing.status === "available" ? (
        <button style={listingStyles.btn} onClick={() => onClaim(listing.id)}>
          Mark Claimed
        </button>
      ) : (
        <button style={{ ...listingStyles.btn, background: "#f3f4f6", color: "#374151" }}
          onClick={() => onReopen(listing.id)}>
          Reopen
        </button>
      )}
    </div>
  </div>
);

const listingStyles = {
  row: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 0", borderBottom: "1px solid #f3f4f6",
  },
  title: { fontSize: 14, fontWeight: 500, color: "#111827" },
  meta: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  right: { display: "flex", alignItems: "center", gap: 8 },
  badge: (status) => ({
    padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500,
    background: status === "available" ? "#dcfce7" : "#f3f4f6",
    color: status === "available" ? "#16a34a" : "#6b7280",
  }),
  btn: {
    padding: "5px 12px", fontSize: 12, fontWeight: 500,
    background: "#16a34a", color: "#fff",
    border: "none", borderRadius: 6, cursor: "pointer",
  },
};

const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#f9fafb" },
  center: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" },
  sidebar: {
    width: 240, background: "#111827", padding: "1.5rem 1rem",
    display: "flex", flexDirection: "column", gap: 0, flexShrink: 0,
  },
  sidebarLogo: { color: "#4ade80", fontSize: 22, fontWeight: 700, marginBottom: "1.5rem" },
  userCard: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#1f2937", borderRadius: 10, padding: "10px 12px", marginBottom: "1.5rem",
  },
  avatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: "#16a34a", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16, flexShrink: 0,
  },
  userName: { color: "#f9fafb", fontSize: 13, fontWeight: 600 },
  userEmail: { color: "#9ca3af", fontSize: 11, marginTop: 1 },
  userRole: {
    fontSize: 10, background: "#16a34a", color: "#fff",
    padding: "1px 6px", borderRadius: 4, display: "inline-block", marginTop: 3,
    textTransform: "capitalize",
  },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: {
    padding: "9px 12px", border: "none", background: "transparent",
    color: "#9ca3af", textAlign: "left", cursor: "pointer",
    borderRadius: 8, fontSize: 13, fontWeight: 500,
  },
  navActive: { background: "#1f2937", color: "#4ade80" },
  signOutBtn: {
    padding: "8px 12px", background: "#1f2937", color: "#ef4444",
    border: "none", borderRadius: 8, cursor: "pointer",
    fontSize: 13, textAlign: "left", marginTop: "1rem",
  },
  sidebarFooter: { color: "#4b5563", fontSize: 11, marginTop: 12, textAlign: "center" },
  main: { flex: 1, padding: "2rem", overflowY: "auto", maxWidth: 900 },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: "1.5rem" },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12, marginBottom: "1.5rem",
  },
  statCard: { borderRadius: 12, padding: "1.25rem", textAlign: "center" },
  statNum: { fontSize: 32, fontWeight: 700 },
  statLabel: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  card: {
    background: "#fff", borderRadius: 12, padding: "1.25rem",
    marginBottom: "1.25rem", border: "1px solid #e5e7eb",
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#111827" },
  viewAllBtn: {
    fontSize: 13, color: "#16a34a", border: "none",
    background: "transparent", cursor: "pointer",
  },
  pointsBadge: {
    background: "#fffbeb", color: "#d97706",
    padding: "3px 10px", borderRadius: 12, fontSize: 13, fontWeight: 600,
  },
  progressLabel: { fontSize: 13, color: "#6b7280", marginBottom: 8 },
  progressBar: { height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", background: "#16a34a", borderRadius: 4, transition: "width 0.4s" },
  progressSub: { fontSize: 12, color: "#9ca3af", marginTop: 6 },
  empty: { color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "1rem 0" },
  badgesGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12,
  },
  badgeCard: {
    background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
    padding: "1.25rem", textAlign: "center",
  },
  badgeEmoji: { fontSize: 36, marginBottom: 8 },
  badgeLabel: { fontSize: 13, fontWeight: 600, color: "#111827" },
  badgePts: { fontSize: 12, color: "#9ca3af", marginTop: 4 },
  badgeEarned: {
    marginTop: 8, fontSize: 11, fontWeight: 600,
    color: "#16a34a", background: "#dcfce7",
    padding: "2px 8px", borderRadius: 10, display: "inline-block",
  },
  leaderRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 12px", borderRadius: 8, marginBottom: 4,
  },
  rank: { fontSize: 18, width: 30, textAlign: "center" },
  leaderAvatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "#16a34a", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 14,
  },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: 14, fontWeight: 500, color: "#111827" },
  leaderRole: { fontSize: 12, color: "#9ca3af", textTransform: "capitalize" },
  leaderPoints: { fontSize: 15, fontWeight: 700, color: "#16a34a" },
};

export default Dashboard;
