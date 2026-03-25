
import PatientSidebar from "./PatientSidebar";
import { Outlet } from "react-router-dom";

export default function PatientLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <PatientSidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
