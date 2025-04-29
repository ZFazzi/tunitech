
import { Code, Server, Smartphone, Workflow, Layout, Brush, Database, Globe, ShieldCheck, LineChart, BrainCircuit, CloudCog } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Code,
    title: "Frontend Developer",
    description: "Expert developers for modern, responsive web applications using React, Angular, and Vue.",
  },
  {
    icon: BrainCircuit,
    title: "AI Expert",
    description: "Specialists in machine learning, deep learning, and natural language processing solutions.",
  },
  {
    icon: Server,
    title: "Backend Developer",
    description: "Experienced developers for robust server-side applications and APIs.",
  },
  {
    icon: Brush,
    title: "UI/UX Designer",
    description: "Creative designers who craft intuitive and engaging user experiences.",
  },
  {
    icon: Database,
    title: "Database Specialist",
    description: "Experts in database design, optimization and management systems.",
  },
  {
    icon: CloudCog,
    title: "DevOps Engineer",
    description: "Professionals who streamline deployment and optimize infrastructure.",
  },
  {
    icon: ShieldCheck,
    title: "Security Expert",
    description: "Specialists in cybersecurity, threat assessment and security protocols.",
  },
  {
    icon: Globe,
    title: "Full-Stack Developer",
    description: "Versatile developers with expertise across entire technology stacks.",
  }
];

export const Services = () => {
  return (
    <section id="services" className="section-padding bg-gradient-to-b from-tunitech-dark to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Talents</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Vi erbjuder talanger efter era önskemål inom alla IT-områden
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 group hover:bg-white/10 transition-all duration-300"
            >
              <service.icon className="w-12 h-12 text-tunitech-mint mb-4 group-hover:text-tunitech-blue transition-colors duration-300" />
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
