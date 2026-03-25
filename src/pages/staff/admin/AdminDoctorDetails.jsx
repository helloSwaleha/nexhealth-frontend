import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Award, 
  DollarSign, 
  Building2, 
  GraduationCap,
  User,
  Stethoscope,
  Power,
  PowerOff
} from "lucide-react";

export default function AdminDoctorDetails() {
  const { doctorId } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosConfig = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  const fetchDoctorDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/admin/doctors/${doctorId}`, axiosConfig);
      console.log("Doctor Data Received:", res.data); // Helpful for checking clinic field names
      setDoctor(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching doctor:", err);
      setError("Doctor not found or server error.");
    } finally {
      setLoading(false);
    }
  }, [doctorId, axiosConfig]);

  useEffect(() => {
    if (doctorId && doctorId !== "undefined") {
      fetchDoctorDetails();
    } else {
      setError("Invalid Doctor ID.");
      setLoading(false);
    }
  }, [doctorId, fetchDoctorDetails]);

  /**
   * ✅ Deactivate / Activate Logic
   * Matches the backend PutMapping: /admin/doctors/{id}/status?status=...
   */
  const handleToggleStatus = async () => {
    if (!doctor) return;

    const currentStatus = (doctor.status || "ACTIVE").toUpperCase();
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const confirmMsg = `Are you sure you want to ${newStatus === "INACTIVE" ? "deactivate" : "activate"} Dr. ${doctor.name}?`;

    if (window.confirm(confirmMsg)) {
      try {
        await axios.put(
          `http://localhost:8080/admin/doctors/${doctor.id}/status?status=${newStatus}`,
          {}, 
          axiosConfig
        );
        // Update local state so UI reflects the change immediately
        setDoctor(prev => ({ ...prev, status: newStatus }));
        alert(`Doctor status updated to ${newStatus}`);
      } catch (err) {
        console.error("Failed to update status:", err);
        alert("Error updating status. Please try again.");
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !doctor) return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{error || "Doctor not found"}</h2>
        <button onClick={() => navigate("/admin/doctors")} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          Back to Directory
        </button>
      </main>
    </div>
  );

  const isActive = doctor.status?.toUpperCase() === "ACTIVE";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <button 
          onClick={() => navigate("/admin/doctors")}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-6 font-semibold"
        >
          <ArrowLeft size={20} /> Back to Directory
        </button>

        <div className="max-w-4xl bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className={`p-10 text-white transition-colors duration-500 ${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-700" : "bg-gradient-to-r from-gray-600 to-gray-700"}`}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-28 h-28 bg-white/20 rounded-3xl flex items-center justify-center text-4xl font-bold backdrop-blur-md border border-white/30">
                {doctor.name?.charAt(0) || "D"}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-black mb-2 tracking-tight">Dr. {doctor.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                  <p className="opacity-90 flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg text-sm">
                    <Stethoscope size={16} /> {doctor.specialization || "Specialist"}
                  </p>
                  <p className="opacity-90 flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg text-sm">
                    <GraduationCap size={16} /> {doctor.qualification || "Qualification"}
                  </p>
                </div>
                <div className="mt-4">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? "bg-green-400 text-green-950" : "bg-red-400 text-red-950"}`}>
                    {doctor.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-10">
            <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-b pb-2">Medical Profile Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-10">
                <DetailItem icon={<Mail size={20} />} label="Email Address" value={doctor.email} />
                <DetailItem icon={<Phone size={20} />} label="Phone Number" value={doctor.phone || doctor.mobile} />
                <DetailItem icon={<Award size={20} />} label="Experience" value={`${doctor.experience || 0} Years`} />
              </div>

              <div className="space-y-10">
                {/* 🔹 Logic to show clinic: matches Doctor -> Clinic structure */}
                <DetailItem 
                   icon={<Building2 size={20} />} 
                   label="Affiliated Clinic" 
                   value={doctor.clinic?.name || doctor.clinic?.clinicName || doctor.clinicName || "Not Assigned"} 
                />
                <DetailItem 
                   icon={<DollarSign size={20} />} 
                   label="Consultation Fee" 
                   value={`₹ ${doctor.consultationFee || doctor.fee || '0'}`} 
                />
                <DetailItem 
                   icon={<Stethoscope size={20} />} 
                   label="Specialization" 
                   value={doctor.specialization} 
                />
              </div>
            </div>
          </div>

          
        </div>
      </main>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-gray-900 font-bold text-lg">{value || "N/A"}</p>
      </div>
    </div>
  );
}