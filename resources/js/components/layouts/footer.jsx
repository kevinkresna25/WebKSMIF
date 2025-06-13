import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import animations from '../../utilities/animations';

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
              initial={animations.fade.fadeInLeft.initial}
              animate={isVisible ? animations.fade.fadeInLeft.animate : animations.fade.fadeInLeft.initial}
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
              initial={animations.fade.fadeInRight.initial}
              animate={isVisible ? animations.fade.fadeInRight.animate : animations.fade.fadeInRight.initial}
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
            initial={animations.fade.fadeInUp.initial}
            animate={isVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp.initial}
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

const SocialIcon = ({ icon, color, href }) => (
  <a
    href={href}
    className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl`}
  >
    {icon}
  </a>
);

// Social Media Icons (simplified)
const YoutubeIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
  </svg>
);

export default Footer;
