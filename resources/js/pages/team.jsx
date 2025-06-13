import Layout from '../components/layouts/layout';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import animations from '../utilities/animations';
import { useInView } from '../hooks/useInView';
import GlassButton from '../components/ui/glassButton';

// Team Member Component (sama seperti di home)
const TeamMember = ({ name, position, image, index, isVisible }) => (
  <motion.div
    initial={animations.fade.fadeInUp}
    animate={isVisible ? animations.fade.fadeInUp.animate(index) : animations.fade.fadeInUp}
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
    <h3 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-3 hover:text-[#2BE0F1] transition-colors duration-300">
      {name}
    </h3>
    <p className="text-lg lg:text-xl xl:text-2xl text-white/70">
      {position}
    </p>
  </motion.div>
);

// Division Button Component
const DivisionButton = ({ title, active = false, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <button
        onClick={onClick}
        className={`
          relative overflow-hidden rounded-2xl px-6 py-4 sm:px-8 sm:py-5
          font-semibold text-sm sm:text-base lg:text-lg
          backdrop-blur-sm border transition-all duration-300
          group min-w-[120px] transform
          ${active
            ? 'bg-white/30 border-white/60 text-white shadow-xl scale-105'
            : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50 text-white hover:shadow-lg hover:scale-105'
          }
        `}
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </div>

        <span className="relative z-10 tracking-wide">
          {title}
        </span>
      </button>
    </motion.div>
  );
};

// Team Members by Division Component
const TeamMembersByDivision = ({ activeDivision }) => {
  const [membersRef, isMembersVisible] = useInView();

  // Data team members untuk setiap division
  const teamData = {
    BPH: [
      { name: "Satya Aryaputra Wigiyanto", position: "Head of KSM IF", image: "/images/fransiscus.png" },
      { name: "Fanny Rorencia Ribowo", position: "Vice Head of KSM IF", image: "/images/fransiscus.png" },
      { name: "Safira Ramaditha", position: "Secretary of KSM IF", image: "/images/fransiscus.png" },
      { name: "Safira Ramaditha", position: "Secretary of KSM IF", image: "/images/fransiscus.png" },
      { name: "Fransiscus Xaverius Petrus Jonathan Suhargo", position: "Treasurer of KSM IF", image: "/images/fransiscus.png" }
    ],
    IRD: [
      { name: "John Doe", position: "IRD Head", image: "/images/fransiscus.png" },
      { name: "Jane Smith", position: "IRD Vice Head", image: "/images/fransiscus.png" },
      { name: "Bob Wilson", position: "IRD Member", image: "/images/fransiscus.png" },
      { name: "Alice Brown", position: "IRD Member", image: "/images/fransiscus.png" }
    ],
    PRD: [
      { name: "Mike Johnson", position: "PRD Head", image: "/images/fransiscus.png" },
      { name: "Sarah Davis", position: "PRD Vice Head", image: "/images/fransiscus.png" },
      { name: "Tom Miller", position: "PRD Member", image: "/images/fransiscus.png" },
      { name: "Lisa Garcia", position: "PRD Member", image: "/images/fransiscus.png" }
    ],
    HRDD: [
      { name: "David Lee", position: "HRDD Head", image: "/images/fransiscus.png" },
      { name: "Emma Wilson", position: "HRDD Vice Head", image: "/images/fransiscus.png" },
      { name: "Ryan Taylor", position: "HRDD Member", image: "/images/fransiscus.png" },
      { name: "Sophie Anderson", position: "HRDD Member", image: "/images/fransiscus.png" }
    ],
    CDD: [
      { name: "Alex Chen", position: "CDD Head", image: "/images/fransiscus.png" },
      { name: "Maya Patel", position: "CDD Vice Head", image: "/images/fransiscus.png" },
      { name: "Jake Thompson", position: "CDD Member", image: "/images/fransiscus.png" },
      { name: "Zoe Martinez", position: "CDD Member", image: "/images/fransiscus.png" }
    ]
  };

  const currentMembers = teamData[activeDivision] || teamData.BPH;

  return (
    <section ref={membersRef} className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-6xl mx-auto">

        {/* Division Title */}
        <motion.div
          key={activeDivision}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {activeDivision === 'BPH' && 'Badan Pengurus Harian'}
            {activeDivision === 'IRD' && 'Internal Relation Department'}
            {activeDivision === 'PRD' && 'Public Relation Department'}
            {activeDivision === 'HRDD' && 'Human Resource Development Department'}
            {activeDivision === 'CDD' && 'Creative Design Department'}
          </h3>
          <div className="h-1 w-24 bg-gradient-to-r from-[#6434F1] to-[#2BE0F1] mx-auto rounded-full"></div>
        </motion.div>

        {/* Team Members Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDivision}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-16 lg:gap-x-16 lg:gap-y-24"
          >
            {currentMembers.map((member, index) => (
              <TeamMember
                key={`${activeDivision}-${index}`}
                name={member.name}
                position={member.position}
                image={member.image}
                index={index}
                isVisible={isMembersVisible}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// Main Team Component
const Team = () => {
  const [titleRef, isTitleVisible] = useInView();
  const [activeDivision, setActiveDivision] = useState('BPH');

  const divisions = [
    { id: 'BPH', title: 'BPH' },
    { id: 'IRD', title: 'IRD' },
    { id: 'PRD', title: 'PRD' },
    { id: 'HRDD', title: 'HRDD' },
    { id: 'CDD', title: 'CDD' },
  ];

  return (
    <Layout>
      <main className="relative z-10 flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">

        {/* Hero Section */}
        <div ref={titleRef} className="text-center relative top-16 mb-20">
          <motion.div
            variants={animations.fade.fadeInUp}
            initial="initial"
            animate={isTitleVisible ? "animate" : "initial"}
            custom={0}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 sm:mb-8 lg:mb-10 tracking-wider sm:tracking-widest leading-tight transform hover:scale-105 transition-transform duration-300 drop-shadow-2xl">
              Our Team
            </h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 font-light tracking-wide max-w-4xl mx-auto leading-relaxed"
              variants={animations.fade.fadeInUp}
              initial="initial"
              animate={isTitleVisible ? "animate" : "initial"}
              custom={0.2}
            >
              We are comprised of four departments, internal relation, public relation, human resource development, and creative design.
            </motion.p>
          </motion.div>
        </div>

        {/* Division Selection Buttons */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 mb-8">
          <div className="text-center flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            {divisions.map((division, index) => (
              <DivisionButton
                key={division.id}
                title={division.title}
                active={activeDivision === division.id}
                onClick={() => setActiveDivision(division.id)}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Team Members Display */}
        <TeamMembersByDivision activeDivision={activeDivision} />

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              Join Our Team
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              Interested in becoming part of KSM Informatika? We're always looking for passionate students to join our departments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#6434F1] hover:bg-[#5228E8] px-8 py-4 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 text-lg shadow-lg hover:shadow-xl">
                Apply Now
              </button>
              <button className="bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 px-8 py-4 text-white font-medium rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 text-lg">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </Layout>
  );
};

export default Team;
