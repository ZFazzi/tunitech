
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
    name: "Namn",
    yourName: "För- och Efternamn",
    email: "E-post",
    yourEmail: "Din e-postadress",
    company: "Företag",
    yourCompany: "Ditt företag",
    message: "Meddelande",
    yourMessage: "Ditt meddelande",
    sendMessage: "Skicka",
    requiredField: "Detta fält är obligatoriskt",
    invalidEmail: "Ange en giltig e-postadress",
    messageSent: "Meddelandet har skickats!",
    messageError: "Ett fel uppstod. Försök igen."
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
    name: "Name",
    yourName: "Your name",
    email: "Email",
    yourEmail: "Your email",
    company: "Company",
    yourCompany: "Your company",
    message: "Message",
    yourMessage: "Your message",
    sendMessage: "Send Message",
    requiredField: "This field is required",
    invalidEmail: "Please enter a valid email",
    messageSent: "Message sent!",
    messageError: "An error occurred. Please try again."
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
    name: "Nom",
    yourName: "Votre nom",
    email: "E-mail",
    yourEmail: "Votre e-mail",
    company: "Entreprise",
    yourCompany: "Votre entreprise",
    message: "Message",
    yourMessage: "Votre message",
    sendMessage: "Envoyer",
    requiredField: "Ce champ est obligatoire",
    invalidEmail: "Veuillez entrer un e-mail valide",
    messageSent: "Message envoyé!",
    messageError: "Une erreur est survenue. Veuillez réessayer."
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
