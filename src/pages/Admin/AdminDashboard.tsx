import React from 'react';
import { Package, Users, TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge } from '../../components/Common';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { ROUTES } from '../../utils/constants';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Active Loads',
      value: '28',
      change: '+4',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Dispatchers',
      value: '15',
      change: '+2',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pending Assignments',
      value: '7',
      change: '-3',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      change: '+2%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentLoads = [
    { id: 'LD-1001', origin: 'New York, NY', destination: 'Boston, MA', status: 'in_transit', dispatcher: 'Mike Johnson' },
    { id: 'LD-1002', origin: 'Chicago, IL', destination: 'Detroit, MI', status: 'assigned', dispatcher: 'Sarah Smith' },
    { id: 'LD-1003', origin: 'Los Angeles, CA', destination: 'San Diego, CA', status: 'pending', dispatcher: 'Unassigned' },
    { id: 'LD-1004', origin: 'Houston, TX', destination: 'Dallas, TX', status: 'delivered', dispatcher: 'Tom Brown' }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      assigned: 'info',
      in_transit: 'primary',
      delivered: 'success'
    };
    return variants[status] || 'default';
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Manage your loads and dispatchers efficiently.
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
                  <Badge variant={stat.change.startsWith('+') ? 'success' : 'warning'} size="sm" className="mt-2">
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

      {/* Recent Loads */}
      <Card title="Recent Loads" padding="default">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Load ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Origin</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Destination</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Dispatcher</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLoads.map((load) => (
                <tr key={load.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{load.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{load.origin}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{load.destination}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{load.dispatcher}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadge(load.status)} size="sm">
                      {getStatusText(load.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="p-6 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-left">
          <Package className="w-8 h-8 text-primary-600 mb-3" />
          <p className="font-semibold text-primary-900">Create New Load</p>
          <p className="text-sm text-primary-700 mt-1">Add a new load to the system</p>
        </button>
        <button className="p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
          <Users className="w-8 h-8 text-green-600 mb-3" />
          <p className="font-semibold text-green-900">Manage Dispatchers</p>
          <p className="text-sm text-green-700 mt-1">View and manage dispatchers</p>
        </button>
        <button className="p-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
          <Clock className="w-8 h-8 text-purple-600 mb-3" />
          <p className="font-semibold text-purple-900">Assign Loads</p>
          <p className="text-sm text-purple-700 mt-1">Assign pending loads</p>
        </button>
        <button 
          onClick={() => navigate(ROUTES.ADMIN.CHAT)}
          className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left relative"
        >
          <MessageCircle className="w-8 h-8 text-blue-600 mb-3" />
          <p className="font-semibold text-blue-900">Messages</p>
          <p className="text-sm text-blue-700 mt-1">Chat with dispatchers</p>
          {unreadCount > 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
