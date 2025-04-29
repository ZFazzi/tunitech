
import { motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const Contact = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.requiredField;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.requiredField;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t.requiredField;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const subject = `Contact Form Submission from ${formData.name}`;
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || "Not provided"}

Message:
${formData.message}
    `.trim();

    const mailtoLink = `mailto:hello@tunitech.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      window.location.href = mailtoLink;
      toast({
        title: t.messageSent,
        variant: "default",
      });
      // Reset form after submission
      setFormData({
        name: "",
        email: "",
        company: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: t.messageError,
        variant: "destructive",
      });
    }
  };

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
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">{t.name}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.yourName}
                className="bg-white/5 border border-white/10 text-white focus:border-tunitech-mint"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">{t.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.yourEmail}
                className="bg-white/5 border border-white/10 text-white focus:border-tunitech-mint"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="text-white">{t.company}</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder={t.yourCompany}
                className="bg-white/5 border border-white/10 text-white focus:border-tunitech-mint"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">{t.message}</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.yourMessage}
                className="bg-white/5 border border-white/10 text-white focus:border-tunitech-mint h-32"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-tunitech-mint to-tunitech-blue text-white font-medium py-6 hover:shadow-lg transition-all duration-300"
            >
              {t.sendMessage}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
