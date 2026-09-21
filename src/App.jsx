import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Steps from './components/Steps';
import Footer from './components/Footer';
import WishModal from './components/WishModal';
import AdminDashboard from './components/AdminDashboard';
import LanguageSelectModal from './components/LanguageSelectModal';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      
      // Clean path matching: supports direct /admin, /admin/, /eh/admin, etc.
      if (
        path === '/admin' || 
        path === '/admin/' || 
        path.endsWith('/admin') || 
        path.endsWith('/admin/') || 
        hash === '#admin' || 
        search.includes('admin=true')
      ) {
        setIsAdminRoute(true);
      } else {
        setIsAdminRoute(false);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleWishSubmitted = () => {
    // Wish submitted callback
  };

  const handleGoToCampaign = () => {
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  return (
    <LanguageProvider>
      {/* Welcome Language Selector Popup on initial visit (Frontend only, disabled on admin page) */}
      {!isAdminRoute && <LanguageSelectModal />}

      {isAdminRoute ? (
        <AdminDashboard onBackToCampaign={handleGoToCampaign} />
      ) : (
        <div className="app-main-wrapper">
          {/* Primary Campaign Frame */}
          <div className="campaign-card-frame">
            <Header />
            <div id="hero">
              <Hero onOpenModal={handleOpenModal} />
            </div>
            <div id="steps">
              <Steps onOpenModal={handleOpenModal} />
            </div>
            <Footer onOpenModal={handleOpenModal} />
          </div>

          {/* Interactive Form Modal connected to PHP Backend */}
          <WishModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            onWishSubmitted={handleWishSubmitted}
          />
        </div>
      )}
    </LanguageProvider>
  );
}
