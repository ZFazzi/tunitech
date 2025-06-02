
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
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-transparent backdrop-blur-sm text-white"
    >
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
    </motion.div>
  );
};

export default Index;
