
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Advantages } from "@/components/Advantages";
import { Footer } from "@/components/Footer";
import { QuoteBlock } from "@/components/QuoteBlock";
import { Values } from "@/components/Values";
import { AboutUs } from "@/components/AboutUs";
import { Pricing } from "@/components/Pricing";
import WorldMap from "@/components/WorldMap";
import { BirdIcon } from "@/components/BirdIcon";
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
      
      {/* Section divider with bird icon */}
      <div className="flex justify-center py-10 relative">
        <BirdIcon size="lg" variant="pulse" className="opacity-30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent via-tunitech-mint to-transparent" />
      </div>
      
      <Values />
      <AboutUs />
      
      {/* Another decorative divider */}
      <div className="flex justify-center py-8 relative">
        <div className="flex items-center gap-4">
          <BirdIcon size="sm" variant="float" className="opacity-20" />
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-tunitech-blue to-transparent" />
          <BirdIcon size="md" variant="hover" className="opacity-25" />
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-tunitech-mint to-transparent" />
          <BirdIcon size="sm" variant="pulse" className="opacity-20" />
        </div>
      </div>
      
      <Advantages />
      
      <section className="py-20 section-padding relative">
        <div className="max-w-7xl mx-auto px-6">
          {/* Floating bird decoration for world map section */}
          <div className="absolute top-10 right-10 opacity-15">
            <BirdIcon size="xl" variant="float" />
          </div>
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
