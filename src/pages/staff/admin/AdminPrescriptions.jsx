import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FileText, 
  Search, 
  Loader2, 
  User, 
  UserPlus, 
  Calendar, 
  Hash,
  AlertCircle
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import API_BASE_URL from '../../../apiConfig';


export default function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  // Fetch all records from the backend
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("${API_BASE_URL}/admin/prescriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Handle PDF View/Download
  const viewPdf = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/prescriptions/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important for binary data
      });

      // If backend sends 204, it means neither a saved PDF nor enough data to generate one exists
      if (response.status === 204) {
        alert("This prescription does not have a PDF file available.");
        return;
      }

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      
      // Create a temporary link to open in a new tab
      const link = document.createElement("a");
      link.href = fileURL;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up memory
      setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
    } catch (err) {
      console.error("PDF Load Error:", err);
      alert("Could not load PDF. Please ensure the backend is running.");
    }
  };

  // Filter logic for Search (By Patient ID, Doctor ID, or Record ID)
  const filteredData = prescriptions.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.patientId?.toString().includes(search) ||
      item.doctorId?.toString().includes(search) ||
      item.id?.toString().includes(search)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-blue-600" />
              Prescription Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              View generated medical documents and audit prescription logs.
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full md:w-80 bg-white shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Issued</p>
            <p className="text-2xl font-black text-slate-900">{prescriptions.length}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Record</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Patient</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Doctor</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date Created</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={32} />
                      <span className="text-slate-400 text-sm font-medium tracking-tight">Syncing Database...</span>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <AlertCircle className="mb-2 opacity-20" size={48} />
                        <span className="text-sm font-medium">No matching prescriptions found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Hash size={14} className="text-blue-600" />
                          </div>
                          <span className="font-mono text-sm font-bold text-slate-700">#{item.id}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          <span className="text-slate-900 font-bold text-sm underline decoration-slate-200 underline-offset-4">PID-{item.patientId}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <UserPlus size={14} className="text-blue-400" />
                          <span className="text-slate-700 font-semibold text-sm italic">DOC-{item.doctorId}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Calendar size={14} className="opacity-60" />
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                          }) : "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => viewPdf(item.id)}
                          className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all shadow-md hover:shadow-blue-200 active:scale-95"
                        >
                          <FileText size={14} />
                          VIEW PDF
                        </button>
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