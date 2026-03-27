import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { Plus, Eye, Power, MapPin, Building2, Search, CheckCircle, XCircle } from "lucide-react";
import API_BASE_URL from '../apiConfig';

export default function AdminClinics() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* ================= FETCH CLINICS ================= */
  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "${API_BASE_URL}/admin/clinics",
        axiosConfig
      );
      setClinics(res.data);
    } catch (error) {
      console.error("Error fetching clinics:", error);
      // If token is expired, you might want to redirect to login
      if (error.response?.status === 403 || error.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOGGLE CLINIC STATUS ================= */
  const toggleStatus = async (clinic) => {
    const isActivating = clinic.status !== "ACTIVE";
    const newStatus = isActivating ? "ACTIVE" : "INACTIVE";

    // Confirmation for deactivation
    if (!isActivating) {
      const confirmDeactivate = window.confirm(
        `Are you sure you want to deactivate "${clinic.name}"? This clinic will be hidden from all patients immediately.`
      );
      if (!confirmDeactivate) return;
    }

    try {
      // Backend Call: PUT ${API_BASE_URL}/admin/clinics/{id}/status?status=ACTIVE/INACTIVE
      await axios.put(
        `${API_BASE_URL}/admin/clinics/${clinic.id}/status?status=${newStatus}`,
        {},
        axiosConfig
      );

      // ✅ Update Local State directly for instant UI feedback
      setClinics((prevClinics) =>
        prevClinics.map((c) =>
          c.id === clinic.id ? { ...c, status: newStatus } : c
        )
      );

      console.log(`Clinic ${clinic.name} is now ${newStatus}`);
    } catch (error) {
      console.error("Error updating clinic status:", error);
      alert("Failed to update clinic status. Please check backend connection.");
    }
  };

  // Filter for the admin search bar
  const filteredClinics = clinics.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinics Registry</h1>
            <p className="text-slate-500 font-medium">Control clinic visibility and system access</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search clinics..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate("/admin/clinics/add")}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm whitespace-nowrap"
            >
              <Plus size={18} /> Add Clinic
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-[0.1em]">
                <th className="px-8 py-5">Clinic Details</th>
                <th className="px-8 py-5">Location</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Visibility Control</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-slate-400 font-bold text-sm">Fetching registry...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredClinics.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-400 font-medium">
                    No clinics match your criteria.
                  </td>
                </tr>
              ) : (
                filteredClinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${clinic.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                          <Building2 size={22} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{clinic.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{clinic.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={14} className="text-slate-300" />
                        <span className="text-sm font-semibold">{clinic.city}, {clinic.state}</span>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center">
                        <span
                          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            clinic.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}
                        >
                          {clinic.status === "ACTIVE" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {clinic.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/clinics/${clinic.id}`)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                        
                        <button
                          onClick={() => toggleStatus(clinic)}
                          className={`p-2.5 rounded-xl transition-all shadow-sm ${
                            clinic.status === "ACTIVE"
                              ? "bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white hover:shadow-rose-200"
                              : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-100"
                          }`}
                          title={clinic.status === "ACTIVE" ? "Click to Deactivate" : "Click to Activate"}
                        >
                          <Power size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}