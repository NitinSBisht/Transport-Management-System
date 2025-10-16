import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Common';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button onClick={() => navigate(-1)} variant="outline" icon={ArrowLeft}>
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} icon={Home}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
