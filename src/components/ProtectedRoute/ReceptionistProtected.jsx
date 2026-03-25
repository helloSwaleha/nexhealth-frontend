import React from "react";
import { Navigate } from "react-router-dom";

export default function ReceptionistProtected({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Expected: ROLE_RECEPTIONIST

  // If not logged in → redirect to staff login
  if (!token) {
    return <Navigate to="/staff-login" replace />;
  }

  // Logged in but NOT a receptionist
  if (role !== "ROLE_RECEPTIONIST") {
    return <Navigate to="/staff-login" replace />;
  }

  return children;
}
