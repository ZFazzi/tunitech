
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Advantages } from "@/components/Advantages";
import { AboutUs } from "@/components/AboutUs";
import { Services } from "@/components/Services";
import { Values } from "@/components/Values";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { QuoteBlock } from "@/components/QuoteBlock";
import { Pricing } from "@/components/Pricing";
import { Flexibility } from "@/components/Flexibility";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-transparent backdrop-blur-sm text-white"
    >
      {/* 🔆 Global radial light gradient */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-radial from-white/10 via-transparent to-transparent opacity-10 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col bg-black">
        <Navbar />
        <Hero />
        <Advantages />
        <QuoteBlock />
        <Flexibility />
        <AboutUs />
        <Services />
        <Values />
        <Pricing />
        <Contact />
        <Footer />
      </div>
    </motion.div>
  );
};

export default Index;
