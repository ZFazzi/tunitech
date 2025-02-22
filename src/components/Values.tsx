
import { motion } from "framer-motion";
import { Brain, Lightbulb, Users } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "Smart Solutions",
    description: "We leverage cutting-edge technology to solve complex problems efficiently.",
  },
  {
    icon: Users,
    title: "Client-Centric",
    description: "Your success is our priority. We work closely with you to deliver the best results.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We constantly evolve and adapt to bring you the latest technological advances.",
  },
];

export const Values = () => {
  return (
    <section id="values" className="section-padding bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Guided by excellence and innovation in everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center group hover:bg-white/10 transition-all duration-300"
            >
              <value.icon className="w-12 h-12 text-tunitech-mint mx-auto mb-6 group-hover:text-tunitech-blue transition-colors duration-300" />
              <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
              <p className="text-gray-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
