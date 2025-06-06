
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const PricingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-transparent backdrop-blur-sm text-white"
    >
      <Navbar />
      <div className="pt-16">
        <Pricing />
      </div>
      <Footer />
    </motion.div>
  );
};

export default PricingPage;
