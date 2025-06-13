import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

// Custom Hook untuk Intersection Observer
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setIsInView(true);
        setHasAnimated(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '-50px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return [ref, isInView];
};

// ============ ANIMATION VARIANTS ============
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 1,
      duration: 1,
      ease: "easeOut"
    }
  })
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 1,
      duration: 1,
      ease: "easeOut"
    }
  })
};

const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 1,
      duration: 1.8,
      ease: "easeOut"
    }
  })
};

const fadeInRight = {
  initial: { opacity: 0, x: 40 },
  animate: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 1,
      duration: 1.8,
      ease: "easeOut"
    }
  })
};

// ============ NAVBAR COMPONENT ============

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

// ============ BACKGROUND COMPONENTS ============
const BackgroundBlurs = () => (
  <div className="absolute inset-0 fixed">
    {/* Main cyan blur */}
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.4, scale: 1 }}
      transition={{ duration: 4, ease: "easeOut", delay: 5 }}
      className="
        absolute top-[-300px] sm:top-[-500px] lg:top-[-800px]
        left-1/2 transform -translate-x-1/2
        w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]
        lg:w-[800px] lg:h-[800px] xl:w-[1000px] xl:h-[1000px]
        rounded-full bg-[#2BE0F1]
        blur-[150px] sm:blur-[300px] lg:blur-[400px]
        animate-pulse-slow
      "
    />

    {/* Yellow accent blur */}
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 0.3, x: 0 }}
      transition={{ duration: 2, ease: "easeOut", delay: 5 }}
      className="
        absolute top-[200px] sm:top-[100px] lg:top-0
        -right-[200px] sm:-right-[200px] lg:-right-[300px]
        w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]
        lg:w-[500px] lg:h-[500px] xl:w-[800px] xl:h-[800px]
        rounded-full bg-[#E7D43B]
        blur-[100px] sm:blur-[200px] lg:blur-[400px]
        animate-float
      "
    />

    {/* Purple blur for depth */}
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 0.2, x: 0 }}
      transition={{ duration: 3, ease: "easeOut", delay: 5 }}
      className="
        absolute bottom-[100px]
        left-[-100px] sm:left-[-150px] lg:left-[-200px]
        w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px]
        rounded-full bg-[#8B5CF6]
        blur-[80px] sm:blur-[120px] lg:blur-[200px]
        animate-bounce-slow
      "
    />
  </div>
);

// ============ HERO SECTION COMPONENTS ============

const MainLogo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 2.5,
        ease: "easeOut",
        delay: 1
      }}
      className="flex items-center justify-center"
    >
      <div className="
        w-38 h-38 sm:w-48 sm:h-48 md:w-64 md:h-64
        lg:w-80 lg:h-80 xl:w-96 xl:h-96
        rounded-full flex items-center justify-center
        transform hover:scale-105 transition-all duration-500
      ">
        <img
          src="/images/logo-ksm.png"
          alt="KSM-IF Logo"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
    </motion.div>
  );
};

const TitleSection = () => {
  return (
    <div className="text-center relative -top-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          ease: "easeOut",
          type: "spring",
          bounce: 0.3,
          delay: 3
        }}
      >
        <h1 className="
          text-2xl lg:text-7xl xl:text-8xl
          font-bold text-white mb-4 sm:mb-6 lg:mb-8
          tracking-wider sm:tracking-widest leading-tight
          transform hover:scale-105 transition-transform duration-300
          drop-shadow-2xl
        ">
          WE NOT ME
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 4 }}
      >
        <p className="
          text-sm sm:text-lg md:text-xl lg:text-2xl text-white/80
          font-light tracking-wide
        ">
          Kelompok Studi Mahasiswa Informatika
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 4 }}
      >
        <p className="
          text-xs sm:text-sm md:text-base lg:text-lg text-white/60
          font-light mt-2 sm:mt-4 tracking-widest uppercase
        ">
          Universitas Surabaya
        </p>
      </motion.div>
    </div>
  );
};

const CTAButtons = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 5 }}
      className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <CTAButton variant="primary">Learn More</CTAButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        delay={2600}
      >
        <CTAButton variant="secondary">Join Us</CTAButton>
      </motion.div>
    </motion.div>
  );
};

const CTAButton = ({ children, variant = 'primary' }) => {
  const baseClasses = `
    px-6 sm:px-8 py-3 sm:py-4 text-white font-medium
    rounded-full backdrop-blur-sm transition-all duration-300
    transform hover:scale-105 hover:shadow-lg text-sm sm:text-base
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

const ScrollIndicator = () => {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Jika sudah di bagian bawah (dengan toleransi 50px)
      if (scrollTop + windowHeight >= docHeight - 50) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {!isBottom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center text-white/60 animate-bounce">
            <span className="text-xs mb-2 tracking-wide">Scroll Down</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============ ABOUT SECTION ============

const AboutSection = () => {
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto gap-8 lg:gap-16">

        {/* Text Area */}
        <motion.div
          variants={fadeInLeft}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.8 }}
          custom={0.2}
          className="text-left text-white lg:flex-1"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            About Us
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed opacity-80 mb-6">
            An Informatics Engineering student organization, established on the University of Surabaya Campus since 1999. We are located at the TC 2.3 Building, University of Surabaya.
          </p>
          <button className="bg-[#2BE0F1]/20 hover:bg-[#2BE0F1]/30 border border-[#2BE0F1]/50 hover:border-[#2BE0F1]/70 px-6 py-3 text-white font-medium rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
            Check out what we do
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* Image Area */}
        <motion.div
          variants={fadeInRight}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.8 }}
          custom={0.2}
          className="w-48 sm:w-56 md:w-64 lg:w-72"
        >
          <img
            src="/images/asset1.png"
            alt="About Us Illustration"
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
};

// ============ VISION & MISSION SECTION ============

const VisionMissionSection = () => {
  const [visionRef, isVisionVisible] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [missionRef, isMissionVisible] = useInView({ triggerOnce: true, threshold: 0.3 });

  const missions = [
    {
      number: "1",
      title: "Organizing activities that can develop students' potential in the field of Computer Science",
      color: "bg-[#2BE0F1]"
    },
    {
      number: "2",
      title: "Empowering all available resources to improve the quality of engineering faculty students, especially KSM IF",
      color: "bg-[#E7D43B]"
    },
    {
      number: "3",
      title: "Being proactive in identifying the needs and desires of engineering faculty students in the field of Computer Science",
      color: "bg-[#8B5CF6]"
    },
    {
      number: "4",
      title: "Expanding the knowledge of Computer Science students as a means to accommodate the needs of students in this field",
      color: "bg-[#F59E0B]"
    }
  ];

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">

        {/* Vision */}
        <div ref={visionRef} className="text-center mb-24 sm:mb-32 lg:mb-40">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isVisionVisible ? "animate" : "initial"}
            custom={0}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-12 lg:mb-16">
              Our Vision
            </h2>
          </motion.div>

          <motion.div
            variants={fadeInScale}
            initial="initial"
            animate={isVisionVisible ? "animate" : "initial"}
            custom={1}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12 lg:p-16 hover:bg-white/10 transition-all duration-1000 max-w-4xl mx-auto"
          >
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed">
              To be an organization capable of accommodating, expanding knowledge, and realizing the aspirations of engineering faculty students related to Computer Science.
            </p>
          </motion.div>
        </div>

        {/* Mission */}
        <div ref={missionRef} className="text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isMissionVisible ? "animate" : "initial"}
            custom={0}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-12 lg:mb-16">
              Our Mission
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.number}
                variants={fadeInUp}
                initial="initial"
                animate={isMissionVisible ? "animate" : "initial"}
                custom={index + 1}
              >
                <MissionCard
                  number={mission.number}
                  title={mission.title}
                  numberBg={mission.color}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const MissionCard = ({ number, title, numberBg }) => (
  <div className="relative rounded-2xl p-6 sm:p-8 hover:scale-105 transition-transform duration-300 overflow-hidden group">
    {/* Layer 1: Background Rectangle dengan warna #120D2C dan opacity 50% */}
    <div className="absolute inset-0 bg-[#120D2C] opacity-50 rounded-2xl"></div>

    {/* Layer 2: Mask Group dengan 2 Eclipse blur effect (atas dan bawah) */}
    <div className="absolute inset-0 rounded-2xl overflow-hidden">
      {/* Eclipse atas */}
      <div className="absolute -top-16 -left-16 w-40 h-32 bg-white rounded-full opacity-20 blur-[100px] group-hover:opacity-30 transition-opacity duration-300"></div>
      {/* Eclipse bawah */}
      <div className="absolute -bottom-16 -right-16 w-40 h-32 bg-white rounded-full opacity-20 blur-[100px] group-hover:opacity-30 transition-opacity duration-300"></div>
    </div>

    {/* Layer 3: Stroke border dengan warna putih dan opacity 50% */}
    <div className="absolute inset-0 border border-white/50 rounded-2xl group-hover:border-white/70 transition-colors duration-300"></div>

    {/* Content */}
    <div className="relative z-10">
      <div className={`${numberBg} text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {number}
      </div>
      <p className="text-white/90 text-base sm:text-lg leading-relaxed">
        {title}
      </p>
    </div>
  </div>
);

// ============ SECTION DIVIDER ============

const SectionDivider = () => {
  const [dividerRef, isVisible] = useInView();

  return (
    <div ref={dividerRef} className="relative z-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-0.5 origin-center"
          style={{
            background: 'linear-gradient(to right, transparent 0%, #6434F1 35%, #FFFFFF 45%, #FFFFFF 55%, #6434F1 65%, transparent 100%)'
          }}
        />
      </div>
    </div>
  );
};

// ============ OUR TEAM SECTION ============

const TeamMember = ({ name, position, image, index, isVisible }) => (
  <motion.div
    initial={fadeInUp.initial}
    animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 * index }}
    className="text-center"
  >
    {/* Photo with gradient background */}
    <div className="relative mb-8">
      {/* Gradient circle background */}
      <div className="absolute inset-0 w-44 h-44 mx-auto rounded-full bg-[#875cf1] opacity-75 blur-[100px] animate-pulse-slow"></div>

      {/* Photo */}
      <div className="relative w-64 h-64 mx-auto rounded-lg overflow-hidden group">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
    </div>

    {/* Gradient line */}
    <div className="mb-8">
      <div
        className="h-0.5 max-w-64 mx-auto"
        style={{
          background: 'linear-gradient(to right, transparent 0%, #6434F1 35%, #FFFFFF 45%, #FFFFFF 55%, #6434F1 65%, transparent 100%)'
        }}
      ></div>
    </div>

    {/* Name and position */}
    <h3 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-3 hover:text-[#2BE0F1] transition-colors duration-300">{name}</h3>
    <p className="text-lg lg:text-xl xl:text-2xl text-white/70">{position}</p>
  </motion.div>
);

const OurTeamSection = () => {
  const [teamRef, isVisible] = useInView();

  const teamMembers = [
    { name: "Satya Aryaputra Wigiyanto", position: "Head of KSM IF", image: "/images/fransiscus.png" },
    { name: "Fanny Rorencia Ribowo", position: "Vice Head of KSM IF", image: "/images/fransiscus.png" },
    { name: "Safira Ramaditha", position: "Secretary of KSM IF", image: "/images/fransiscus.png" },
    { name: "Fransiscus Xaverius Petrus Jonathan Suhargo", position: "Treasurer of KSM IF", image: "/images/fransiscus.png" }
  ];

  return (
    <section ref={teamRef} className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={fadeInUp.initial}
          animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 lg:mb-12">
            Our Team
          </h2>
        </motion.div>

        <motion.div
          initial={fadeInUp.initial}
          animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed mb-12 lg:mb-16">
            We are comprised of four department, internal relation, public relation, human resource development, and creative design department.
          </p>
        </motion.div>

        <motion.div
          initial={fadeInUp.initial}
          animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="flex justify-center mb-16"
        >
          <button className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 px-8 py-4 text-white font-medium rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 text-lg">
            Executive Board
          </button>
        </motion.div>

        {/* Team Members Grid - 2x2 layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-32 gap-y-24 mb-20 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              position={member.position}
              image={member.image}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* See full team button */}
        <motion.div
          initial={fadeInUp.initial}
          animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          className="flex justify-center"
        >
          <button className="bg-[#6434F1] hover:bg-[#5228E8] px-8 py-4 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 text-lg shadow-lg hover:shadow-xl">
            See our full team
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// ============ ONGOING EVENT SECTION ============

// ============ ONGOING EVENT SECTION ============

const OngoingEventSection = () => {
  const [eventRef, isVisible] = useInView();

  return (
    <section ref={eventRef} className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 max-h-screen min-h-fit flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={fadeInUp.initial}
          animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 lg:mb-12">
            Ongoing Event
          </h2>
        </motion.div>

        <motion.div
          initial={fadeInUp.initial}
          animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed">
            There aren't any ongoing events currently. Thank you.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ============ GALLERY SECTION ============

const GalleryItem = ({ image, title, index, isVisible }) => (
  <motion.div
    initial={fadeInUp.initial}
    animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 * index }}
    className="relative group cursor-pointer overflow-hidden rounded-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
  >
    {/* Image */}
    <div className="aspect-video w-full overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>

    {/* Overlay with gradient and title */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-semibold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {title}
        </h3>
      </div>
    </div>

    {/* Subtle border glow effect */}
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg transition-colors duration-300"></div>
  </motion.div>
);

const GallerySection = () => {
  const [galleryRef, isVisible] = useInView();

  const galleryItems = [
    { image: "/images/event1.png", title: "Workshop Web Development" },
    { image: "/images/event1.png", title: "Seminar AI & Machine Learning" },
    { image: "/images/event1.png", title: "Hackathon Competition 2024" },
    { image: "/images/event1.png", title: "Study Tour to Tech Company" },
    { image: "/images/event1.png", title: "Programming Bootcamp" },
    { image: "/images/event1.png", title: "Alumni Networking Event" }
  ];

  return (
    <section ref={galleryRef} className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={fadeInUp.initial}
            animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
              Gallery
            </h2>
          </motion.div>

          <motion.div
            initial={fadeInUp.initial}
            animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <p className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed">
              Events and activities from KSM IF during the current period.
            </p>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {galleryItems.map((item, index) => (
            <GalleryItem
              key={index}
              image={item.image}
              title={item.title}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={fadeInUp.initial}
          animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          className="text-center"
        >
          <button className="bg-[#6434F1] hover:bg-[#5228E8] px-8 py-4 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 text-lg shadow-lg hover:shadow-xl">
            View More
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// ============ FOOTER SECTION ============

const SocialIcon = ({ icon, color, href }) => (
  <a
    href={href}
    className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl`}
  >
    {icon}
  </a>
);

const Footer = () => {
  const [footerRef, isVisible] = useInView();

  return (
    <footer ref={footerRef} className="relative z-10 overflow-hidden rounded-tl-[50px] rounded-tr-[50px]">
      {/* Gradient Border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-px origin-center"
        style={{
          background: 'linear-gradient(to right, #302176 0%, #120D2C 56%, #120D2C 74%, #302176 100%)'
        }}
      />

      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Layer 2: Ellipse 4 - Lingkaran bawah dengan blur */}
        <div className="absolute -bottom-72 left-1/2 transform -translate-x-1/2 w-134 h-134 bg-[#A683FF] rounded-full blur-[120px] animate-pulse-slow"></div>

        {/* Layer 3: Ellipse kiri - Hitam dengan blur */}
        <div className="absolute top-1/2 -left-48 transform -translate-y-1/2 w-134 h-134 bg-black rounded-full blur-[120px]"></div>

        {/* Layer 4: Ellipse kanan - Hitam dengan blur */}
        <div className="absolute top-1/2 -right-48 transform -translate-y-1/2 w-134 h-134 bg-black rounded-full blur-[120px]"></div>
      </div>

      {/* Content dengan background overlay untuk readability */}
      <div className="relative z-10 bg-[#1a1447]/65 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">

            {/* Left Column - Address & Email */}
            <motion.div
              initial={fadeInLeft.initial}
              animate={isVisible ? fadeInLeft.animate : fadeInLeft.initial}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              {/* Address Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Address</h3>
                <div className="text-white/80 leading-relaxed">
                  <p>Gedung TC 2.3 Universitas Surabaya</p>
                  <p>Jl. Raya Kali Rungkut, Surabaya, Jawa Timur (60293)</p>
                </div>
              </div>

              {/* Email Section */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Email</h3>
                <p className="text-white/80">ksm.if.ubaya@gmail.com</p>
              </div>
            </motion.div>

            {/* Right Column - Social Media */}
            <motion.div
              initial={fadeInRight.initial}
              animate={isVisible ? fadeInRight.animate : fadeInRight.initial}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Our Socials</h3>
              <div className="flex gap-4">
                <SocialIcon
                  icon={
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  }
                  color="bg-red-600 hover:bg-red-700"
                  href="#"
                />
                <SocialIcon
                  icon={
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  }
                  color="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  href="#"
                />
                <SocialIcon
                  icon={
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  }
                  color="bg-green-500 hover:bg-green-600"
                  href="#"
                />
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
            initial={fadeInUp.initial}
            animate={isVisible ? fadeInUp.animate : fadeInUp.initial}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            className="border-t border-white/20 pt-8 text-center"
          >
            <p className="text-white/70">
              Copyright ©2024 | KSM Informatika Universitas Surabaya
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

// ============ MAIN APP COMPONENT ============

export default function App() {
  return (
    <>
      {/* Main Container */}
      <div className="min-h-screen w-full relative overflow-hidden" style={{
        background: 'linear-gradient(to bottom, #302176 0%, #120D2C 56%, #120D2C 74%, #302176 100%)'
      }}>

        {/* Background Effects */}
        <BackgroundBlurs />

        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
          <MainLogo />
          <TitleSection />
          <CTAButtons />
        </main>

        {/* Scroll Indicator */}
        <ScrollIndicator />

        {/* Content Sections */}
        <AboutSection />
        <VisionMissionSection />
        <SectionDivider />
        <OurTeamSection />
        <OngoingEventSection />
        <GallerySection />
        <Footer />

      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        /* ============ KEYFRAME ANIMATIONS ============ */

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

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-slide-right {
          animation: slide-right 0.8s ease-out forwards;
        }

        .animate-slide-left {
          animation: slide-left 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        /* ============ CUSTOM EASING ============ */

        .ease-spring {
          transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .ease-bounce {
          transition-timing-function: cubic-bezier(0.68, -0.6, 0.32, 1.6);
        }

        .ease-smooth {
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* ============ HERO LOADING ANIMATIONS ============ */

        @keyframes hero-load {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .hero-animate {
          animation: hero-load 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* ============ GLOWING EFFECTS ============ */

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(46, 224, 241, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(46, 224, 241, 0.6);
          }
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        /* ============ HOVER ENHANCEMENTS ============ */

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
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

        /* ============ SCROLL SMOOTH ============ */

        html {
          scroll-behavior: smooth;
        }

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
      `}</style>
    </>
  );
}
