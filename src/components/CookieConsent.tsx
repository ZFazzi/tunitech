
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Cookie } from "lucide-react";

export const CookieConsent = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];
  const [showConsent, setShowConsent] = useState(false);
  
  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setShowConsent(true);
    }
  }, []);
  
  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
  };
  
  if (!showConsent) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie size={24} className="text-blue-400" />
          <p className="text-white text-sm">
            {t.cookieConsent || "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies."}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors"
          >
            {t.acceptCookies || "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};
