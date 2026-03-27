import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../apiConfig';

function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ URL updated to match your auth structure
      const response = await axios.post("${API_BASE_URL}/auth/login", {
        email,
        password,
      });

      // ✅ Handle successful login
      // Expected: { token, role, doctorId, doctorName, message }
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("doctorId", response.data.doctorId);
        localStorage.setItem("doctorName", response.data.doctorName);

        alert("Login Successful!");
        navigate("/doctor/dashboard");
      } else {
        setMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Doctor Login</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">Access your clinic dashboard</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="doctor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-3 rounded-lg font-bold transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-lg"
            }`}
          >
            {loading ? "Verifying..." : "Login to Dashboard"}
          </button>

          {message && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-center text-sm text-red-600 font-medium">{message}</p>
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                Healthcare Professional Portal
            </p>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;