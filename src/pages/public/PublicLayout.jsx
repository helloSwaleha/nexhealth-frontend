import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function PublicLayout() {
  return (
    <div className="app-container">
      {/* This Navbar will automatically switch styles 
          based on the 'isLoggedIn' logic we wrote earlier 
      */}
      <Navbar />

      <main className="content-area">
        <Outlet />
      </main>
      
      {/* You can also add a Footer here if you want it on all public/patient pages */}
    </div>
  );
}