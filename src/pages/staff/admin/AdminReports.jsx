import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import API_BASE_URL from '../../../apiConfig';
import { 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Cell
} from "recharts";

export default function AdminReports() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [summary, setSummary] = useState({
    totalAppointments: 0,
    completed: 0,
    cancelled: 0,
    noShows: 0
  });
  const [appointmentTrend, setAppointmentTrend] = useState([]);
  const [clinicPerformance, setClinicPerformance] = useState([]);
  const [patientBehavior, setPatientBehavior] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modern color palette for the Bar Chart
  const BAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    // Redirect if no token exists
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

      try {
        // Parallel API calls for speed
        const [summaryRes, trendRes, clinicRes, behaviorRes] = await Promise.all([
          axios.get("${API_BASE_URL}/admin/reports/summary", axiosConfig),
          axios.get("${API_BASE_URL}/admin/reports/appointments/weekly", axiosConfig),
          axios.get("${API_BASE_URL}/admin/reports/clinics/performance", axiosConfig),
          axios.get("${API_BASE_URL}/admin/reports/patient-behavior", axiosConfig),
        ]);

        setSummary(summaryRes.data || summary);
        setAppointmentTrend(trendRes.data || []);
        setClinicPerformance(clinicRes.data || []);
        setPatientBehavior(behaviorRes.data || []);
      } catch (err) {
        console.error("Analytics Error:", err);
        setError("Unable to reach the reporting server. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // --- Error View ---
  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-red-100 text-center max-w-md">
            <AlertTriangle className="text-red-500 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Data Sync Failed</h2>
            <p className="text-slate-500 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all font-bold"
            >
              <RefreshCw size={18} /> Retry Connection
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Analytics</h1>
            <p className="text-slate-500 font-medium mt-1">Operational insights for your healthcare network.</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
            <p className="text-sm font-bold text-slate-700">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {loading ? (
          /* Custom Loading Spinner */
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="text-blue-600 font-bold mt-6 animate-pulse tracking-widest text-sm uppercase">Calculating Metrics...</p>
          </div>
        ) : (
          <>
            {/* Summary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Total Bookings", value: summary.totalAppointments, color: "text-blue-600", icon: <TrendingUp size={20}/>, bg: "bg-blue-50" },
                { label: "Check-ins", value: summary.completed, color: "text-emerald-600", icon: <CheckCircle size={20}/>, bg: "bg-emerald-50" },
                { label: "Cancellations", value: summary.cancelled, color: "text-rose-600", icon: <XCircle size={20}/>, bg: "bg-rose-50" },
                { label: "No Shows", value: summary.noShows, color: "text-amber-600", icon: <Clock size={20}/>, bg: "bg-amber-50" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`${item.bg} ${item.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>{item.icon}</div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</span>
                  </div>
                  <h2 className={`text-4xl font-black ${item.color}`}>{item.value || 0}</h2>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Weekly Trend Area Chart */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-600"/> Weekly Volume
                </h2>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={appointmentTrend}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                      />
                      <Area
                        type="monotone"
                        dataKey="appointments"
                        stroke="#2563eb"
                        strokeWidth={4}
                        fill="url(#chartGradient)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Clinic Performance Bar Chart */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600"/> Clinic Distribution
                </h2>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clinicPerformance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="clinic" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                      <Bar dataKey="appointments" radius={[8, 8, 0, 0]} barSize={40}>
                        {clinicPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Demographics/Behavior Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 overflow-hidden">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Patient Behavioral Insight</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-100">
                      <th className="py-5 px-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Measurement Category</th>
                      <th className="py-5 px-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-right">Metric Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {patientBehavior.length > 0 ? patientBehavior.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-5 px-6 text-slate-700 font-bold text-sm tracking-tight">{item.name}</td>
                        <td className="py-5 px-6 text-right">
                            <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {item.value} Patients
                            </span>
                        </td>
                      </tr>
                    )) : (
                        <tr>
                            <td colSpan="2" className="py-12 text-center text-slate-400 font-medium italic">No demographics data available.</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}