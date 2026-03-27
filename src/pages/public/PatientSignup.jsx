import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from '../apiConfig';
import { 
  User, Mail, Lock, Phone, MapPin, Hash, 
  UserPlus, Loader2, ShieldCheck, CheckCircle2, X,
  Users // ✅ Added icon for Gender
} from "lucide-react";

export default function PatientSignup() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    phone: "",
    city: "",
    gender: "" // ✅ Added Gender to state
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.gender) {
      setError("Please select your gender.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post("${API_BASE_URL}/api/patient/signup", formData);
      if (response.status === 200 || response.status === 201) {
        navigate("/patient/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const errMsg = err.response?.data || "Signup failed. Please try again.";
      setError(typeof errMsg === 'string' ? errMsg : "Email already exists or invalid data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6 py-12">
      <div className="max-w-6xl w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row border border-slate-100 mt-7">
        
        {/* Left Side: Information Panel */}
        <div className="md:w-5/12 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 p-8 opacity-10">
             <UserPlus size={300} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="bg-blue-600 p-2 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">HealthSync</span>
            </div>
            
            <h2 className="text-4xl font-black leading-tight mb-6">
              Join our <br />
              <span className="text-blue-500 text-5xl italic font-serif">Care Network.</span>
            </h2>
            
            <div className="space-y-6 mt-10">
              {[
                "Access 24/7 Appointment Booking",
                "Secure Digital Medical Records",
                "Instant Lab Result Notifications",
                "Direct Messaging with Specialists"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-blue-500" size={20} />
                  <span className="text-slate-300 font-bold text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Patient Security Protocol</p>
             <p className="text-xs text-slate-400 leading-relaxed">
               All data is encrypted via 256-bit SSL and stored in HIPAA-compliant environments.
             </p>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="md:w-7/12 p-8 md:p-16">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Create Account</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Personal Identity Details</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 animate-shake">
              <X size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 transition-all outline-none"
                    onChange={handleChange}
                    value={formData.name}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 transition-all outline-none"
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Age</label>
                <div className="relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="number"
                    name="age"
                    placeholder="e.g. 25"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 transition-all outline-none"
                    onChange={handleChange}
                    value={formData.age}
                    required
                  />
                </div>
              </div>

              {/* Gender - ✅ NEW SELECT FIELD */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Gender</label>
                <div className="relative">
                  <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select
                    name="gender"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
                    onChange={handleChange}
                    value={formData.gender}
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 234 567 890"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 transition-all outline-none"
                    onChange={handleChange}
                    value={formData.phone}
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    name="city"
                    placeholder="New York"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 transition-all outline-none"
                    onChange={handleChange}
                    value={formData.city}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Security Key (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 transition-all outline-none"
                    onChange={handleChange}
                    value={formData.password}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 hover:-translate-y-1 transition-all shadow-xl shadow-blue-100 disabled:bg-slate-300 flex items-center justify-center gap-2"
                type="submit"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>Establish Account</>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-slate-400 font-bold text-xs">
            Part of the network?{" "}
            <Link to="/patient/login" className="text-blue-600 hover:underline ml-1">
              Sign in to your portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}