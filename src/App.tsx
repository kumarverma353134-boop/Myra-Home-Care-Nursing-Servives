/**
 * MYRA Home Care Nursing Services
 * Official Web Healthcare Platform & Role Dashboards
 * Location: Patna, Bihar, India | Helpline: 8893671162
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { UserRole, UserProfile, HealthcareService } from './types';
import { storage } from './services/storage';

// Common Components
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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
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
      setSettings(storage.getSettings());
      setServices(storage.getServices());
      setReviews(storage.getReviews(true));
    });
    return unsubscribe;
  }, []);

  // Firebase is the only source of truth for signed-in identity and role.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        setCurrentView((view) => view === 'login' ? 'login' : 'website');
        return;
      }

      try {
        const profileSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (!profileSnapshot.exists()) return;

        const profile = profileSnapshot.data();
        const allowedRoles: UserRole[] = ['customer', 'staff', 'manager', 'owner'];
        if (
          !allowedRoles.includes(profile.role as UserRole) ||
          profile.status !== 'active' ||
          profile.uid !== firebaseUser.uid ||
          profile.email !== firebaseUser.email
        ) {
          await signOut(auth);
          return;
        }

        const user: UserProfile = {
          id: firebaseUser.uid,
          name: typeof profile.name === 'string' ? profile.name : (firebaseUser.displayName || 'MYRA User'),
          email: firebaseUser.email || '',
          phone: typeof profile.phone === 'string' ? profile.phone : '',
          role: profile.role as UserRole,
          avatar: firebaseUser.photoURL || undefined,
          createdAt: typeof profile.createdAt === 'string' ? profile.createdAt : new Date().toISOString(),
          isVerified: profile.isVerified === true,
          qualification: typeof profile.qualification === 'string' ? profile.qualification : undefined,
          designation: typeof profile.designation === 'string' ? profile.designation : undefined,
          status: 'active'
        };
        setCurrentUser(user);
        setCurrentView(user.role);
      } catch (error) {
        console.error('Unable to load MYRA account profile:', error);
        await signOut(auth);
      }
    });

    return unsubscribe;
  }, []);

  // Dedicated portal URLs open a login screen only; the URL never grants a role.
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.endsWith('/ownerloginservises')) {
      setPreferredLoginRole('owner');
      setCurrentView('login');
    } else if (path.endsWith('/managerloginservises')) {
      setPreferredLoginRole('manager');
      setCurrentView('login');
    } else if (path.endsWith('/staffloginservises')) {
      setPreferredLoginRole('staff');
      setCurrentView('login');
    } else if (path.endsWith('/customerloginservises') || path.endsWith('/login')) {
      setPreferredLoginRole('customer');
      setCurrentView('login');
    }
  }, []);

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

  // If maintenance mode is active, visitors see only the public maintenance page.
  if (settings.maintenanceMode && currentView === 'website') {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <MaintenanceView
          settings={settings}
          onOpenOwner={() => handleOpenLogin('owner')}
        />
      </div>
    );
  }

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
            onLogout={() => { void signOut(auth); setCurrentView('website'); }}
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
          if (currentUser?.role === 'customer') setCurrentView('customer');
          else handleOpenLogin('customer');
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
