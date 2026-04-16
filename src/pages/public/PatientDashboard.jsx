import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate, useOutletContext } from "react-router-dom";
import { Calendar, FileText, User, Loader2, ChevronRight, Bell, Menu } from "lucide-react";
import axios from "axios";
import API_BASE_URL from '../../apiConfig';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // ✅ USE THIS: This connects to the setIsOpen state in your PatientLayout
  const { setIsOpen } = useOutletContext();

  const [appointment, setAppointment] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);

  const userIdFromStorage = localStorage.getItem("userId"); 
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role?.toUpperCase() !== "PATIENT" || userIdFromStorage != id) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [appointmentRes, prescriptionRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/appointments/patient/${id}/upcoming`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/api/patient/prescriptions/${id}`, { headers }).catch(() => ({ data: [] }))
        ]);
        
        setAppointment(appointmentRes.data[0] || null);
        setPrescriptions(Array.isArray(prescriptionRes.data) ? prescriptionRes.data : []);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [id, userIdFromStorage, token, role]);

  if (!authorized) return <Navigate to="/patient/login" replace />;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50">
      {/* ✅ UPDATED HEADER: Includes the Mobile Menu Toggle */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 md:px-8 md:py-6 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-4">
          {/* MOBILE MENU BUTTON: Only shows on small screens */}
          <button 
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Health Portal</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
            <Bell size={20} />
          </button>
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
            <User size={20} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-slate-900">Welcome Back 👋</h2>
          <p className="text-slate-500 font-medium mt-2">Showing your primary care overview.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointment Card */}
          <section className="space-y-4">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-blue-600">Most Recent Upcoming</h3>
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              {appointment ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{appointment.doctorName}</p>
                      <p className="text-slate-500 text-sm font-bold">{appointment.clinicName}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                  <p className="text-slate-400 font-bold mb-4">No scheduled visits found.</p>
                  <button onClick={() => navigate("/doctors")} className="text-blue-600 font-black text-[10px] uppercase tracking-widest">
                    Book Appointment
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Prescriptions Card */}
          <section className="space-y-4">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-600">Recent Prescriptions</h3>
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              {prescriptions.length > 0 ? (
                prescriptions.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all">
                    <div className="flex items-center gap-4">
                      <FileText className="text-emerald-500" size={20} />
                      <p className="font-bold text-slate-800">{p.medicineName}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-300 font-bold">No records available.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
