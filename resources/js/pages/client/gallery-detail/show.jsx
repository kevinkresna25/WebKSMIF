import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Layout from '../../../components/layouts/layout';
import { ChevronLeft, ChevronRight, X, Calendar, MapPin, Users, ArrowLeft, Download, Share2, Heart, Eye, Clock } from 'lucide-react';

const GalleryDetailShow = ({ programId, programData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    // Simulate view count based on program ID for consistency
    setViewCount(Math.floor(Math.random() * 1000) + 100);
  }, [programId]);

  const nextImage = () => {
    if (programData?.gallery?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === programData.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (programData?.gallery?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? programData.gallery.length - 1 : prev - 1
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDownload = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Gagal mengunduh gambar. Silakan coba lagi.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: programData.nama,
          text: programData.deskripsi,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link berhasil disalin ke clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Gagal menyalin link. Silakan salin manual dari address bar.');
      }
    }
  };

  const handleBackToGallery = () => {
    router.visit('/gallery');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') prevImage();
      if (event.key === 'ArrowRight') nextImage();
      if (event.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [programData]);

  // Handle loading state
  if (!programData) {
    return (
      <Layout>
        <Head title="Gallery Detail - Loading" />
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BE0F1] mx-auto mb-4"></div>
            <p className="text-white text-xl">Memuat data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle no gallery images
  if (!programData.gallery || programData.gallery.length === 0) {
    return (
      <Layout>
        <Head title={`${programData.nama} - Gallery Detail`} />
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">{programData.nama}</h2>
            <p className="text-white/70 mb-6">Tidak ada foto yang tersedia untuk program ini.</p>
            <button
              onClick={handleBackToGallery}
              className="bg-gradient-to-r from-[#6434F1] to-[#8B5CF6] text-white px-8 py-3 rounded-2xl hover:from-[#5228E8] hover:to-[#7C3AED] transition-all transform hover:scale-105"
            >
              Kembali ke Gallery
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentImage = programData.gallery[currentImageIndex];

  return (
    <Layout>
      <main className='relative z-10 flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24'>
        <Head title={`${programData.nama} - Gallery Detail`} />

        <div className="relative z-10 container mx-auto px-6 py-12">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-10 mb-12 border border-white/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#2BE0F1] to-[#E7D43B] bg-clip-text text-transparent mb-6 leading-tight">
                    {programData.nama}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/70 mb-8">
                    <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
                    <Calendar size={18} className="text-[#2BE0F1]" />
                    <span className="text-sm font-medium">
                        {formatDate(programData.tanggal_mulai_acara)} - {formatDate(programData.tanggal_selesai_acara)}
                    </span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
                    <MapPin size={18} className="text-[#E7D43B]" />
                    <span className="text-sm font-medium">{programData.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
                    <Users size={18} className="text-[#8B5CF6]" />
                    <span className="text-sm font-medium">{programData.target_peserta}</span>
                    </div>
                </div>
                <p className="text-white/80 leading-relaxed text-lg font-light">
                    {programData.deskripsi}
                </p>
                </div>
            </div>
            </div>

            {/* Main Gallery Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Image Display */}
            <div className="xl:col-span-4">
                <div className="bg-black/30 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                <div className="relative aspect-video bg-black/50">
                    <img
                    src={currentImage?.image_url}
                    alt={currentImage?.original_name}
                    className="w-full h-full object-contain cursor-zoom-in transition-transform duration-500 hover:scale-105"
                    onClick={() => setIsFullscreen(true)}
                    />

                    {/* Navigation Buttons */}
                    {programData.gallery.length > 1 && (
                    <>
                        <button
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-4 rounded-full transition-all transform hover:scale-110 border border-white/30"
                        >
                        <ChevronLeft size={24} />
                        </button>
                        <button
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-4 rounded-full transition-all transform hover:scale-110 border border-white/30"
                        >
                        <ChevronRight size={24} />
                        </button>
                    </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/30">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{currentImageIndex + 1} / {programData.gallery.length}</span>
                    </div>
                    </div>

                    {/* Download Button */}
                    <button
                    onClick={() => handleDownload(currentImage?.image_url, currentImage?.original_name)}
                    className="absolute bottom-6 right-6 bg-gradient-to-r from-[#6434F1]/80 to-[#8B5CF6]/80 backdrop-blur-md hover:from-[#5228E8]/80 hover:to-[#7C3AED]/80 text-white p-3 rounded-2xl transition-all transform hover:scale-110 border border-white/30"
                    >
                    <Download size={20} />
                    </button>
                </div>

                {/* Image Info */}
                <div className="p-8 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm">
                    <h3 className="font-bold text-2xl text-white mb-2">
                    {currentImage?.original_name}
                    </h3>
                    <div className="flex items-center gap-4 text-white/60">
                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="text-sm">Foto ke-{currentImageIndex + 1} dari {programData.gallery.length}</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Fullscreen Modal */}
        {isFullscreen && (
            <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-lg">
            <div className="h-full flex items-center justify-center p-6 z-[1000]">
                <button
                onClick={() => setIsFullscreen(false)}
                className="absolute flex top-8 right-8 text-white hover:text-gray-300 p-3 bg-white/10 backdrop-blur-sm rounded-full transition-all hover:bg-white/20 border border-white/30"
                >
                <X size={28} />
                </button>

                <img
                src={currentImage?.image_url}
                alt={currentImage?.original_name}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />

                {programData.gallery.length > 1 && (
                <>
                    <button
                    onClick={prevImage}
                    className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-4 rounded-full transition-all transform hover:scale-110 border border-white/30"
                    >
                    <ChevronLeft size={28} />
                    </button>
                    <button
                    onClick={nextImage}
                    className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-4 rounded-full transition-all transform hover:scale-110 border border-white/30"
                    >
                    <ChevronRight size={28} />
                    </button>
                </>
                )}

                {/* Fullscreen Image Info */}
                <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md text-white px-6 py-4 rounded-2xl border border-white/30">
                <h4 className="font-semibold text-lg">{currentImage?.original_name}</h4>
                <p className="text-white/70">{currentImageIndex + 1} of {programData.gallery.length}</p>
                </div>
            </div>
            </div>
        )}
      </main>
    </Layout>
  );
};

export default GalleryDetailShow;
