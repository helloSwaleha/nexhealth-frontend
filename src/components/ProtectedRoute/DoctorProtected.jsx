import { Navigate, useLocation } from "react-router-dom";

export default function DoctorProtected({ children }) {
  const token = localStorage.getItem("token");
  const rawRole = localStorage.getItem("role");
  const location = useLocation();

  // 1. Normalize the role to uppercase to prevent "doctor" vs "DOCTOR" bugs
  const role = rawRole ? rawRole.toUpperCase() : "";

  // 2. Flexible check: matches "DOCTOR" or "ROLE_DOCTOR"
  const isDoctor = role === "DOCTOR" || role === "ROLE_DOCTOR";

  // Debugging (optional: remove in production)
  console.log("Doctor Guard Check:", { hasToken: !!token, role });

  if (!token || !isDoctor) {
    console.warn("Doctor session invalid or unauthorized. Redirecting...");
    
    // ✅ Redirect to /admin/login (where your Doctor/Admin login logic lives)
    // We use 'replace' so the user can't use the back button to return to a protected page
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If everything is valid, render the doctor page
  return children;
}