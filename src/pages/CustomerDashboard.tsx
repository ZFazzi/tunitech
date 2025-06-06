
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomerDashboard as CustomerDashboardComponent } from '@/components/customer/CustomerDashboard';

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black text-white">
      <Navbar />
      <div className="pt-20 pb-10">
        <CustomerDashboardComponent />
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
