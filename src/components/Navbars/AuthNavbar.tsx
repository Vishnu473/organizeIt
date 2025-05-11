import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, Home, FileText, User, X, ChevronLeft, ChevronRight, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "../../Context/ThemeContext";

interface AuthNavbarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const AuthNavbar = ({ isSidebarCollapsed, toggleSidebar }: AuthNavbarProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/templates", label: "Templates", icon: <FileText size={20} /> },
    { to: "/profile", label: "Profile", icon: <User size={20} /> }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon size={20} />;
      case 'light':
        return <Sun size={20} />;
      default:
        return <Monitor size={20} />;
    }
  };

  const cycleTheme = () => {
    switch (theme) {
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('system');
        break;
      default:
        setTheme('light');
        break;
    }
  };

  return (
    <>
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-full bg-blue-50 dark:bg-gray-800 shadow-md flex-col transition-all duration-300 z-40 ${isSidebarCollapsed ? "w-16" : "w-64"
          }`}
      >
        <div className="flex items-center p-4 justify-between">
          {!isSidebarCollapsed && (
            <Link to="/" className="text-xl font-bold text-blue-700 dark:text-blue-400">OrganizeIt</Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 text-blue-700 dark:text-blue-400"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex flex-col gap-2 p-3 mt-4 flex-grow">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 p-2 rounded-md transition-colors
                ${isActive(link.to)
                  ? "bg-blue-600 text-white"
                  : "text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-700"
                }
                ${isSidebarCollapsed ? "justify-center" : ""}
              `}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {!isSidebarCollapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </div>

        <div className="p-3 mt-auto border-t border-blue-100 dark:border-gray-700">
          <button
            onClick={cycleTheme}
            className={`flex items-center gap-3 p-2 w-full rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors mb-2
              ${isSidebarCollapsed ? "justify-center" : ""}
            `}
            aria-label={`Change theme, current theme: ${theme}`}
          >
            <span className="flex-shrink-0">{getThemeIcon()}</span>
            {!isSidebarCollapsed && (
              <span>{theme === 'system' ? 'System Theme' : theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 p-2 w-full rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors
              ${isSidebarCollapsed ? "justify-center" : ""}
            `}
          >
            <LogOut size={20} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <header className="w-full md:hidden sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex justify-between items-center border-b dark:border-b-gray-700">
        <Link to="/" className="text-xl font-semibold text-blue-600 dark:text-blue-400">OrganizeIt</Link>
        <div className="flex items-center gap-2">
          <button
            onClick={cycleTheme}
            className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 focus:outline-none"
            aria-label={`Change theme, current theme: ${theme}`}
          >
            {getThemeIcon()}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>


      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-transparent bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex justify-end items-center p-4 border-b dark:border-gray-700">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-1 flex flex-col h-[calc(100%-60px)]">
          <div className="flex-grow">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 transition-colors rounded-sm py-2 mb-3 px-2 dark:text-blue-300 ${isActive(link.to) ? " bg-blue-800 text-blue-50 dark:text-white" : "hover:bg-blue-100 text-blue-800 hover:dark:bg-gray-700 dark:text-blue-300"
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={cycleTheme}
              className="flex items-center gap-3 py-3 w-full text-blue-600 dark:text-blue-400"
            >
              {getThemeIcon()}
              <span>{theme === 'system' ? 'System Theme' : theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 py-3 text-red-600 dark:text-red-400 w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthNavbar;