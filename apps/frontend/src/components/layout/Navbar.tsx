import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Car, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-3">
          <Car className="h-8 w-8 text-primary-600" />
          <h1 className="text-xl font-bold text-gray-900">
            Car Dealership Management
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-5 w-5 text-gray-500" />
            <div className="text-right">
              <p className="font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
