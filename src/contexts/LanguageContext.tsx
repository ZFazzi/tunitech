
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
    // Services translations
    ourTalentsHeader: "Våra Talanger",
    talentsTagline: "Vi erbjuder talanger efter era önskemål inom alla IT-områden",
    frontendDeveloper: "Frontend-utvecklare",
    frontendDesc: "Expertutvedklare specialiserade på React, Angular, Vue och moderna webbtekniker.",
    aiExperts: "AI-experter",
    aiDesc: "Specialister inom maskininlärning, naturlig språkbehandling och AI-lösningar.",
    backendDevelopers: "Backend-utvecklare",
    backendDesc: "Erfarna ingenjörer som bygger robusta och skalbara serverapplikationer.",
    uiDesigners: "UI/UX-designers",
    uiDesc: "Kreativa designers som skapar vackra och intuitiva användargränssnitt och upplevelser.",
    dbSpecialists: "Databasspecialister",
    dbDesc: "Experter på SQL, NoSQL, datamodellering och databasoptimering.",
    devOpsEngineers: "DevOps-ingenjörer",
    devOpsDesc: "Specialister på CI/CD-pipelines, infrastruktur som kod och molntjänster.",
    securityExperts: "Säkerhetsexperter",
    securityDesc: "Yrkesverksamma som säkerställer att applikationer är säkra och skyddade mot hot.",
    fullstackDevs: "Fullstack-utvecklare",
    fullstackDesc: "Mångsidiga utvecklare som behärskar både frontend- och backendtekniker.",
    mobileDevelopers: "Mobilutvecklare",
    mobileDesc: "Specialister på native och plattformsoberoende mobilapputveckling.",
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
    // Services translations
    ourTalentsHeader: "Our Talents",
    talentsTagline: "We offer talents according to your needs in all IT areas",
    frontendDeveloper: "Frontend Developer",
    frontendDesc: "Expert developers specializing in React, Angular, Vue, and modern web technologies.",
    aiExperts: "AI Experts",
    aiDesc: "Specialists in machine learning, natural language processing, and AI solutions.",
    backendDevelopers: "Backend Developers",
    backendDesc: "Experienced engineers building robust and scalable server-side applications.",
    uiDesigners: "UI/UX Designers",
    uiDesc: "Creative designers crafting beautiful and intuitive user interfaces and experiences.",
    dbSpecialists: "Database Specialists",
    dbDesc: "Experts in SQL, NoSQL, data modeling and database optimization.",
    devOpsEngineers: "DevOps Engineers",
    devOpsDesc: "Specialists in CI/CD pipelines, infrastructure as code, and cloud services.",
    securityExperts: "Security Experts",
    securityDesc: "Professionals ensuring applications are secure and protected from threats.",
    fullstackDevs: "Full-Stack Developers",
    fullstackDesc: "Versatile developers comfortable with both frontend and backend technologies.",
    mobileDevelopers: "Mobile Developers",
    mobileDesc: "Specialists in native and cross-platform mobile app development.",
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
    // Services translations
    ourTalentsHeader: "Nos Talents",
    talentsTagline: "Nous proposons des talents selon vos besoins dans tous les domaines informatiques",
    frontendDeveloper: "Développeur Frontend",
    frontendDesc: "Experts spécialisés dans React, Angular, Vue et les technologies web modernes.",
    aiExperts: "Experts en IA",
    aiDesc: "Spécialistes en apprentissage automatique, traitement du langage naturel et solutions d'IA.",
    backendDevelopers: "Développeurs Backend",
    backendDesc: "Ingénieurs expérimentés construisant des applications serveur robustes et évolutives.",
    uiDesigners: "Designers UI/UX",
    uiDesc: "Designers créatifs créant des interfaces utilisateur et des expériences belles et intuitives.",
    dbSpecialists: "Spécialistes en Base de Données",
    dbDesc: "Experts en SQL, NoSQL, modélisation de données et optimisation de bases de données.",
    devOpsEngineers: "Ingénieurs DevOps",
    devOpsDesc: "Spécialistes des pipelines CI/CD, de l'infrastructure en tant que code et des services cloud.",
    securityExperts: "Experts en Sécurité",
    securityDesc: "Professionnels garantissant que les applications sont sécurisées et protégées contre les menaces.",
    fullstackDevs: "Développeurs Full-Stack",
    fullstackDesc: "Développeurs polyvalents maîtrisant les technologies frontend et backend.",
    mobileDevelopers: "Développeurs Mobile",
    mobileDesc: "Spécialistes du développement d'applications mobiles natives et multiplateformes.",
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
