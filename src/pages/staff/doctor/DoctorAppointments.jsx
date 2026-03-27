import React, { useEffect, useState } from "react";
import DoctorSidebar from "./DoctorSidebar";
import { CheckCircle, XCircle, FileText, Loader2, Calendar, Send, X, Clock, Search } from "lucide-react"; // Added Search icon
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from '../apiConfig';

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  
  // New Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState("");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, [token, navigate]);

  const fetchAppointments = () => {
    axios
      .get("${API_BASE_URL}/appointments/doctor", axiosConfig)
      .then((res) => {
        const rawData = res.data || [];
        const sortedData = [...rawData].sort((a, b) => {
          const statusOrder = { "PENDING": 1, "BOOKED": 1, "CONFIRMED": 1, "COMPLETED": 2, "CANCELLED": 3 };
          const statusA = a.status?.toUpperCase() || "";
          const statusB = b.status?.toUpperCase() || "";

          if (statusOrder[statusA] !== statusOrder[statusB]) {
            return (statusOrder[statusA] || 99) - (statusOrder[statusB] || 99);
          }
          return new Date(b.date) - new Date(a.date);
        });

        setAppointments(sortedData);
      })
      .catch((err) => setError("Failed to load medical timeline."))
      .finally(() => setLoading(false));
  };

  // 🔹 FILTER LOGIC: Updates live based on searchTerm
  const filteredAppointments = appointments.filter((appt) => {
    const nameMatch = appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = (appt.id || appt.appointmentId)?.toString().includes(searchTerm);
    return nameMatch || idMatch;
  });

  const openPrescriptionModal = (appt) => {
    setSelectedAppt(appt);
    setPrescriptionText("");
    setShowPrescriptionModal(true);
  };

  const handleCompleteWithPrescription = async () => {
    if (!prescriptionText.trim()) return alert("Please provide clinical notes.");
    const aId = selectedAppt.id || selectedAppt.appointmentId;
    const prescriptionPayload = {
      appointmentId: aId,
      medication: "As per notes", 
      dosage: "Check clinical advice",
      notes: prescriptionText,
    };

    try {
      setActionLoading(aId);
      await axios.post(`${API_BASE_URL}/api/doctor/prescriptions`, prescriptionPayload, axiosConfig);
      setAppointments((prev) =>
        prev.map((appt) =>
          (appt.id === aId || appt.appointmentId === aId) 
          ? { ...appt, status: "COMPLETED" } : appt
        )
      );
      setShowPrescriptionModal(false);
      alert("Visit Finalized Successfully!");
      fetchAppointments();
    } catch (error) {
      alert("Error: Database rejected the update.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Mark this appointment as CANCELLED?")) return;
    try {
      setActionLoading(appointmentId);
      await axios.put(`${API_BASE_URL}/appointments/${appointmentId}/doctor-cancel`, {}, axiosConfig);
      fetchAppointments();
    } catch (error) {
      alert("Cancellation failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const statusStyle = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "COMPLETED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200 shadow-sm";
      case "CANCELLED": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />
      <main className="flex-1 flex flex-col items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <DoctorSidebar />
      <main className="flex-1 p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header & Search Bar Container */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Doctor Dashboard</h1>
                  <p className="text-slate-500 font-medium">Manage your patient visits and history</p>
              </div>
              
              {/* 🔹 SEARCH INPUT COMPONENT */}
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Search patient or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm font-medium text-slate-700"
                />
              </div>
          </div>

          <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-200 rounded-[2.5rem] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-8 py-6">Patient</th>
                  <th>Appointment Time</th>
                  <th>Status</th>
                  <th className="text-center px-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* 🔹 CHANGED: map through filteredAppointments instead of appointments */}
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => {
                    const aId = appt.id || appt.appointmentId;
                    const isPending = ["PENDING", "BOOKED", "CONFIRMED"].includes(appt.status?.toUpperCase());

                    return (
                      <tr key={aId} className={`transition-all ${isPending ? "bg-white" : "bg-slate-50/50 grayscale-[0.5]"}`}>
                        <td className="px-8 py-6">
                          <p className="font-bold text-slate-900 text-lg">{appt.patientName}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: #{aId}</p>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <Clock size={14} className="text-blue-500" />
                            {appt.date} <span className="text-slate-300 font-normal">|</span> {appt.time}
                          </div>
                        </td>
                        <td>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border-2 ${statusStyle(appt.status)}`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="py-6 px-8">
                          <div className="flex justify-center gap-4">
                            {isPending ? (
                              <>
                                <button 
                                  onClick={() => openPrescriptionModal(appt)} 
                                  className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-wider border border-emerald-100"
                                >
                                  <CheckCircle size={14} /> Complete Visit
                                </button>
                                <button 
                                  onClick={() => handleCancel(aId)} 
                                  className="flex items-center gap-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-wider border border-rose-100"
                                >
                                  <XCircle size={14} /> Cancel
                                </button>
                              </>
                            ) : (
                              <span className="text-slate-400 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest py-2 px-4 bg-slate-100 rounded-xl">
                                <FileText size={14} /> Logged
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  // Empty State for no search results
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-slate-400 font-medium italic">
                      No appointments found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL REMAINS THE SAME --- */}
        {showPrescriptionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">E-Prescription</h2>
                  <p className="text-xs text-blue-600 font-black uppercase tracking-[0.2em] mt-1">Patient: {selectedAppt?.patientName}</p>
                </div>
                <button onClick={() => setShowPrescriptionModal(false)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all shadow-sm">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-10">
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-4">Medication, Dosage & Clinical Notes</label>
                <textarea
                  rows="7"
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  placeholder="E.g. Paracetamol 500mg..."
                  className="w-full p-8 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] outline-none font-bold text-slate-700 transition-all resize-none text-lg shadow-inner"
                />
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-400 max-w-[200px] leading-tight">By submitting, this appointment will be marked as COMPLETED.</p>
                <button
                  disabled={actionLoading}
                  onClick={handleCompleteWithPrescription}
                  className="flex items-center gap-4 bg-slate-900 hover:bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <><Send size={18} /> Finish Session</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}