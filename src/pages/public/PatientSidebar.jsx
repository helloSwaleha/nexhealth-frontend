import React from "react";
import { Home, Calendar, ClipboardList, User, LogOut, ArrowLeft, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PatientSidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/patient/login", { replace: true });
    window.location.reload();
  };

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: `/patient/dashboard/${userId}` },
    { name: "Appointments", icon: <Calendar size={20} />, path: "/patient/appointments" },
    { name: "Book Appointment", icon: <ClipboardList size={20} />, path: "/doctors" },
    { name: "My Profile", icon: <User size={20} />, path: "/patient/profile" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    // Auto-close the sidebar after clicking a link ONLY on mobile
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 1. MOBILE OVERLAY: Only visible when isOpen is true on small screens */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 2. SIDEBAR PANEL */}
      <aside className={`
        /* Layout: Fixed on mobile to slide over content, Relative on desktop to stay in place */
        fixed md:relative inset-y-0 left-0 z-50
        
        /* Sizing & Style */
        w-64 bg-white border-r border-slate-100 p-6 flex flex-col h-screen shadow-2xl md:shadow-none
        
        /* Animation: Slide out on mobile, always visible on desktop */
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        {/* Mobile Close Button (X) */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute right-4 top-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          <X size={24} />
        </button>

        {/* Branding */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <ClipboardList size={22} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            My Portal
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all font-bold text-sm
                  ${isActive 
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                `}
              >
                <span className={`${isActive ? "scale-110" : ""} transition-transform`}>
                  {item.icon}
                </span>
                {item.name}
              </div>
            );
          })}

          <div className="my-6 px-2">
            <div className="h-px bg-slate-100 w-full" />
          </div>

          <div
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all font-bold text-sm text-slate-400 hover:text-slate-600"
          >
            <ArrowLeft size={20} /> Public Home
          </div>
        </nav>

        {/* Logout Section */}
        <div className="mt-auto pt-6 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-700 p-3 rounded-xl hover:bg-red-50 w-full transition-all font-black text-sm uppercase tracking-wider"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
