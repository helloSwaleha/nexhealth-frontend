import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { Calendar, XCircle, Clock, User, Stethoscope, Building2 } from "lucide-react";
import API_BASE_URL from '../../../apiConfig';

export default function AdminAppointments() {
  const token = localStorage.getItem("token");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 🔹 Matches Java: @GetMapping("/admin/all") inside @RequestMapping("/appointments")
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/appointments/admin/all`,
        axiosConfig
      );
      setAppointments(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Failed to load appointments registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🔹 Matches Java: @PutMapping("/admin/cancel/{id}") inside @RequestMapping("/appointments")
  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.put(
        `${API_BASE_URL}/appointments/admin/cancel/${appointmentId}`,
        {}, // Body is empty
        axiosConfig
      );

      // Update UI state locally
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: "CANCELLED" } : appt
        )
      );

      alert("Appointment successfully cancelled by Admin.");
    } catch (error) {
      console.error("Cancel Error:", error);
      // The 404 alert usually comes from here
      alert(error.response?.status === 404 
        ? "Error 404: The endpoint was not found. Please check backend Mapping." 
        : "Failed to cancel appointment.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Calendar className="text-blue-600" /> Appointments Registry
          </h1>
          <p className="text-gray-500 mt-1">Global view of all medical bookings</p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-gray-600 text-sm font-semibold">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400">Loading...</td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">#{appt.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{appt.date}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {appt.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {/* Accessing nested patient object from Java Entity */}
                      {appt.patient?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-800">{appt.doctor?.name || "No Doctor"}</div>
                      <div className="text-blue-600 text-xs">{appt.clinic?.name || "No Clinic"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        appt.status === "CONFIRMED" ? "bg-blue-100 text-blue-600" :
                        appt.status === "COMPLETED" ? "bg-green-100 text-green-600" :
                        "bg-red-100 text-red-600"
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {appt.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                        >
                          <XCircle size={20} />
                        </button>
                      )}
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
