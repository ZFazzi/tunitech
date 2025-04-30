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
    contactTagline: "Redo att hitta nästa talang? Kontakta oss idag.",
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
    contactUs: "Kontakta oss",
    // Service descriptions
    frontendDeveloper: "Expertuvecklare som specialiserar sig på React, Angular, Vue och moderna webbteknologier.",
    aiExperts: "Specialister inom maskininlärning, natural language processing och AI-lösningar.",
    backendDevelopers: "Erfarna ingenjörer som bygger robusta och skalbara serverapplikationer.",
    uiUxDesigners: "Kreativa designers som skapar vackra och intuitiva användargränssnitt och upplevelser.",
    databaseSpecialists: "Experter på SQL, NoSQL, datamodellering och databasoptimering.",
    devOpsEngineers: "Specialister på CI/CD-pipelines, infrastructure as code och molntjänster.",
    securityExperts: "Yrkesverksamma som säkerställer att applikationer är säkra och skyddade från hot.",
    fullStackDevelopers: "Mångsidiga utvecklare som är bekväma med både frontend- och backend-teknologier.",
    mobileDevelopers: "Specialister inom native och cross-platform mobilapputveckling."
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
    contactUs: "Contact us",
    // Service descriptions
    frontendDeveloper: "Expert developers specializing in React, Angular, Vue, and modern web technologies.",
    aiExperts: "Specialists in machine learning, natural language processing, and AI solutions.",
    backendDevelopers: "Experienced engineers building robust and scalable server-side applications.",
    uiUxDesigners: "Creative designers crafting beautiful and intuitive user interfaces and experiences.",
    databaseSpecialists: "Experts in SQL, NoSQL, data modeling and database optimization.",
    devOpsEngineers: "Specialists in CI/CD pipelines, infrastructure as code, and cloud services.",
    securityExperts: "Professionals ensuring applications are secure and protected from threats.",
    fullStackDevelopers: "Versatile developers comfortable with both frontend and backend technologies.",
    mobileDevelopers: "Specialists in native and cross-platform mobile app development."
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
    contactUs: "Contactez-nous",
    // Service descriptions
    frontendDeveloper: "Développeurs experts spécialisés en React, Angular, Vue et technologies web modernes.",
    aiExperts: "Spécialistes en apprentissage automatique, traitement du langage naturel et solutions d'IA.",
    backendDevelopers: "Ingénieurs expérimentés construisant des applications robustes et évolutives côté serveur.",
    uiUxDesigners: "Designers créatifs élaborant des interfaces utilisateur et des expériences belles et intuitives.",
    databaseSpecialists: "Experts en SQL, NoSQL, modélisation de données et optimisation de bases de données.",
    devOpsEngineers: "Spécialistes des pipelines CI/CD, de l'infrastructure en tant que code et des services cloud.",
    securityExperts: "Professionnels veillant à ce que les applications soient sécurisées et protégées contre les menaces.",
    fullStackDevelopers: "Développeurs polyvalents à l'aise avec les technologies frontend et backend.",
    mobileDevelopers: "Spécialistes du développement d'applications mobiles natives et multiplateformes."
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
