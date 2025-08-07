import Layout from "../../components/layouts/layout";
import { motion, AnimatePresence } from "framer-motion";
import animations from "../../utilities/animations";
import { useInView } from "../../hooks/useInView";
import { useState, useEffect } from "react";
import { router } from '@inertiajs/react';

// Loading Skeleton Component
const GalleryItemSkeleton = () => (
  <div className="relative group cursor-pointer overflow-hidden rounded-xl animate-pulse">
    <div className="aspect-video w-full bg-gray-700"></div>
    <div className="absolute top-4 left-4">
      <div className="bg-gray-600 h-6 w-20 rounded-full"></div>
    </div>
  </div>
);

// Error State Component
const ErrorState = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-20"
  >
    <div className="text-red-400 text-6xl mb-4">⚠️</div>
    <h3 className="text-2xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
    <p className="text-white/70 mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-[#6434F1] text-white rounded-lg hover:bg-[#5228E0] transition-colors"
    >
      Try Again
    </button>
  </motion.div>
);

// Gallery Item Component
const GalleryItem = ({ image, title, date, category, index, isVisible, onClick }) => (
  <motion.div
    initial={animations.fade.fadeInUp}
    animate={isVisible ? animations.fade.fadeInUp.animate(index) : animations.fade.fadeInUp}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 * index }}
    className="relative group cursor-pointer overflow-hidden rounded-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
    onClick={onClick}
  >
    {/* Image */}
    <div className="aspect-video w-full overflow-hidden bg-gray-800">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          e.target.src = "/images/placeholder.png";
        }}
        loading="lazy"
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
const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
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
      <motion.button
        whileHover={{ scale: !loading ? 1.05 : 1 }}
        whileTap={{ scale: !loading ? 0.95 : 1 }}
        onClick={() => !loading && onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-300
          ${currentPage === 1 || loading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
          }
        `}
      >
        Previous
      </motion.button>

      {getPageNumbers().map((page, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: page !== '...' && !loading ? 1.1 : 1 }}
          whileTap={{ scale: page !== '...' && !loading ? 0.9 : 1 }}
          onClick={() => !loading && page !== '...' && onPageChange(page)}
          disabled={page === '...' || loading}
          className={`
            w-10 h-10 rounded-lg font-medium transition-all duration-300
            ${page === currentPage
              ? 'bg-[#6434F1] text-white shadow-lg'
              : page === '...'
              ? 'text-white/50 cursor-default'
              : loading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
            }
          `}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        whileHover={{ scale: !loading ? 1.05 : 1 }}
        whileTap={{ scale: !loading ? 0.95 : 1 }}
        onClick={() => !loading && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-300
          ${currentPage === totalPages || loading
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

// Category Filter Component
const CategoryFilter = ({ programs, selectedProgram, onProgramChange, loading }) => {
  const categories = [
    { id: 'all', nama: 'All' },
    ...programs
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((program, index) => (
        <motion.button
          key={program.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: !loading ? 1.05 : 1 }}
          whileTap={{ scale: !loading ? 0.95 : 1 }}
          onClick={() => !loading && onProgramChange(program.id)}
          disabled={loading}
          className={`
            px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-sm
            ${selectedProgram === program.id
              ? 'bg-[#6434F1] text-white shadow-lg border border-[#6434F1]'
              : loading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-600'
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }
          `}
        >
          {program.nama}
        </motion.button>
      ))}
    </div>
  );
};

// Search Component
const SearchInput = ({ searchTerm, onSearchChange, loading }) => {
  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search photos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#6434F1] focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Main Gallery Component
const Gallery = ({
  galleries = { data: [], current_page: 1, last_page: 1, total: 0, from: 0, to: 0 },
  programs = [],
  galleryStats = { total_photos: 0, total_programs_with_photos: 0, total_size: 0 },
  filters = { program: null, search: null, per_page: 12 },
  error = null
}) => {
  const [galleryRef, isGalleryVisible] = useInView();
  const [titleRef, isTitleVisible] = useInView();
  const [filterRef, isFilterVisible] = useInView();
  const [infoRef, isInfoVisible] = useInView();

  // State management
  const [loading, setLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(filters.program || 'all');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Transform gallery data for display
  const transformedGalleryData = galleries.data.map(item => ({
    id: item.id,
    image: item.image_url,
    title: item.original_name ? item.original_name.replace(/\.[^/.]+$/, "") : 'Untitled',
    date: item.created_at,
    category: item.program?.nama || 'Unknown Program',
    size: item.size,
    uploader: item.uploader?.name || 'Unknown',
    program_id: item.program.id
  }));

  // Handle page change
  const handlePageChange = (page) => {
    setLoading(true);

    router.get(route('gallery'), {
      page,
      program: selectedProgram !== 'all' ? selectedProgram : null,
      search: searchTerm || null,
      per_page: filters.per_page
    }, {
      preserveState: true,
      preserveScroll: false,
      onFinish: () => {
        setLoading(false);
        galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  // Handle program filter change
  const handleProgramChange = (programId) => {
    setSelectedProgram(programId);
    setLoading(true);

    router.get(route('gallery'), {
      program: programId !== 'all' ? programId : null,
      search: searchTerm || null,
      per_page: filters.per_page,
      page: 1 // Reset to first page
    }, {
      preserveState: true,
      preserveScroll: false,
      onFinish: () => setLoading(false)
    });
  };

  // Handle search with debounce
  const handleSearchChange = (value) => {
    setSearchTerm(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      setLoading(true);

      router.get(route('gallery'), {
        search: value || null,
        program: selectedProgram !== 'all' ? selectedProgram : null,
        per_page: filters.per_page,
        page: 1 // Reset to first page
      }, {
        preserveState: true,
        preserveScroll: false,
        onFinish: () => setLoading(false)
      });
    }, 500);

    setSearchTimeout(newTimeout);
  };

  // Handle retry
  const handleRetry = () => {
    setLoading(true);
    router.reload({
      onFinish: () => setLoading(false)
    });
  };

  // Handle item click (for future modal or detail view)
  const handleItemClick = (item) => {
    console.log('Gallery item clicked:', item);
    router.get(`/gallery-detail/${item.program_id}`);
  };

  // Clear search and filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProgram('all');
    setLoading(true);

    router.get(route('gallery'), {
      per_page: filters.per_page
    }, {
      preserveState: true,
      preserveScroll: false,
      onFinish: () => setLoading(false)
    });
  };

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
              Gallery
            </h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 font-light tracking-wide max-w-4xl mx-auto leading-relaxed"
              variants={animations.fade.fadeInUp}
              initial="initial"
              animate={isTitleVisible ? "animate" : "initial"}
              custom={0.2}
            >
              Dokumentasi kegiatan dan acara KSM IF periode saat ini.
            </motion.p>

            {/* Stats */}
            {galleryStats.total_photos > 0 && (
              <motion.div
                className="mt-8 text-white/60 text-sm"
                variants={animations.fade.fadeInUp}
                initial="initial"
                animate={isTitleVisible ? "animate" : "initial"}
                custom={0.4}
              >
                {galleryStats.total_photos} foto • {galleryStats.total_programs_with_photos} program • {formatFileSize(galleryStats.total_size)}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Gallery Section */}
        <section ref={galleryRef} className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">

            {/* Search Input */}
            <SearchInput
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              loading={loading}
            />

            {/* Gallery Info */}
            <motion.div
              ref={infoRef}
              variants={animations.fade.fadeInUp}
              initial="initial"
              animate={isInfoVisible ? "animate" : "initial"}
              custom={0}
              className="text-center mb-8"
            >
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-white/20 rounded w-64 mx-auto"></div>
                </div>
              ) : galleries.total > 0 ? (
                <p className="text-white/70 text-lg">
                  Showing {galleries.from || 0} - {galleries.to || 0} of {galleries.total} photos
                  {selectedProgram !== 'all' && programs.find(p => p.id === selectedProgram) &&
                    ` in ${programs.find(p => p.id === selectedProgram).nama}`
                  }
                  {searchTerm && ` matching "${searchTerm}"`}
                  {galleries.last_page > 1 && ` (Page ${galleries.current_page} of ${galleries.last_page})`}
                </p>
              ) : null}
            </motion.div>

            {/* Error State */}
            {error && !loading && (
              <ErrorState message={error} onRetry={handleRetry} />
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 place-items-center">
                {[...Array(6)].map((_, index) => (
                  <GalleryItemSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Gallery Grid */}
            {!loading && !error && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedProgram}-${galleries.current_page}-${searchTerm}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 place-items-center"
                >
                  {transformedGalleryData.map((item, index) => (
                    <GalleryItem
                      key={item.id}
                      image={item.image}
                      title={item.title}
                      date={item.date}
                      category={item.category}
                      index={index}
                      isVisible={isGalleryVisible}
                      onClick={() => handleItemClick(item)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Empty State */}
            {!loading && !error && transformedGalleryData.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <div className="text-white/50 text-6xl mb-4">📷</div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {searchTerm ? 'No photos found' : 'No photos available'}
                </h3>
                <p className="text-white/70">
                  {searchTerm
                    ? `No photos match your search "${searchTerm}"`
                    : selectedProgram !== 'all'
                    ? `No photos found in ${programs.find(p => p.id === selectedProgram)?.nama || 'selected'} program`
                    : 'No photos have been uploaded yet.'
                  }
                </p>
                {(searchTerm || selectedProgram !== 'all') && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 px-6 py-3 bg-[#6434F1] text-white rounded-lg hover:bg-[#5228E0] transition-colors"
                  >
                    Show All Photos
                  </button>
                )}
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && !error && galleries.last_page > 1 && (
              <Pagination
                currentPage={galleries.current_page}
                totalPages={galleries.last_page}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Gallery;
