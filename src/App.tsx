/**
 * MYRA Home Care Nursing Services
 * Official Web Healthcare Platform & Role Dashboards
 * Location: Patna, Bihar, India | Helpline: 8893671162
 */

import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, HealthcareService } from './types';
import { storage } from './services/storage';

// Common Components
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { MyraCareAssistantModal } from './components/common/MyraCareAssistantModal';
import { ServiceDetailModal } from './components/common/ServiceDetailModal';
import { BookingModal } from './components/common/BookingModal';
import { ZipDownloadModal } from './components/common/ZipDownloadModal';
import { LegalModal } from './components/common/LegalModal';

// Website Sections
import { Hero } from './components/website/Hero';
import { ServicesSection } from './components/website/ServicesSection';
import { AboutSection } from './components/website/AboutSection';
import { WhyChooseUs } from './components/website/WhyChooseUs';
import { HowItWorks } from './components/website/HowItWorks';
import { CoverageSection } from './components/website/CoverageSection';
import { ReviewsSection } from './components/website/ReviewsSection';
import { FAQSection } from './components/website/FAQSection';
import { ContactSection } from './components/website/ContactSection';
import { MaintenanceView } from './components/website/MaintenanceView';

// Auth & Dashboards
import { LoginView } from './components/auth/LoginView';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { OwnerDashboard } from './components/owner/OwnerDashboard';

export default function App() {
  // Application View: 'website' | 'customer' | 'manager' | 'staff' | 'owner' | 'login'
  const [currentView, setCurrentView] = useState<'website' | 'customer' | 'manager' | 'staff' | 'owner' | 'login'>('website');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => storage.getCurrentUser());
  const [settings, setSettings] = useState(() => storage.getSettings());
  const [services, setServices] = useState(() => storage.getServices());
  const [reviews, setReviews] = useState(() => storage.getReviews(true));

  // Modal States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceToBook, setSelectedServiceToBook] = useState<HealthcareService | null>(null);
  const [detailModalService, setDetailModalService] = useState<HealthcareService | null>(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [zipModalOpen, setZipModalOpen] = useState(false);
  const [legalModalKey, setLegalModalKey] = useState<string | null>(null);
  const [preferredLoginRole, setPreferredLoginRole] = useState<UserRole>('customer');

  // Theme mode: dark by default as requested by user
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('myra_theme');
    if (saved) return saved === 'dark';
    return true; // Default to DARK mode
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('myra_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('myra_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Reactive subscription to storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setCurrentUser(storage.getCurrentUser());
      setSettings(storage.getSettings());
      setServices(storage.getServices());
      setReviews(storage.getReviews(true));
    });
    return unsubscribe;
  }, []);

  // Handle URL path / Hash on load (e.g. /manager, /staff, /owner, /customer)
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    const search = new URLSearchParams(window.location.search);
    const roleParam = search.get('role');

    if (path.includes('/owner') || roleParam === 'owner') {
      storage.switchRole('owner');
      setCurrentView('owner');
    } else if (path.includes('/manager') || roleParam === 'manager') {
      storage.switchRole('manager');
      setCurrentView('manager');
    } else if (path.includes('/staff') || roleParam === 'staff') {
      storage.switchRole('staff');
      setCurrentView('staff');
    } else if (path.includes('/customer') || roleParam === 'customer') {
      storage.switchRole('customer');
      setCurrentView('customer');
    } else if (path.includes('/login')) {
      setCurrentView('login');
    }
  }, []);

  // Role Switcher Click Handler
  const handleSelectRole = (role: UserRole | 'website') => {
    if (role === 'website') {
      setCurrentView('website');
    } else {
      const activeUser = storage.switchRole(role);
      setCurrentUser(activeUser);
      setCurrentView(role);
    }
  };

  const handleOpenBooking = (service?: HealthcareService) => {
    setSelectedServiceToBook(service || null);
    setBookingModalOpen(true);
  };

  const handleOpenLogin = (role: UserRole = 'customer') => {
    setPreferredLoginRole(role);
    setCurrentView('login');
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'website') {
      setCurrentView('website');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If maintenance mode is active and user is viewing public website
  if (settings.maintenanceMode && currentView === 'website') {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <RoleSwitcherBar
          currentRole="website"
          onSelectRole={handleSelectRole}
          onOpenZipModal={() => setZipModalOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
        <MaintenanceView
          settings={settings}
          onOpenOwner={() => {
            storage.switchRole('owner');
            setCurrentView('owner');
          }}
        />
        <ZipDownloadModal
          isOpen={zipModalOpen}
          onClose={() => setZipModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-white dark:bg-[#071228] text-slate-900 dark:text-slate-100 transition-colors ${isDarkMode ? 'dark' : ''}`}>
      {/* 1. Universal Top Role Switcher & ZIP Export Bar */}
      <RoleSwitcherBar
        currentRole={currentView}
        onSelectRole={handleSelectRole}
        onOpenZipModal={() => setZipModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* 2. Primary View Container */}
      <main className="flex-1">
        {currentView === 'website' && (
          <>
            <Header
              settings={settings}
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
              onNavigate={handleNavigateSection}
              onOpenLogin={handleOpenLogin}
              onOpenBooking={() => handleOpenBooking()}
            />
            <Hero
              settings={settings}
              onOpenBooking={() => handleOpenBooking()}
              onOpenServices={() => handleNavigateSection('services')}
            />
            <ServicesSection
              services={services}
              onSelectService={(s) => setDetailModalService(s)}
              onBookService={(s) => handleOpenBooking(s)}
            />
            <AboutSection settings={settings} />
            <ContactSection
              settings={settings}
              onOpenBooking={() => handleOpenBooking()}
            />
            <Footer
              settings={settings}
              onOpenLegal={(key) => setLegalModalKey(key)}
              onOpenLogin={(role) => handleOpenLogin(role)}
              onOpenZip={() => setZipModalOpen(true)}
            />
          </>
        )}

        {currentView === 'login' && (
          <LoginView
            initialRole={preferredLoginRole}
            onLoginSuccess={(usr) => {
              setCurrentUser(usr);
              setCurrentView(usr.role);
            }}
            onCancel={() => setCurrentView('website')}
          />
        )}

        {currentView === 'customer' && currentUser && (
          <CustomerDashboard
            user={currentUser}
            onOpenBooking={() => handleOpenBooking()}
            onLogout={() => setCurrentView('website')}
            onOpenAI={() => setAiAssistantOpen(true)}
          />
        )}

        {currentView === 'manager' && currentUser && (
          <ManagerDashboard
            user={currentUser}
            onLogout={() => setCurrentView('website')}
          />
        )}

        {currentView === 'staff' && currentUser && (
          <StaffDashboard
            user={currentUser}
            onLogout={() => setCurrentView('website')}
          />
        )}

        {currentView === 'owner' && currentUser && (
          <OwnerDashboard
            user={currentUser}
            onLogout={() => setCurrentView('website')}
            onOpenZip={() => setZipModalOpen(true)}
          />
        )}
      </main>

      {/* 3. Common Floating Widgets & Modals */}
      <WhatsAppButton />

      <MyraCareAssistantModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(!aiAssistantOpen)}
        onSelectServiceToBook={(srv) => {
          setAiAssistantOpen(false);
          handleOpenBooking(srv);
        }}
      />

      <ServiceDetailModal
        service={detailModalService}
        onClose={() => setDetailModalService(null)}
        onBook={(srv) => {
          setDetailModalService(null);
          handleOpenBooking(srv);
        }}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedService={selectedServiceToBook}
        onBookingSuccess={() => {
          storage.switchRole('customer');
          setCurrentView('customer');
        }}
      />

      <ZipDownloadModal
        isOpen={zipModalOpen}
        onClose={() => setZipModalOpen(false)}
      />

      <LegalModal
        pageKey={legalModalKey}
        onClose={() => setLegalModalKey(null)}
      />
    </div>
  );
}
