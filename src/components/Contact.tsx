
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-black to-tunitech-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready to start your next project? Contact us today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-white mb-6">Contact Information</h3>
            
            <div className="flex items-center space-x-4">
              <Phone className="w-6 h-6 text-tunitech-mint" />
              <p className="text-gray-300">+1 (555) 123-4567</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Mail className="w-6 h-6 text-tunitech-mint" />
              <p className="text-gray-300">hello@tunitech.se</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-tunitech-mint" />
              <p className="text-gray-300">Stockholm, Sverige</p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-8 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="text-white mb-2 block">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-tunitech-mint transition-colors"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="text-white mb-2 block">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-tunitech-mint transition-colors"
                placeholder="Your email"
              />
            </div>
            
            <div>
              <label className="text-white mb-2 block">Message</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-tunitech-mint transition-colors h-32"
                placeholder="Your message"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-tunitech-mint to-tunitech-blue text-white font-medium py-3 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
