import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Package, 
  Settings, 
  Menu, 
  X,
  UserCog,
  ClipboardList,
  LogOut,
  MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import { useChat } from '../../hooks/useChat';
import { ROUTES } from '../../utils/constants';
import { MenuItem } from '../../types';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isSuperAdmin, isAdmin, isDispatcher } = useRole();
  const { unreadCount } = useChat();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Define menu items based on role
  const getMenuItems = (): MenuItem[] => {
    if (isSuperAdmin()) {
      return [
        { 
          name: 'Dashboard', 
          path: ROUTES.SUPER_ADMIN.DASHBOARD, 
          icon: LayoutDashboard 
        },
        { 
          name: 'Manage Admins', 
          path: ROUTES.SUPER_ADMIN.MANAGE_ADMINS, 
          icon: UserCog 
        },
        { 
          name: 'Manage Dispatchers', 
          path: ROUTES.SUPER_ADMIN.MANAGE_DISPATCHERS, 
          icon: Users 
        },
        { 
          name: 'Messages', 
          path: ROUTES.SUPER_ADMIN.CHAT, 
          icon: MessageCircle 
        },
        { 
          name: 'Settings', 
          path: ROUTES.SUPER_ADMIN.SETTINGS, 
          icon: Settings 
        }
      ];
    }

    if (isAdmin()) {
      return [
        { 
          name: 'Dashboard', 
          path: ROUTES.ADMIN.DASHBOARD, 
          icon: LayoutDashboard 
        },
        { 
          name: 'Manage Dispatchers', 
          path: ROUTES.ADMIN.MANAGE_DISPATCHERS, 
          icon: Users 
        },
        { 
          name: 'Manage Loads', 
          path: ROUTES.ADMIN.MANAGE_LOADS, 
          icon: Package 
        },
        { 
          name: 'Assign Loads', 
          path: ROUTES.ADMIN.ASSIGN_LOADS, 
          icon: ClipboardList 
        },
        { 
          name: 'Messages', 
          path: ROUTES.ADMIN.CHAT, 
          icon: MessageCircle 
        },
        { 
          name: 'Settings', 
          path: ROUTES.ADMIN.SETTINGS, 
          icon: Settings 
        }
      ];
    }

    if (isDispatcher()) {
      return [
        { 
          name: 'Dashboard', 
          path: ROUTES.DISPATCHER.DASHBOARD, 
          icon: LayoutDashboard 
        },
        { 
          name: 'My Loads', 
          path: ROUTES.DISPATCHER.MY_LOADS, 
          icon: Package 
        },
        { 
          name: 'Update Status', 
          path: ROUTES.DISPATCHER.UPDATE_STATUS, 
          icon: Truck 
        },
        { 
          name: 'Messages', 
          path: ROUTES.DISPATCHER.CHAT, 
          icon: MessageCircle 
        },
        { 
          name: 'Profile', 
          path: ROUTES.DISPATCHER.PROFILE, 
          icon: Settings 
        }
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary-600 text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="h-full w-64 bg-gray-900 text-white flex flex-col">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <Truck className="w-8 h-8 text-primary-500" />
              <div>
                <h1 className="text-xl font-bold">TMS</h1>
                <p className="text-xs text-gray-400">Transport Management</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg
                        transition-colors duration-200 relative
                        ${active 
                          ? 'bg-primary-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {item.name === 'Messages' && unreadCount > 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              © 2025 TMS. All rights reserved.
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
