
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
      className="min-h-screen bg-transparent backdrop-blur-sm text-white"
    >
      <Navbar />
      <div className="pt-16">
        <Services />
      </div>
      <Footer />
    </motion.div>
  );
};

export default ServicesPage;
