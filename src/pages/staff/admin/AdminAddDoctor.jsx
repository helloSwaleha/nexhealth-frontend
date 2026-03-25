import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { UserPlus, Stethoscope, Mail, Lock, Phone, Banknote, Building2, GraduationCap } from "lucide-react";

export default function AdminAddDoctor() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    qualification: "", // 🔹 Added field
    experience: "",
    fee: "",
    clinicId: "",
    status: "ACTIVE", 
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8080/admin/clinics", axiosConfig)
      .then((res) => setClinics(res.data))
      .catch((err) => {
        console.error("Fetch clinics error:", err);
        setError("Could not load clinics. Please check your connection.");
      });
  }, []);

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: doctor.name,
      email: doctor.email,
      password: doctor.password,
      phone: doctor.phone,
      specialization: doctor.specialization,
      qualification: doctor.qualification, // 🔹 Included in payload
      experience: parseInt(doctor.experience),
      fee: parseFloat(doctor.fee),
      clinicId: parseInt(doctor.clinicId)
    };

    axios
      .post("http://localhost:8080/admin/doctors/add", payload, axiosConfig)
      .then(() => {
        alert("Doctor registered successfully!");
        navigate("/admin/doctors");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to add doctor.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <UserPlus className="text-blue-600" /> Add New Doctor
            </h1>
            <p className="text-gray-500">Assign a new healthcare professional to a clinic.</p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-r-xl">
              {error}
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={doctor.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Dr. John Doe"
                  required
                />
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16} /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={doctor.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="doctor@clinic.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Lock size={16} /> Initial Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={doctor.password}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Specialization & Qualification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Stethoscope size={16} /> Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={doctor.specialization}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Cardiologist"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2 text-left">
                    <GraduationCap size={16} /> Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={doctor.qualification}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="MBBS, MD (Cardio)"
                    required
                  />
                </div>
              </div>

              {/* Phone & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={doctor.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={doctor.experience}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="5"
                    required
                  />
                </div>
              </div>

              {/* Fee & Clinic Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Banknote size={16} /> Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="fee"
                    value={doctor.fee}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Building2 size={16} /> Assign to Clinic
                  </label>
                  <select
                    name="clinicId"
                    value={doctor.clinicId}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    required
                  >
                    <option value="">Choose a clinic...</option>
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name} — {clinic.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Account Status (Moved to single col or keep row) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Account Status</label>
                <select
                  name="status"
                  value={doctor.status}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate("/admin/doctors")}
                  className="px-8 py-3 font-semibold text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg disabled:bg-gray-400 transition-transform active:scale-95"
                >
                  {loading ? "Registering..." : "Save Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}