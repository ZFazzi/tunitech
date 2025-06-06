
import { Navbar } from "@/components/Navbar";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-transparent backdrop-blur-sm text-white relative"
    >
      {/* Background image for Contact page */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
          alt="Professional workspace background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <div className="pt-16">
          <Contact />
        </div>
        <Footer />
      </div>
    </motion.div>
  );
};

export default ContactPage;
