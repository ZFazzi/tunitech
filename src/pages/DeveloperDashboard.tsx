
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DeveloperDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Omdirigera till utvecklarprofil istället
    navigate('/developer-profile', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <p>Omdirigerar till profil...</p>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
