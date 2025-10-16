import React from 'react';
import { Package, Plus, Eye, Edit } from 'lucide-react';
import { Card, Button, Badge } from '../../components/Common';

const ManageLoads = () => {
  const loads = [
    { id: 'LD-1001', origin: 'New York, NY', destination: 'Boston, MA', status: 'in_transit', dispatcher: 'Mike Johnson', weight: '15,000 lbs' },
    { id: 'LD-1002', origin: 'Chicago, IL', destination: 'Detroit, MI', status: 'assigned', dispatcher: 'Sarah Smith', weight: '12,500 lbs' },
    { id: 'LD-1003', origin: 'Los Angeles, CA', destination: 'San Diego, CA', status: 'pending', dispatcher: 'Unassigned', weight: '18,000 lbs' },
    { id: 'LD-1004', origin: 'Houston, TX', destination: 'Dallas, TX', status: 'delivered', dispatcher: 'Tom Brown', weight: '10,000 lbs' }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Loads</h1>
          <p className="text-gray-600 mt-2">View and manage all transportation loads</p>
        </div>
        <Button icon={Plus}>Create New Load</Button>
      </div>

      <Card padding="default">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Load ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Origin</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Destination</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Weight</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Dispatcher</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loads.map((load) => (
                <tr key={load.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-medium text-gray-900">{load.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{load.origin}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{load.destination}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{load.weight}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{load.dispatcher}</td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadge(load.status)} size="sm">
                      {load.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ManageLoads;
