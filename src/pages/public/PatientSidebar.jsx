import React from "react";
import { Home, Calendar, ClipboardList, User, LogOut, ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PatientSidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
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
    if (window.innerWidth < 768) setIsOpen(false); // Auto-close on mobile after clicking
  };

  return (
    <>
      {/* Mobile Overlay: Darkens the screen when sidebar is open */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Panel */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-2xl md:shadow-xl p-6 flex flex-col h-screen
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute right-4 top-6 p-2 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>

        {/* Brand/Header */}
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
            <ClipboardList size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            My Portal
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 text-slate-600">
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all font-medium group"
            >
              <span className="group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              {item.name}
            </div>
          ))}

          <hr className="my-4 border-slate-100" />

          <div
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 cursor-pointer transition-all font-medium text-slate-400 hover:text-slate-600"
          >
            <ArrowLeft size={20} /> Public Home
          </div>
        </nav>

        {/* Logout Section */}
        <div className="mt-auto pt-6 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-700 p-3 rounded-xl hover:bg-red-50 w-full transition-all font-bold"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
