# 🌿 FoodShare (HungerLink)  
### 🚀 Real-Time Food Sharing Platform  
![React](https://img.shields.io/badge/Frontend-React-blue)
![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)
![Status](https://img.shields.io/badge/Status-Live-green)

🚀 **Live Demo:** [https://hungerlink-gk.vercel.app/](https://hungerlink-gk.vercel.app/)

FoodShare is a **real-time, location-based platform** designed to connect food donors with recipients and reduce food waste efficiently.

Built during a hackathon by **Team Digital Spartans**, this platform uses modern web technologies to create **instant, transparent, and impactful food redistribution**.

---

## 🧠 Project Vision

> “No food should be wasted while people are hungry.”

FoodShare transforms surplus food into opportunity by enabling:

* ⚡ Instant food sharing
* 📍 Location-based discovery
* 🤝 Community-driven impact

---

## 🚨 Problem Statement

* 🌍 1.3 Billion tonnes of food wasted yearly
* 🍽 828 Million people suffer from hunger
* 🌱 ~8% global emissions from food waste
* ❌ No real-time connection between donors & recipients

---

## 💡 Our Solution

A **live web platform** where:

* Donors can **list surplus food instantly**
* Recipients can **discover nearby food on map**
* Food is claimed **before it expires**

---

## 🔥 Core Features

### 🗺 Real-Time Food Map (Main Highlight)

* Built with Leaflet + OpenStreetMap
* Shows nearby food in real-time
* GPS-based auto location detection

### ⏱ Smart Expiry System

* Live countdown timers
* 🔴 Urgent alerts (<2 hrs)
* Auto-remove expired food

### ⚡ One-Click Claim

* Instant claiming system
* Prevents duplicate pickups
* Real-time updates across users

### 🏆 Gamification System

* Points for donations & claims
* Badges & leaderboard
* Boosts user engagement

### 📊 Impact Tracking

* Meals shared
* CO₂ saved
* Donation analytics

### 🛡 Admin Control Panel

* Manage users & listings
* Platform analytics
* Full moderation system

---

## 📂 Project Structure

```text
📦 FoodShare
 ┣ 📂 public               # Static assets (images, icons)
 ┣ 📂 src                  # Main source code
 ┃ ┣ 📂 components         # Reusable UI components
 ┃ ┃ ┣ 📂 ui               # Layout elements (NavBar, Footer)
 ┃ ┃ ┣ 📜 Auth.jsx         # Authentication logic & UI
 ┃ ┃ ┣ 📜 DonationModal.jsx # Food listing form
 ┃ ┃ ┗ 📜 Map.jsx          # Interactive Leaflet map
 ┃ ┣ 📂 pages              # Application views
 ┃ ┃ ┣ 📜 HomePage.tsx     # Landing page
 ┃ ┃ ┣ 📜 Dashboard.jsx    # User portal (Donor/Recipient)
 ┃ ┃ ┗ 📜 AdminDashboard.jsx # Administrative control
 ┃ ┣ 📜 App.jsx            # Routing & global state
 ┃ ┣ 📜 firebase.js        # Firebase initialization
 ┃ ┗ 📜 index.css          # Global styling & Tailwind
 ┣ 📜 firestore.rules      # Security rules for Firestore
 ┣ 📜 package.json         # Dependencies & scripts
 ┗ 📜 README.md            # Documentation
```

---

## 🔄 User Flow

### 🍱 Donor Journey

1. Sign up as donor
2. Add food details
3. Food appears on map
4. Recipient claims it
5. Earn points & badges

### 🤲 Recipient Journey

1. Sign up
2. View nearby food
3. Check expiry
4. Claim food
5. Pick up

---

## ⚙ Tech Stack

### Frontend

* ⚛ React.js
* 💨 Tailwind CSS
* 🎬 Framer Motion
* 🧭 React Router
* 🗺 Leaflet Maps

### Backend

* 🔥 Firebase Firestore (Real-time DB)
* 🔐 Firebase Authentication
* 📁 Firebase Storage

### Additional

* 🧪 Supabase (testimonials)
* 📊 Chart.js (analytics)

---

## 🧩 Unique Selling Points

✔ Real-time food visibility
✔ GPS-based discovery
✔ Expiry-driven urgency system
✔ Gamification (rare in this domain)
✔ Full admin control
✔ Clean & scalable architecture

---

## 🌍 Impact

* 🍽 Thousands of meals redistributed
* 🌱 Reduced food waste
* ♻ Lower carbon footprint
* 🤝 Strong community collaboration

---

## 🚀 Future Enhancements

* 📍 Radius-based filtering (5km, 10km)
* 🔔 Push notifications
* 💬 In-app chat
* 📱 Mobile app (React Native)
* 🤖 AI food demand prediction
* 🏛 NGO & government integration

---

## 👨💻 Team

**Team Digital Spartans**

* Khan Gulamgous Amjat
* Hasib Masihuddin Shaikh

📧 [Gousk2004@gmail.com](mailto:Gousk2004@gmail.com)

---

## 📸 Screenshots

![Uploading Screenshot (72).png..]()

---

## ⭐ Why This Project Stands Out

FoodShare is not just a project — it’s a **real-world scalable solution** addressing two major global problems:

👉 Hunger
👉 Food Waste

Built with **technology + social impact + usability**, it is hackathon-ready and production-capable.

---

<p align="center">
  Made with ❤️ by <b>Gous Khan</b>
</p>
