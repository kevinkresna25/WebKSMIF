import Layout from "../components/layouts/layout";
import { motion, AnimatePresence } from "framer-motion";
import animations from "../utilities/animations";
import { useInView } from "../hooks/useInView";
import { useState } from "react";

// Gallery Item Component
const GalleryItem = ({ image, title, date, category, index, isVisible }) => (
  <motion.div
    initial={animations.fade.fadeInUp.initial}
    animate={isVisible ? animations.fade.fadeInUp.animate(index) : animations.fade.fadeInUp.initial}
    transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
    className="relative group cursor-pointer overflow-hidden rounded-xl transform transition-all duration-100 hover:scale-105 hover:shadow-2xl"
  >
    {/* Image */}
    <div className="aspect-video w-full overflow-hidden bg-gray-800">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          e.target.src = "/images/placeholder.png"; // Fallback image
        }}
      />
    </div>

    {/* Category Badge */}
    <div className="absolute top-4 left-4 z-10">
      <span className="bg-[#6434F1]/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
        {category}
      </span>
    </div>

    {/* Overlay with gradient and content */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-white font-semibold text-lg mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {title}
        </h3>
        {date && (
          <p className="text-white/80 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
            {new Date(date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
      </div>
    </div>

    {/* Subtle border glow effect */}
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-xl transition-colors duration-300"></div>
  </motion.div>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-300
          ${currentPage === 1
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
          }
        `}
      >
        Previous
      </motion.button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: page !== '...' ? 1.1 : 1 }}
          whileTap={{ scale: page !== '...' ? 0.9 : 1 }}
          onClick={() => page !== '...' && onPageChange(page)}
          disabled={page === '...'}
          className={`
            w-10 h-10 rounded-lg font-medium transition-all duration-300
            ${page === currentPage
              ? 'bg-[#6434F1] text-white shadow-lg'
              : page === '...'
              ? 'text-white/50 cursor-default'
              : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
            }
          `}
        >
          {page}
        </motion.button>
      ))}

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-300
          ${currentPage === totalPages
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
          }
        `}
      >
        Next
      </motion.button>
    </div>
  );
};

// Filter Component
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category)}
          className={`
            px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-sm
            ${selectedCategory === category
              ? 'bg-[#6434F1] text-white shadow-lg border border-[#6434F1]'
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }
          `}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

// Main Gallery Component
const Gallery = () => {
  const [galleryRef, isGalleryVisible] = useInView();
  const [titleRef, isTitleVisible] = useInView();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const itemsPerPage = 6;

  // Gallery data - tambahkan lebih banyak items untuk testing pagination
  const allGalleryItems = [
    { id: 1, image: "/images/event1.png", title: "Workshop Web Development", date: "2024-01-15", category: "Workshop" },
    { id: 2, image: "/images/event1.png", title: "Seminar AI & Machine Learning", date: "2024-02-20", category: "Seminar" },
    { id: 3, image: "/images/event1.png", title: "Hackathon Competition 2024", date: "2024-03-10", category: "Competition" },
    { id: 4, image: "/images/event1.png", title: "Study Tour to Tech Company", date: "2024-04-05", category: "Study Tour" },
    { id: 5, image: "/images/event1.png", title: "Programming Bootcamp", date: "2024-05-15", category: "Workshop" },
    { id: 6, image: "/images/event1.png", title: "Alumni Networking Event", date: "2024-06-01", category: "Networking" },
    { id: 7, image: "/images/event1.png", title: "Mobile App Development Workshop", date: "2024-07-12", category: "Workshop" },
    { id: 8, image: "/images/event1.png", title: "Cybersecurity Seminar", date: "2024-08-18", category: "Seminar" },
    { id: 9, image: "/images/event1.png", title: "Game Development Competition", date: "2024-09-25", category: "Competition" },
    { id: 10, image: "/images/event1.png", title: "Tech Talk with Industry Experts", date: "2024-10-30", category: "Seminar" },
    { id: 11, image: "/images/event1.png", title: "UI/UX Design Workshop", date: "2024-11-14", category: "Workshop" },
    { id: 12, image: "/images/event1.png", title: "Annual Tech Conference 2024", date: "2024-12-05", category: "Conference" },
    { id: 13, image: "/images/event1.png", title: "Database Management Training", date: "2024-12-20", category: "Workshop" },
    { id: 14, image: "/images/event1.png", title: "Cloud Computing Seminar", date: "2025-01-08", category: "Seminar" },
    { id: 15, image: "/images/event1.png", title: "Software Testing Bootcamp", date: "2025-02-15", category: "Workshop" }
  ];

  // Get unique categories
  const categories = ['All', ...new Set(allGalleryItems.map(item => item.category))];

  // Filter items by category
  const filteredItems = selectedCategory === 'All'
    ? allGalleryItems
    : allGalleryItems.filter(item => item.category === selectedCategory);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of gallery
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  return (
    <Layout>
      <main className="relative z-10 flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">

        {/* Hero Section */}
        <div ref={titleRef} className="text-center relative top-16 mb-20">
          <motion.div
            initial={animations.fade.fadeInUp.initial}
            animate={isTitleVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp.initial}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 sm:mb-8 lg:mb-10 tracking-wider sm:tracking-widest leading-tight transform hover:scale-105 transition-transform duration-300 drop-shadow-2xl">
              Gallery
            </h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 font-light tracking-wide max-w-4xl mx-auto leading-relaxed"
              initial={animations.fade.fadeInUp.initial}
              animate={isTitleVisible ? animations.fade.fadeInUp.animate : animations.fade.fadeInUp.initial}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              Events and activities from KSM IF during the current period.
            </motion.p>
          </motion.div>
        </div>

        {/* Gallery Section */}
        <section ref={galleryRef} className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">

            {/* Category Filter */}
            <motion.div
              initial={animations.fade.fadeInUp.initial}
              animate={animations.fade.fadeInUp.animate}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            >
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </motion.div>

            {/* Gallery Info */}
            <motion.div
              initial={animations.fade.fadeInUp.initial}
              animate={animations.fade.fadeInUp.animate}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="text-center mb-8"
            >
              <p className="text-white/70 text-lg">
                Showing {currentItems.length} of {filteredItems.length} {selectedCategory !== 'All' ? selectedCategory.toLowerCase() : ''} events
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </p>
            </motion.div>

            {/* Gallery Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {currentItems.map((item, index) => (
                  <GalleryItem
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    date={item.date}
                    category={item.category}
                    index={index}
                    isVisible={isGalleryVisible}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {currentItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <div className="text-white/50 text-6xl mb-4">📷</div>
                <h3 className="text-2xl font-semibold text-white mb-2">No events found</h3>
                <p className="text-white/70">
                  No {selectedCategory.toLowerCase()} events available at the moment.
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Gallery;
