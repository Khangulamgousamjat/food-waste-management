# Community Food Waste Reduction Platform

### **About the Project**
This project is a **Community Food Waste Reduction Platform** designed to connect individuals and businesses with surplus food to charities or people in need. The platform aims to reduce food waste, provide meals to those in need, and create a sustainable ecosystem by utilizing modern web technologies.

---

### **Features**

#### **Core Features:**
- **Real-time Map Integration**: Displays food donors and recipients using Google Maps API.
- **User Dashboards**:
  - Donors: Add food listings, track donations, and view gamification stats.
  - Recipients: Browse food availability, request items, and schedule pickups.
- **Gamification System**:
  - Earn badges and points for contributions.
  - Community leaderboards updated in real-time.
- **Impact Analytics**:
  - Visualize total meals donated, CO₂ emissions saved, and other metrics.
- **AI Suggestions**: Predict optimal times for food donations (future feature).

#### **Other Features:**
- Secure user authentication with Supabase.
- Responsive design with Tailwind CSS.
- Notifications for new donations and pickup updates.
- Contact form with FAQ for general inquiries.

---

### **Tech Stack**

#### **Frontend:**
- **React.js**: For building the dynamic user interface.
- **Tailwind CSS**: For responsive and modern styling.
- **React Router**: For navigation between pages.

#### **Backend:**
- **Supabase**: For user authentication, real-time database, and API integration.

#### **Hosting:**
- **Netlify**: For hosting the React application with CI/CD setup.
- **Netlify Functions**: For serverless backend logic.

#### **APIs:**
- **Google Maps API**: For geolocation and mapping features.

---

### **Project Structure**
```plaintext
src/
├── components/
│   ├── Header.js
│   ├── Footer.js
│   ├── Dashboard.js
│   └── Map.js
├── pages/
│   ├── Home.js
│   ├── HowItWorks.js
│   ├── Features.js
│   ├── Contact.js
│   └── Dashboard.js
├── styles/
│   └── tailwind.css
├── App.js
└── index.js
```

---

### **Setup and Installation**

#### **Prerequisites**
1. Node.js installed on your local machine.
2. A Supabase account for backend setup.
3. Google Maps API key for map functionality.

#### **Steps to Run Locally**
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/community-food-reduction.git
   cd community-food-reduction
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following:
     ```env
     REACT_APP_SUPABASE_URL=<your-supabase-url>
     REACT_APP_SUPABASE_ANON_KEY=<your-supabase-anon-key>
     REACT_APP_GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
     ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open the app in your browser at [http://localhost:3000](http://localhost:3000).

---

### **Deployment**
1. Push your code to a GitHub repository.
2. Connect the repository to **Netlify** for automatic deployment.
3. Add the environment variables in the Netlify dashboard.
4. Deploy the app and get your live URL!

---

### **Contributing**
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

### **License**
Distributed under the MIT License. See `LICENSE` for more information.

---

### **Acknowledgments**
- **React** and **Tailwind CSS** for front-end development.
- **Supabase** for backend support.
- **Netlify** for hosting and deployment.
- Google Maps API for location services.

---

### **Contact**
For any queries or feedback, contact us at [maverick4bros@gmail.com].
