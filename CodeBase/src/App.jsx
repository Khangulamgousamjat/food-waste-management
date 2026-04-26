import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Keep ALL existing page imports that were there before
import NavBar from "./components/ui/NavBar";
import Footer from "./components/ui/Footer";
import HomePage from "./pages/HomePage";
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

// New Firebase components
import Auth from "./components/Auth";
import FoodMap from "./components/Map";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

const ADMIN_EMAIL = "Gousk2004@gmail.com";

// Loading spinner
const Loader = () => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    height: "100vh", fontSize: 16, color: "#16a34a", fontWeight: 500,
  }}>
    Loading FoodShare...
  </div>
);

import { Outlet } from "react-router-dom";

// Loading fallback for lazy loaded routes
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <main className="flex-grow">
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </div>
);

// Protected route wrapper
const PrivateRoute = ({ children, user }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        if (u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setIsAdmin(true);
          setUser(u);
        } else {
          setIsAdmin(false);
          // Check if user is removed
          try {
            const userDocRef = doc(db, "users", u.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists() && userDoc.data().status === "removed") {
              await signOut(auth);
              alert("Your account has been suspended. \nContact admin at Gousk2004@gmail.com");
              setUser(null);
              return;
            }
          } catch (err) {
            console.error("Error checking user status", err);
          }
          setUser(u);
        }
      } else {
        setIsAdmin(false);
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  if (user === undefined) return <Loader />;

  return (
    <Router>
      <Routes>
        {/* Public Layout Routes (includes NavBar and Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/map" element={<FoodMap />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace /> : <Auth onSuccess={() => {}} />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace /> : <Auth onSuccess={() => {}} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Dashboard Route (No main NavBar/Footer) */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute user={user}>
              <Suspense fallback={<LoadingFallback />}>
                {isAdmin ? <Navigate to="/admin" replace /> : <Dashboard />}
              </Suspense>
            </PrivateRoute>
          } 
        />

        {/* Admin Route */}
        <Route 
          path="/admin" 
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
