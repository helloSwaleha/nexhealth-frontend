import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, User, CheckCircle, Loader2, ChevronLeft } from "lucide-react";
import API_BASE_URL from '../../apiConfig';

export default function BookingPage() {
  const { clinicId, doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      
      try {
        setLoading(true);
        // ✅ Matches your singular @RequestMapping("/doctor")
        const res = await axios.get(`${API_BASE_URL}/api/doctors/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId, token]);

  /**
   * ✅ Helper: Converts "02:00 PM" to "14:00:00" 
   * Required for Java LocalTime compatibility
   */
  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = (parseInt(hours, 10) + 12).toString();
    return `${hours.padStart(2, '0')}:${minutes}:00`; 
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const bookingData = {
      patientId: patientId,
      doctorId: doctorId,
      appointmentDate: bookingDate, 
      appointmentTime: convertTo24Hour(bookingTime), 
    };

    try {
      await axios.post(`${API_BASE_URL}/api/patient-appointments/book`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess(true);
      setTimeout(() => navigate(`/patient/dashboard/${patientId}`), 2000);
    } catch (err) {
      console.error("Booking Error:", err.response?.data || err.message);
      alert(err.response?.data || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Show loading spinner while fetching doctor info
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Loading Specialist Info...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="h-20 w-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Confirmed!</h2>
          <p className="text-slate-500 font-medium">Your appointment with Dr. {doctor?.name} has been requested successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 mt-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest">
          <ChevronLeft size={16} /> Back to Clinic
        </button>

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-blue-600 p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-black tracking-tight text-white">Book Appointment</h1>
              <p className="text-blue-100 mt-2 font-medium">Select a date and time to secure your consultation.</p>
            </div>
            <div className="absolute -right-10 -top-10 h-40 w-40 bg-blue-500 rounded-full opacity-50"></div>
          </div>

          <form onSubmit={handleBooking} className="p-10 space-y-8">
            <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                <User size={30} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consulting Specialist</p>
                <p className="text-xl font-black text-slate-900"> {doctor?.name}</p>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-tighter">{doctor?.specialization}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split("T")[0]} 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none font-bold text-slate-700 transition-all"
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-4 text-slate-400" size={20} />
                  <select 
                    required
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none font-bold text-slate-700 appearance-none transition-all"
                    onChange={(e) => setBookingTime(e.target.value)}
                  >
                    <option value="">Choose Time</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 disabled:shadow-none"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Processing...
                </span>
              ) : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
