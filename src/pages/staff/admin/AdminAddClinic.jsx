import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { PlusCircle, Image as ImageIcon, Layout, MapPin, Phone, Mail, Upload, Link as LinkIcon } from "lucide-react";

export default function AdminAddClinic() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [clinic, setClinic] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    imageUrl: "" 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadType, setUploadType] = useState("url"); // "url" or "file"

  const handleChange = (e) => {
    setClinic({ ...clinic, [e.target.name]: e.target.value });
  };

  // 🔹 Handle File Upload and convert to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) { // 2MB limit check
        setError("File is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setClinic({ ...clinic, imageUrl: reader.result }); // result is the base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8080/admin/clinics",
        clinic,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Clinic registered successfully!");
      navigate("/admin/clinics");
    } catch (err) {
      console.error("Submission Error:", err);
      setError(err.response?.data?.message || "Failed to register clinic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
              <PlusCircle size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Add New Clinic</h1>
              <p className="text-gray-500">Register a new medical facility</p>
            </div>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
              
              {/* SECTION: GENERAL INFO */}
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
                  <Layout size={18} />
                  <span>General Information</span>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic Name</label>
                    <input type="text" name="name" value={clinic.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Mail size={14}/> Email</label>
                      <input type="email" name="email" value={clinic.email} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Phone size={14}/> Phone</label>
                      <input type="tel" name="phone" value={clinic.phone} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: LOCATION */}
              <div className="pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
                  <MapPin size={18} />
                  <span>Location Details</span>
                </div>
                <div className="space-y-6">
                  <textarea name="address" value={clinic.address} onChange={handleChange} rows="2" className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Street Address" required />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="city" placeholder="City" value={clinic.city} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
                    <input type="text" name="state" placeholder="State" value={clinic.state} onChange={handleChange} className="border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                </div>
              </div>

              {/* SECTION: ASSETS (Dual Image Upload) */}
              <div className="pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <ImageIcon size={18} />
                    <span>Clinic Photo</span>
                  </div>
                  {/* Toggle between URL and File */}
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                      type="button"
                      onClick={() => setUploadType("url")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition ${uploadType === 'url' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    >URL</button>
                    <button 
                      type="button"
                      onClick={() => setUploadType("file")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition ${uploadType === 'file' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    >Upload</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {uploadType === "url" ? (
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="imageUrl"
                        value={clinic.imageUrl}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://images.unsplash.com/photo..."
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="text-gray-400 mb-2" size={24} />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                  )}

                  {/* Image Preview */}
                  {clinic.imageUrl && (
                    <div className="mt-4 relative w-40 h-24 rounded-xl overflow-hidden border">
                      <img src={clinic.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setClinic({...clinic, imageUrl: ""})}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                      >×</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button type="button" onClick={() => navigate("/admin/clinics")} className="px-8 py-3 font-semibold text-gray-600">Cancel</button>
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg disabled:bg-gray-400 flex items-center gap-2"
              >
                {loading ? "Processing..." : "Save Clinic"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}