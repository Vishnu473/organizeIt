import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { ChevronRight } from "lucide-react";

const LandingNavbar = () => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-900 dark:text-white">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-blue-700 dark:text-blue-500">OrganizeIt</Link>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
          <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
          <a href="#story" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Our Story</a>
          <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          {!user ? <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium">
            Login
          </Link> :
            < div className="flex justify-center items-center gap-1 hover:text-blue-500">
              <Link to="/dashboard">Return to Dashboard </Link>
              <ChevronRight size={20} />
            </div>}
        </div>
      </nav>
    </header>
  );
};

export default LandingNavbar;