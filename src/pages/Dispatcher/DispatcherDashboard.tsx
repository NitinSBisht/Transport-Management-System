import React from 'react';
import { Package, MapPin, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge } from '../../components/Common';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { ROUTES } from '../../utils/constants';

const DispatcherDashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Assigned Loads',
      value: '8',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'In Transit',
      value: '3',
      icon: MapPin,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Pending Pickup',
      value: '2',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Completed Today',
      value: '5',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const myLoads = [
    { 
      id: 'LD-1001', 
      origin: 'New York, NY', 
      destination: 'Boston, MA', 
      status: 'in_transit',
      pickupTime: '08:00 AM',
      deliveryTime: '02:00 PM',
      distance: '215 miles'
    },
    { 
      id: 'LD-1005', 
      origin: 'Philadelphia, PA', 
      destination: 'Washington, DC', 
      status: 'assigned',
      pickupTime: '10:00 AM',
      deliveryTime: '04:00 PM',
      distance: '140 miles'
    },
    { 
      id: 'LD-1008', 
      origin: 'Baltimore, MD', 
      destination: 'Richmond, VA', 
      status: 'assigned',
      pickupTime: '01:00 PM',
      deliveryTime: '06:00 PM',
      distance: '110 miles'
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      assigned: 'info',
      in_transit: 'primary',
      delivered: 'success',
      pending: 'warning'
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
        <h1 className="text-3xl font-bold text-gray-900">Dispatcher Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Here are your assigned loads.
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
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-4 rounded-lg`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* My Loads */}
      <Card title="My Active Loads" padding="default">
        <div className="space-y-4">
          {myLoads.map((load) => (
            <div key={load.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{load.id}</h3>
                  <Badge variant={getStatusBadge(load.status)} size="sm" className="mt-1">
                    {getStatusText(load.status)}
                  </Badge>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Update Status
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Origin</p>
                  <p className="text-sm font-medium text-gray-900">{load.origin}</p>
                  <p className="text-xs text-gray-600 mt-1">Pickup: {load.pickupTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Destination</p>
                  <p className="text-sm font-medium text-gray-900">{load.destination}</p>
                  <p className="text-xs text-gray-600 mt-1">Delivery: {load.deliveryTime}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Distance:</span> {load.distance}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-6 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-left">
          <MapPin className="w-8 h-8 text-primary-600 mb-3" />
          <p className="font-semibold text-primary-900">View All Loads</p>
          <p className="text-sm text-primary-700 mt-1">See all your assigned loads</p>
        </button>
        <button className="p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
          <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
          <p className="font-semibold text-green-900">Update Load Status</p>
          <p className="text-sm text-green-700 mt-1">Update the status of your loads</p>
        </button>
        <button 
          onClick={() => navigate(ROUTES.DISPATCHER.CHAT)}
          className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left relative"
        >
          <MessageCircle className="w-8 h-8 text-blue-600 mb-3" />
          <p className="font-semibold text-blue-900">Messages</p>
          <p className="text-sm text-blue-700 mt-1">Chat with admin</p>
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

export default DispatcherDashboard;
