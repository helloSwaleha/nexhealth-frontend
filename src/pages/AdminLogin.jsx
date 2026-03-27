import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 🔹 Pointing to your unified auth endpoint
      const res = await axios.post("${API_BASE_URL}/auth/login", formData);
      const { token, role, userId } = res.data;

      // ✅ 1. Normalize Role
      // This ensures "ROLE_DOCTOR" becomes "DOCTOR" and "ROLE_ADMIN" becomes "ADMIN"
      // to match your ProtectedRoute logic perfectly.
      const cleanRole = role ? role.replace("ROLE_", "").toUpperCase() : "";

      if (cleanRole !== "ADMIN" && cleanRole !== "DOCTOR") {
        setErrorMsg("Access Denied: Administrative or Medical privileges required.");
        setLoading(false);
        return;
      }

      // ✅ 2. Persistent Storage
      // Using localStorage ensures the session survives tab closes and app switches.
      localStorage.setItem("token", token);
      localStorage.setItem("role", cleanRole);
      localStorage.setItem("userId", userId);

      // ✅ 3. Redirect based on cleaned role
      if (cleanRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (cleanRole === "DOCTOR") {
        navigate("/doctor/dashboard");
      }

    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg(err.response?.data?.message || "Invalid credentials or Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-700 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Portal</h2>
          <p className="text-slate-500 mt-2 font-medium">Admin & Doctor Management Login</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-xs font-bold text-center animate-pulse">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
            <input
              type="email" name="email" required
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white bg-slate-50 outline-none transition-all font-bold text-slate-700"
              placeholder="name@clinic.com"
              value={formData.email} onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
            <input
              type="password" name="password" required
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white bg-slate-50 outline-none transition-all font-bold text-slate-700"
              placeholder="••••••••"
              value={formData.password} onChange={handleChange}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 disabled:bg-slate-300 uppercase text-xs tracking-widest mt-4"
          >
            {loading ? "Verifying Credentials..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}