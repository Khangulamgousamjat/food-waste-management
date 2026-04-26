import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/ui/NavBar";
import Footer from "./components/ui/Footer";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Lazy loaded pages
const MapPage = lazy(() => import("./pages/MapPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const DonateFormPage = lazy(() => import("./pages/DonateFormPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const NgoCertificationPage = lazy(() => import("./pages/NgoCertificationPage"));
const DonatePage = lazy(() => import("./pages/DonatePage"));
const RewardsPage = lazy(() => import("./pages/RewardsPage"));
const DonationsPage = lazy(() => import("./pages/DonationsPage"));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route
              path="/ngo-certification"
              element={<NgoCertificationPage />}
            />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/donations" element={<DonationsPage />} />
            <Route path="/rewards" element={<RewardsPage />} />

            {/* Auth routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/donate" element={<DonateFormPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
