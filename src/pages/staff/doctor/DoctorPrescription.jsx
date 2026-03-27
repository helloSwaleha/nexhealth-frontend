import React, { useEffect, useState, useCallback } from "react";
import DoctorSidebar from "./DoctorSidebar";
import axios from "axios";
import API_BASE_URL from '../apiConfig';
import { 
  Loader2, Search, History, User, Calendar, 
  ChevronRight, Pill, Clipboard, AlertCircle 
} from "lucide-react";

export default function PatientHistoryList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const token = localStorage.getItem("token");

  const axiosConfig = useCallback(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await axios.get("${API_BASE_URL}/api/doctor/patients", axiosConfig());
        setPatients(res.data || []);
      } catch (err) {
        console.error("Failed to fetch patients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [axiosConfig]);

  const handleViewHistory = async (patient) => {
    setSelectedPatient(patient);
    try {
      setHistoryLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/doctor/prescriptions/patient/${patient.id}`, 
        axiosConfig()
      );
      setSelectedPatientHistory(res.data || []);
    } catch (err) {
      console.error("Error fetching history", err);
      setSelectedPatientHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString().includes(searchTerm)
  );

  if (loading) return (
    <div className="flex min-h-screen bg-white">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
              <p className="text-gray-500 text-sm">Review clinical medication and dosage history</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-80 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* PATIENT LIST */}
            <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[75vh]">
              <div className="divide-y divide-gray-50 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div 
                    key={patient.id}
                    onClick={() => handleViewHistory(patient)}
                    className={`p-5 cursor-pointer transition-all flex items-center justify-between ${
                      selectedPatient?.id === patient.id ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        selectedPatient?.id === patient.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{patient.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase">ID: #{patient.id}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className={selectedPatient?.id === patient.id ? "text-blue-500" : "text-gray-300"} />
                  </div>
                ))}
              </div>
            </div>

            {/* HISTORY VIEW */}
            <div className="lg:col-span-8 space-y-6 overflow-y-auto h-[75vh] pr-2">
              {!selectedPatientHistory ? (
                <div className="h-full flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400">
                  <User size={40} className="mb-2 opacity-20" />
                  <p>Select a patient to see history</p>
                </div>
              ) : historyLoading ? (
                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : (
                <div className="space-y-6">
                  {selectedPatientHistory.map((hx) => (
                    <div key={hx.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm font-bold text-gray-600">
                          <Calendar size={14} className="text-blue-500" /> 
                          {new Date(hx.created_at || hx.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">APPT_ID: {hx.appointment_id || hx.appointmentId}</span>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        {/* Medication Info */}
                        <div className="flex gap-4">
                          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 h-fit"><Pill size={20}/></div>
                          <div className="flex-1">
                            <h4 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Medication Status</h4>
                            <p className="text-gray-800 font-bold">{hx.medication || "Not specified"}</p>
                            <div className="mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <p className="text-[10px] uppercase font-black text-blue-500 mb-1">Dosage Instructions</p>
                              <p className="text-sm text-gray-700 font-medium">{hx.dosage || "Check clinical notes"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Clinical Notes */}
                        <div className="flex gap-4">
                          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 h-fit"><Clipboard size={20}/></div>
                          <div className="flex-1">
                            <h4 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Clinical Notes</h4>
                            <p className="text-sm text-gray-600 leading-relaxed italic">
                              "{hx.notes || "No additional notes recorded."}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}