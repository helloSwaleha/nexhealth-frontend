import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, LayoutDashboard, LogOut, Search, UserPlus, LogIn } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Handle scroll for transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = token && userId && userId !== "undefined" && role?.toUpperCase() === "PATIENT";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/patient/login");
    window.location.reload();
  };

  return (
    <nav className={`navbar ${isScrolled ? "nav-scrolled" : "nav-transparent"} ${isLoggedIn ? "patient-theme" : "public-theme"}`}>
      <div className="nav-container">
        
        {/* Unique NexHealth Logo Type */}
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

        <ul className="nav-links">
          <li><Link to="/"><Search size={18}/> <span>Clinics</span></Link></li>

          {!isLoggedIn ? (
            <>
              <li><Link to="/patient/login" className="login-link"><LogIn size={18}/> Login</Link></li>
              <li><Link to="/patient/signup" className="signup-btn">Get Started</Link></li>
            </>
          ) : (
            <>
              <li>
                <Link to={`/patient/dashboard/${userId}`} className="dash-link">
                  <LayoutDashboard size={18}/> Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-glass-btn">
                  <LogOut size={18} /> <span>Sign Out</span>
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