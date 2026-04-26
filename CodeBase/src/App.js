import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Pages & Components
import Auth from "./components/Auth";
import FoodMap from "./components/Map";
import Dashboard from "./pages/Dashboard";

// Loading spinner
const Loader = () => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    height: "100vh", fontSize: 16, color: "#16a34a", fontWeight: 500,
  }}>
    Loading FoodShare...
  </div>
);

// Protected route wrapper
const PrivateRoute = ({ children, user }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    // Firebase auth state listener — fires on login/logout automatically
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  // Show loader while Firebase checks auth
  if (user === undefined) return <Loader />;

  return (
    <Router>
      <Routes>
        {/* Auth page */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Auth onSuccess={() => {}} />
          }
        />

        {/* Map — public */}
        <Route path="/map" element={<FoodMap />} />

        {/* Dashboard — protected */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute user={user}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
