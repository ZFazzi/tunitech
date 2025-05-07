
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
      className="min-h-screen text-white"
    >
      <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-tunitech-dark to-black/90 -z-10"></div>
      <div className="relative z-10">
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
    </motion.div>
  );
};

export default Index;
