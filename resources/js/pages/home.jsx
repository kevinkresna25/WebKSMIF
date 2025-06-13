import Layout from '../components/layouts/layout';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence} from 'framer-motion';
import animations from '../utilities/animations';
import { useInView } from '../hooks/useInView';

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
          variants={animations.fade.fadeInLeft}
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
          variants={animations.fade.fadeInRight}
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
            variants={animations.fade.fadeInUp}
            initial="initial"
            animate={isVisionVisible ? "animate" : "initial"}
            custom={0}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-12 lg:mb-16">
              Our Vision
            </h2>
          </motion.div>

          <motion.div
            variants={animations.fade.fadeInScale}
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
            variants={animations.fade.fadeInUp}
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
                variants={animations.fade.fadeInUp}
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
    initial={animations.fade.fadeInUp}
    animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
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
          initial={animations.fade.fadeInUp}
          animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 lg:mb-12">
            Our Team
          </h2>
        </motion.div>

        <motion.div
          initial={animations.fade.fadeInUp}
          animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed mb-12 lg:mb-16">
            We are comprised of four department, internal relation, public relation, human resource development, and creative design department.
          </p>
        </motion.div>

        <motion.div
          initial={animations.fade.fadeInUp}
          animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
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
          initial={animations.fade.fadeInUp}
          animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
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

const OngoingEventSection = () => {
  const [eventRef, isVisible] = useInView();

  return (
    <section ref={eventRef} className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 max-h-screen min-h-fit flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={animations.fade.fadeInUp}
          animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 lg:mb-12">
            Ongoing Event
          </h2>
        </motion.div>

        <motion.div
          initial={animations.fade.fadeInUp}
          animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
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
    initial={animations.fade.fadeInUp}
    animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
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
            initial={animations.fade.fadeInUp}
            animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
              Gallery
            </h2>
          </motion.div>

          <motion.div
            initial={animations.fade.fadeInUp}
            animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
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
          initial={animations.fade.fadeInUp}
          animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp}
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

const Home= () => {
    return (
        <Layout>
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
        </Layout>
    )
}

export default Home;
