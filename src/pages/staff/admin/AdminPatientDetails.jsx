// src/pages/staff/admin/AdminPatientDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import API_BASE_URL from '../apiConfig';

export default function AdminPatientDetails() {
  // 🔹 Match the key in your Route path: /admin/patients/:patientId
  const { patientId } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [patient, setPatient] = useState(null);
  const [stats, setStats] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchPatientDetails = async () => {
    try {
      // 🔹 Ensure these endpoints exist in your AdminController
      const [patientRes, statsRes, apptRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/patients/${patientId}`, axiosConfig),
        axios.get(`${API_BASE_URL}/admin/patients/${patientId}/stats`, axiosConfig),
        axios.get(`${API_BASE_URL}/admin/patients/${patientId}/appointments`, axiosConfig),
      ]);

      setPatient(patientRes.data);
      setStats(statsRes.data);
      setAppointments(apptRes.data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to load patient details. Check if the backend endpoints exist.");
      navigate("/admin/patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchPatientDetails();
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8 text-center text-gray-500 font-bold">
          Loading patient dossier...
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Patient Profile</h1>

        {/* Patient Primary Info */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 border-l-4 border-blue-500">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {patient.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
              <p className="text-gray-600">{patient.email}</p>
              <p className="text-gray-600">{patient.phone}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                patient.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {patient.status}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-xl shadow border-b-2 border-transparent hover:border-blue-400 transition">
              <p className="text-gray-400 text-sm font-semibold uppercase">{item.label}</p>
              <h3 className="text-2xl font-extrabold text-gray-800">{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Personal Details Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">Medical Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Info label="Gender" value={patient.gender} />
            <Info label="Age" value={patient.age} />
            <Info label="City" value={patient.city} />
            <Info label="Blood Group" value={patient.bloodGroup} />
          </div>
        </div>

        {/* Appointment History Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-700">Appointment History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Clinic</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400">No medical history found.</td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">
                        {/* 🔹 Fixed Mapping for related objects */}
                        Dr. {a.doctor?.name || a.doctorName}
                      </td>
                      <td className="p-4 text-gray-600">{a.clinic?.name || a.clinicName}</td>
                      <td className="p-4 text-gray-600">{new Date(a.appointmentDate || a.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          a.status === "COMPLETED" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"
                        }`}>
                          {a.status}
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

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 text-xs uppercase font-bold">{label}</p>
      <p className="font-semibold text-gray-800">{value || "N/A"}</p>
    </div>
  );
}