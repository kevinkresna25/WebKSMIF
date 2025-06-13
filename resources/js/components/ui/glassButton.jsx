import { motion } from 'framer-motion';
import { useState } from 'react';

const GlassButton = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  active = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: `
      ${active
        ? 'bg-white/30 border-white/60 text-white shadow-lg'
        : 'bg-[#5039BD]/20 border-[#5039BD]/50 hover:bg-[#5039BD]/30 hover:border-[#5039BD]/70 text-white'
      }
    `,
    secondary: `
      ${active
        ? 'bg-white/30 border-white/60 text-white shadow-lg'
        : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50 text-white'
      }
    `,
    accent: `
      ${active
        ? 'bg-[#2BE0F1]/40 border-[#2BE0F1]/80 text-white shadow-lg'
        : 'bg-[#2BE0F1]/20 border-[#2BE0F1]/50 hover:bg-[#2BE0F1]/30 hover:border-[#2BE0F1]/70 text-white'
      }
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: disabled ? 1 : (active ? 1.02 : 1.05) }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        relative overflow-hidden rounded-2xl font-medium
        backdrop-blur-sm border transition-all duration-300
        ${variants[variant]} ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:shadow-xl'}
        ${active ? 'scale-105' : ''}
        group ${className}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/10" />
        <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-white/5" />
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered || active ? 0.3 : 0,
          scale: isHovered || active ? 1.02 : 1
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
          filter: 'blur(10px)'
        }}
      />

      <span className="relative z-10 tracking-wide font-semibold">
        {children}
      </span>
    </motion.button>
  );
};

export default GlassButton;
