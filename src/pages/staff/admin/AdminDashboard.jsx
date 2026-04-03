import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import {
  Hospital,
  UserRound,
  Users,
  CalendarDays,
  Loader2,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from '../../../apiConfig';

export default function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    clinics: 0,
    doctors: 0,
    patients: 0,
    todayAppointments: 0,
  });

  const [recentDoctors, setRecentDoctors] = useState([]);
  const [recentClinics, setRecentClinics] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 🔹 Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        // Parallel requests to all your Controller endpoints
        const [
          clinicsCount,
          doctorsCount,
          patientsCount,
          todayApptCount,
          recentDoctorsRes,
          recentClinicsRes,
          recentApptRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/clinics/count`, axiosConfig),
          axios.get(`${API_BASE_URL}/admin/doctors/count`, axiosConfig),
          axios.get(`${API_BASE_URL}/admin/patients/count`, axiosConfig),
          axios.get(`${API_BASE_URL}/admin/appointments/today/count`, axiosConfig),
          axios.get(`${API_BASE_URL}/admin/doctors/recent`, axiosConfig),
          axios.get(`${API_BASE_URL}/admin/clinics/recent`, axiosConfig),
          axios.get(`${API_BASE_URL}/admin/appointments/recent`, axiosConfig),
        ]);

        setStats({
          clinics: clinicsCount.data,
          doctors: doctorsCount.data,
          patients: patientsCount.data,
          todayAppointments: todayApptCount.data,
        });

        setRecentDoctors(recentDoctorsRes.data);
        setRecentClinics(recentClinicsRes.data);
        setRecentAppointments(recentApptRes.data);
      } catch (error) {
        console.error("Admin dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
            <p className="text-gray-500 font-medium">Loading System Stats...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <TrendingUp className="text-blue-600" /> Admin Insights
          </h1>
          <p className="text-gray-500">Real-time overview of your clinic management system</p>
        </header>

        {/* 📊 STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Clinics"
            value={stats.clinics}
            icon={<Hospital size={24} />}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <StatCard
            title="Doctors"
            value={stats.doctors}
            icon={<UserRound size={24} />}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatCard
            title="Patients"
            value={stats.patients}
            icon={<Users size={24} />}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={<CalendarDays size={24} />}
            bgColor="bg-orange-50"
            textColor="text-orange-600"
          />
        </div>

        {/* 🏥 RECENT CLINICS & 👨‍⚕️ DOCTORS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <DashboardList
            title="Recently Joined Clinics"
            items={recentClinics}
            emptyText="No clinics registered yet"
            renderItem={(clinic) => (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{clinic.name}</p>
                  <p className="text-sm text-gray-500">{clinic.city || "Location not set"}</p>
                </div>
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">ID: #{clinic.id}</span>
              </div>
            )}
          />

          <DashboardList
            title="Recently Joined Doctors"
            items={recentDoctors}
            emptyText="No doctors registered yet"
            renderItem={(doctor) => (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{doctor.name}</p>
                  <p className="text-sm text-gray-500">{doctor.specialization}</p>
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">ID: #{doctor.id}</span>
              </div>
            )}
          />
        </div>

        {/* 📅 RECENT APPOINTMENTS TABLE */}
        <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-white">
            <h2 className="text-xl font-bold text-gray-800">Recent Appointments</h2>
          </div>

          <div className="p-6">
            {recentAppointments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400">No appointments recorded in the system.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {appt.patientName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{appt.patientName}</p>
                        <p className="text-sm text-gray-500">
                          Scheduled with <span className="font-medium text-gray-700">Dr. {appt.doctorName}</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 text-right">
                      <p className="text-sm font-semibold text-gray-800">{appt.date}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                        appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                        appt.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* 🔁 Reusable Components */

function StatCard({ title, value, icon, bgColor, textColor }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl ${bgColor} ${textColor} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function DashboardList({ title, items, emptyText, renderItem }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="p-6">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-4">{emptyText}</p>
        ) : (
          <div className="space-y-5">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="pb-5 last:pb-0 border-b last:border-none border-gray-50"
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
