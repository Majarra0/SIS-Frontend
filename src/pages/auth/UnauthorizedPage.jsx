import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page. Please contact an administrator
          if you believe this is an error.
        </p>
        <Link
          to="/login"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;