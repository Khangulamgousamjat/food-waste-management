import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { X, Upload } from "lucide-react";

// ✅ FREE image hosting — no credit card needed
// Get your free API key at: https://api.imgbb.com/
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "";

const uploadToImgBB = async (file) => {
  if (!IMGBB_API_KEY) {
    throw new Error("ImgBB API key not set. Add VITE_IMGBB_API_KEY to your .env file.");
  }
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || "ImgBB upload failed");
  return data.data.url; // returns the public image URL
};

const DonationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    foodType: "veg",
    quantity: "",
    description: "",
    cookedType: "freshly_cooked",
    expiryTime: "",
    pickupLocation: "",
    contactNumber: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [expiryWarning, setExpiryWarning] = useState(false);
  const [userLocation, setUserLocation] = useState([20.5937, 78.9629]);

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
      // Reset form on open
      setUploadStatus("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "expiryTime") {
      const selectedTime = new Date(value).getTime();
      const twoHours = 2 * 60 * 60 * 1000;
      setExpiryWarning(selectedTime - Date.now() < twoHours && selectedTime > Date.now());
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image too large. Please choose an image under 5MB.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please log in.");
    if (!formData.expiryTime) return alert("Please select an expiry time.");

    setLoading(true);
    setUploadStatus("");

    let imageUrl = "";

    // Step 1: Upload image (if selected)
    if (imageFile) {
      if (!IMGBB_API_KEY) {
        setUploadStatus("⚠️ No ImgBB key set — submitting without image.");
      } else {
        try {
          setUploadStatus("📸 Uploading image...");
          imageUrl = await uploadToImgBB(imageFile);
          setUploadStatus("✅ Image uploaded!");
        } catch (imgErr) {
          console.error("ImgBB Error:", imgErr);
          setUploadStatus("⚠️ Image upload failed — submitting without image.");
        }
      }
    }

    // Step 2: Save to Firestore
    try {
      setUploadStatus((prev) => prev + " 💾 Saving donation...");
      await addDoc(collection(db, "listings"), {
        ...formData,
        imageUrl,
        lat: userLocation[0] + (Math.random() - 0.5) * 0.02,
        lng: userLocation[1] + (Math.random() - 0.5) * 0.02,
        status: "available",
        donorId: auth.currentUser.uid,
        donorName: auth.currentUser.displayName || "Anonymous",
        createdAt: serverTimestamp(),
        expiryTime: new Date(formData.expiryTime).getTime(),
      });

      alert("✅ Donation listed successfully! Recipients can now see your listing.");
      // Reset form
      setFormData({
        title: "", foodType: "veg", quantity: "", description: "",
        cookedType: "freshly_cooked", expiryTime: "", pickupLocation: "", contactNumber: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setUploadStatus("");
      onClose();
    } catch (err) {
      console.error("Firestore Error:", err);
      if (err.code === "permission-denied") {
        alert("❌ Permission denied.\n\nMake sure your account role is set to 'donor' in Firebase.\n\nGo to Firebase Console → Firestore → users → your user document → change role to 'donor'");
      } else {
        alert("❌ Error saving donation: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Start Donating</h2>
          <button style={styles.closeBtn} onClick={onClose} disabled={loading}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Food Name & Quantity */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Food Name</label>
              <input style={styles.input} name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Rice and Dal" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Quantity</label>
              <input style={styles.input} name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g. 10 meals" required />
            </div>
          </div>

          {/* Food Type */}
          <div style={styles.field}>
            <label style={styles.label}>Food Type</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}><input type="radio" name="foodType" value="veg" checked={formData.foodType === "veg"} onChange={handleChange} /> <span style={{color:"#16a34a"}}>🌿</span> Vegetarian</label>
              <label style={styles.radioLabel}><input type="radio" name="foodType" value="nonveg" checked={formData.foodType === "nonveg"} onChange={handleChange} /> <span style={{color:"#dc2626"}}>🍗</span> Non-Vegetarian</label>
              <label style={styles.radioLabel}><input type="radio" name="foodType" value="vegan" checked={formData.foodType === "vegan"} onChange={handleChange} /> <span style={{color:"#2563eb"}}>🌱</span> Vegan</label>
            </div>
          </div>

          {/* Cooked Type */}
          <div style={styles.field}>
            <label style={styles.label}>Preparation Type</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}><input type="radio" name="cookedType" value="freshly_cooked" checked={formData.cookedType === "freshly_cooked"} onChange={handleChange} /> Freshly Cooked</label>
              <label style={styles.radioLabel}><input type="radio" name="cookedType" value="packaged" checked={formData.cookedType === "packaged"} onChange={handleChange} /> Packaged</label>
              <label style={styles.radioLabel}><input type="radio" name="cookedType" value="raw" checked={formData.cookedType === "raw"} onChange={handleChange} /> Raw Ingredients</label>
            </div>
          </div>

          {/* Image Upload */}
          <div style={styles.field}>
            <label style={styles.label}>
              Food Image <span style={{fontWeight: 400, color: "#6b7280", fontSize: 12}}>(optional — free via ImgBB)</span>
            </label>
            <div style={styles.imageUploadWrapper}>
              <label style={styles.imageUploadBtn}>
                <Upload size={18} /> Upload Photo
                <input type="file" accept="image/*" onChange={handleImageChange} style={{display: "none"}} />
              </label>
              {imagePreview && (
                <div style={styles.previewContainer}>
                  <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                </div>
              )}
              {imageFile && !imagePreview && <span style={{fontSize: 12, color: "#6b7280"}}>{imageFile.name}</span>}
            </div>
            {!IMGBB_API_KEY && (
              <p style={{fontSize: 12, color: "#d97706", marginTop: 4}}>
                ⚠️ Add <code>VITE_IMGBB_API_KEY</code> to your .env for image uploads to work.
              </p>
            )}
          </div>

          {/* Expiry Time */}
          <div style={styles.field}>
            <label style={styles.label}>Expiry / Best Before</label>
            <input type="datetime-local" style={styles.input} name="expiryTime" value={formData.expiryTime} onChange={handleChange} required />
            {expiryWarning && <p style={styles.warning}>⚠️ Warning: Food expires in less than 2 hours.</p>}
          </div>

          {/* Pickup & Contact */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Pickup Location</label>
              <input style={styles.input} name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} placeholder="Address or Landmark" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Contact Number</label>
              <input style={styles.input} name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="For recipients" required />
            </div>
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>Description / Instructions</label>
            <textarea style={{...styles.input, minHeight: 80}} name="description" value={formData.description} onChange={handleChange} placeholder="Pickup instructions, notes, etc." required />
          </div>

          {/* Upload Status */}
          {uploadStatus && (
            <div style={styles.statusBox}>{uploadStatus}</div>
          )}

          <button type="submit" style={{...styles.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer"}} disabled={loading}>
            {loading ? "Please wait..." : "Submit Donation"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
  },
  modal: {
    background: "#fff", borderRadius: 12, width: "100%", maxWidth: 600,
    maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  header: {
    padding: "20px 24px", borderBottom: "1px solid #e5e7eb",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    position: "sticky", top: 0, background: "#fff", zIndex: 10
  },
  title: { fontSize: 20, fontWeight: 700, margin: 0, color: "#111827" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#6b7280" },
  form: { padding: "24px", display: "flex", flexDirection: "column", gap: "16px" },
  row: { display: "flex", gap: "16px", flexWrap: "wrap" },
  field: { flex: 1, display: "flex", flexDirection: "column", gap: "6px", minWidth: "200px" },
  label: { fontSize: 14, fontWeight: 600, color: "#374151" },
  input: { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" },
  radioGroup: { display: "flex", gap: "16px", flexWrap: "wrap" },
  radioLabel: { display: "flex", alignItems: "center", gap: "6px", fontSize: 14, cursor: "pointer" },
  imageUploadWrapper: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  imageUploadBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 16px", background: "#f3f4f6", border: "1px dashed #d1d5db",
    borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#4b5563"
  },
  previewContainer: { width: 60, height: 60, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb", flexShrink: 0 },
  imagePreview: { width: "100%", height: "100%", objectFit: "cover" },
  warning: { color: "#ef4444", fontSize: 12, marginTop: 4, fontWeight: 500 },
  statusBox: { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#166534" },
  submitBtn: {
    marginTop: "8px", padding: "12px", background: "#16a34a", color: "#fff",
    border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600
  }
};

export default DonationModal;
