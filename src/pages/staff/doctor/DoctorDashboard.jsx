import React, { useEffect, useState } from "react";
import DoctorSidebar from "./DoctorSidebar";
import { Calendar, ClipboardList, FileText, Users, Clock } from "lucide-react";
import axios from "axios";

export default function DoctorDashboard() {
  // ✅ Check for doctorId specifically, fallback to userId
  const doctorId = localStorage.getItem("doctorId") || localStorage.getItem("userId");
  const doctorName = localStorage.getItem("doctorName") || "Doctor";
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    prescriptions: 0,
    pending: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!doctorId || !token) {
      setError("Unauthorized access. Please login again.");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [
          todayRes,
          patientCountRes,
          prescriptionCountRes,
          pendingRes,
          recentRes,
        ] = await Promise.all([
          axios.get(`http://localhost:8080/api/doctor/appointments/${doctorId}/today/count`, axiosConfig),
          axios.get(`http://localhost:8080/api/doctor/patients/${doctorId}/count`, axiosConfig),
          axios.get(`http://localhost:8080/api/doctor/prescriptions/${doctorId}/count`, axiosConfig),
          axios.get(`http://localhost:8080/api/doctor/appointments/${doctorId}/pending/count`, axiosConfig),
          axios.get(`http://localhost:8080/api/doctor/appointments/${doctorId}/recent`, axiosConfig),
        ]);

        setStats({
          todayAppointments: todayRes.data || 0,
          totalPatients: patientCountRes.data || 0,
          prescriptions: prescriptionCountRes.data || 0,
          pending: pendingRes.data || 0,
        });

        setRecentAppointments(recentRes.data || []);
      } catch (err) {
        console.error("Doctor dashboard error:", err);
        setError("Unable to sync dashboard data. Check backend connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [doctorId, token]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <DoctorSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-gray-500 text-xl font-medium animate-pulse">
              Syncing Medical Records...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <DoctorSidebar />
        <main className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="bg-red-50 p-8 rounded-3xl border border-red-200 text-center max-w-md shadow-lg">
            <p className="text-red-600 text-xl font-black mb-2 italic">Connection Error</p>
            <p className="text-red-500 font-medium">{error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
            >
                Retry Connection
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DoctorSidebar />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">
              Welcome, Dr. {doctorName} 👨‍⚕️
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              Here is what's happening at your clinic today.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm text-sm font-bold text-gray-700 border border-gray-100">
            <Calendar size={18} className="text-blue-600" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            icon={<Calendar size={22} />}
            title="Today's Appointments"
            value={stats.todayAppointments}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />

          <DashboardCard
            icon={<Users size={22} />}
            title="Total Patients"
            value={stats.totalPatients}
            color="text-green-600"
            bgColor="bg-green-50"
          />

          <DashboardCard
            icon={<FileText size={22} />}
            title="Prescriptions Issued"
            value={stats.prescriptions}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />

          <DashboardCard
            icon={<ClipboardList size={22} />}
            title="Pending Requests"
            value={stats.pending}
            color="text-red-600"
            bgColor="bg-red-50"
          />
        </div>

        {/* Recent Appointments */}
        <div className="mt-10 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Recent Appointments
            </h2>
            <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-800 transition-colors">
              View Full History
            </button>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="py-16 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold italic text-lg">
                No recent appointment history found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-gray-50">
                    <th className="pb-5 px-4 font-black">Patient Profile</th>
                    <th className="pb-5 px-4 font-black">Schedule</th>
                    <th className="pb-5 px-4 font-black text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentAppointments.map((appt) => (
                    <tr
                      key={appt.id}
                      className="hover:bg-blue-50/50 transition-all group"
                    >
                      <td className="py-6 px-4">
                        <div className="flex flex-col">
                          {/* ✅ FIX: Defensive check for nested patient data */}
                          <span className="font-bold text-gray-800 text-lg leading-tight">
                            {appt.patientName || appt.patient?.name || "Patient Unknown"}
                          </span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-1">
                            Record ID: #{appt.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                          <Clock size={16} className="text-blue-500" />
                          <span>{appt.date}</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-900">{appt.time}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4 text-right">
                        <span
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                            appt.status === "COMPLETED"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : appt.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : appt.status === "CANCELLED"
                                  ? "bg-red-50 text-red-700 border-red-100"
                                  : "bg-blue-50 text-blue-700 border-blue-100"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* Reusable Card Component */
function DashboardCard({ icon, title, value, color, bgColor }) {
  return (
    <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group cursor-default">
      <div
        className={`w-14 h-14 rounded-2xl ${bgColor} ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h2>
      <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
    </div>
  );
}