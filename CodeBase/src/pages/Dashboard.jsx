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
  increment,
} from "firebase/firestore";
import DonationModal from "../components/DonationModal";

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
  const [availableListings, setAvailableListings] = useState([]);
  const [myClaimed, setMyClaimed] = useState([]);
  // Donors default to overview; recipients will switch to 'available' once profile loads
  const [activeTab, setActiveTab] = useState("overview");
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, claimed: 0 });
  const [showDonationModal, setShowDonationModal] = useState(false);

  // Filters for recipient
  const [filterFoodType, setFilterFoodType] = useState("all");
  const [filterCookedType, setFilterCookedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Timer state for forcing re-renders of countdowns
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  // Fetch user profile + set default tab based on role
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        const profile = snap.data();
        setUserProfile(profile);
        // Only override tab for recipients — donors stay on overview
        if (profile.role === "recipient") {
          setActiveTab("available");
        }
      } else {
        // No Firestore doc — create a sensible default so page doesn't stay blank
        const defaultProfile = {
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          role: "donor",
          points: 0,
          badges: [],
        };
        setUserProfile(defaultProfile);
        setActiveTab("overview");
      }
    });
    return () => unsub();
  }, [user]);

  // Fetch listings and handle auto-expire
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const allData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Auto-expire check — only run for donors to avoid permission errors
      if (userProfile?.role === "donor" || !userProfile) {
        allData.forEach(async (listing) => {
          if (
            listing.status === "available" &&
            listing.expiryTime &&
            listing.expiryTime < Date.now() &&
            listing.donorId === user.uid // Only expire OWN listings
          ) {
            try {
              await updateDoc(doc(db, "listings", listing.id), { status: "expired" });
            } catch (e) {
              // Silently ignore permission errors
            }
          }
        });
      }

      // Sort and filter for state
      setMyListings(allData.filter((l) => l.donorId === user.uid));
      setAvailableListings(
        allData.filter(
          (l) =>
            l.status === "available" &&
            l.donorId !== user.uid && // Don't show own listings to claim
            (!l.expiryTime || l.expiryTime > Date.now())
        )
      );
      setMyClaimed(allData.filter((l) => l.claimedBy === user.uid && l.status !== "removed"));

      const mine = allData.filter((l) => l.donorId === user.uid);
      setStats({
        total: mine.length,
        available: mine.filter((l) => l.status === "available").length,
        claimed: mine.filter((l) => l.status === "claimed").length,
      });
    });
    return () => unsub();
  }, [user, userProfile?.role]);

  // Fetch leaderboard
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("points", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLeaderboard(snap.docs.slice(0, 10).map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const markAsClaimed = async (listingId) => {
    try {
      // Donor marks their own listing as claimed — must only change 'status' (donor owns it)
      await updateDoc(doc(db, "listings", listingId), { status: "claimed" });
      if (userProfile) {
        const newPoints = (userProfile.points || 0) + 15;
        await updateDoc(doc(db, "users", user.uid), { points: newPoints });
      }
    } catch (err) {
      console.error("Mark claimed error:", err);
      alert("Failed to update listing: " + err.message);
    }
  };

  const markAsAvailable = async (listingId) => {
    try {
      await updateDoc(doc(db, "listings", listingId), { status: "available" });
    } catch (err) {
      console.error("Mark available error:", err);
    }
  };

  const claimFood = async (listing) => {
    try {
      // Firestore rule requires BOTH status and claimedBy together, nothing else
      await updateDoc(doc(db, "listings", listing.id), {
        status: "claimed",
        claimedBy: user.uid,
      });
      // Award 5 points to donor separately (allowed by points-only rule)
      if (listing.donorId) {
        try {
          await updateDoc(doc(db, "users", listing.donorId), {
            points: increment(5),
          });
        } catch (pointsErr) {
          console.warn("Could not award donor points:", pointsErr.message);
          // Non-critical — don't fail the whole claim
        }
      }
      alert("✅ Food claimed successfully! Please pick it up at the location.");
    } catch (err) {
      console.error("Claim food error:", err);
      if (err.code === "permission-denied") {
        alert("❌ Claim failed: Permission denied.\n\nThis can happen if:\n• You are logged in as a Donor (only Recipients can claim)\n• The listing was already claimed\n• Your Firestore rules need updating");
      } else {
        alert("❌ Failed to claim food: " + err.message);
      }
    }
  };

  const handleSignOut = () => signOut(auth);

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatCountdown = (expiryTime) => {
    if (!expiryTime) return null;
    const diff = expiryTime - currentTime;
    if (diff <= 0) return { text: "Expired", color: "#9ca3af", urgent: true };

    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);

    if (hours >= 4) {
      return { text: `Expires in ${hours} hours`, color: "#16a34a", urgent: false }; // green
    } else if (hours >= 2) {
      return { text: `Expiring soon - ${hours} hours left`, color: "#d97706", urgent: false }; // orange
    } else {
      const remainingMins = mins % 60;
      const hText = hours > 0 ? `${hours}h ` : "";
      return { text: `Urgent! Expires in ${hText}${remainingMins} mins`, color: "#dc2626", urgent: true }; // red
    }
  };

  const getFoodTypeColor = (type) => {
    if (type === "veg") return { color: "#16a34a", bg: "#dcfce7", icon: "🌿", label: "Veg" };
    if (type === "nonveg") return { color: "#dc2626", bg: "#fee2e2", icon: "🍗", label: "Non-Veg" };
    if (type === "vegan") return { color: "#2563eb", bg: "#dbeafe", icon: "🌱", label: "Vegan" };
    return { color: "#6b7280", bg: "#f3f4f6", icon: "🍽️", label: "Unknown" };
  };

  if (!user) {
    return (
      <div style={styles.center}>
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  const isRecipient = userProfile?.role === "recipient";

  const filteredListings = availableListings
    .filter(l => filterFoodType === "all" || l.foodType === filterFoodType)
    .filter(l => filterCookedType === "all" || l.cookedType === filterCookedType)
    .sort((a, b) => {
      if (sortBy === "expiring_soon") {
        return (a.expiryTime || Infinity) - (b.expiryTime || Infinity);
      }
      // newest
      return (b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt) - 
             (a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt);
    });

  const earnedBadges = BADGES.filter((b) => (userProfile?.points || 0) >= b.points);
  const nextBadge = BADGES.find((b) => (userProfile?.points || 0) < b.points);
  const progressToNext = nextBadge ? Math.min(100, ((userProfile?.points || 0) / nextBadge.points) * 100) : 100;

  return (
    <div style={styles.page}>
      <DonationModal isOpen={showDonationModal} onClose={() => setShowDonationModal(false)} />

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>FoodShare</div>

        {!isRecipient && (
          <button style={styles.donateBtn} onClick={() => setShowDonationModal(true)}>
            Start Donating
          </button>
        )}

        <div style={styles.userCard}>
          <div style={styles.avatar}>
            {(user.displayName || user.email || "U")[0].toUpperCase()}
          </div>
          <div>
            <div style={styles.userName}>
            {user.displayName || user.email?.split("@")[0] || "User"}
          </div>
            <div style={styles.userEmail}>{user.email}</div>
            <div style={styles.userRole}>{userProfile?.role || "donor"}</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {isRecipient ? (
            <>
              <button onClick={() => setActiveTab("available")} style={{ ...styles.navItem, ...(activeTab === "available" ? styles.navActive : {}) }}>🍽️ Available Food</button>
              <button onClick={() => setActiveTab("my_claimed")} style={{ ...styles.navItem, ...(activeTab === "my_claimed" ? styles.navActive : {}) }}>✅ My Claimed Food</button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab("overview")} style={{ ...styles.navItem, ...(activeTab === "overview" ? styles.navActive : {}) }}>📊 Overview</button>
              <button onClick={() => setActiveTab("listings")} style={{ ...styles.navItem, ...(activeTab === "listings" ? styles.navActive : {}) }}>🍱 My Listings</button>
            </>
          )}
          <button onClick={() => setActiveTab("badges")} style={{ ...styles.navItem, ...(activeTab === "badges" ? styles.navActive : {}) }}>🏅 Badges</button>
          <button onClick={() => setActiveTab("leaderboard")} style={{ ...styles.navItem, ...(activeTab === "leaderboard" ? styles.navActive : {}) }}>🏆 Leaderboard</button>
        </nav>

        <button style={styles.signOutBtn} onClick={handleSignOut}>
          Sign Out
        </button>

        <p style={styles.sidebarFooter}>Made with ❤️ by<br /><strong>Gous Khan</strong></p>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        
        {/* Recipient View - Available Food */}
        {isRecipient && activeTab === "available" && (
          <div>
            <h2 style={styles.pageTitle}>Available Food Listings</h2>
            
            <div style={styles.filterBar}>
              <select value={filterFoodType} onChange={(e) => setFilterFoodType(e.target.value)} style={styles.filterSelect}>
                <option value="all">All Food Types</option>
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
              
              <select value={filterCookedType} onChange={(e) => setFilterCookedType(e.target.value)} style={styles.filterSelect}>
                <option value="all">All Preparations</option>
                <option value="freshly_cooked">Freshly Cooked</option>
                <option value="packaged">Packaged</option>
                <option value="raw">Raw Ingredients</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.filterSelect}>
                <option value="newest">Newest First</option>
                <option value="expiring_soon">Expiring Soon First</option>
              </select>
            </div>

            <div style={styles.gridListings}>
              {filteredListings.length === 0 ? (
                <p style={styles.empty}>No available food matches your filters.</p>
              ) : (
                filteredListings.map(l => {
                  const typeInfo = getFoodTypeColor(l.foodType);
                  const countdown = formatCountdown(l.expiryTime);
                  
                  return (
                    <div key={l.id} style={styles.listingCard}>
                      <div style={styles.imgWrapper}>
                        {l.imageUrl ? (
                          <img src={l.imageUrl} alt={l.title} style={styles.cardImg} />
                        ) : (
                          <div style={styles.placeholderImg}>🍽️ No Image</div>
                        )}
                        {countdown?.urgent && (
                          <div style={styles.urgentBadge}>Urgent</div>
                        )}
                      </div>
                      
                      <div style={styles.cardContent}>
                        <div style={styles.cardHeaderFlex}>
                          <h3 style={styles.recipientCardTitle}>{l.title}</h3>
                          <span style={{...styles.typeBadge, background: typeInfo.bg, color: typeInfo.color}}>
                            {typeInfo.icon} {typeInfo.label}
                          </span>
                        </div>
                        
                        <p style={styles.cardDetail}><strong>Qty:</strong> {l.quantity}</p>
                        <p style={styles.cardDetail}><strong>Type:</strong> {l.cookedType?.replace('_', ' ')}</p>
                        <p style={styles.cardDetail}><strong>Donor:</strong> {l.donorName}</p>
                        <p style={styles.cardDetail}><strong>Pickup:</strong> {l.pickupLocation}</p>
                        <p style={styles.cardDetail}><strong>Contact:</strong> {l.contactNumber}</p>
                        
                        {countdown && (
                          <div style={{...styles.countdown, color: countdown.color}}>
                            ⏱ {countdown.text}
                          </div>
                        )}
                        
                        <button style={styles.claimBtn} onClick={() => claimFood(l)}>
                          Claim This Food
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Recipient View - My Claimed Food */}
        {isRecipient && activeTab === "my_claimed" && (
          <div>
            <h2 style={styles.pageTitle}>My Claimed Food</h2>
            <div style={styles.gridListings}>
              {myClaimed.length === 0 ? (
                <p style={styles.empty}>You haven't claimed any food yet.</p>
              ) : (
                myClaimed.map(l => (
                  <div key={l.id} style={{...styles.listingCard, opacity: 0.8}}>
                    <div style={styles.cardContent}>
                      <h3 style={styles.recipientCardTitle}>{l.title}</h3>
                      <p style={styles.cardDetail}><strong>Status:</strong> <span style={{color:"#16a34a", fontWeight:600}}>Claimed</span></p>
                      <p style={styles.cardDetail}><strong>Pickup:</strong> {l.pickupLocation}</p>
                      <p style={styles.cardDetail}><strong>Contact:</strong> {l.contactNumber}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Donor View - Overview */}
        {!isRecipient && activeTab === "overview" && (
          <div>
            <h2 style={styles.pageTitle}>Welcome back, {user.displayName?.split(" ")[0] || "there"}! 👋</h2>

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
                <p style={{ color: "#16a34a", fontWeight: 600 }}>🎉 You've earned all badges!</p>
              )}
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Recent Listings</span>
                <button style={styles.viewAllBtn} onClick={() => setActiveTab("listings")}>
                  View all →
                </button>
              </div>
              {myListings.slice(0, 3).map((l) => {
                 const countdown = formatCountdown(l.expiryTime);
                 return <ListingRow key={l.id} listing={l} onClaim={markAsClaimed} onReopen={markAsAvailable} formatDate={formatDate} countdown={countdown} />
              })}
              {myListings.length === 0 && (
                <p style={styles.empty}>No listings yet. Start donating to help the community!</p>
              )}
            </div>
          </div>
        )}

        {/* Donor View - My Listings */}
        {!isRecipient && activeTab === "listings" && (
          <div>
            <h2 style={styles.pageTitle}>My Listings</h2>
            <div style={styles.card}>
              {myListings.length === 0 ? (
                <p style={styles.empty}>No listings yet. Start donating!</p>
              ) : (
                myListings.map((l) => {
                  const countdown = formatCountdown(l.expiryTime);
                  return <ListingRow key={l.id} listing={l} onClaim={markAsClaimed} onReopen={markAsAvailable} formatDate={formatDate} countdown={countdown} />
                })
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

const ListingRow = ({ listing, onClaim, onReopen, formatDate, countdown }) => (
  <div style={listingStyles.row}>
    <div style={{ flex: 1 }}>
      <div style={listingStyles.title}>
        {listing.title}
        {countdown?.urgent && listing.status === 'available' && <span style={listingStyles.urgentSpan}>Urgent</span>}
      </div>
      <div style={listingStyles.meta}>
        {listing.quantity} · {formatDate(listing.createdAt)}
        {listing.status === 'available' && countdown && (
          <span style={{ color: countdown.color, marginLeft: 8, fontWeight: 500 }}>
            ({countdown.text})
          </span>
        )}
      </div>
    </div>
    <div style={listingStyles.right}>
      <span style={listingStyles.badge(listing.status)}>
        {listing.status === "available" ? "Available" : listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
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
  row: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f3f4f6" },
  title: { fontSize: 14, fontWeight: 500, color: "#111827", display: "flex", alignItems: "center", gap: 8 },
  urgentSpan: { background: "#fee2e2", color: "#dc2626", fontSize: 10, padding: "2px 6px", borderRadius: 10, fontWeight: 700 },
  meta: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  right: { display: "flex", alignItems: "center", gap: 8 },
  badge: (status) => ({
    padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500,
    background: status === "available" ? "#dcfce7" : (status === "expired" ? "#fee2e2" : "#f3f4f6"),
    color: status === "available" ? "#16a34a" : (status === "expired" ? "#dc2626" : "#6b7280"),
  }),
  btn: { padding: "5px 12px", fontSize: 12, fontWeight: 500, background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
};

const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#f9fafb" },
  center: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" },
  sidebar: { width: 240, background: "#111827", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: 0, flexShrink: 0 },
  sidebarLogo: { color: "#4ade80", fontSize: 22, fontWeight: 700, marginBottom: "1.5rem" },
  donateBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: "1.5rem", width: "100%" },
  userCard: { display: "flex", alignItems: "center", gap: 10, background: "#1f2937", borderRadius: 10, padding: "10px 12px", marginBottom: "1.5rem" },
  avatar: { width: 38, height: 38, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 },
  userName: { color: "#f9fafb", fontSize: 13, fontWeight: 600 },
  userEmail: { color: "#9ca3af", fontSize: 11, marginTop: 1 },
  userRole: { fontSize: 10, background: "#16a34a", color: "#fff", padding: "1px 6px", borderRadius: 4, display: "inline-block", marginTop: 3, textTransform: "capitalize" },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: { padding: "9px 12px", border: "none", background: "transparent", color: "#9ca3af", textAlign: "left", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 500 },
  navActive: { background: "#1f2937", color: "#4ade80" },
  signOutBtn: { padding: "8px 12px", background: "#1f2937", color: "#ef4444", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, textAlign: "left", marginTop: "1rem" },
  sidebarFooter: { color: "#4b5563", fontSize: 11, marginTop: 12, textAlign: "center" },
  main: { flex: 1, padding: "2rem", overflowY: "auto", maxWidth: 1000, margin: "0 auto" },
  pageTitle: { fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: "1.5rem" },
  
  // Recipient Grid
  filterBar: { display: "flex", gap: "12px", marginBottom: "1.5rem", flexWrap: "wrap" },
  filterSelect: { padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none", background: "#fff", color: "#374151" },
  gridListings: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" },
  listingCard: { background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  imgWrapper: { position: "relative", width: "100%", height: 160, background: "#f3f4f6" },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  placeholderImg: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#9ca3af" },
  urgentBadge: { position: "absolute", top: 10, right: 10, background: "#dc2626", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" },
  cardContent: { padding: "16px", display: "flex", flexDirection: "column", flex: 1 },
  cardHeaderFlex: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 12 },
  recipientCardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 },
  typeBadge: { padding: "3px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 },
  cardDetail: { fontSize: 13, color: "#4b5563", margin: "0 0 6px" },
  countdown: { fontSize: 13, fontWeight: 600, marginTop: 10, marginBottom: 16, padding: "8px", background: "#f9fafb", borderRadius: 8, textAlign: "center" },
  claimBtn: { width: "100%", padding: "10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: "auto" },

  // Donor overview
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: "1.5rem" },
  statCard: { borderRadius: 12, padding: "1.25rem", textAlign: "center" },
  statNum: { fontSize: 32, fontWeight: 700 },
  statLabel: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  card: { background: "#fff", borderRadius: 12, padding: "1.25rem", marginBottom: "1.25rem", border: "1px solid #e5e7eb" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#111827" },
  viewAllBtn: { fontSize: 13, color: "#16a34a", border: "none", background: "transparent", cursor: "pointer" },
  pointsBadge: { background: "#fffbeb", color: "#d97706", padding: "3px 10px", borderRadius: 12, fontSize: 13, fontWeight: 600 },
  progressLabel: { fontSize: 13, color: "#6b7280", marginBottom: 8 },
  progressBar: { height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", background: "#16a34a", borderRadius: 4, transition: "width 0.4s" },
  progressSub: { fontSize: 12, color: "#9ca3af", marginTop: 6 },
  empty: { color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "1rem 0" },
  badgesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 },
  badgeCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem", textAlign: "center" },
  badgeEmoji: { fontSize: 36, marginBottom: 8 },
  badgeLabel: { fontSize: 13, fontWeight: 600, color: "#111827" },
  badgePts: { fontSize: 12, color: "#9ca3af", marginTop: 4 },
  badgeEarned: { marginTop: 8, fontSize: 11, fontWeight: 600, color: "#16a34a", background: "#dcfce7", padding: "2px 8px", borderRadius: 10, display: "inline-block" },
  leaderRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, marginBottom: 4 },
  rank: { fontSize: 18, width: 30, textAlign: "center" },
  leaderAvatar: { width: 34, height: 34, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 },
  leaderInfo: { flex: 1 },
  leaderName: { fontSize: 14, fontWeight: 500, color: "#111827" },
  leaderRole: { fontSize: 12, color: "#9ca3af", textTransform: "capitalize" },
  leaderPoints: { fontSize: 15, fontWeight: 700, color: "#16a34a" },
};

export default Dashboard;
