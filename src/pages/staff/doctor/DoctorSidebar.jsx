import {
  Home,
  Calendar,
  FileText,
  User,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../apiConfig';

export default function DoctorSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear ALL storage keys to prevent session ghosting
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("doctorName");

    // 2. Redirect to Admin Login
    // Note: ensure your route in App.js matches "/admin/login"
    navigate("/admin/login", { replace: true });
    
    // 3. Optional: Force a reload to clear any remaining memory states
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-white shadow-xl p-6 flex flex-col min-h-screen border-r border-slate-100">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-black text-blue-600 italic tracking-tighter">
          Doctor Panel
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          Medical Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-slate-600 font-bold">

        <div
          onClick={() => navigate("/doctor/dashboard")}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all"
        >
          <Home size={20} /> Dashboard
        </div>

        <div
          onClick={() => navigate("/doctor/appointments")}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all"
        >
          <Calendar size={20} /> Appointments
        </div>

        <div
          onClick={() => navigate("/doctor/prescription")}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all"
        >
          <FileText size={20} /> Patient History
        </div>

        <div
          onClick={() => navigate("/doctor/profile")}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all"
        >
          <User size={20} /> Profile
        </div>

      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-rose-500 font-black text-xs uppercase tracking-widest hover:text-white p-4 rounded-2xl hover:bg-rose-500 w-full transition-all shadow-sm hover:shadow-rose-200"
        >
          <LogOut size={18} /> Logout to Admin
        </button>
      </div>

    </aside>
  );
}