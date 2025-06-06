
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Advantages } from "@/components/Advantages";
import { Footer } from "@/components/Footer";
import { QuoteBlock } from "@/components/QuoteBlock";
import { Values } from "@/components/Values";
import { AboutUs } from "@/components/AboutUs";
import { Pricing } from "@/components/Pricing";
import WorldMap from "@/components/WorldMap";
import { BirdDecoration } from "@/components/BirdDecoration";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-transparent backdrop-blur-sm text-white relative"
    >
      <Navbar />
      <Hero />
      
      {/* Fågel dekorationer på olika sektioner */}
      <div className="relative">
        <Values />
        <BirdDecoration position="bottom-left" variant="perched" />
      </div>
      
      <div className="relative">
        <AboutUs />
        <BirdDecoration position="top-right" variant="floating" />
      </div>
      
      <div className="relative">
        <Advantages />
        <BirdDecoration position="bottom-right" variant="floating" />
      </div>
      
      <section className="py-20 section-padding relative">
        <div className="max-w-7xl mx-auto px-6">
          <WorldMap />
        </div>
        <BirdDecoration position="top-left" variant="perched" />
      </section>
      
      <div className="relative">
        <Pricing />
        <BirdDecoration position="center" variant="floating" />
      </div>
      
      <QuoteBlock />
      <Footer />
    </motion.div>
  );
};

export default Index;
