import { Home, Calendar, ClipboardList, FileText, User, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../apiConfig';

export default function PatientSidebar() {
  const navigate = useNavigate();
  
  // ✅ Get the ID from localStorage
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.clear(); // Clears token, userId, and role at once
    navigate("/patient/login", { replace: true });
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-white shadow-xl p-6 flex flex-col min-h-screen">
      <div className="flex items-center gap-2 mb-10">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <ClipboardList size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          My Portal
        </h2>
      </div>

      <nav className="flex flex-col gap-2 text-slate-600">
        
        {/* ✅ FIXED DASHBOARD LINK: Uses backticks (`) */}
        <div 
          onClick={() => navigate(`/patient/dashboard/${userId}`)}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all font-medium"
        >
          <Home size={20} /> Dashboard
        </div>

        <div 
          onClick={() => navigate("/patient/appointments")}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all font-medium"
        >
          <Calendar size={20} /> Appointments
        </div>

        <div 
          onClick={() => navigate("/doctors")}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all font-medium"
        >
          <ClipboardList size={20} /> Book Appointment
        </div>

       

        <div 
          onClick={() => navigate("/patient/profile")}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all font-medium"
        >
          <User size={20} /> My Profile
        </div>

        <hr className="my-4 border-slate-100" />

        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 cursor-pointer transition-all font-medium text-slate-400"
        >
          <ArrowLeft size={20} /> Public Home
        </div>

      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-700 p-3 rounded-xl hover:bg-red-50 w-full transition-all font-bold"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}