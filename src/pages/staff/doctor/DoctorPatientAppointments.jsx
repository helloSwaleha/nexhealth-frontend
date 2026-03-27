// src/pages/staff/doctor/DoctorPatientAppointments.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";
import axios from "axios";
import { Loader2, Calendar, Clock, MapPin } from "lucide-react";
import API_BASE_URL from '../apiConfig';

export default function DoctorPatientAppointments() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!token) {
      setError("Unauthorized access.");
      setLoading(false);
      return;
    }

    // Fetching data from your backend: @GetMapping("/patient/{patientId}")
    axios
      .get(`${API_BASE_URL}/appointments/patient/${patientId}`, axiosConfig)
      .then((res) => {
        setAppointments(res.data || []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load patient history.");
      })
      .finally(() => setLoading(false));
  }, [patientId, token]);

  const statusStyle = (status) => {
    switch (status) {
      case "UPCOMING": return "bg-green-100 text-green-700";
      case "COMPLETED": return "bg-blue-100 text-blue-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <DoctorSidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DoctorSidebar />

      <main className="flex-1 p-8">
        {/* Patient Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Clinical History</h2>
          <p className="text-blue-600 font-medium mt-1 uppercase tracking-wide text-sm">
            Patient Reference: #{patientId}
          </p>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Appointments List */}
        <div className="grid gap-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-xl shadow-sm p-5 flex flex-col md:flex-row justify-between items-center border border-gray-100 hover:border-blue-300 transition-all"
            >
              <div className="space-y-2 w-full md:w-auto">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar size={18} className="text-blue-500" />
                  <span className="font-semibold">{appt.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock size={18} className="text-gray-400" />
                  <span>{appt.time}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={18} className="text-gray-400" />
                  <span>{appt.clinic?.name || "Main Clinic"}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 w-full md:w-auto mt-4 md:mt-0">
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${statusStyle(appt.status)}`}>
                  {appt.status}
                </span>

                <div className="flex gap-2">
                  {(appt.status === "UPCOMING" || appt.status === "PENDING") && (
                    <button
                      onClick={() => navigate(`/doctor/prescription/${appt.id}`)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-sm"
                    >
                      Start Consultation
                    </button>
                  )}

                  {appt.status === "COMPLETED" && (
                    <button 
                      onClick={() => navigate(`/doctor/prescription/view/${appt.id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm"
                    >
                      View Record
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {appointments.length === 0 && !error && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg italic">No medical encounters recorded.</p>
          </div>
        )}
      </main>
    </div>
  );
}