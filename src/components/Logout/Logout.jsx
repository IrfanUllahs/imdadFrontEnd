import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogout = () => {
    try {
      // Clear user session or authentication tokens
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Failed to access localStorage:', error);
    }

    // Redirect to the login page after logout
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Logout</h2>
        <p className="text-gray-600 mb-4">Are you sure you want to log out?</p>
        <button
          onClick={() => setShowConfirmation(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>

        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-xl font-semibold mb-4 text-center">⚠️ Confirm Logout</h3>
              <p className="text-gray-600 text-center mb-4">Are you sure you want to log out? This action cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logout;
