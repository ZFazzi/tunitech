
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
    <div className="min-h-screen bg-gradient-to-br from-tunitech-dark via-slate-900 to-tunitech-dark text-white overflow-x-hidden">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,214,179,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,181,233,0.1),transparent_50%)]" />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <Navbar />
        
        <main className="section-spacing">
          <Hero />
          
          {/* Divider */}
          <div className="content-container">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          
          <Advantages />
          <QuoteBlock />
          
          {/* Divider */}
          <div className="content-container">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          
          <AboutUs />
          <Services />
          <Values />
          <Pricing />
          
          {/* Final divider before contact */}
          <div className="content-container">
            <div className="h-px bg-gradient-to-r from-transparent via-tunitech-mint/30 to-transparent" />
          </div>
          
          <Contact />
        </main>
        
        <Footer />
      </motion.div>
    </div>
  );
};

export default Index;
