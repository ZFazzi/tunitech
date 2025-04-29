
import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "sv" | "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<Language, Record<string, string>>;
}

const translations = {
  sv: {
    aboutUs: "Om oss",
    ourTalents: "Våra talanger",
    career: "Karriär",
    contact: "Kontakt",
    swedish: "Svenska",
    english: "Engelska",
    french: "Franska",
    // Contact form translations
    getInTouch: "Kontakta oss",
    contactTagline: "Redo att starta ditt nästa projekt? Kontakta oss idag.",
    name: "Namn",
    yourName: "För- och Efternamn",
    company: "Företag",
    yourCompany: "Ditt företag",
    message: "Meddelande",
    yourMessage: "Ditt meddelande",
    sendMessage: "Skicka",
    sending: "Skickar...",
    success: "Tack!",
    emailSent: "Ditt meddelande har skickats.",
    error: "Fel",
    formError: "Formulärfel",
    formErrorMsg: "Vänligen fyll i alla obligatoriska fält.",
    emailFailed: "Det gick inte att skicka ditt meddelande. Försök igen.",
    contactUs: "Kontakta oss"
  },
  en: {
    aboutUs: "About Us",
    ourTalents: "Our Talents",
    career: "Career",
    contact: "Contact",
    swedish: "Swedish",
    english: "English",
    french: "French",
    // Contact form translations
    getInTouch: "Get in Touch",
    contactTagline: "Ready to start your next project? Contact us today.",
    name: "Name",
    yourName: "Your name",
    company: "Company",
    yourCompany: "Your company",
    message: "Message",
    yourMessage: "Your message",
    sendMessage: "Send message",
    sending: "Sending...",
    success: "Thank you!",
    emailSent: "Your message has been sent.",
    error: "Error",
    formError: "Form error",
    formErrorMsg: "Please fill in all required fields.",
    emailFailed: "Failed to send your message. Please try again.",
    contactUs: "Contact us"
  },
  fr: {
    aboutUs: "À propos de nous",
    ourTalents: "Nos talents",
    career: "Carrière",
    contact: "Contact",
    swedish: "Suédois",
    english: "Anglais",
    french: "Français",
    // Contact form translations
    getInTouch: "Contactez-nous",
    contactTagline: "Prêt à démarrer votre prochain projet? Contactez-nous dès aujourd'hui.",
    name: "Nom",
    yourName: "Votre nom",
    company: "Entreprise",
    yourCompany: "Votre entreprise",
    message: "Message",
    yourMessage: "Votre message",
    sendMessage: "Envoyer",
    sending: "Envoi en cours...",
    success: "Merci!",
    emailSent: "Votre message a été envoyé.",
    error: "Erreur",
    formError: "Erreur de formulaire",
    formErrorMsg: "Veuillez remplir tous les champs obligatoires.",
    emailFailed: "Échec de l'envoi de votre message. Veuillez réessayer.",
    contactUs: "Contactez-nous"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("sv");

  const value = {
    language,
    setLanguage,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
