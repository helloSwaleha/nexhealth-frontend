import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, ShieldCheck, Clock, Loader2, AlertCircle } from "lucide-react";
import API_BASE_URL from '../../apiConfig';
import "../../CSS/Home.css";

import image1 from "../../img/image1.jpg";
import image2 from "../../img/image2.jpg";


export default function Home() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/clinics`);
        if (!res.ok) throw new Error("Could not fetch clinics data.");
        const data = await res.json();
        setClinics(data);
      } catch (err) {
        console.error("Error fetching clinics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  // ✅ Sends search terms to the Doctors page
  const handleSearch = () => {
    navigate("/doctors", { 
      state: { 
        initialSearch: searchTerm, 
        initialLocation: locationTerm 
      } 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // ✅ FILTER LOGIC: Only show ACTIVE clinics on the Home Page
  const activeClinics = clinics.filter(clinic => clinic.status === "ACTIVE");

  return (
    <div className="home-page ">
      <header 
        className="hero-v2" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${image1})` }}
      >
        <div className="container hero-content">
          <span className="hero-badge mt-6 ">Trusted by 10,000+ Patients</span>
          <h1 className="hero-main-title">Modern Healthcare <br /><span>At Your Fingertips</span></h1>
        
          
          <div className="hero-search-bar">
            <div className="search-input">
              <Search className="icon" size={20} />
              <input 
                type="text" 
                placeholder="Search doctors or clinics..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="search-input">
              <MapPin className="icon" size={20} />
              <input 
                type="text" 
                placeholder="Location..." 
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <button onClick={handleSearch} className="btn-search">Find Now</button>
          </div>
        </div>
      </header>

      <div className="stats-bar">
        <div className="container stats-flex">
          <div className="stat-item"><strong>500+</strong> <span>Specialists</span></div>
          <div className="stat-item"><strong>100+</strong> <span>Clinics</span></div>
          <div className="stat-item"><strong>24/7</strong> <span>Support</span></div>
          <div className="stat-item"><strong>15k+</strong> <span>Happy Patients</span></div>
        </div>
      </div>

      <section className="featured-clinics py-80">
        <div className="container">
          <div className="section-top">
            <div>
              <h2 className="section-title">Top Rated Clinics</h2>
              <p className="section-subtitle">The highest standards of medical care in your neighborhood.</p>
            </div>
            <button className="btn-outline" onClick={() => navigate("/doctors")}>View All Clinics</button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-blue-600">
              <Loader2 className="animate-spin mb-2" size={40} />
              <p className="text-gray-500 font-medium">Loading clinics...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-red-500 gap-2">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>
          ) : (
            <div className="clinic-grid">
              {activeClinics.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                   <p className="no-data text-gray-400 font-medium">No active clinics available at the moment.</p>
                </div>
              ) : (
                /* ✅ Showing only ACTIVE clinics (max 4) */
                activeClinics.slice(0, 4).map((clinic) => (
                  <div key={clinic.id} className="clinic-card-v2">
                    <div className="clinic-img-container">
                      <img 
                        src={clinic.imagePath 
                          ? `${API_BASE_URL}/${clinic.imagePath}` 
                          : (clinic.imageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600")} 
                        alt={clinic.clinicName || clinic.name} 
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600" }}
                      />
                      <div className="price-tag">₹{clinic.consultationFee || clinic.fee || '500'}</div>
                    </div>
                    <div className="clinic-info">
                      <span className="spec-label">{clinic.specialization || "General Care"}</span>
                      <h3>{clinic.clinicName || clinic.name || "Unnamed Clinic"}</h3>
                      <p className="doc-name">
                        {clinic.doctorName ? `Dr. ${clinic.doctorName}` : "Specialist Physician"}
                      </p>
                      <div className="clinic-meta">
                        <span><MapPin size={14} /> {clinic.clinicAddress || clinic.city || clinic.location || "Location not listed"}</span>
                      </div>
                      <button 
                        className="btn-full" 
                        onClick={() => navigate(`/clinic/profile/${clinic.id}`)}
                      >
                        Book Visit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      <section className="promo-section" style={{ backgroundImage: `url(${image2})` }}>
        <div className="promo-overlay">
          <div className="container promo-content">
            <h2>Ready to prioritize your health?</h2>
            <p>Our platform ensures you get the right care at the right time. Secure, fast, and digital.</p>
            <div className="promo-steps">
                <div className="step"><ShieldCheck className="text-green-400" /> <span>Verified Doctors</span></div>
                <div className="step"><Clock className="text-blue-400" /> <span>Instant Booking</span></div>
                <div className="step"><Calendar className="text-purple-400" /> <span>Digital Records</span></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-v2">
        <div className="container footer-grid">
          <div className="footer-brand">
            <h3>ClinicApp<span>.</span></h3>
            <p>Empowering patients with better access to healthcare technology.</p>
          </div>
          <div className="footer-links">
            <h4>Platform</h4>
            <ul>
              <li onClick={() => navigate("/about")} className="cursor-pointer hover:text-blue-400 transition-colors">About Us</li>
              <li onClick={() => navigate("/doctors")} className="cursor-pointer hover:text-blue-400 transition-colors">Our Clinics</li>
              <li className="cursor-pointer hover:text-blue-400 transition-colors">Privacy Policy</li>
            </ul>
          </div>
          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <div className="input-group">
              <input type="email" placeholder="Your email" className="bg-gray-800 border-none text-white p-2 rounded-l-md outline-none w-full" />
              <button className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors">Go</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 NexHealth. Built for a healthier tomorrow.</p>
        </div>
      </footer>
    </div>
  );
}
