import React from 'react';
import { Package, MapPin, Clock } from 'lucide-react';
import { Card, Badge } from '../../components/Common';

const MyLoads = () => {
  const loads = [
    { 
      id: 'LD-1001', 
      origin: 'New York, NY', 
      destination: 'Boston, MA', 
      status: 'in_transit',
      pickupTime: '08:00 AM',
      deliveryTime: '02:00 PM',
      distance: '215 miles',
      weight: '15,000 lbs',
      notes: 'Handle with care - fragile items'
    },
    { 
      id: 'LD-1005', 
      origin: 'Philadelphia, PA', 
      destination: 'Washington, DC', 
      status: 'assigned',
      pickupTime: '10:00 AM',
      deliveryTime: '04:00 PM',
      distance: '140 miles',
      weight: '12,500 lbs',
      notes: 'Temperature controlled'
    },
    { 
      id: 'LD-1008', 
      origin: 'Baltimore, MD', 
      destination: 'Richmond, VA', 
      status: 'assigned',
      pickupTime: '01:00 PM',
      deliveryTime: '06:00 PM',
      distance: '110 miles',
      weight: '18,000 lbs',
      notes: 'Standard delivery'
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      assigned: 'info',
      in_transit: 'primary',
      delivered: 'success'
    };
    return variants[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Loads</h1>
        <p className="text-gray-600 mt-2">View all your assigned loads</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loads.map((load) => (
          <Card key={load.id} padding="default" hover>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{load.id}</h3>
                <Badge variant={getStatusBadge(load.status)} size="sm" className="mt-2">
                  {load.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <Package className="w-8 h-8 text-primary-600" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Origin</p>
                  <p className="text-sm font-medium text-gray-900">{load.origin}</p>
                  <p className="text-xs text-gray-600 mt-1">Pickup: {load.pickupTime}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Destination</p>
                  <p className="text-sm font-medium text-gray-900">{load.destination}</p>
                  <p className="text-xs text-gray-600 mt-1">Delivery: {load.deliveryTime}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium text-gray-900">{load.distance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium text-gray-900">{load.weight}</span>
                </div>
              </div>

              {load.notes && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Notes:</p>
                  <p className="text-sm text-gray-700">{load.notes}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyLoads;
