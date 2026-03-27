import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../apiConfig";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("${API_BASE_URL}/auth/login", formData);

      // Save JWT + user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.id);

     const role = res.data.role.replace("ROLE_", "");

      // Redirect based on role
      if (role === "ADMIN") {
        navigate("/admin-dashboard");
      } 
      else if (role === "DOCTOR") {
        navigate("/doctor-dashboard");
      } 
      else if (role === "RECEPTIONIST") {
        navigate("/receptionist-dashboard");
      } 
      else {
        setErrorMsg("Invalid role assigned!");
      }

    } catch (err) {
      setErrorMsg("Invalid Email or Password!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Admin / Doctor / Receptionist Login
        </h2>

        {errorMsg && (
          <p className="text-red-600 mb-4 text-center">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-4"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-4"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}
