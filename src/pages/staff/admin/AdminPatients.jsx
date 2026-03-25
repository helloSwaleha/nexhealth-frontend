import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { Search, MapPin, Phone, User, Loader2 } from "lucide-react";

export default function AdminPatients() {
  const token = localStorage.getItem("token");
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // 🔹 Fetch patients with search
  const fetchPatients = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/admin/patients?search=${search}`, axiosConfig)
      .then((res) => setPatients(res.data))
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Patient Directory</h1>
            <p className="text-gray-500 mt-1">Review registered patient details and contact info</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search name, email, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm md:w-80"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin text-blue-500" size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Contact Information</th>
                  <th className="px-6 py-4">Location (City)</th>
                  <th className="px-6 py-4">Gender</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {patients.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-20 text-gray-500 font-medium">
                      No patient records found.
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Patient Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold">
                            {p.name?.charAt(0) || <User size={18} />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{p.name ?? "N/A"}</p>
                            <p className="text-[10px] text-gray-400 font-mono tracking-tighter">ID: #{p.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="text-gray-400">@</span> {p.email ?? "N/A"}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Phone size={12} className="text-gray-400" /> {p.phone ?? "N/A"}
                          </p>
                        </div>
                      </td>

                      {/* City - ✅ NEW FIELD */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                          <MapPin size={14} className="text-blue-400" />
                          {p.city || "Not Provided"}
                        </div>
                      </td>

                      {/* Gender */}
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-bold text-[10px] uppercase tracking-wide">
                          {p.gender || "N/A"}
                        </span>
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