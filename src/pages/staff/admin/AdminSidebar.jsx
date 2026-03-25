// src/pages/staff/admin/AdminSidebar.jsx
import { 
  LayoutDashboard,
  Hospital,
  UserRound,
  Users,
  CalendarDays,
  FileText,
  BarChart3,
  LogOut
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition
     ${
       isActive
         ? "bg-blue-600 text-white"
         : "text-gray-700 hover:bg-blue-50"
     }`;

  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-4 flex flex-col">
      
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 mb-8 text-center">
        Admin Panel
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/clinics" className={linkClass}>
          <Hospital size={20} />
          Clinics
        </NavLink>

        <NavLink to="/admin/doctors" className={linkClass}>
          <UserRound size={20} />
          Doctors
        </NavLink>

        <NavLink to="/admin/patients" className={linkClass}>
          <Users size={20} />
          Patients
        </NavLink>

        <NavLink to="/admin/appointments" className={linkClass}>
          <CalendarDays size={20} />
          Appointments
        </NavLink>

        <NavLink to="/admin/prescriptions" className={linkClass}>
          <FileText size={20} />
          Prescriptions
        </NavLink>

        <NavLink to="/admin/reports" className={linkClass}>
          <BarChart3 size={20} />
          Reports
        </NavLink>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-lg"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
