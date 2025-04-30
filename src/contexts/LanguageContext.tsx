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
    
    // Section titles
    ourValues: "Våra värderingar",
    
    // Values translations
    smartSolutions: "Vi använder den senaste teknologin för att effektivt lösa komplexa problem.",
    clientCentric: "Din framgång är vår prioritet. Vi arbetar nära dig för att leverera bästa möjliga resultat.",
    innovation: "Vi utvecklas och anpassas ständigt för att ge dig de senaste teknologiska framstegen.",
    
    // Values titles
    smartSolutionsTitle: "Smarta Lösningar",
    clientCentricTitle: "Kundfokuserade",
    innovationTitle: "Innovation",
    
    // Service descriptions
    frontendDevelopers: "Expertutvecklare som specialiserar sig på React, Angular, Vue och moderna webbteknologier.",
    aiExperts: "Specialister inom maskininlärning, natural language processing och AI-lösningar.",
    backendDevelopers: "Erfarna ingenjörer som bygger robusta och skalbara serverapplikationer.",
    uiUxDesigners: "Kreativa designers som skapar vackra och intuitiva användargränssnitt och upplevelser.",
    databaseSpecialists: "Experter på SQL, NoSQL, datamodellering och databasoptimering.",
    devOpsEngineers: "Specialister på CI/CD-pipelines, infrastructure as code och molntjänster.",
    securityExperts: "Yrkesverksamma som säkerställer att applikationer är säkra och skyddade från hot.",
    fullStackDevelopers: "Mångsidiga utvecklare som är bekväma med både frontend- och backend-teknologier.",
    mobileDevelopers: "Specialister inom native och cross-platform mobilapputveckling.",
    gameDevelopers: "Kreativa utvecklare specialiserade på spelmotorer och interaktiva upplevelser.",
    webDesigners: "Talangfulla designers som skapar visuellt tilltalande och användarvänliga webbplatser.",
    automationTesters: "Experter på att bygga robusta testramverk för att säkerställa mjukvarukvalitet.",
    scrumMasters: "Erfarna processledare som underlättar agila metoder och team produktivitet.",
    appDevelopers: "Skickliga utvecklare som skapar innovativa mobila applikationer för olika plattformar.",
    
    // Service titles
    frontendDevelopersTitle: "Frontend-utvecklare",
    aiExpertsTitle: "AI-experter",
    backendDevelopersTitle: "Backend-utvecklare",
    uiUxDesignersTitle: "UI/UX-designers",
    databaseSpecialistsTitle: "Databasspecialister",
    devOpsEngineersTitle: "DevOps-ingenjörer",
    securityExpertsTitle: "Säkerhetsexperter",
    fullStackDevelopersTitle: "Fullstack-utvecklare",
    mobileDevelopersTitle: "Mobilutvecklare",
    gameDevelopersTitle: "Spelutvecklare",
    webDesignersTitle: "Webbdesigners",
    automationTestersTitle: "Automationstestare",
    scrumMastersTitle: "Scrum Masters",
    appDevelopersTitle: "Apputvecklare",
    
    // Hero feature titles
    talentedMindsTitle: "Duktiga Utvecklare",
    tailoredSolutionsTitle: "Skräddarsydda Lösningar",
    globalReachTitle: "Global Räckvidd, Lokal Påverkan",
    costEfficientTitle: "Kostnadseffektivt, Kvalitetsdrivet",
    
    // Footer translations
    menu: "Meny",
    socialMedia: "Sociala medier",
    location: "Stockholm, Sverige",
    copyright: "© {year} TuniTech. Alla rättigheter reserverade."
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
    
    // Section titles
    ourValues: "Our Values",
    
    // Values translations
    smartSolutions: "We leverage cutting-edge technology to solve complex problems efficiently.",
    clientCentric: "Your success is our priority. We work closely with you to deliver the best results.",
    innovation: "We constantly evolve and adapt to bring you the latest technological advances.",
    
    // Values titles
    smartSolutionsTitle: "Smart Solutions",
    clientCentricTitle: "Client-Centric",
    innovationTitle: "Innovation",
    
    // Service descriptions
    frontendDevelopers: "Expert developers specializing in React, Angular, Vue, and modern web technologies.",
    aiExperts: "Specialists in machine learning, natural language processing, and AI solutions.",
    backendDevelopers: "Experienced engineers building robust and scalable server-side applications.",
    uiUxDesigners: "Creative designers crafting beautiful and intuitive user interfaces and experiences.",
    databaseSpecialists: "Experts in SQL, NoSQL, data modeling and database optimization.",
    devOpsEngineers: "Specialists in CI/CD pipelines, infrastructure as code, and cloud services.",
    securityExperts: "Professionals ensuring applications are secure and protected from threats.",
    fullStackDevelopers: "Versatile developers comfortable with both frontend and backend technologies.",
    mobileDevelopers: "Specialists in native and cross-platform mobile app development.",
    gameDevelopers: "Creative developers specialized in game engines and interactive experiences.",
    webDesigners: "Talented designers creating visually appealing and user-friendly websites.",
    automationTesters: "Experts in building robust testing frameworks to ensure software quality.",
    scrumMasters: "Experienced process facilitators enabling agile methodologies and team productivity.",
    appDevelopers: "Skilled developers creating innovative mobile applications for various platforms.",
    
    // Service titles
    frontendDevelopersTitle: "Frontend Developers",
    aiExpertsTitle: "AI Experts",
    backendDevelopersTitle: "Backend Developers",
    uiUxDesignersTitle: "UI/UX Designers",
    databaseSpecialistsTitle: "Database Specialists",
    devOpsEngineersTitle: "DevOps Engineers",
    securityExpertsTitle: "Security Experts",
    fullStackDevelopersTitle: "Full-Stack Developers",
    mobileDevelopersTitle: "Mobile Developers",
    gameDevelopersTitle: "Game Developers",
    webDesignersTitle: "Web Designers",
    automationTestersTitle: "Automation Testers",
    scrumMastersTitle: "Scrum Masters",
    appDevelopersTitle: "App Developers",
    
    // Hero feature titles
    talentedMindsTitle: "Talented Minds",
    tailoredSolutionsTitle: "Tailored Solutions",
    globalReachTitle: "Global Reach, Local Impact",
    costEfficientTitle: "Cost-Efficient, Quality-Driven",
    
    // Footer translations
    menu: "Menu",
    socialMedia: "Social Media",
    location: "Stockholm, Sweden",
    copyright: "© {year} TuniTech. All rights reserved."
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
    
    // Section titles
    ourValues: "Nos Valeurs",
    
    // Values translations
    smartSolutions: "Nous utilisons des technologies de pointe pour résoudre efficacement des problèmes complexes.",
    clientCentric: "Votre succès est notre priorité. Nous travaillons en étroite collaboration avec vous pour fournir les meilleurs résultats.",
    innovation: "Nous évoluons et nous adaptons constamment pour vous apporter les dernières avancées technologiques.",
    
    // Values titles
    smartSolutionsTitle: "Solutions Intelligentes",
    clientCentricTitle: "Centré sur le Client",
    innovationTitle: "Innovation",
    
    // Service descriptions
    frontendDevelopers: "Développeurs experts spécialisés en React, Angular, Vue et technologies web modernes.",
    aiExperts: "Spécialistes en apprentissage automatique, traitement du langage naturel et solutions d'IA.",
    backendDevelopers: "Ingénieurs expérimentés construisant des applications robustes et évolutives côté serveur.",
    uiUxDesigners: "Designers créatifs élaborant des interfaces utilisateur et des expériences belles et intuitives.",
    databaseSpecialists: "Experts en SQL, NoSQL, modélisation de données et optimisation de bases de données.",
    devOpsEngineers: "Spécialistes des pipelines CI/CD, de l'infrastructure en tant que code et des services cloud.",
    securityExperts: "Professionnels veillant à ce que les applications soient sécurisées et protégées contre les menaces.",
    fullStackDevelopers: "Développeurs polyvalents à l'aise avec les technologies frontend et backend.",
    mobileDevelopers: "Spécialistes du développement d'applications mobiles natives et multiplateformes.",
    gameDevelopers: "Développeurs créatifs spécialisés dans les moteurs de jeu et les expériences interactives.",
    webDesigners: "Designers talentueux créant des sites Web attrayants et conviviaux.",
    automationTesters: "Experts dans la création de frameworks de test robustes pour assurer la qualité des logiciels.",
    scrumMasters: "Facilitateurs de processus expérimentés permettant les méthodologies agiles et la productivité de l'équipe.",
    appDevelopers: "Développeurs qualifiés créant des applications mobiles innovantes pour diverses plateformes.",
    
    // Service titles
    frontendDevelopersTitle: "Développeurs Frontend",
    aiExpertsTitle: "Experts en IA",
    backendDevelopersTitle: "Développeurs Backend",
    uiUxDesignersTitle: "Designers UI/UX",
    databaseSpecialistsTitle: "Spécialistes en Bases de Données",
    devOpsEngineersTitle: "Ingénieurs DevOps",
    securityExpertsTitle: "Experts en Sécurité",
    fullStackDevelopersTitle: "Développeurs Full-Stack",
    mobileDevelopersTitle: "Développeurs Mobile",
    gameDevelopersTitle: "Développeurs de Jeux",
    webDesignersTitle: "Designers Web",
    automationTestersTitle: "Testeurs d'Automatisation",
    scrumMastersTitle: "Scrum Masters",
    appDevelopersTitle: "Développeurs d'Applications",
    
    // Hero feature titles
    talentedMindsTitle: "Talents Compétents",
    tailoredSolutionsTitle: "Solutions Sur Mesure",
    globalReachTitle: "Portée Mondiale, Impact Local",
    costEfficientTitle: "Rentable, Axé Sur La Qualité",
    
    // Footer translations
    menu: "Menu",
    socialMedia: "Médias Sociaux",
    location: "Stockholm, Suède",
    copyright: "© {year} TuniTech. Tous droits réservés."
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
