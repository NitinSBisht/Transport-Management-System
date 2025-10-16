import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, User, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                  {getInitials(user?.name || '')}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
