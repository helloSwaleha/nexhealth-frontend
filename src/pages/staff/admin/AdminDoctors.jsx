import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Activity, MoreVertical, ExternalLink, Search, X } from "lucide-react";
import API_BASE_URL from '../../../apiConfig';

export default function AdminDoctors() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 New state for search

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("${API_BASE_URL}/admin/doctors", axiosConfig)
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  // 🔹 Real-time Filtering Logic
  const filteredDoctors = doctors.filter((doc) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      doc.name?.toLowerCase().includes(searchLower) ||
      (doc.clinicName || doc.clinic?.name || "").toLowerCase().includes(searchLower) ||
      doc.specialization?.toLowerCase().includes(searchLower)
    );
  });

  const toggleDoctorStatus = (doctor) => {
    const currentStatus = (doctor.status || "ACTIVE").toUpperCase();
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    axios
      .put(
        `${API_BASE_URL}/admin/doctors/${doctor.id}/status?status=${newStatus}`,
        {}, 
        axiosConfig
      )
      .then(() => {
        setDoctors((prev) =>
          prev.map((doc) =>
            doc.id === doctor.id ? { ...doc, status: newStatus } : doc
          )
        );
      })
      .catch((err) => {
        console.error("Failed to update status:", err);
        alert("Failed to update doctor status");
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Doctors Directory</h1>
            <p className="text-gray-500 mt-1">Manage all registered medical professionals</p>
          </div>
          <button
            onClick={() => navigate("/admin/doctors/add")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
          >
            + Register New Doctor
          </button>
        </div>

        {/* 🔍 Search Bar Section */}
        <div className="mb-6 relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, clinic, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-6 py-4">Doctor Info</th>
                  <th>Clinic</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th className="text-center">Operations</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 font-medium">Loading medical data...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredDoctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-20 text-gray-500 font-medium">
                      {searchQuery ? `No results found for "${searchQuery}"` : "No doctors found in the database."}
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                            {doc.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.experience} Years Exp.</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="text-gray-600 font-medium text-sm">
                        <div className="flex items-center gap-1">
                          <Activity size={14} className="text-blue-400" />
                          {doc.clinicName || doc.clinic?.name || "N/A"}
                        </div>
                      </td>

                      <td className="text-gray-600 text-sm">
                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-semibold text-[11px]">
                          {doc.specialization || "General"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            doc.status?.toUpperCase() === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {doc.status || "ACTIVE"}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => navigate(`/admin/doctors/${doc.id}`)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm transition"
                          >
                            <ExternalLink size={14} /> View
                          </button>

                          <button
                            onClick={() => toggleDoctorStatus(doc)}
                            className={`text-sm font-bold transition px-3 py-1 rounded-lg border ${
                              doc.status?.toUpperCase() === "ACTIVE"
                                ? "text-red-600 border-red-100 hover:bg-red-50"
                                : "text-green-600 border-green-100 hover:bg-green-50"
                            }`}
                          >
                            {doc.status?.toUpperCase() === "ACTIVE" ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}