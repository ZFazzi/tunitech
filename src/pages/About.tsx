
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
      className="min-h-screen bg-transparent backdrop-blur-sm text-white"
    >
      <Navbar />
      <div className="pt-16">
        <AboutUs />
      </div>
      <Footer />
    </motion.div>
  );
};

export default About;
