import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2 }}
      className={`fixed top-0 left-0 right-0 z-30 p-4 md:p-6 transition-all duration-500 ${
        scrolled ? 'bg-black/20 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
            <button
              onClick={() => handleNavigation('home')}
              className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
            >
              <img
                src="/images/logo-ksm.png"
                alt="KSM-IF Logo"
                className="w-full h-full object-contain"
              />
            </button>
          </div>
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
            className="md:hidden bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20 hover:scale-110 transition-transform duration-300"
          >
            <HamburgerIcon isOpen={isMobileMenuOpen} />
          </button>

        {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute right-0 top-0 h-full w-64 bg-[#120D2C]/95 backdrop-blur-md border-l border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col p-6 pt-20">
              <h3 className="text-white text-lg font-semibold mb-6">Navigation</h3>

              <MobileNavButton
                active={currentPage === 'home'}
                onClick={() => handleNavigation('home')}
              >
                🏠 Dashboard
              </MobileNavButton>

              <MobileNavButton
                active={currentPage === 'team'}
                onClick={() => handleNavigation('team')}
              >
                👥 Our Team
              </MobileNavButton>

              <MobileNavButton
                active={currentPage === 'gallery'}
                onClick={() => handleNavigation('gallery')}
              >
                📸 Gallery
              </MobileNavButton>

              <MobileNavButton
                active={currentPage === 'lsta'}
                onClick={() => handleNavigation('lsta')}
              >
                📈 LSTA & Bursa
              </MobileNavButton>
            </div>
          </motion.div>
        </motion.div>
      )}
      </div>
    </motion.div>
  );
};

const NavButton = ({ children, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 lg:px-6 py-2 lg:py-3 text-white font-medium rounded-full
        transition-all duration-300 text-xs lg:text-sm transform hover:scale-105
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

const MobileNavButton = ({ children, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 text-white font-medium rounded-lg
        transition-all duration-300 mb-2 text-sm
        ${active
          ? 'bg-white/20 text-white'
          : 'hover:bg-white/10 text-white/80 hover:text-white'
        }
      `}
    >
      {children}
    </button>
  );
};

const HamburgerIcon = ({ isOpen }) => (
  <svg
    className={`w-6 h-6 text-white transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
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
