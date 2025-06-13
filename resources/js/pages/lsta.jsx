import Layout from "../components/layouts/layout";
import { motion, AnimatePresence } from "framer-motion";
import animations from "../utilities/animations";
import { useInView } from "../hooks/useInView";
import { useState, useEffect } from "react";

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
        w-96 h-66 sm:w-[500px] sm:h-[300px] md:w-[600px] md:h-[400px]
        lg:w-[700px] lg:h-[500px] xl:w-[800px] xl:h-[400px] 2xl:w-[900px] 2xl:h-[500px]
        rounded-full flex items-center justify-center
        transform hover:scale-105 transition-all duration-500
      ">
        <img
          src="/images/logo-bursa.png"
          alt="KSM-IF Logo"
          className="w-fit h-fit object-contain drop-shadow-2xl"
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
          About Bursa Soal
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
          A collection of Informatics Engineering exam questions for UTS and UAS. Good luck on your exam!
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
        <CTAButton variant="primary">Link Soal</CTAButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        delay={2600}
      >
        <CTAButton variant="secondary">Link Kuesioner</CTAButton>
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

const SectionDivider = () => {
  const [dividerRef, isVisible] = useInView();

  return (
    <div ref={dividerRef} className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
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

const ScrollIndicator = () => {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Jika sudah di bagian bawah (dengan toleransi 100px)
      if (scrollTop + windowHeight >= docHeight - 100) {
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
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          style={{ zIndex: 9998 }}
        >
          <div className="flex flex-col items-center text-white/70 px-3 py-2">
            <span className="text-xs mb-1 tracking-wide">About LSTA</span>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LinkButton = ({ children, onClick, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-[#6434F1] hover:bg-[#5228E8] border-[#6434F1]',
    secondary: 'bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        px-8 py-4 text-white font-medium rounded-full
        backdrop-blur-sm border transition-all duration-300
        transform hover:shadow-lg text-lg
        ${variants[variant]}
      `}
    >
      {children}
    </motion.button>
  );
};

const RequirementsList = ({ title, items, isVisible, index }) => (
  <motion.div
    variants={animations.fade.fadeInUp}
    initial="initial"
    animate={isVisible ? "animate" : "initial"}
    custom={index}
    className="flex-1"
  >
    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
      {title}
    </h3>
    <div className="space-y-4">
      {items.map((item, itemIndex) => (
        <motion.div
          key={itemIndex}
          initial={{ opacity: 0, x: title === 'Penyaji' ? -20 : 20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: title === 'Penyaji' ? -20 : 20 }}
          transition={{ duration: 0.6, delay: 0.1 * itemIndex + 0.5 }}
          className="flex items-start space-x-3"
        >
          <div className="w-2 h-2 bg-[#2BE0F1] rounded-full mt-2 flex-shrink-0"></div>
          <p className="text-white/90 text-base sm:text-lg leading-relaxed">
            {item}
          </p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const AboutLSTASection = () => {
  const [sectionRef, isVisible] = useInView();
  const [requirementsRef, isRequirementsVisible] = useInView();

  const penyajiRequirements = [
    "Surat Maju Sidang lengkap dengan tanda tangan dosen pembimbing",
    "Sertifikat Pendengar LSTA (1 sertifikat)",
    "Abstraksi lengkap dengan NAMA, NRP, serta JUDUL TUGAS AKHIR (dikumpulkan sebanyak 30 lembar dimasukkan ke map cokelat)",
    "PPT untuk Presentasi LSTA dengan format NRP_NAMA_(Pengiriman ke berapa)"
  ];

  const pendengarRequirements = [
    "Sudah menempuh 90 SKS",
    "Bagi mahasiswa yang memiliki Kartu Biru, kartu tersebut dapat dilampirkan dalam form pendaftaran"
  ];

  return (
    <>
      {/* About LSTA Section */}
      <section ref={sectionRef} className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">

          <motion.div
            variants={animations.fade.fadeInUp}
            initial="initial"
            animate={isVisible ? "animate" : "initial"}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
              About LSTA
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed">
                LSTA (Latihan Sidang Tugas Akhir) merupakan kegiatan Jurusan Informatika
                yang ditujukan untuk mahasiswa tingkat 3 dalam menghadapi Tugas Akhir.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={animations.fade.fadeInUp}
            initial="initial"
            animate={isVisible ? "animate" : "initial"}
            custom={0.2}
            className="text-center mb-16"
          >
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              PERSYARATAN LSTA
            </h3>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Beberapa persyaratan yang harus dipenuhi untuk menjadi peserta LSTA.
            </p>
          </motion.div>

          <div ref={requirementsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <RequirementsList
              title="Penyaji"
              items={penyajiRequirements}
              isVisible={isRequirementsVisible}
              index={0}
            />
            <RequirementsList
              title="Pendengar"
              items={pendengarRequirements}
              isVisible={isRequirementsVisible}
              index={0.3}
            />
          </div>

          <motion.div
            variants={animations.fade.fadeInUp}
            initial="initial"
            animate={isRequirementsVisible ? "animate" : "initial"}
            custom={0.6}
            className="mt-20"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto">
              <div className="text-center">
                <h4 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  Informasi Penting
                </h4>
                <p className="text-lg text-white/80 leading-relaxed mb-8">
                  LSTA adalah kesempatan berharga untuk melatih kemampuan presentasi dan
                  mempersiapkan diri menghadapi sidang tugas akhir yang sesungguhnya.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LinkButton variant="primary">
                    Daftar Sekarang
                  </LinkButton>
                  <LinkButton variant="secondary">
                    Pelajari Lebih Lanjut
                  </LinkButton>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const Lsta = () => {
    return(
        <Layout>
            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
                <MainLogo />
                <TitleSection />
                <CTAButtons />
            </main>

            <ScrollIndicator />
            <SectionDivider />
            <AboutLSTASection />
        </Layout>
    );
};

export default Lsta;
