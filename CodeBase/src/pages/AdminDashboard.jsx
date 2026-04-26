import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, doc, updateDoc, writeBatch } from "firebase/firestore";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  // Fetch real-time data
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const unsubListings = onSnapshot(collection(db, "listings"), (snap) => {
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => {
      unsubUsers();
      unsubListings();
    };
  }, []);

  const handleSignOut = () => signOut(auth);

  const removeUser = async (user) => {
    const confirm = window.confirm(`Are you sure you want to remove user: ${user.name || user.email}? This will hide all their listings.`);
    if (!confirm) return;

    try {
      const batch = writeBatch(db);
      
      // Update user document
      const userRef = doc(db, "users", user.id);
      batch.update(userRef, {
        status: "removed",
        removedAt: new Date().toISOString(),
        removedBy: "admin"
      });

      // Update all their listings
      const userListings = listings.filter(l => l.donorId === user.id);
      userListings.forEach(l => {
        const listingRef = doc(db, "listings", l.id);
        batch.update(listingRef, { status: "removed" });
      });

      await batch.commit();
      alert("User and their listings removed successfully.");
    } catch (err) {
      alert("Failed to remove user: " + err.message);
    }
  };

  const removeListing = async (listing) => {
    try {
      await updateDoc(doc(db, "listings", listing.id), { status: "removed" });
    } catch (err) {
      alert("Failed to remove listing: " + err.message);
    }
  };

  const markListingExpired = async (listing) => {
    try {
      await updateDoc(doc(db, "listings", listing.id), { status: "expired" });
    } catch (err) {
      alert("Failed to mark as expired: " + err.message);
    }
  };

  const formatDate = (ts) => {
    if (!ts) return "N/A";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.page}>
      {/* Admin Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>Admin Panel</div>

        <div style={styles.userCard}>
          <div style={styles.avatar}>G</div>
          <div>
            <div style={styles.userName}>Gous Khan</div>
            <div style={styles.userRole}>Super Admin</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <button onClick={() => setActiveTab("overview")} style={{ ...styles.navItem, ...(activeTab === "overview" ? styles.navActive : {}) }}>📊 Overview</button>
          <button onClick={() => setActiveTab("users")} style={{ ...styles.navItem, ...(activeTab === "users" ? styles.navActive : {}) }}>👥 Users</button>
          <button onClick={() => setActiveTab("donations")} style={{ ...styles.navItem, ...(activeTab === "donations" ? styles.navActive : {}) }}>🍱 Donations</button>
          <button onClick={() => setActiveTab("reports")} style={{ ...styles.navItem, ...(activeTab === "reports" ? styles.navActive : {}) }}>📈 Reports</button>
          <button onClick={() => setActiveTab("settings")} style={{ ...styles.navItem, ...(activeTab === "settings" ? styles.navActive : {}) }}>⚙️ Settings</button>
        </nav>

        <button style={styles.signOutBtn} onClick={handleSignOut}>Sign Out</button>

        <p style={styles.sidebarFooter}>Made with ❤️ by<br /><strong>Gous Khan</strong></p>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {activeTab === "overview" && <OverviewTab users={users} listings={listings} />}
        {activeTab === "users" && <UsersTab users={users} listings={listings} removeUser={removeUser} formatDate={formatDate} />}
        {activeTab === "donations" && <DonationsTab listings={listings} removeListing={removeListing} markListingExpired={markListingExpired} formatDate={formatDate} />}
        {activeTab === "reports" && <ReportsTab listings={listings} users={users} />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
};

/* --- TAB COMPONENTS --- */

const OverviewTab = ({ users, listings }) => {
  const stats = [
    { label: "Total Users", value: users.length, color: "#2563eb" },
    { label: "Donors", value: users.filter(u => u.role === "donor").length, color: "#16a34a" },
    { label: "Recipients", value: users.filter(u => u.role === "recipient").length, color: "#d97706" },
    { label: "Total Donations", value: listings.length, color: "#7c3aed" },
    { label: "Active Listings", value: listings.filter(l => l.status === "available").length, color: "#10b981" },
    { label: "Claimed Listings", value: listings.filter(l => l.status === "claimed").length, color: "#3b82f6" },
    { label: "Expired", value: listings.filter(l => l.status === "expired").length, color: "#ef4444" },
    { label: "Total Meals Shared", value: listings.filter(l => l.status === "claimed").reduce((acc, l) => acc + (parseInt(l.quantity) || 0), 0), color: "#f59e0b" }
  ];

  const recentListings = [...listings].sort((a, b) => (b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt) - (a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt)).slice(0, 10);

  return (
    <div>
      <h2 style={styles.pageTitle}>Dashboard Overview <span style={styles.liveDot}></span></h2>
      <div style={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
            <div style={{ ...styles.statNum, color: s.color }}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Recent Activity (Live)</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.trHeader}>
              <th style={styles.th}>Food Name</th>
              <th style={styles.th}>Donor</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentListings.map(l => (
              <tr key={l.id} style={styles.tr}>
                <td style={styles.td}><strong>{l.title}</strong></td>
                <td style={styles.td}>{l.donorName}</td>
                <td style={styles.td}>
                  <span style={styles.badge(l.status)}>{l.status.toUpperCase()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UsersTab = ({ users, listings, removeUser, formatDate }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u => {
    if (filter === "donors" && u.role !== "donor") return false;
    if (filter === "recipients" && u.role !== "recipient") return false;
    if (filter === "removed" && u.status !== "removed") return false;
    if (filter === "active" && u.status === "removed") return false;
    
    if (search) {
      const q = search.toLowerCase();
      if (!((u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q))) return false;
    }
    return true;
  });

  return (
    <div>
      <h2 style={styles.pageTitle}>User Management</h2>
      <div style={styles.filterBar}>
        <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={styles.input} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={styles.select}>
          <option value="all">All Users</option>
          <option value="active">Active Only</option>
          <option value="donors">Donors</option>
          <option value="recipients">Recipients</option>
          <option value="removed">Removed Users</option>
        </select>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.trHeader}>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Role & Status</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Listings</th>
              <th style={styles.th}>Points</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => {
              const uListings = listings.filter(l => l.donorId === u.id).length;
              return (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={styles.tableAvatar}>{(u.name || u.email || "U")[0].toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name || "N/A"}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge(u.role === "donor" ? "available" : "claimed")}>{u.role}</span>
                    {u.status === "removed" && <span style={{...styles.badge("removed"), marginLeft: 6}}>Suspended</span>}
                  </td>
                  <td style={styles.td}>{formatDate(u.createdAt)}</td>
                  <td style={styles.td}>{uListings}</td>
                  <td style={styles.td}><strong>{u.points || 0}</strong></td>
                  <td style={styles.td}>
                    {u.status !== "removed" && (
                      <button style={styles.dangerBtn} onClick={() => removeUser(u)}>Remove</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DonationsTab = ({ listings, removeListing, markListingExpired, formatDate }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = listings.filter(l => {
    if (filter !== "all" && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!((l.title || "").toLowerCase().includes(q) || (l.donorName || "").toLowerCase().includes(q))) return false;
    }
    return true;
  });

  return (
    <div>
      <h2 style={styles.pageTitle}>Food Listings</h2>
      <div style={styles.filterBar}>
        <input type="text" placeholder="Search food or donor..." value={search} onChange={e => setSearch(e.target.value)} style={styles.input} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={styles.select}>
          <option value="all">All Listings</option>
          <option value="available">Available</option>
          <option value="claimed">Claimed</option>
          <option value="expired">Expired</option>
          <option value="removed">Removed</option>
        </select>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.trHeader}>
              <th style={styles.th}>Food Item</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Donor</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {l.imageUrl ? <img src={l.imageUrl} alt="" style={styles.thumb} /> : <div style={styles.thumbPlaceholder}>No Img</div>}
                    <div>
                      <div style={{ fontWeight: 600 }}>{l.title}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>Qty: {l.quantity}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}><span style={styles.badge("default")}>{l.foodType}</span></td>
                <td style={styles.td}>{l.donorName}</td>
                <td style={styles.td}><span style={styles.badge(l.status)}>{l.status.toUpperCase()}</span></td>
                <td style={styles.td}>{formatDate(l.createdAt)}</td>
                <td style={styles.td}>
                  {l.status !== "removed" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={styles.dangerBtn} onClick={() => removeListing(l)}>Remove</button>
                      {l.status === "available" && <button style={styles.warningBtn} onClick={() => markListingExpired(l)}>Expire</button>}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsTab = ({ listings, users }) => {
  const claimed = listings.filter(l => l.status === "claimed");
  const totalMeals = claimed.reduce((acc, l) => acc + (parseInt(l.quantity) || 0), 0);
  const co2Saved = (totalMeals * 2.5).toFixed(1);
  const wastePrevented = (totalMeals * 0.5).toFixed(1); // approx 0.5kg per meal

  return (
    <div>
      <h2 style={styles.pageTitle}>Impact Reports</h2>
      
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, borderTop: "4px solid #16a34a"}}>
          <div style={{...styles.statNum, color: "#16a34a"}}>{totalMeals}</div>
          <div style={styles.statLabel}>Total Meals Donated</div>
        </div>
        <div style={{...styles.statCard, borderTop: "4px solid #059669"}}>
          <div style={{...styles.statNum, color: "#059669"}}>{co2Saved} kg</div>
          <div style={styles.statLabel}>Estimated CO2 Saved</div>
        </div>
        <div style={{...styles.statCard, borderTop: "4px solid #d97706"}}>
          <div style={{...styles.statNum, color: "#d97706"}}>{wastePrevented} kg</div>
          <div style={styles.statLabel}>Food Waste Prevented</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 20 }}>
        <div style={{ ...styles.card, flex: 1, minWidth: 300 }}>
          <h3 style={styles.cardTitle}>Top Donors Leaderboard</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {users.filter(u => u.role === "donor" && u.status !== "removed")
              .sort((a,b) => (b.points||0) - (a.points||0)).slice(0,5).map((u, i) => (
              <li key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span><strong>#{i+1}</strong> {u.name || u.email}</span>
                <span style={{ color: "#16a34a", fontWeight: 700 }}>{u.points || 0} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => (
  <div>
    <h2 style={styles.pageTitle}>Admin Settings</h2>
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>Super Admin Info</h3>
      <p style={styles.settingRow}><strong>Name:</strong> Khan Gulamgous Amjat</p>
      <p style={styles.settingRow}><strong>Email:</strong> Gousk2004@gmail.com</p>
      <p style={styles.settingRow}><strong>Role:</strong> Super Admin</p>
    </div>
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>App Information</h3>
      <p style={styles.settingRow}><strong>App Name:</strong> FoodShare Admin</p>
      <p style={styles.settingRow}><strong>Version:</strong> 1.0.0</p>
      <p style={styles.settingRow}><strong>Firebase Project ID:</strong> foodshare-bda03</p>
      <p style={styles.settingRow}><strong>Admin Developer:</strong> Gous Khan</p>
    </div>
  </div>
);

const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#f1f5f9" },
  sidebar: { width: 250, background: "#0f172a", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", flexShrink: 0 },
  sidebarLogo: { color: "#f59e0b", fontSize: 24, fontWeight: 700, marginBottom: "1.5rem" },
  userCard: { display: "flex", alignItems: "center", gap: 10, background: "#1e293b", borderRadius: 10, padding: "10px", marginBottom: "1.5rem" },
  avatar: { width: 40, height: 40, borderRadius: "50%", background: "#f59e0b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  userName: { color: "#f8fafc", fontSize: 14, fontWeight: 600 },
  userRole: { fontSize: 11, background: "#dc2626", color: "#fff", padding: "2px 6px", borderRadius: 4, display: "inline-block", marginTop: 2 },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: { padding: "10px 12px", border: "none", background: "transparent", color: "#94a3b8", textAlign: "left", cursor: "pointer", borderRadius: 8, fontSize: 14, fontWeight: 500 },
  navActive: { background: "#1e293b", color: "#f59e0b" },
  signOutBtn: { padding: "10px", background: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, marginTop: "auto" },
  sidebarFooter: { color: "#64748b", fontSize: 11, marginTop: 16, textAlign: "center" },
  main: { flex: 1, padding: "2rem", overflowY: "auto" },
  pageTitle: { fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 10 },
  liveDot: { width: 10, height: 10, background: "#22c55e", borderRadius: "50%", display: "inline-block", animation: "pulse 1.5s infinite" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: "2rem" },
  statCard: { background: "#fff", borderRadius: 12, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  statNum: { fontSize: 32, fontWeight: 700, marginBottom: 4 },
  statLabel: { fontSize: 13, color: "#64748b", fontWeight: 600, textTransform: "uppercase" },
  card: { background: "#fff", borderRadius: 12, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: "1rem" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  trHeader: { borderBottom: "2px solid #e2e8f0" },
  th: { textAlign: "left", padding: "12px 10px", color: "#64748b", fontWeight: 600 },
  tr: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "12px 10px", color: "#334155" },
  badge: (status) => {
    let bg = "#f1f5f9", color = "#64748b";
    if (status === "available") { bg = "#dcfce7"; color = "#16a34a"; }
    else if (status === "claimed") { bg = "#dbeafe"; color = "#2563eb"; }
    else if (status === "expired" || status === "removed") { bg = "#fee2e2"; color = "#dc2626"; }
    return { padding: "4px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: bg, color: color };
  },
  filterBar: { display: "flex", gap: 12, marginBottom: "1.5rem" },
  input: { flex: 1, maxWidth: 300, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, outline: "none" },
  select: { padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, outline: "none", background: "#fff" },
  tableAvatar: { width: 32, height: 32, background: "#e2e8f0", color: "#475569", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  dangerBtn: { padding: "4px 10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" },
  warningBtn: { padding: "4px 10px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" },
  thumb: { width: 40, height: 40, borderRadius: 6, objectFit: "cover" },
  thumbPlaceholder: { width: 40, height: 40, borderRadius: 6, background: "#e2e8f0", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" },
  settingRow: { marginBottom: 10, color: "#334155", fontSize: 15 }
};

export default AdminDashboard;
