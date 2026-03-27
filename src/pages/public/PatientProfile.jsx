import React, { useState, useEffect } from "react";
import { 
  User, Mail, Phone, MapPin, Edit3, Save, X, 
  ChevronLeft, Loader2, Camera, ShieldCheck, HeartPulse,
  Calendar, Activity, Hash
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from '../../apiConfig';

export default function PatientProfile() {
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("userId");

  // Axios Global Config for this page
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    if (patientId) {
      fetchProfile();
    } else {
      setLoading(false);
      setMessage({ type: "error", text: "Session expired. Please log in." });
    }
  }, [patientId]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/patients/${patientId}`, config);
      setPatient(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Error fetching profile", err);
      setMessage({ type: "error", text: "Unable to reach medical server." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_BASE_URL}/api/patients/${patientId}`, formData, config);
      setPatient(res.data); // Update main state with fresh DB data
      setIsEditing(false);
      setMessage({ type: "success", text: "Medical profile synchronized successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      setMessage({ type: "error", text: "Update failed. Please verify your connection." });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Verifying Identity...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="group flex items-center gap-2 text-slate-400 font-bold text-sm mb-4 hover:text-slate-900 transition-all"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              Return to Dashboard
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Patient Profile</h1>
          </div>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm ${
              isEditing ? "bg-slate-200 text-slate-600" : "bg-slate-900 text-white hover:bg-blue-600 hover:-translate-y-1"
            }`}
          >
            {isEditing ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Update Info</>}
          </button>
        </div>

        {message.text && (
          <div className={`p-5 rounded-[2rem] mb-8 font-bold text-sm flex items-center gap-3 animate-bounce shadow-sm ${
            message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
          }`}>
            <ShieldCheck size={20} /> {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="h-40 w-40 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-[3.5rem] flex items-center justify-center text-slate-300 overflow-hidden border-8 border-white shadow-xl">
                  {patient?.imageUrl ? (
                    <img src={patient.imageUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User size={80} className="opacity-20" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-blue-600 p-3 rounded-2xl shadow-lg text-white hover:scale-110 transition-all border-4 border-white">
                    <Camera size={20} />
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">{patient?.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest px-4 py-1 bg-blue-50 rounded-full">
                  Verified Patient
                </span>
              </div>
            </div>

            {/* Health Overview Card */}
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <Activity className="absolute -right-4 -top-4 text-white/5" size={120} />
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 opacity-50 relative z-10">Vital Statistics</h3>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                  <Hash className="text-blue-400 mb-2" size={20} />
                  <p className="text-[10px] font-bold opacity-60 uppercase">Age</p>
                  <p className="font-black text-lg">{patient?.age || "N/A"} <span className="text-[10px] opacity-40">yrs</span></p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl">
                  <HeartPulse className="text-red-400 mb-2" size={20} />
                  <p className="text-[10px] font-bold opacity-60 uppercase">Status</p>
                  <p className="font-black text-lg uppercase tracking-tighter">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Column: Form */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 md:p-14 rounded-[3.5rem] border border-slate-200 shadow-sm">
              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Name */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Legal Full Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        disabled={!isEditing}
                        value={formData.name || ""}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-0 transition-all disabled:opacity-70"
                      />
                    </div>
                  </div>

                  {/* Age (Mapped to your age field) */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Age</label>
                    <div className="relative">
                      <Activity className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        disabled={!isEditing}
                        type="number"
                        value={formData.age || ""}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-0 transition-all disabled:opacity-70"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        disabled={!isEditing}
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-0 transition-all disabled:opacity-70"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Primary Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        disabled={!isEditing}
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-0 transition-all disabled:opacity-70"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Location / City</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        disabled={!isEditing}
                        value={formData.city || ""}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-0 transition-all disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                    <button 
                      type="submit"
                      className="w-full flex items-center justify-center gap-3 px-10 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-100"
                    >
                      <Save size={20} /> Save My Records
                    </button>
                    <p className="text-center text-slate-400 font-bold text-[9px] uppercase tracking-widest">
                      Encrypted End-to-End • Medical Grade Security
                    </p>
                  </div>
                )}
              </form>

              {!isEditing && (
                <div className="mt-12 pt-12 border-t border-slate-100 grid md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <Calendar size={24} />
                    </div>
                    
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}