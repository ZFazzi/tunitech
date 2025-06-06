
import { Navbar } from "@/components/Navbar";
import { AboutUs } from "@/components/AboutUs";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-transparent backdrop-blur-sm text-white relative"
    >
      {/* Background image for About page */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
          alt="Team collaboration background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        <div className="pt-16">
          <AboutUs />
        </div>
        <Footer />
      </div>
    </motion.div>
  );
};

export default About;
