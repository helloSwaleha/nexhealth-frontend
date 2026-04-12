import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, LogOut, Search, LogIn } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To trigger re-check on page change
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  // Robust Auth Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    
    const authenticated = !!token && 
                          !!storedId && 
                          storedId !== "undefined" && 
                          role?.toUpperCase() === "PATIENT";
    
    setIsLoggedIn(authenticated);
    setUserId(storedId);
  }, [location]); // Re-run whenever the URL changes

  // Handle scroll for transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/patient/login");
    window.location.reload();
  };

  return (
    <nav className={`navbar ${isScrolled ? "nav-scrolled" : "nav-transparent"} ${isLoggedIn ? "patient-theme" : "public-theme"}`}>
      <div className="nav-container">
        
        {/* Logo Section */}
        <div className="nav-logo">
          <Link to="/">
            <div className="logo-icon">
              <Activity size={20} strokeWidth={3} />
            </div>
            <span className="logo-text">
              Nex<span className="text-highlight">Health</span>
            </span>
            {isLoggedIn && <span className="patient-badge">Portal</span>}
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link to="/">
              <Search size={18}/> 
              <span className="nav-text">Clinics</span>
            </Link>
          </li>

          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/patient/login" className="login-link">
                  <LogIn size={18}/> 
                  <span className="nav-text">Login</span>
                </Link>
              </li>
              <li>
                <Link to="/patient/signup" className="signup-btn">
                  Get Started
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={`/patient/dashboard/${userId}`} className="dash-link">
                  <LayoutDashboard size={18}/> 
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout} className="logout-glass-btn">
                  <LogOut size={18} /> 
                  <span className="nav-text">Sign Out</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
