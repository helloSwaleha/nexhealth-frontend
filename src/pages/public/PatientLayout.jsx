import React, { useState } from "react";
import PatientSidebar from "./PatientSidebar";
import { Outlet } from "react-router-dom";

export default function PatientLayout() {
  // ✅ 1. Create the state here
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ 2. Pass state to the Sidebar */}
      <PatientSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <div className="flex-1">
        {/* ✅ 3. CRITICAL: Pass the state through the Outlet context */}
        <Outlet context={{ setIsOpen }} />
      </div>
    </div>
  );
}
