import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, HeartPulse, X } from "lucide-react";
import API_BASE_URL from '../../apiConfig';

export default function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "${API_BASE_URL}/api/patient/login",
        { email, password }
      );

      // ✅ PERSISTENT STORAGE: This is what keeps you logged in across tabs
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.patientId); 
      localStorage.setItem("role", "PATIENT"); // Matches your PatientProtected check

      // Use navigate instead of window.location for a smoother React transition
      // but window.location.href works too if you want a full refresh
      navigate("/"); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6 ">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row border border-slate-100 mt-10">
        
        {/* Left Side: Branding/Visual */}
        <div className="md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
              <HeartPulse size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">HealthSync</span>
            </div>
            <h2 className="text-4xl font-black leading-tight mb-4">
              Your Health, <br />
              <span className="text-blue-500 text-5xl italic">Simplified.</span>
            </h2>
            <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-xs">
              Securely access your medical records, book appointments, and connect with your doctors in one place.
            </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
             <div className="flex -space-x-3 mb-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-4 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                    DR
                  </div>
                ))}
                <div className="h-10 w-10 rounded-full border-4 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black">
                  +2k
                </div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trusted by 2,000+ Patients</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Welcome Back</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Patient Portal Login</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
              <X size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Password</label>
                <Link to="/forgot-password" size={14} className="text-[10px] font-black uppercase text-blue-600 hover:text-slate-900 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 flex items-center justify-center gap-2"
              type="submit"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-400 font-bold text-xs">
            New to HealthSync?{" "}
            <Link to="/patient/signup" className="text-blue-600 hover:text-slate-900 transition-colors ml-1">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}