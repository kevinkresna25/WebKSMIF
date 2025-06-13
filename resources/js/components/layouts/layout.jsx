import Navbar from './navbar';
import Footer from './footer';

const Layout = ({ children, showNavbar = true, showFooter = true }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom, #302176 0%, #120D2C 56%, #120D2C 74%, #302176 100%)'
    }}>
      {/* Background Effects */}
      <BackgroundBlurs />

      {/* Navbar */}
      {showNavbar && <Navbar />}

      {/* Main Content */}
      <main className={`relative z-10`}>
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}

       <style jsx global>{`
        /* ============ CUSTOM SCROLLBAR ============ */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #120D2C;
        }

        ::-webkit-scrollbar-thumb {
          background: #6434F1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #5228E8;
        }

        /* ============ ENHANCED ANIMATIONS ============ */
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* ============ ANIMATION CLASSES ============ */
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        /* ============ SCROLL SMOOTH ============ */
        html {
          scroll-behavior: smooth;
        }

        /* ============ ACCESSIBILITY ============ */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .animate-float,
          .animate-pulse-slow,
          .animate-bounce-slow {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Background component (extracted from your original code)
const BackgroundBlurs = () => (
  <div className="absolute inset-0 fixed">
    <div className="absolute top-[-300px] sm:top-[-500px] lg:top-[-800px] left-1/2 transform -translate-x-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[800px] lg:h-[800px] xl:w-[1000px] xl:h-[1000px] rounded-full bg-[#2BE0F1] blur-[150px] sm:blur-[300px] lg:blur-[400px] animate-pulse-slow opacity-40" />
    <div className="absolute top-[200px] sm:top-[100px] lg:top-0 -right-[200px] sm:-right-[200px] lg:-right-[300px] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[500px] lg:h-[500px] xl:w-[800px] xl:h-[800px] rounded-full bg-[#E7D43B] blur-[100px] sm:blur-[200px] lg:blur-[400px] animate-float opacity-30" />
    <div className="absolute bottom-[100px] left-[-100px] sm:left-[-150px] lg:left-[-200px] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full bg-[#8B5CF6] blur-[80px] sm:blur-[120px] lg:blur-[200px] animate-bounce-slow opacity-20" />
  </div>
);

export default Layout;
