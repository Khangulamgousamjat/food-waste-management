import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { X, Upload, Image as ImageIcon } from "lucide-react";

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
  const [expiryWarning, setExpiryWarning] = useState(false);
  const [userLocation, setUserLocation] = useState([20.5937, 78.9629]);

  useEffect(() => {
    if (isOpen) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {} // fallback
      );
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "expiryTime") {
      const selectedTime = new Date(value).getTime();
      const now = Date.now();
      const twoHours = 2 * 60 * 60 * 1000;
      if (selectedTime - now < twoHours && selectedTime > now) {
        setExpiryWarning(true);
      } else {
        setExpiryWarning(false);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please log in.");
    if (!formData.expiryTime) return alert("Please select an expiry time.");

    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        try {
          const imageRef = ref(storage, `food_images/${Date.now()}_${imageFile.name}`);
          
          let timeoutId;
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error("Storage upload timed out. Did you enable Firebase Storage in the console?")), 15000);
          });
          
          const snapshot = await Promise.race([uploadBytes(imageRef, imageFile), timeoutPromise]);
          clearTimeout(timeoutId);
          
          imageUrl = await getDownloadURL(snapshot.ref);
        } catch (storageErr) {
          console.error("Storage Error:", storageErr);
          alert("Image upload failed: " + storageErr.message + "\n\nProceeding without image...");
        }
      }

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

      alert("Donation listed successfully!");
      onClose();
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Error saving donation: " + err.message + "\n\nPlease ensure your user role is Donor and your Firebase rules are set correctly.");
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
          <button style={styles.closeBtn} onClick={onClose}><X size={24} /></button>
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
            <label style={styles.label}>Food Image</label>
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
            </div>
          </div>

          {/* Expiry Time */}
          <div style={styles.field}>
            <label style={styles.label}>Expiry / Best Before</label>
            <input type="datetime-local" style={styles.input} name="expiryTime" value={formData.expiryTime} onChange={handleChange} required />
            {expiryWarning && <p style={styles.warning}>Warning: Food expires in less than 2 hours.</p>}
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

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Submitting..." : "Submit Donation"}
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
  input: { padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none" },
  radioGroup: { display: "flex", gap: "16px", flexWrap: "wrap" },
  radioLabel: { display: "flex", alignItems: "center", gap: "6px", fontSize: 14, cursor: "pointer" },
  imageUploadWrapper: { display: "flex", alignItems: "center", gap: "16px" },
  imageUploadBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 16px", background: "#f3f4f6", border: "1px dashed #d1d5db",
    borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#4b5563"
  },
  previewContainer: { width: 60, height: 60, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" },
  imagePreview: { width: "100%", height: "100%", objectFit: "cover" },
  warning: { color: "#ef4444", fontSize: 12, marginTop: 4, fontWeight: 500 },
  submitBtn: {
    marginTop: "8px", padding: "12px", background: "#16a34a", color: "#fff",
    border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer"
  }
};

export default DonationModal;
