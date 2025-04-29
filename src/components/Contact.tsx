
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

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

        <div className="flex justify-center">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-8 space-y-6 w-full max-w-2xl"
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
