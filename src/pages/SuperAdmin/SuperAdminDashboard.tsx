import React from 'react';
import { Users, UserCog, TrendingUp, Activity, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge } from '../../components/Common';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { ROUTES } from '../../utils/constants';

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Admins',
      value: '12',
      change: '+2',
      icon: UserCog,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Dispatchers',
      value: '45',
      change: '+5',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Active Users',
      value: '52',
      change: '+3',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'System Health',
      value: '98%',
      change: '+1%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'Admin John', action: 'Created new dispatcher account', time: '2 hours ago' },
    { id: 2, user: 'Admin Sarah', action: 'Assigned load #1234', time: '4 hours ago' },
    { id: 3, user: 'Dispatcher Mike', action: 'Updated load status', time: '5 hours ago' },
    { id: 4, user: 'Admin Tom', action: 'Modified dispatcher permissions', time: '1 day ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Here's what's happening with your system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} padding="default" hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <Badge variant="success" size="sm" className="mt-2">
                    {stat.change} this week
                  </Badge>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-4 rounded-lg`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activities" padding="default">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions" padding="default">
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
              <p className="font-medium text-primary-900">Create New Admin</p>
              <p className="text-sm text-primary-700">Add a new admin to the system</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <p className="font-medium text-green-900">Manage Dispatchers</p>
              <p className="text-sm text-green-700">View and manage all dispatchers</p>
            </button>
            <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <p className="font-medium text-purple-900">System Settings</p>
              <p className="text-sm text-purple-700">Configure system preferences</p>
            </button>
            <button 
              onClick={() => navigate(ROUTES.SUPER_ADMIN.CHAT)}
              className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors relative"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Messages</p>
                  <p className="text-sm text-blue-700">Chat with admins</p>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
