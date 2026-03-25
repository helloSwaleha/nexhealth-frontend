import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { MapPin, Star, Stethoscope, Search, X, AlertCircle, ChevronLeft } from "lucide-react";

export default function Doctors() {
  const navigate = useNavigate();
  const location = useLocation();

  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState(location.state?.initialSearch || "");
  const [locationTerm, setLocationTerm] = useState(location.state?.initialLocation || "");

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        // Ensure this endpoint returns the 'status' field for each clinic
        const res = await axios.get("http://localhost:8080/api/clinics");
        setClinics(res.data);
      } catch (err) {
        console.error("Error fetching clinics:", err);
        setError("Failed to connect to medical database.");
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  // ✅ FIXED FILTER LOGIC
  const filteredClinics = clinics.filter((clinic) => {
    // 1. STATUS CHECK: If a clinic is not ACTIVE, do not show it to patients
    if (clinic.status !== "ACTIVE") {
      return false;
    }

    const searchLower = searchTerm.toLowerCase();
    const locationLower = locationTerm.toLowerCase();

    // 2. SEARCH & LOCATION MATCHING
    const matchesName = 
      (clinic.clinicName || clinic.name || "").toLowerCase().includes(searchLower);
    
    const matchesLocation = 
      (clinic.clinicAddress || clinic.city || clinic.location || "").toLowerCase().includes(locationLower);

    return matchesName && matchesLocation;
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-red-100">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">{error}</h2>
          <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 font-bold hover:underline">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-8">
      {/* Header & Search Bar Section */}
      <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="text-center lg:text-left">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold mb-4 hover:text-slate-900 transition-all text-xs uppercase tracking-widest">
              <ChevronLeft size={16} /> Back
            </button>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Available Medical Centers
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Discover {filteredClinics.length} registered clinics in your area.
          </p>
        </div>

        {/* Search & Location Inputs */}
        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          <div className="relative group flex-1 md:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Clinic or Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm font-medium text-gray-800"
            />
            {searchTerm && <X size={16} onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" />}
          </div>

          <div className="relative group flex-1 md:w-64">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="City or Area..."
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm font-medium text-gray-800"
            />
            {locationTerm && <X size={16} onClick={() => setLocationTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" />}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 animate-pulse font-medium">Syncing with Medical Database...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 overflow-hidden border border-gray-100"
              >
                {/* Image Section */}
                <div className="relative h-52 overflow-hidden bg-gray-200">
                  <img
                    src={clinic.imagePath ? `http://localhost:8080/${clinic.imagePath}` : (clinic.imageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000")}
                    alt={clinic.clinicName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"; }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-sm border border-white/20">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-black text-gray-700">4.9</span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-7">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em] mb-2 block">
                    {clinic.specialization || "General Medical"}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                    {clinic.clinicName || clinic.name || "Unnamed Clinic"}
                  </h2>

                  <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                    <MapPin size={14} className="text-blue-400" />
                    <span className="text-sm font-medium truncate">
                      {clinic.clinicAddress || clinic.city || "Location N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Fee Starts At</p>
                      <p className="text-xl font-black text-green-600 italic">
                        ₹{clinic.consultationFee || clinic.fee || "500"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/clinic/profile/${clinic.id}`)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredClinics.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
              <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-blue-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">No results matched</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium">
                We couldn't find any <strong>Active</strong> medical centers matching "<strong>{searchTerm || locationTerm}</strong>".
              </p>
              <button 
                onClick={() => { setSearchTerm(""); setLocationTerm(""); }}
                className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}