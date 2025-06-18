import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get current page from Laravel data atau URL
    const pageData = window.Laravel?.pageData?.page;
    const currentPath = window.location.pathname;

    if (pageData) {
      setCurrentPage(pageData);
    } else {
      // Fallback ke URL parsing
      if (currentPath === '/') setCurrentPage('home');
      else if (currentPath.includes('/team')) setCurrentPage('team');
      else if (currentPath.includes('/gallery')) setCurrentPage('gallery');
      else if (currentPath.includes('/lsta')) setCurrentPage('lsta');
      else setCurrentPage('home');
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Navigation handler - redirect ke Laravel routes
  const handleNavigation = (page) => {
    const routes = window.Laravel?.routes;

    if (routes) {
      // Menggunakan Laravel routes
      switch (page) {
        case 'home':
          window.location.href = routes.home;
          break;
        case 'team':
          window.location.href = routes.team;
          break;
        case 'gallery':
          window.location.href = routes.gallery;
          break;
        case 'lsta':
          window.location.href = routes.lsta;
          break;
        default:
          window.location.href = routes.home;
      }
    } else {
      // Fallback routes
      switch (page) {
        case 'home':
          window.location.href = '/';
          break;
        case 'team':
          window.location.href = '/team';
          break;
        case 'gallery':
          window.location.href = '/gallery';
          break;
        case 'lsta':
          window.location.href = '/lsta';
          break;
        default:
          window.location.href = '/';
      }
    }

    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2 }}
        className={`fixed top-0 left-0 right-0 z-40 p-3 sm:p-4 md:p-6 transition-all duration-500 ${
          scrolled ? 'bg-black/20 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('home')}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Go to homepage"
            >
              <img
                src="/images/logo-ksm.png"
                alt="KSM-IF Logo"
                className="w-full h-full object-contain"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
            <NavButton
              active={currentPage === 'home'}
              onClick={() => handleNavigation('home')}
            >
              Dashboard
            </NavButton>
            <NavButton
              active={currentPage === 'team'}
              onClick={() => handleNavigation('team')}
            >
              Our Team
            </NavButton>
            <NavButton
              active={currentPage === 'gallery'}
              onClick={() => handleNavigation('gallery')}
            >
              Gallery
            </NavButton>
            <NavButton
              active={currentPage === 'lsta'}
              onClick={() => handleNavigation('lsta')}
            >
              LSTA & Bursa
            </NavButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-3 border border-white/20 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 relative z-50"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <HamburgerIcon isOpen={isMobileMenuOpen} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: 0.4
              }}
              className="fixed right-0 top-0 bottom-0 z-40 w-72 sm:w-80 bg-gradient-to-b from-[#120D2C]/98 to-[#1a1147]/98 backdrop-blur-lg border-l border-white/20 shadow-2xl md:hidden overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <img
                    src="/images/logo-ksm.png"
                    alt="KSM-IF Logo"
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                  <h3 className="text-white text-lg sm:text-xl font-bold">KSM-IF</h3>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className="flex flex-col p-4 sm:p-6 space-y-2">
                <h4 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">Navigation</h4>

                <MobileNavButton
                  active={currentPage === 'home'}
                  onClick={() => handleNavigation('home')}
                  icon="🏠"
                >
                  Dashboard
                </MobileNavButton>

                <MobileNavButton
                  active={currentPage === 'team'}
                  onClick={() => handleNavigation('team')}
                  icon="👥"
                >
                  Our Team
                </MobileNavButton>

                <MobileNavButton
                  active={currentPage === 'gallery'}
                  onClick={() => handleNavigation('gallery')}
                  icon="📸"
                >
                  Gallery
                </MobileNavButton>

                <MobileNavButton
                  active={currentPage === 'lsta'}
                  onClick={() => handleNavigation('lsta')}
                  icon="📈"
                >
                  LSTA & Bursa
                </MobileNavButton>
              </div>

              {/* Mobile Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-white/10">
                <p className="text-white/40 text-xs text-center">
                  © 2024 KSM-IF. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const NavButton = ({ children, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 lg:px-6 py-2 lg:py-3 text-white font-medium rounded-full
        transition-all duration-300 text-xs lg:text-sm transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-white/30
        ${active
          ? 'bg-white/20 hover:bg-white/30'
          : 'hover:bg-white/20'
        }
      `}
    >
      {children}
    </button>
  );
};

const MobileNavButton = ({ children, active = false, onClick, icon }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        group w-full flex items-center space-x-3 px-4 py-3 sm:py-4 text-left font-medium rounded-xl
        transition-all duration-300 text-sm sm:text-base
        focus:outline-none focus:ring-2 focus:ring-white/30
        ${active
          ? 'bg-white/20 text-white shadow-lg border border-white/20'
          : 'hover:bg-white/10 text-white/80 hover:text-white border border-transparent hover:border-white/10'
        }
      `}
    >
      <span className="text-lg sm:text-xl flex-shrink-0">{icon}</span>
      <span className="flex-1">{children}</span>
      {active && (
        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0 animate-pulse" />
      )}
    </motion.button>
  );
};

const HamburgerIcon = ({ isOpen }) => (
  <svg
    className={`w-5 h-5 sm:w-6 sm:h-6 text-white transition-all duration-300 ${
      isOpen ? 'rotate-90' : 'rotate-0'
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    {isOpen ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    )}
  </svg>
);

export default Navbar;
