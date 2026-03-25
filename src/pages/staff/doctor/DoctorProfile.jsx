import React, { useEffect, useState, useCallback } from "react";
import DoctorSidebar from "./DoctorSidebar";
import axios from "axios";
import { Loader2, User, Phone, Mail, Award, DollarSign, Building, Save, AlertCircle } from "lucide-react";

export default function DoctorProfile() {
  const token = localStorage.getItem("token");

  // Aligned with Backend: qualification instead of degree, fee instead of fees
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    specialization: "",
    qualification: "", 
    fee: 0,
    phone: "",
    clinicName: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const axiosConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  // 🔹 Fetch Doctor Profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("No authentication token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:8080/doctor/profile",
          axiosConfig()
        );
        
        const data = res.data;
        // Data mapping to match UI keys
        setProfile({
          ...data,
          clinicName: data.clinicName || data.clinic?.name || "",
          // Ensure we map backend field names to our state names
          qualification: data.qualification || data.degree || "",
          fee: data.fee || data.fees || 0
        });
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Could not load profile. Your session may have expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, axiosConfig]);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 Save Profile
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await axios.put(
        "http://localhost:8080/doctor/profile",
        profile,
        axiosConfig()
      );
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      // FIX: Extracting string message to prevent React rendering errors
      const errorMsg = err.response?.data?.message || err.response?.data || "Failed to update profile.";
      setError(typeof errorMsg === "object" ? "Server Error: Check Console" : errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DoctorSidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Doctor Profile</h2>
              <p className="text-gray-500 text-sm">Update your public information and clinical settings</p>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </header>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-40 relative">
              <div className="absolute -bottom-16 left-10 flex items-end gap-6">
                <div className="relative group">
                    <img
                      src={profile.image || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                      alt="Doctor"
                      className="w-36 h-36 rounded-3xl border-8 border-white object-cover bg-white shadow-xl transition-transform group-hover:scale-[1.02]"
                    />
                </div>
                <div className="mb-4 ">
                  <h3 className="text-2xl font-black text-black mt-16 drop-shadow-md">
  {profile.name || "Dr. Name"}
</h3>
                  <div className="flex gap-1">
                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {profile.specialization || "General Physician"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-24 p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                
                {/* Column 1: Identity */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">Personal Identity</h4>
                  
                  <label className="block">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 mb-2">
                      <User size={12} /> Full Name
                    </span>
                    <input
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. John Doe"
                      className="w-full border-gray-100 border-2 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 font-semibold text-gray-700 transition-all"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 mb-2">
                      <Mail size={12} /> Work Email
                    </span>
                    <input
                      name="email"
                      value={profile.email}
                      disabled
                      className="w-full border-gray-100 border-2 p-3.5 rounded-2xl bg-gray-100/50 cursor-not-allowed text-gray-400 font-medium"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 mb-2">
                      <Phone size={12} /> Contact Number
                    </span>
                    <input
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full border-gray-100 border-2 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 font-semibold text-gray-700 transition-all"
                    />
                  </label>
                </div>

                {/* Column 2: Clinical Data */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">Clinical Details</h4>

                  <label className="block">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 mb-2">
                      <Award size={12} /> Professional Qualification
                    </span>
                    <input
                      name="qualification"
                      value={profile.qualification}
                      onChange={handleChange}
                      placeholder="e.g. MBBS, MD (Cardiology)"
                      className="w-full border-gray-100 border-2 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 font-semibold text-gray-700 transition-all"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 mb-2">
                      <Building size={12} /> Primary Clinic
                    </span>
                    <input
                      name="clinicName"
                      value={profile.clinicName}
                      onChange={handleChange}
                      className="w-full border-gray-100 border-2 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 font-semibold text-gray-700 transition-all"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 mb-2">
                      <DollarSign size={12} /> Consultation Fee ($)
                    </span>
                    <input
                      name="fee"
                      type="number"
                      value={profile.fee}
                      onChange={handleChange}
                      className="w-full border-gray-100 border-2 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50 font-semibold text-gray-700 transition-all"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
                <p className="text-xs text-gray-400 max-w-sm">
                  * All changes reflect immediately on the patient booking portal.
                </p>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-3 disabled:bg-gray-300 active:scale-[0.98]"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {saving ? "Updating..." : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}