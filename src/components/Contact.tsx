
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export const Contact = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: t.formError || "Error",
        description: t.formErrorMsg || "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Supabase using type assertion to work around the types issue
      const { error } = await (supabase as any)
        .from('contact_submissions')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            company: formData.company || null,
            message: formData.message
          }
        ]);
      
      if (error) throw error;
      
      // Create a mailto link to open the user's email client as a backup
      const subject = `Contact Form: ${formData.name} from ${formData.company || 'N/A'}`;
      const body = `Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || 'N/A'}
Message: ${formData.message}`;

      const mailtoLink = `mailto:hello@tunitech.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        message: ""
      });
      
      // Show success notification
      toast({
        title: t.success || "Success!",
        description: t.emailSent || "Your message has been sent. Thank you!",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: t.error || "Error",
        description: t.emailFailed || "Failed to send your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              type: "spring",
              stiffness: 100 
            }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-tunitech-mint via-tunitech-blue to-tunitech-mint bg-clip-text text-transparent">
              {t.getInTouch || "Get in Touch"}
            </span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t.contactTagline || "Ready to start your next project? Contact us today."}
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
            <div>
              <label className="text-white mb-2 block">{t.name || "Namn"}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-tunitech-mint transition-colors"
                placeholder={t.yourName || "För- och Efternamn"}
              />
            </div>
            
            <div>
              <label className="text-white mb-2 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-tunitech-mint transition-colors"
                placeholder="Email"
              />
            </div>
            
            <div>
              <label className="text-white mb-2 block">{t.company || "Företag"}</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-tunitech-mint transition-colors"
                placeholder={t.yourCompany || "Ditt företag"}
              />
            </div>
            
            <div>
              <label className="text-white mb-2 block">{t.message || "Meddelande"}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-tunitech-mint transition-colors h-32"
                placeholder={t.yourMessage || "Ditt meddelande"}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-tunitech-mint to-tunitech-blue text-white font-medium py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="animate-pulse">{t.sending || "Sending..."}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.sendMessage || "Skicka"}</span>
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
