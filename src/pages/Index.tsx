
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Advantages } from "@/components/Advantages";
import { Footer } from "@/components/Footer";
import { QuoteBlock } from "@/components/QuoteBlock";
import { Values } from "@/components/Values";
import { AboutUs } from "@/components/AboutUs";
import { Pricing } from "@/components/Pricing";
import WorldMap from "@/components/WorldMap";
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
      <Values />
      <AboutUs />
      <Advantages />
      <section className="py-20 section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <WorldMap />
        </div>
      </section>
      <Pricing />
      <QuoteBlock />
      <Footer />
    </motion.div>
  );
};

export default Index;
