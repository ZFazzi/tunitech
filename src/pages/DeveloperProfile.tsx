
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navbar } from '@/components/Navbar';
import { DeveloperProfileView } from '@/components/developer/DeveloperProfileView';

const DeveloperProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Laddar...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Åtkomst nekad</h2>
            <p>Du måste vara inloggad för att se din profil.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24 pb-8"
      >
        <DeveloperProfileView />
      </motion.div>
    </div>
  );
};

export default DeveloperProfile;
