import React, { useEffect, useState, useCallback } from "react";
import DoctorSidebar from "./DoctorSidebar";
import axios from "axios";
import { Loader2, Calendar, Clock, CheckCircle, Timer, AlertCircle, User } from "lucide-react";
import API_BASE_URL from '../../../apiConfig';

export default function DoctorSchedule() {
  const doctorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const axiosConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!doctorId || doctorId === "undefined") {
        setError("Doctor session expired. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // FIX: Added /api prefix to match your Spring Boot controller mapping
        const res = await axios.get(
          `${API_BASE_URL}/doctor/${doctorId}/schedule`,
          axiosConfig()
        );
        
        setAppointments(res.data || []);
        setError("");
      } catch (err) {
        console.error("Failed to load schedule", err);
        const errorMsg = err.response?.data?.message || "Could not connect to medical server.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [doctorId, axiosConfig]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DoctorSidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-500 font-medium text-sm">Synchronizing your clinic schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Clinic Schedule</h1>
              <p className="text-gray-500 mt-1">Daily appointment queue and patient flow</p>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
              <Calendar className="text-blue-600" size={20} />
              <span className="font-bold text-sm text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-50">
                <tr>
                  <th className="px-10 py-6">Time Slot</th>
                  <th className="px-10 py-6">Patient Details</th>
                  <th className="px-10 py-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <Calendar size={64} />
                        <p className="font-bold text-xl">No appointments today</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            <Clock size={20} />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-xl leading-tight">{appt.appointmentTime || appt.time}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{appt.appointmentDate || appt.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <User size={14} />
                           </div>
                           <div>
                              <p className="font-bold text-gray-800 text-lg leading-none mb-1">
                                {appt.patientName || appt.patient?.name || "Unregistered Patient"}
                              </p>
                              <p className="text-xs font-medium text-gray-400 font-mono">APP_ID: #{appt.id}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${
                          appt.status === "COMPLETED" 
                            ? "bg-green-50 text-green-700 border-green-100" 
                            : appt.status === "PENDING" || appt.status === "SCHEDULED"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-gray-50 text-gray-700 border-gray-100"
                        }`}>
                          {appt.status === "COMPLETED" ? <CheckCircle size={14}/> : <Timer size={14}/>}
                          {appt.status}
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