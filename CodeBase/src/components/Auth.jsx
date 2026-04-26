import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Auth = ({ onSuccess }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "donor" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle Google redirect result when page loads after redirect
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await saveUserToFirestore(result.user);
          if (onSuccess) onSuccess();
        }
      })
      .catch((err) => {
        if (err.code !== 'auth/null-user') {
          setError(getFriendlyError(err.code));
        }
      });
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const saveUserToFirestore = async (user, extraData = {}) => {
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName || form.name,
        email: user.email,
        role: form.role,
        points: 0,
        badges: [],
        totalDonations: 0,
        createdAt: serverTimestamp(),
        ...extraData,
      },
      { merge: true }
    );
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        await updateProfile(user, { displayName: form.name });
        await saveUserToFirestore(user);
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      // Use redirect instead of popup — never blocked by browser
      await signInWithRedirect(auth, googleProvider);
      // Page will redirect — result handled in useEffect above
    } catch (err) {
      setError(getFriendlyError(err.code));
      setLoading(false);
    }
  };

  const getFriendlyError = (code) => {
    const errors = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Try again.",
      "auth/invalid-credential": "Incorrect email or password. Please check and try again.",
      "auth/invalid-login-credentials": "Incorrect email or password. Please check and try again.",
      "auth/email-already-in-use": "This email is already registered.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
      "auth/popup-blocked": "Popup was blocked. Redirecting you to Google sign-in...",
      "auth/too-many-requests": "Too many failed attempts. Please wait a moment.",
      "auth/network-request-failed": "Network error. Please check your connection.",
      "auth/unauthorized-domain": "This domain is not authorized for Google sign-in. Please contact support.",
    };
    return errors[code] || `Login failed (${code}). Please try again.`;
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Home button */}
        <a href="/" style={styles.homeBtn}>← Back to Home</a>

        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoText}>FoodShare</span>
          <p style={styles.logoSub}>
            {mode === "login"
              ? "Welcome back! Sign in to continue."
              : "Join us and start making a difference."}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={styles.tabBar}>
          <button
            style={{ ...styles.tab, ...(mode === "login" ? styles.tabActive : {}) }}
            onClick={() => { setMode("login"); setError(""); setShowPassword(false); }}
          >
            Log In
          </button>
          <button
            style={{ ...styles.tab, ...(mode === "signup" ? styles.tabActive : {}) }}
            onClick={() => { setMode("signup"); setError(""); setShowPassword(false); }}
          >
            Sign Up
          </button>
        </div>

        {/* Google button */}
        <button style={styles.googleBtn} onClick={handleGoogleLogin} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 10 }}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div style={styles.divider}><span style={styles.dividerText}>or</span></div>

        {/* Form */}
        <form onSubmit={handleEmailAuth}>
          {mode === "signup" && (
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="e.g. Gous Khan"
                value={form.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                style={{ ...styles.input, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div style={styles.field}>
              <label style={styles.label}>I want to join as</label>
              <div style={styles.roleRow}>
                {["donor", "recipient"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, role: r }))}
                    style={{
                      ...styles.roleBtn,
                      ...(form.role === r ? styles.roleBtnActive : {}),
                    }}
                  >
                    {r === "donor" ? "🍱 Donor" : "🤲 Recipient"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <div style={styles.errorBox}>{error}</div>}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Made with ❤️ by <strong>Gous Khan</strong>
        </p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "2rem",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 4px 40px rgba(0,0,0,0.10)",
  },
  logo: { textAlign: "center", marginBottom: "1.5rem" },
  logoText: { fontSize: 28, fontWeight: 700, color: "#16a34a" },
  logoSub: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  homeBtn: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: 13,
    color: "#6b7280",
    textDecoration: "none",
    marginBottom: "1rem",
    padding: "4px 0",
    fontWeight: 500,
    transition: "color 0.2s",
  },

  tabBar: {
    display: "flex",
    background: "#f3f4f6",
    borderRadius: 10,
    padding: 4,
    marginBottom: "1.25rem",
  },
  tab: {
    flex: 1,
    padding: "8px 0",
    border: "none",
    background: "transparent",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#6b7280",
    transition: "all 0.2s",
  },
  tabActive: { background: "#fff", color: "#16a34a", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  googleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 0",
    border: "1.5px solid #e5e7eb",
    borderRadius: 10,
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    marginBottom: "1rem",
    transition: "background 0.2s",
  },
  divider: {
    textAlign: "center",
    position: "relative",
    margin: "1rem 0",
    borderTop: "1px solid #e5e7eb",
  },
  dividerText: {
    background: "#fff",
    padding: "0 10px",
    fontSize: 12,
    color: "#9ca3af",
    position: "relative",
    top: -10,
  },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4 },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 14,
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    padding: 0,
    lineHeight: 1,
  },
  roleRow: { display: "flex", gap: 10 },
  roleBtn: {
    flex: 1,
    padding: "10px 0",
    border: "1.5px solid #e5e7eb",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#6b7280",
  },
  roleBtnActive: { border: "1.5px solid #16a34a", color: "#16a34a", background: "#f0fdf4" },
  errorBox: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 13,
    marginBottom: "1rem",
  },
  submitBtn: {
    width: "100%",
    padding: "12px 0",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 4,
    transition: "background 0.2s",
  },
  footer: { textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: "1.25rem" },
};

export default Auth;
