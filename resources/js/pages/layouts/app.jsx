const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-transparent p-4 md:p-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center">
            <img
              src="/images/logo-ksm.png"
              alt="KSM-IF Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
          <NavButton active>Our Team</NavButton>
          <NavButton>Gallery</NavButton>
          <NavButton>LSTA & Bursa</NavButton>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
          <HamburgerIcon />
        </button>
      </div>
    </nav>
  );
};

const NavButton = ({ children, active = false }) => {
  return (
    <button
      className={`
        px-4 lg:px-6 py-2 lg:py-3 text-white font-medium rounded-full
        transition-all duration-300 text-xs lg:text-sm
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

const BackgroundBlurs = () => (
  <div className="absolute inset-0">
    {/* Main cyan blur */}
    <div
      className="
        absolute top-[-300px] sm:top-[-500px] lg:top-[-800px]
        left-1/2 transform -translate-x-1/2
        w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]
        lg:w-[800px] lg:h-[800px] xl:w-[1000px] xl:h-[1000px]
        rounded-full bg-[#2BE0F1]
        blur-[150px] sm:blur-[300px] lg:blur-[400px]
        opacity-40
      "
    />

    {/* Yellow accent blur */}
    <div
      className="
        absolute top-[200px] sm:top-[100px] lg:top-0
        -right-[150px] sm:-right-[200px] lg:-right-[300px]
        w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]
        lg:w-[500px] lg:h-[500px] xl:w-[800px] xl:h-[800px]
        rounded-full bg-[#E7D43B]
        blur-[100px] sm:blur-[200px] lg:blur-[400px]
        opacity-30
      "
    />

    {/* Purple blur for depth */}
    <div
      className="
        absolute bottom-[100px]
        left-[-100px] sm:left-[-150px] lg:left-[-200px]
        w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px]
        rounded-full bg-[#8B5CF6]
        blur-[80px] sm:blur-[120px] lg:blur-[200px]
        opacity-20
      "
    />
  </div>
);

const MainLogo = () => (
  <div className="flex items-center justify-center">
    <div
      className="
        w-38 h-38 sm:w-48 sm:h-48 md:w-64 md:h-64
        lg:w-80 lg:h-80 xl:w-96 xl:h-96
        rounded-full flex items-center justify-center
        transform hover:scale-105 transition-transform duration-500
      "
    >
      <img
        src="/images/logo-ksm.png"
        alt="KSM-IF Logo"
        className="w-full h-full object-contain drop-shadow-2xl"
      />
    </div>
  </div>
);

const TitleSection = () => (
  <div className="text-center relative -top-4">
    <h1
      className="
        text-2xl lg:text-7xl xl:text-8xl
        font-bold text-white mb-4 sm:mb-6 lg:mb-8
        tracking-wider sm:tracking-widest leading-tight
        transform hover:scale-105 transition-transform duration-300
        drop-shadow-2xl animate-fade-in-up
      "
    >
      WE NOT ME
    </h1>

    <p
      className="
        text-sm sm:text-lg md:text-xl lg:text-2xl text-white/80
        font-light tracking-wide animate-fade-in-up
      "
    >
      Kelompok Studi Mahasiswa Informatika
    </p>

    <p
      className="
        text-xs sm:text-sm md:text-base lg:text-lg text-white/60
        font-light mt-2 sm:mt-4 tracking-widest uppercase animate-fade-in-up
      "
    >
      Universitas Surabaya
    </p>
  </div>
);

const CTAButtons = () => (
  <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
    <CTAButton variant="primary">Learn More</CTAButton>
    <CTAButton variant="secondary">Join Us</CTAButton>
  </div>
);

const CTAButton = ({ children, variant = 'primary' }) => {
  const baseClasses = `
    px-6 sm:px-8 py-3 sm:py-4 text-white font-medium
    rounded-full backdrop-blur-sm transition-all duration-300
    transform hover:scale-105 text-sm sm:text-base
  `;

  const variants = {
    primary: `
      bg-white/20 hover:bg-white/30
      border border-white/30 hover:border-white/50
    `,
    secondary: `
      bg-[#2BE0F1]/20 hover:bg-[#2BE0F1]/30
      border border-[#2BE0F1]/50 hover:border-[#2BE0F1]/70
    `
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

const ScrollIndicator = () => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
    <div className="flex flex-col items-center text-white/60 animate-bounce">
      <span className="text-xs mb-2 tracking-wide">Scroll Down</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </div>
);

const AboutSection = () => (
  <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="text-center text-white">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
        About KSM-IF
      </h2>
      <p className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed opacity-80">
        Organisasi mahasiswa yang fokus pada pengembangan ilmu informatika dan teknologi di Universitas Surabaya.
      </p>
    </div>
  </section>
);

export default function App() {
  return (
    <>
      <div className="bg-gradient-to-b from-[#302176] via-[#120D2C] to-[#302176] min-h-screen w-full relative overflow-hidden">

        <BackgroundBlurs />
        <Navbar />

        {/* Hero Section */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
          <MainLogo />
          <TitleSection />
          <CTAButtons />
        </main>

        <ScrollIndicator />

      </div>

      {/* Custom CSS Animation */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </>
  );
}
