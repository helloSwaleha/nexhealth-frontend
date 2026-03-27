import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Activity, Users, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import API_BASE_URL from '../../../apiConfig';

export default function AdminClinicDetails() {
  const { clinicId } = useParams();
  const token = localStorage.getItem("token");

  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* ================= FETCH DATA ================= */
  const fetchClinicData = async () => {
    try {
      setLoading(true);
      const [clinicRes, doctorsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/clinics/${clinicId}`, axiosConfig),
        axios.get(`${API_BASE_URL}/admin/clinics/${clinicId}/doctors`, axiosConfig)
      ]);

      setClinic(clinicRes.data);
      setDoctors(doctorsRes.data);
    } catch (error) {
      console.error("Error loading clinic details:", error);
      alert("Failed to load clinic details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicData();
  }, [clinicId]);

  /* ================= TOGGLE DOCTOR STATUS ================= */
  const toggleDoctorStatus = async (doctor) => {
    // 1. Determine new status
    const newStatus = doctor.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    try {
      // 2. FIXED: Added the ?status= query parameter to match backend requirements
      await axios.put(
        `${API_BASE_URL}/admin/doctors/${doctor.id}/status?status=${newStatus}`,
        {},
        axiosConfig
      );
      
      // 3. Instant local update for better UX
      setDoctors(prev => 
        prev.map(d => d.id === doctor.id ? { ...d, status: newStatus } : d)
      );
      
    } catch (error) {
      console.error("Error updating doctor status:", error);
      alert("Failed to update doctor status. Check console for details.");
    }
  };

  if (loading) return <div className="p-10 text-center text-blue-600 font-bold">Loading Clinic Data...</div>;
  if (!clinic) return <div className="p-10 text-center text-gray-500">Clinic not found</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Clinic Profile</h1>
      </div>

      {/* Clinic Details Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
        {/* FIXED: Image URL logic to handle backend image paths */}
        <img
          src={clinic.imagePath 
            ? `${API_BASE_URL}/${clinic.imagePath}` 
            : (clinic.imageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=300")}
          alt="Clinic"
          className="rounded-2xl w-40 h-40 object-cover border-4 border-gray-50 shadow-md"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=300" }}
        />

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{clinic.name}</h2>
              <p className="text-blue-600 font-medium">{clinic.email}</p>
            </div>
            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              clinic.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {clinic.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-600">
            <div>
              <p className="font-bold text-gray-400 uppercase text-[10px]">Contact</p>
              <p className="text-gray-800 font-semibold">{clinic.phone}</p>
            </div>
            <div>
              <p className="font-bold text-gray-400 uppercase text-[10px]">Location</p>
              <p className="text-gray-800 font-semibold">{clinic.address}, {clinic.city}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="text-blue-500" /> Assigned Medical Staff
            </h2>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold">
                {doctors.length} Doctors
            </span>
        </div>

        {doctors.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No doctors assigned to this clinic yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4 tracking-wider">Doctor</th>
                <th className="px-6 py-4 tracking-wider">Specialization</th>
                <th className="px-6 py-4 tracking-wider">Experience</th>
                <th className="px-6 py-4 tracking-wider">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{doc.name}</div>
                    <div className="text-xs text-gray-500">ID: #{doc.id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{doc.specialization}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{doc.experience} Years</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      doc.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleDoctorStatus(doc)}
                      className={`text-xs font-black uppercase tracking-tighter px-4 py-2 rounded-xl transition-all ${
                        doc.status === "ACTIVE" 
                          ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" 
                          : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                      }`}
                    >
                      {doc.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}