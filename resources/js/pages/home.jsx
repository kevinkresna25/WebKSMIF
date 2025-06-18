import Layout from '../components/layouts/layout';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence} from 'framer-motion';
import animations from '../utilities/animations';
import RegistrationModal from '../components/ui/registrationModal';
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
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
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

// EventCard Component
const EventCard = ({ event, index, onRegister }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
    >
      {/* Event Image */}
      {event.image && (
        <div className="aspect-video w-full mb-6 rounded-lg overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Event Details */}
      <div className="text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          {event.title}
        </h3>

        <p className="text-white/80 text-lg leading-relaxed mb-6">
          {event.description}
        </p>

        {/* Event Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-[#2BE0F1] text-sm font-medium mb-1">📅 Tanggal</div>
            <div className="text-white text-lg font-semibold">
              {new Date(event.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-[#2BE0F1] text-sm font-medium mb-1">⏰ Waktu</div>
            <div className="text-white text-lg font-semibold">{event.time}</div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-[#2BE0F1] text-sm font-medium mb-1">📍 Lokasi</div>
            <div className="text-white text-lg font-semibold">{event.location}</div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-[#2BE0F1] text-sm font-medium mb-1">👥 Kapasitas</div>
            <div className="text-white text-lg font-semibold">
              {event.registeredCount || 0}/{event.maxCapacity} peserta
            </div>
          </div>
        </div>

        {/* Registration Status */}
        <div className="mb-6">
          {event.status === 'open' && (
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-green-400 font-medium">Pendaftaran Dibuka</span>
            </div>
          )}
          {event.status === 'closing' && (
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-yellow-400 font-medium">Pendaftaran Segera Ditutup</span>
            </div>
          )}
          {event.status === 'closed' && (
            <div className="inline-flex items-center px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
              <span className="text-red-400 font-medium">Pendaftaran Ditutup</span>
            </div>
          )}
          {event.status === 'full' && (
            <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              <span className="text-purple-400 font-medium">Kuota Penuh</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Registration Button */}
          {(event.status === 'open' || event.status === 'closing') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRegister(event)}
              className="bg-[#6434F1] hover:bg-[#5228E8] px-8 py-4 text-white font-bold rounded-full transition-all duration-300 transform hover:shadow-lg text-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Daftar Sekarang
            </motion.button>
          )}

          {/* Info Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 px-8 py-4 text-white font-medium rounded-full backdrop-blur-sm transition-all duration-300 transform hover:shadow-lg text-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Info Lengkap
          </motion.button>
        </div>

        {/* Deadline Warning */}
        {event.registrationDeadline && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg"
          >
            <div className="text-orange-400 text-sm font-medium mb-1">⚠️ Deadline Pendaftaran</div>
            <div className="text-white">
              {new Date(event.registrationDeadline).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Event Component
const OngoingEventSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock data
  const [ongoingEvents] = useState([
    {
      id: 1,
      title: "Workshop React Advanced 2025",
      description: "Workshop mendalam tentang React hooks, context API, dan performance optimization untuk developer level intermediate hingga advanced.",
      date: "2025-01-25",
      time: "09:00 - 16:00 WIB",
      location: "Lab Komputer TC 2.3",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      maxCapacity: 30,
      registeredCount: 18,
      status: "open",
      registrationDeadline: "2025-01-23T23:59:00"
    },
    {
      id: 2,
      title: "Hackathon 48 Hours Challenge",
      description: "Kompetisi coding 48 jam untuk menciptakan solusi inovatif dengan tema sustainability dan teknologi hijau.",
      date: "2025-02-15",
      time: "08:00 - 17:00 WIB",
      location: "Auditorium Utama",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop",
      maxCapacity: 50,
      registeredCount: 35,
      status: "closing",
      registrationDeadline: "2025-02-10T23:59:00"
    }
  ]);

  const handleRegistration = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const hasOngoingEvents = ongoingEvents && ongoingEvents.length > 0;

  return (
    <div className="min-h-fit ">
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 lg:mb-12">
              Ongoing Event
            </h2>
          </motion.div>

          {/* Events Content */}
          {hasOngoingEvents ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {ongoingEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  onRegister={handleRegistration}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-white/30 text-8xl mb-6">📅</div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
                Tidak Ada Event Berlangsung
              </h3>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Saat ini tidak ada event yang sedang berlangsung.
                Pantau terus media sosial kami untuk informasi event terbaru!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={selectedEvent}
      />
    </div>
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
