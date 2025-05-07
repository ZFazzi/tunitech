
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
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-b from-tunitech-dark to-black/90 text-white overflow-hidden"
    >
      <div className="relative z-10">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/d0c39a01-0fd1-4def-a437-d7d7fb59e2b3.png')] bg-cover bg-center opacity-10 blur-sm"></div>
        <div className="relative z-20">
          <Navbar />
          <Hero />
          <Advantages />
          <QuoteBlock />
          <AboutUs />
          <Services />
          <Values />
          <Pricing />
          <Contact />
          <Footer />
        </div>
      </div>
    </motion.div>
  );
};

export default Index;
