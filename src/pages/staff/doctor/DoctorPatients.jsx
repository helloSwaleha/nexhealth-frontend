import React, { useEffect, useState, useCallback } from "react";
import DoctorSidebar from "./DoctorSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Added 'History' to the imports below
import { User, Calendar, FileText, Search, Loader2, Phone, Mail, UserCheck, History } from "lucide-react";

export default function DoctorPatients() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const doctorId = localStorage.getItem("doctorId") || localStorage.getItem("userId");

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const axiosConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  useEffect(() => {
    if (!token || !doctorId) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    const fetchMyPatients = async () => {
      try {
        setLoading(true);
        // Targets only this doctor's specific patients
        const res = await axios.get(
          `http://localhost:8080/doctor/${doctorId}/patients`, 
          axiosConfig()
        );
        setPatients(res.data || []);
      } catch (err) {
        console.error("Error fetching my patients:", err);
        setError("Could not load your patient list.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPatients();
  }, [doctorId, token, axiosConfig]);

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DoctorSidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
              <UserCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
              <p className="text-gray-500 text-sm">Patients currently under your consultation.</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search your patients..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-72 bg-white shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-black border-b border-gray-100">
                <th className="px-8 py-5">Patient Profile</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5">Gender</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="group hover:bg-blue-50/30 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gray-100 group-hover:bg-blue-600 group-hover:text-white text-gray-500 rounded-xl flex items-center justify-center font-bold transition-all">
                        {patient.name?.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block leading-tight">{patient.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">ID: #{patient.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-300" /> {patient.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[11px] px-3 py-1 rounded-full font-bold uppercase bg-gray-100 text-gray-600">
                      {patient.gender || "N/A"}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {/* This button uses the 'History' icon we just imported */}
                      <button
                        onClick={() => navigate(`/doctor/patient-history/${patient.id}`)}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="View Prescription History"
                      >
                        <History size={20} />
                      </button>
                      <button
                        onClick={() => navigate(`/doctor/prescription/${patient.id}`)}
                        className="px-4 py-2 bg-gray-900 text-white hover:bg-blue-600 rounded-xl text-xs font-bold transition-all"
                      >
                        New Prescription
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}