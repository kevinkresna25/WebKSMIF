import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <img
              src="/images/logo-ksm.png"
              alt="KSM-IF Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
          <NavButton active>Dashboard</NavButton>
          <NavButton>Our Team</NavButton>
          <NavButton>Gallery</NavButton>
          <NavButton>LSTA & Bursa</NavButton>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20 hover:scale-110 transition-transform duration-300">
          <HamburgerIcon />
        </button>
      </div>
    </motion.div>
  );
};

const NavButton = ({ children, active = false }) => {
  return (
    <button
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

const HamburgerIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default Navbar;
