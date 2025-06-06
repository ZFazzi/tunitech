
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProjectRequirementForm } from '@/components/customer/ProjectRequirementForm';

const ProjectRequirement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-gray-900 to-black text-white">
      <Navbar />
      <div className="pt-20 pb-10">
        <ProjectRequirementForm />
      </div>
      <Footer />
    </div>
  );
};

export default ProjectRequirement;
