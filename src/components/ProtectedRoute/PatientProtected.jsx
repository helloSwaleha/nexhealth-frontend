import { Navigate, useLocation } from "react-router-dom";

export default function PatientProtected({ children }) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const rawRole = localStorage.getItem("role");
  const location = useLocation();

  // 1. Normalize the role
  // We trim whitespace and convert to uppercase to ensure "PATIENT" matches
  const role = rawRole ? rawRole.trim().toUpperCase() : "";

  // 2. The Check
  const isPatient = role === "PATIENT" || role === "ROLE_PATIENT";

  // DEBUG: Open your browser console (F12) to see this output
  console.log("--- Patient Guard Check ---");
  console.log("Token Exists:", !!token);
  console.log("User ID:", userId);
  console.log("Normalized Role:", role);
  console.log("Access Granted:", isPatient && !!token);

  if (!token || !userId || !isPatient) {
    return <Navigate to="/patient/login" state={{ from: location }} replace />;
  }

  return children;
}