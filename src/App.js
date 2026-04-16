import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

/* Layouts */
import PublicLayout from "./pages/public/PublicLayout";
import PatientLayout from "./pages/public/PatientLayout";

/* Public Pages */
import Home from "./pages/public/Home";
import Doctors from "./pages/public/Doctors";
import ClinicProfile from "./pages/public/ClinicProfile";
import About from "./pages/public/About";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";

/* Patient Pages */
import PatientLogin from "./pages/public/PatientLogin";
import PatientSignup from "./pages/public/PatientSignup";
import PatientDashboard from "./pages/public/PatientDashboard";
import Appointments from "./pages/public/Appointments";
import Prescriptions from "./pages/public/Prescriptions";
import BookingPage from "./pages/public/BookingPage";
import PatientProfile from "./pages/public/PatientProfile";

/* Staff/Admin */
import StaffLogin from "./pages/staff/StaffLogin";
import AdminLogin from "./pages/AdminLogin";

/* Protected Guards */
import AdminProtected from "./components/ProtectedRoute/AdminProtected";
import DoctorProtected from "./components/ProtectedRoute/DoctorProtected";
import PatientProtected from "./components/ProtectedRoute/PatientProtected";

/* Admin Panel Pages */
import AdminDashboard from "./pages/staff/admin/AdminDashboard";
import AdminClinics from "./pages/staff/admin/AdminClinics";
import AdminClinicDetails from "./pages/staff/admin/AdminClinicDetails";
import AdminAddClinic from "./pages/staff/admin/AdminAddClinic";
import AdminDoctors from "./pages/staff/admin/AdminDoctors";
import AdminDoctorDetails from "./pages/staff/admin/AdminDoctorDetails";
import AdminPatients from "./pages/staff/admin/AdminPatients";
import AdminPatientDetails from "./pages/staff/admin/AdminPatientDetails";
import AdminAppointments from "./pages/staff/admin/AdminAppointments";
import AdminPrescriptions from "./pages/staff/admin/AdminPrescriptions";
import AdminReports from "./pages/staff/admin/AdminReports";
import AdminAddDoctor from "./pages/staff/admin/AdminAddDoctor";

/* Doctor Panel Pages */
import DoctorDashboard from "./pages/staff/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/staff/doctor/DoctorAppointments";
import DoctorPatients from "./pages/staff/doctor/DoctorPatients";
import DoctorPatientAppointments from "./pages/staff/doctor/DoctorPatientAppointments";
import DoctorPrescription from "./pages/staff/doctor/DoctorPrescription";
import DoctorSchedule from "./pages/staff/doctor/DoctorSchedule";
import DoctorProfile from "./pages/staff/doctor/DoctorProfile";

export default function App() {
  // ✅ 1. ADD THIS STATE: Wait for browser storage to be ready
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // This gives the browser a small window to resolve LocalStorage
    // and prevents the "Instant Redirect" bug on refresh.
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 150); 
    return () => clearTimeout(timer);
  }, []);

  // ✅ 2. SHOW NOTHING (OR A SPINNER) UNTIL READY
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        
        {/* 🌍 PUBLIC & AUTHENTICATED BROWSING */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/clinic/profile/:id" element={<ClinicProfile />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/signup" element={<PatientSignup />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/about" element={<About />} />
           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route 
            path="/book/:clinicId/:doctorId" 
            element={<PatientProtected><BookingPage /></PatientProtected>} 
          />
        </Route>

        {/* 👤 PATIENT PRIVATE PORTAL */}
        <Route element={<PatientLayout />}>
          <Route 
            path="/patient/dashboard/:id" 
            element={<PatientProtected><PatientDashboard /></PatientProtected>} 
          />
          <Route 
            path="/patient/appointments" 
            element={<PatientProtected><Appointments /></PatientProtected>}
          />
          <Route 
            path="/patient/prescriptions" 
            element={<PatientProtected><Prescriptions /></PatientProtected>}
          />
          <Route 
            path="/patient/profile" 
            element={<PatientProtected><PatientProfile /></PatientProtected>} 
          />
        </Route>

        {/* 🛡️ ADMIN PANEL */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
        <Route path="/admin/clinics" element={<AdminProtected><AdminClinics /></AdminProtected>} />
        <Route path="/admin/clinics/:clinicId" element={<AdminProtected><AdminClinicDetails /></AdminProtected>}/>
        <Route path="/admin/clinics/add" element={<AdminProtected><AdminAddClinic /></AdminProtected>} />
        <Route path="/admin/doctors" element={<AdminProtected><AdminDoctors /></AdminProtected>} />
        <Route path="/admin/doctors/:doctorId" element={<AdminProtected><AdminDoctorDetails /></AdminProtected>}/>
        <Route path="/admin/doctors/add" element={<AdminProtected><AdminAddDoctor /></AdminProtected>}/>
        <Route path="/admin/patients" element={<AdminProtected><AdminPatients/></AdminProtected>} />
        <Route path="/admin/patients/:patientId" element={<AdminProtected><AdminPatientDetails /></AdminProtected>}/> 
        <Route path="/admin/appointments" element={<AdminProtected><AdminAppointments /></AdminProtected>}/>
        <Route path="/admin/prescriptions" element={<AdminProtected><AdminPrescriptions /></AdminProtected>}/>
        <Route path="/admin/reports" element={<AdminProtected><AdminReports /></AdminProtected>}/>

        {/* 🩺 DOCTOR PANEL */}
        <Route path="/doctor/dashboard" element={<DoctorProtected><DoctorDashboard /></DoctorProtected>}/>
        <Route path="/doctor/appointments" element={<DoctorProtected><DoctorAppointments /></DoctorProtected>}/>
        <Route path="/doctor/patients" element={<DoctorProtected><DoctorPatients /></DoctorProtected>} />
        <Route path="/doctor/patients/:patientId/appointments" element={<DoctorProtected><DoctorPatientAppointments /></DoctorProtected>}/>
        <Route path="/doctor/prescription/:appointmentId" element={<DoctorProtected><DoctorPrescription /></DoctorProtected>}/>
        <Route path="/doctor/prescription" element={<DoctorProtected><DoctorPrescription /></DoctorProtected>}/>
        <Route path="/doctor/schedule" element={<DoctorProtected><DoctorSchedule /></DoctorProtected>}/>
        <Route path="/doctor/profile" element={<DoctorProtected><DoctorProfile /></DoctorProtected>}/>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
