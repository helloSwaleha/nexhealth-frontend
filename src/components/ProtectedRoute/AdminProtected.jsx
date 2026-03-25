import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtected({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 1. Not logged in -> Go to Admin Login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. Role Check -> Match the "cleanRole" from your Login (ADMIN)
  // We check for both "ADMIN" and "ROLE_ADMIN" just to be safe
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  if (!isAdmin) {
    // If they are a patient or doctor trying to access admin, send to unauthorized
    return <Navigate to="/patient/login" replace />;
  }

  // 3. Authorized -> Render the component inside
  return children;
}