import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Calendar, FileText, User, Loader2, ChevronRight, Bell, Menu, ClipboardList } from "lucide-react";
import axios from "axios";
import API_BASE_URL from '../../apiConfig';
import PatientSidebar from "./PatientSidebar"; // Import your fixed sidebar

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userIdFromStorage = localStorage.getItem("userId"); 
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [appointment, setAppointment] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    if (!token || role?.toUpperCase() !== "PATIENT" || userIdFromStorage != id) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const fetchAppt = axios.get(`${API_BASE_URL}/appointments/patient/${id}/upcoming`, { headers })
          .catch(() => ({ data: [] }));

        const fetchScripts = axios.get(`${API_BASE_URL}/api/patient/prescriptions/${id}`, { headers })
          .catch(() => ({ data: [] }));

        const [appointmentRes, prescriptionRes] = await Promise.all([fetchAppt, fetchScripts]);

        let apptData = appointmentRes.data;
        
        if (Array.isArray(apptData) && apptData.length > 0) {
          const sorted = [...apptData].sort((a, b) => {
            const dateA = new Date(`${a.date || a.appointmentDate}T${a.time || a.appointmentTime || '00:00'}`);
            const dateB = new Date(`${b.date || b.appointmentDate}T${b.time || b.appointmentTime || '00:00'}`);
            return dateA - dateB;
          });
          
          setAppointment(sorted[0]);
        } else if (apptData && !Array.isArray(apptData) && apptData.id) {
          setAppointment(apptData);
        } else {
          setAppointment(null);
        }

        setPrescriptions(Array.isArray(prescriptionRes.data) ? prescriptionRes.data : []);

      } catch (error) {
        console.error("Critical Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [id, userIdFromStorage, token, role]);

  if (!authorized) return <Navigate to="/patient/login" replace />;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Verifying Records...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. Integrated Sidebar */}
      <PatientSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* 2. Responsive Header with Hamburger Menu */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 md:px-8 md:py-6 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 bg-slate-50 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Health Portal</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><Bell size={20} /></button>
            <div className="h-9 w-9 md:h-10 md:w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
              <User size={18} />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
          <div className="mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Welcome Back 👋</h2>
            <p className="text-slate-500 font-medium mt-2">Showing your primary care overview.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* UPCOMING APPOINTMENT */}
            <section className="space-y-4">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <div className="h-1 w-3 bg-blue-600 rounded-full"></div> Most Recent Upcoming
              </h3>
              
              {appointment ? (
                <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all">
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="h-12 w-12 md:h-14 md:w-14 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600">
                      <Calendar size={24} md:size={28} />
                    </div>
                    <div>
                      <p className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                         {appointment.doctorName || "Consultant"}
                      </p>
                      <p className="text-blue-600 font-bold text-[9px] md:text-[10px] uppercase tracking-widest">
                        {appointment.clinicName || "Medical Center"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                    <div className="p-4 md:p-5 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Date</span>
                      <p className="font-bold text-slate-800 text-base md:text-lg">{appointment.date}</p>
                    </div>
                    <div className="p-4 md:p-5 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Time</span>
                      <p className="font-bold text-slate-800 text-base md:text-lg">{appointment.time}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate("/patient/appointments")}
                    className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                  >
                    View All Appointments
                  </button>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-12 text-center">
                  <p className="text-slate-400 font-bold mb-4">No scheduled visits found.</p>
                  <button onClick={() => navigate("/doctors")} className="text-blue-600 font-black text-[10px] uppercase tracking-widest underline decoration-2 underline-offset-4">Book Appointment</button>
                </div>
              )}
            </section>

            {/* MEDICAL RECORDS */}
            <section className="space-y-4">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <div className="h-1 w-3 bg-emerald-500 rounded-full"></div> Recent Prescriptions
              </h3>
              <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm">
                {prescriptions.length > 0 ? (
                  <div className="space-y-2">
                    {prescriptions.slice(0, 3).map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 md:p-4 hover:bg-slate-50 rounded-xl md:rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="h-9 w-9 md:h-10 md:w-10 bg-emerald-50 text-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                             <FileText size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs md:text-sm">{p.medicineName}</p>
                            <p className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{p.dosage}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 md:py-12">
                     <p className="text-slate-300 font-bold text-sm">No records available.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
