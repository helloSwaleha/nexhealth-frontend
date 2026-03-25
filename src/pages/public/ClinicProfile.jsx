import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  MapPin, 
  Clock, 
  Star, 
  UserRound, 
  GraduationCap, 
  Banknote, 
  Stethoscope, 
  ChevronLeft,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function ClinicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // 1. Fetch Clinic Details and Doctors in parallel
        const [clinicRes, doctorsRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/clinics/${id}`, config),
          axios.get(`http://localhost:8080/api/doctors/clinic/${id}`, config)
        ]);

        // 2. CHECK CLINIC STATUS: If clinic itself is inactive, show error
        if (clinicRes.data.status !== "ACTIVE") {
          setError("This clinic is currently not accepting appointments.");
          return;
        }

        setClinic(clinicRes.data);

        // 3. ✅ FILTER DOCTORS: Only show doctors whose status is exactly "ACTIVE"
        const activeDoctors = (doctorsRes.data || []).filter(
          (doc) => doc.status === "ACTIVE"
        );
        setDoctors(activeDoctors);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to load profile. Please ensure the server is running.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClinicData();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-slate-500 font-bold tracking-tight uppercase text-xs">Loading Medical Profile</p>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-white p-10 rounded-[2.5rem] text-center shadow-xl shadow-blue-900/5 max-w-md border border-slate-100">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={50} />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Notice</h2>
          <p className="text-slate-500 font-medium mb-6">{error || "Clinic profile not found."}</p>
          <button 
            onClick={() => navigate("/doctors")} 
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mx-auto"
          >
            <ChevronLeft size={18} /> Return to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 mt-8">
      {/* --- CLINIC BRANDING HEADER --- */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
          >
            <ChevronLeft size={16} /> Back to Directory
          </button>

          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            {/* Image Section */}
            <div className="w-full md:w-1/3 lg:w-1/4 aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-50 relative group">
              <img
                src={clinic.imagePath ? `http://localhost:8080/${clinic.imagePath}` : (clinic.imageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000")}
                alt={clinic.clinicName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <span className="bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-200">
                  Verified Facility
                </span>
                <div className="flex items-center text-amber-500 font-black bg-amber-50 px-4 py-1.5 rounded-full text-xs border border-amber-100">
                  <Star size={14} className="fill-current mr-1.5" /> {clinic.rating || "4.9"}
                </div>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                {clinic.clinicName || clinic.name}
              </h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-2xl">
                <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100"><MapPin size={22} /></div>
                  <div className="text-left">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Clinic Address</p>
                    <p className="text-slate-800 font-bold leading-tight text-sm">{clinic.clinicAddress || clinic.address || clinic.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100"><Clock size={22} /></div>
                  <div className="text-left">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Visiting Hours</p>
                    <p className="text-slate-800 font-bold leading-tight text-sm">{clinic.opdTime || "10:00 AM - 08:00 PM"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SPECIALISTS GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-blue-600 mb-1">
                <Stethoscope size={24} />
                <span className="font-black text-[10px] uppercase tracking-[0.3em]">Our Medical Team</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Available Specialists</h2>
          </div>
          <div className="bg-white border border-slate-100 px-8 py-4 rounded-[2rem] shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-lg">{doctors.length}</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Active<br/>Doctors</p>
          </div>
        </div>

        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="group bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Stethoscope size={80} className="text-blue-600" />
                </div>

                <div className="flex flex-col items-center text-center mb-8">
                  <div className="h-28 w-28 rounded-[2rem] bg-gradient-to-br from-slate-50 to-slate-100 p-1 mb-6 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-white flex items-center justify-center text-slate-300">
                        {doctor.imagePath ? (
                            <img 
                              src={`http://localhost:8080/${doctor.imagePath}`} 
                              alt={doctor.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Doctor"; }}
                            />
                        ) : <UserRound size={48} />}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {doctor.name?.startsWith("Dr.") ? doctor.name : ` ${doctor.name}`}
                  </h3>
                  <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-2">{doctor.specialization || "General Physician"}</p>
                </div>
                
                <div className="space-y-5 mb-10">
                  <div className="flex items-center justify-center gap-3 text-slate-500 font-bold text-sm bg-slate-50 py-3 rounded-2xl">
                    <GraduationCap size={20} className="text-slate-400" />
                    <span>{doctor.qualification || doctor.degree || "Specialist"}</span>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Banknote size={18} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee</span>
                    </div>
                    <span className="text-slate-900 font-black text-2xl">₹{doctor.fee || doctor.consultationFee || "500"}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/book/${clinic.id}/${doctor.id}`)}
                  className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-24 text-center rounded-[4rem] border-4 border-dashed border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <UserRound size={48} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">No Specialists Available</h3>
            <p className="text-slate-400 max-w-sm mx-auto font-medium">Currently, there are no active specialists available at this clinic. Please check back later or contact the clinic directly.</p>
          </div>
        )}
      </div>
    </div>
  );
}