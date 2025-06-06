
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./components/auth/AuthProvider";
import { CookieConsent } from "./components/CookieConsent";
import Index from "./pages/Index";
import About from "./pages/About";
import ServicesPage from "./pages/Services";
import ContactPage from "./pages/ContactPage";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import CustomerOnboarding from "./pages/CustomerOnboarding";
import DeveloperOnboarding from "./pages/DeveloperOnboarding";
import ProjectRequirement from "./pages/ProjectRequirement";
import ProjectSpecification from "./pages/ProjectSpecification";
import CustomerDashboard from "./pages/CustomerDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import DeveloperProfile from "./pages/DeveloperProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <CookieConsent />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/customer-onboarding" element={<CustomerOnboarding />} />
              <Route path="/developer-onboarding" element={<DeveloperOnboarding />} />
              <Route path="/project-requirement" element={<ProjectRequirement />} />
              <Route path="/project-specification/:id" element={<ProjectSpecification />} />
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
              <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
              <Route path="/developer-profile" element={<DeveloperProfile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
