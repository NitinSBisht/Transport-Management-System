import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Transport Management System. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
