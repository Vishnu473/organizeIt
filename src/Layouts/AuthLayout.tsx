import { Outlet } from "react-router-dom";
import AuthNavbar from "../components/Navbars/AuthNavbar";
import { useState,} from "react";

const AuthLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen dark:bg-gray-800">
      <AuthNavbar 
        isSidebarCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      <main 
        className={`flex-1 p-0 transition-all duration-300 ${
          isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;