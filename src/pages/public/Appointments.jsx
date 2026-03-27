import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, Clock, Loader2, ChevronLeft, 
  CheckCircle2, FileText, ChevronDown, ChevronUp
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from '../apiConfig';


export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("UPCOMING");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); 
  
  // 🔹 Prescriptions state
  const [prescriptions, setPrescriptions] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("userId");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchAppointmentsAndPrescriptions = async () => {
    setLoading(true);
    try {
      // 1. Fetch Appointments
      const apptRes = await axios.get(
        `${API_BASE_URL}/appointments/patient/${patientId}`,
        authHeader
      );
      const appts = apptRes.data;
      setAppointments(appts);

      // 2. ⚡ FAST FETCH: Get prescriptions for all COMPLETED appointments immediately
      const completedAppts = appts.filter(a => a.status === "COMPLETED");
      
      // Run all requests in parallel for maximum speed
      const prescriptionPromises = completedAppts.map(appt => 
        axios.get(`${API_BASE_URL}/api/doctor/prescriptions/appointment/${appt.id}`, authHeader)
          .then(res => ({ id: appt.id, data: res.data }))
          .catch(() => null) // Ignore errors for individual missing prescriptions
      );

      const results = await Promise.all(prescriptionPromises);
      const prescriptionMap = {};
      results.forEach(res => {
        if (res) prescriptionMap[res.id] = res.data;
      });
      
      setPrescriptions(prescriptionMap);
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchAppointmentsAndPrescriptions();
  }, [patientId]);

  const filteredAppointments = appointments.filter((appt) => {
    const status = appt.status?.toUpperCase();
    if (activeTab === "UPCOMING") return ["BOOKED", "PENDING", "CONFIRMED"].includes(status);
    if (activeTab === "COMPLETED") return status === "COMPLETED";
    if (activeTab === "CANCELLED") return status === "CANCELLED";
    return false;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
      case "COMPLETED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "CANCELLED": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold mb-4 hover:text-slate-900 transition-all text-xs uppercase tracking-widest">
              <ChevronLeft size={16} /> Back
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Medical Timeline</h1>
          </div>
          
          <div className="flex p-1.5 bg-white rounded-2xl shadow-sm border border-slate-200 w-fit">
            {["UPCOMING", "COMPLETED", "CANCELLED"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setExpandedId(null); }}
                className={`px-6 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all ${
                  activeTab === tab ? "bg-slate-900 text-white shadow-md scale-105" : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="grid gap-6">
          {filteredAppointments.map((appt) => (
            <div key={appt.id} className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden transition-all">
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6 w-full">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${appt.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                    {appt.status === "COMPLETED" ? <CheckCircle2 size={28} /> : <Calendar size={28} />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-black text-slate-900"> {appt.doctorName}</h2>
                      <span className={`px-3 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-tighter ${getStatusStyle(appt.status)}`}>
                        {appt.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 text-slate-500 font-bold text-xs">
                      <div className="flex items-center gap-1"><Calendar size={14} className="text-blue-500" /> {appt.date}</div>
                      <div className="flex items-center gap-1"><Clock size={14} className="text-blue-500" /> {appt.time}</div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  {appt.status === "COMPLETED" && (
                    <button 
                      onClick={() => setExpandedId(expandedId === appt.id ? null : appt.id)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
                    >
                      <FileText size={14} />
                      {expandedId === appt.id ? "Close" : "View Prescription"}
                    </button>
                  )}
                </div>
              </div>

              {/* ⚡ INSTANT VIEW: Data is already in state */}
              {expandedId === appt.id && (
                <div className="px-8 pb-8 pt-0">
                  <div className="bg-blue-50/50 p-6 rounded-[1.5rem] border border-blue-100">
                    {prescriptions[appt.id] ? (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                          <p className="text-[10px] uppercase font-black text-blue-500 mb-2">Medication Detail</p>
                          <p className="text-slate-900 font-bold text-lg mb-1">{prescriptions[appt.id].medication}</p>
                          <p className="text-slate-500 text-sm italic mb-4">Dosage: {prescriptions[appt.id].dosage}</p>
                          
                          <hr className="my-3 border-slate-100" />
                          
                          <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Doctor's Advice</p>
                          <p className="text-slate-700 font-medium italic">"{prescriptions[appt.id].notes}"</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-xs italic py-4">No clinical record available for this visit.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}