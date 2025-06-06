
import { Navbar } from "@/components/Navbar";
import { Services } from "@/components/Services";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const ServicesPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-transparent backdrop-blur-sm text-white relative"
    >
      {/* Background image for Services page */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" 
          alt="Programming code background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <div className="pt-16">
          <Services />
        </div>
        <Footer />
      </div>
    </motion.div>
  );
};

export default ServicesPage;
