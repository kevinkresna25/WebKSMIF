import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../layout';

// ===========================
// GALLERY ADMIN PAGE
// ===========================
const GalleryAdminPage = ({
  user,
  galleries: initialGalleries = { data: [] },
  programs = [],
  stats = {},
  filters = {},
  notifications = []
}) => {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  const [galleries, setGalleries] = useState(initialGalleries);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Filters state
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [filterProgram, setFilterProgram] = useState(filters.program || 'all');
  const [sortBy, setSortBy] = useState(filters.sort || 'newest');
  const [currentPage, setCurrentPage] = useState(galleries.current_page || 1);
  const [perPage, setPerPage] = useState(filters.per_page || 12);

  // View mode state
  const [viewMode, setViewMode] = useState('grid');

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    program_kerja_id: '',
    images: []
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    program_kerja_id: '',
    original_name: ''
  });

  // ===========================
  // EFFECTS
  // ===========================
  useEffect(() => {
    document.title = 'Kelola Gallery - Admin KSM-IF';
  }, []);

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================
  const formatFileSize = (bytes, precision = 2) => {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    let size = bytes;

    while (size > 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }

    return size.toFixed(precision) + ' ' + units[i];
  };

  const getProgramName = (programId) => {
    const program = programs.find(p => p.id === programId);
    return program ? program.nama : 'Unknown Program';
  };

  const getImageUrl = (image) => {
    // Prioritas: image_url dari response, atau buat dari storage_path
    if (image.image_url) {
      return image.image_url;
    }

    if (image.storage_path) {
      return `/storage/${image.storage_path}`;
    }

    // Fallback untuk format lama
    if (image.image) {
      return `/storage/${image.image}`;
    }

    return '/images/image-placeholder.png';
  };

  // ===========================
  // MODAL MANAGEMENT
  // ===========================
  const openUploadModal = () => {
    setUploadForm({
      program_kerja_id: '',
      images: []
    });
    setShowUploadModal(true);
    setMessage('');
  };

  const openEditModal = (image) => {
    setEditForm({
      program_kerja_id: image.program_kerja_id || '',
      original_name: image.original_name || ''
    });
    setSelectedImage(image);
    setShowEditModal(true);
    setMessage('');
  };

  const openDetailModal = (image) => {
    setSelectedImage(image);
    setShowDetailModal(true);
  };

  const closeAllModals = () => {
    setShowUploadModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedImage(null);
    setUploadForm({ program_kerja_id: '', images: [] });
    setEditForm({ program_kerja_id: '', original_name: '' });
    setMessage('');
  };

  // ===========================
  // API OPERATIONS
  // ===========================

  // UPLOAD SUCCESS HANDLER - dipanggil dari UploadModal
  const handleUploadSuccess = (data) => {
    console.log('Upload successful:', data);

    // Controller mengembalikan 'images' bukan 'data'
    const newImages = Array.isArray(data.images) ? data.images : [];

    if (newImages.length > 0) {
      // Update galleries dengan data baru
      setGalleries(prev => ({
        ...prev,
        data: [...newImages, ...prev.data], // Tambah data baru di depan
        total: prev.total + newImages.length
      }));

      // Gunakan message dari server atau buat sendiri
      const successMessage = data.message || `Berhasil mengupload ${newImages.length} foto!`;
      setMessage(successMessage);
      setMessageType('success');

      // Jika ada error pada beberapa file, tampilkan info tambahan
      if (data.upload_summary && data.upload_summary.failed_uploads > 0) {
        setTimeout(() => {
          setMessage(
            `${data.upload_summary.successful_uploads} foto berhasil diupload, ${data.upload_summary.failed_uploads} gagal. Periksa console untuk detail error.`
          );
          setMessageType('warning');
        }, 3000);

        // Log errors untuk debugging
        console.warn('Upload errors:', data.upload_summary.errors);
      }
    } else {
      setMessage('Upload berhasil tapi tidak ada foto yang dikembalikan');
      setMessageType('warning');
    }

    // Auto hide message
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);

    // Close modal
    closeAllModals();
  };

  // BULK DELETE HANDLER
  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) {
      setMessage('Pilih foto yang akan dihapus');
      setMessageType('error');
      return;
    }

    const confirmMessage = selectedImages.length === 1
      ? 'Yakin akan menghapus 1 foto?'
      : `Yakin akan menghapus ${selectedImages.length} foto?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);
    setMessage('Menghapus foto...');
    setMessageType('info');

    try {
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

      const response = await fetch('/admin/galeri/bulk-delete', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedImages })
      });

      const data = await response.json();

      if (data.success) {
        // Update galleries state - remove deleted items
        setGalleries(prev => ({
          ...prev,
          data: prev.data.filter(img => !selectedImages.includes(img.id)),
          total: prev.total - data.deleted_count
        }));

        // Clear selected images
        setSelectedImages([]);

        // Show success message with details
        let message = data.message;
        if (data.summary) {
          const { successfully_deleted, failed_deletions, files_deleted_from_storage } = data.summary;

          if (failed_deletions > 0) {
            message += ` (${failed_deletions} foto gagal dihapus)`;
            setMessageType('warning');

            // Log errors for debugging
            if (data.errors && data.errors.length > 0) {
              console.warn('Bulk delete errors:', data.errors);
            }
          } else {
            setMessageType('success');
          }

          // Log info about file deletions
          if (files_deleted_from_storage !== successfully_deleted) {
            console.warn(`Database records deleted: ${successfully_deleted}, Files deleted: ${files_deleted_from_storage}`);
          }
        } else {
          setMessageType('success');
        }

        setMessage(message);

        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 5000);
      } else {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          setMessage('Validasi gagal: ' + errorMessages.join(', '));
        } else {
          setMessage(data.message || 'Gagal menghapus foto');
        }
        setMessageType('error');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      setMessage('Terjadi kesalahan saat menghapus foto: ' + error.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // SINGLE DELETE HANDLER
  const handleDelete = async (image) => {
    if (!confirm(`Yakin akan menghapus foto "${image.original_name}"?`)) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

      const response = await fetch(`/admin/galeri/${image.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Update galleries state
        setGalleries(prev => ({
          ...prev,
          data: prev.data.filter(img => img.id !== image.id),
          total: prev.total - 1
        }));

        setMessage(data.message || 'Foto berhasil dihapus');
        setMessageType('success');

        // Log additional info
        if (data.file_deleted === false) {
          console.warn('Database record deleted but file removal failed for:', image.original_name);
        }

        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      } else {
        setMessage(data.message || 'Gagal menghapus foto');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Terjadi kesalahan saat menghapus foto: ' + error.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // EDIT HANDLER
  const handleEdit = async (editData) => {
    setIsLoading(true);
    setMessage('');

    try {
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

      const response = await fetch(`/admin/galeri/${selectedImage.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();

      if (data.success) {
        setGalleries(prev => ({
          ...prev,
          data: prev.data.map(img =>
            img.id === selectedImage.id
              ? { ...img, ...data.data }
              : img
          )
        }));

        setMessage('Foto berhasil diupdate');
        setMessageType('success');
        closeAllModals();

        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      } else {
        setMessage(data.message || 'Gagal mengupdate foto');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Edit error:', error);
      setMessage('Terjadi kesalahan saat mengupdate foto');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================
  // SELECTION MANAGEMENT
  // ===========================
  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAllImages = () => {
    if (selectedImages.length === galleries.data.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(galleries.data.map(img => img.id));
    }
  };

  // ===========================
  // MAIN RENDER
  // ===========================
  return (
    <AdminLayout
      user={user}
      currentPage="gallery"
      title="Gallery Program Kerja"
      subtitle="Kelola foto-foto dokumentasi program kerja KSM-IF"
      notifications={notifications}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl text-sm ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={openUploadModal}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Upload Foto</span>
              </button>

              {selectedImages.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Hapus ({selectedImages.length})</span>
                </button>
              )}
            </div>

            {galleries.data.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllImages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {selectedImages.length === galleries.data.length ? 'Batalkan Semua' : 'Pilih Semua'}
                </button>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Filters and Stats - Simplified for space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-8"
          >
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_photos || 0}</div>
                <div className="text-sm text-gray-600">Total Foto</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.programs_with_photos || 0}</div>
                <div className="text-sm text-gray-600">Program dengan Foto</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.total_size_formatted || '0 B'}</div>
                <div className="text-sm text-gray-600">Total Ukuran</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.recent_uploads || 0}</div>
                <div className="text-sm text-gray-600">Upload 7 Hari</div>
              </div>
            </div>
          </motion.div>

          {/* Gallery Grid/List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden"
          >
            {galleries.data.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {galleries.data.map((image) => (
                        <GalleryImageCard
                          key={image.id}
                          image={image}
                          isSelected={selectedImages.includes(image.id)}
                          onSelect={() => toggleImageSelection(image.id)}
                          onDetail={() => openDetailModal(image)}
                          onEdit={() => openEditModal(image)}
                          onDelete={() => handleDelete(image)}
                          getProgramName={getProgramName}
                          formatFileSize={formatFileSize}
                          getImageUrl={getImageUrl}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">
                            <input
                              type="checkbox"
                              checked={selectedImages.length === galleries.data.length}
                              onChange={selectAllImages}
                              className="rounded"
                            />
                          </th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Preview</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama File</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Program</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Ukuran</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Upload</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {galleries.data.map((image) => (
                          <GalleryImageRow
                            key={image.id}
                            image={image}
                            isSelected={selectedImages.includes(image.id)}
                            onSelect={() => toggleImageSelection(image.id)}
                            onDetail={() => openDetailModal(image)}
                            onEdit={() => openEditModal(image)}
                            onDelete={() => handleDelete(image)}
                            getProgramName={getProgramName}
                            formatFileSize={formatFileSize}
                            getImageUrl={getImageUrl}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <EmptyState onUpload={openUploadModal} />
            )}
          </motion.div>

          {/* Modals */}
          <AnimatePresence>
            {showUploadModal && (
              <UploadModal
                uploadForm={uploadForm}
                setUploadForm={setUploadForm}
                programs={programs}
                onSuccess={handleUploadSuccess} // Ubah dari onSubmit ke onSuccess
                onClose={closeAllModals}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showEditModal && selectedImage && (
              <EditModal
                editForm={editForm}
                setEditForm={setEditForm}
                programs={programs}
                onSubmit={handleEdit}
                onClose={closeAllModals}
                isLoading={isLoading}
                message={message}
                messageType={messageType}
                image={selectedImage}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDetailModal && selectedImage && (
              <DetailModal
                image={selectedImage}
                onClose={closeAllModals}
                onEdit={() => {
                  closeAllModals();
                  openEditModal(selectedImage);
                }}
                onDelete={() => {
                  closeAllModals();
                  handleDelete(selectedImage);
                }}
                getProgramName={getProgramName}
                formatFileSize={formatFileSize}
                getImageUrl={getImageUrl}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
};

// ===========================
// UPLOAD MODAL COMPONENT (SIMPLIFIED)
// ===========================
const UploadModal = ({ uploadForm, setUploadForm, programs, onSuccess, onClose, isLoading }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadForm.program_kerja_id) {
      setMessage('Pilih program kerja terlebih dahulu');
      setMessageType('error');
      return;
    }

    if (uploadForm.images.length === 0) {
      setMessage('Pilih foto untuk diupload');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      setUploadProgress(0);

      // Get CSRF token
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

      const formData = new FormData();
      formData.append('program_kerja_id', uploadForm.program_kerja_id);

      // Gunakan images[] untuk array di Laravel
      uploadForm.images.forEach((file) => {
        formData.append('images[]', file);
      });

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      // Handle response
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } catch (error) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.ontimeout = () => reject(new Error('Request timeout'));
      });

      // Configure and send request
      xhr.open('POST', '/admin/galeri');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('X-CSRF-TOKEN',
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      );
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.timeout = 30000;

      xhr.send(formData);

      const data = await uploadPromise;

      if (data.success) {
        setUploadProgress(100);
        setMessage(`Berhasil mengupload ${uploadForm.images.length} foto!`);
        setMessageType('success');

        // Reset form
        setUploadForm({
          program_kerja_id: '',
          images: []
        });

        // Call success handler
        onSuccess(data);

      } else {
        throw new Error(data.message || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Terjadi kesalahan saat mengupload foto: ' + error.message);
      setMessageType('error');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Upload Foto</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Progress Bar */}
          {loading && uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
              <p className="text-sm text-gray-600 mt-2 text-center">
                Mengupload... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-xl text-sm border ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800 border-green-200'
                : messageType === 'warning'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Program Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Kerja <span className="text-red-500">*</span>
            </label>
            <select
              value={uploadForm.program_kerja_id}
              onChange={(e) => setUploadForm(prev => ({ ...prev, program_kerja_id: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            >
              <option value="">Pilih Program Kerja</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>{program.nama}</option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Foto <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  const validFiles = files.filter(file =>
                    file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
                  );
                  setUploadForm(prev => ({ ...prev, images: validFiles }));
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, GIF, WEBP hingga 5MB per file
            </p>
          </div>

          {/* File Preview */}
          {uploadForm.images.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                File yang dipilih ({uploadForm.images.length})
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {uploadForm.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadForm(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading || uploadForm.images.length === 0 || !uploadForm.program_kerja_id}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span>
                {loading
                  ? 'Mengupload...'
                  : `Upload ${uploadForm.images.length} Foto`
                }
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ===========================
// SUB-COMPONENTS (SIMPLIFIED)
// ===========================

// Gallery Image Card Component
const GalleryImageCard = ({
  image,
  isSelected,
  onSelect,
  onDetail,
  onEdit,
  onDelete,
  getProgramName,
  formatFileSize,
  getImageUrl
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
  >
    {/* Selection Checkbox */}
    <div className="absolute top-3 left-3 z-10">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="w-4 h-4 text-blue-600 bg-white/90 border-gray-300 rounded focus:ring-blue-500"
      />
    </div>

    {/* Image */}
    <div className="h-48 bg-gray-200 relative overflow-hidden">
      <img
        src={getImageUrl(image)}
        alt={image.original_name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
        onClick={onDetail}
        onError={(e) => {
          e.target.src = '/images/image-placeholder.png';
        }}
      />

      {/* File Size Badge */}
      <div className="absolute bottom-3 right-3">
        <span className="px-2 py-1 bg-black/70 text-white rounded text-xs">
          {formatFileSize(image.size)}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 mb-1 text-sm truncate" title={image.original_name}>
        {image.original_name}
      </h3>
      <p className="text-blue-600 font-medium text-xs mb-1">
        {getProgramName(image.program_kerja_id)}
      </p>
      <p className="text-gray-500 text-xs mb-3">
        {image.uploader?.name || 'Unknown'} • {new Date(image.created_at).toLocaleDateString('id-ID')}
      </p>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <button
          onClick={onDetail}
          className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
        >
          Detail
        </button>

        <div className="flex space-x-1">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={onDelete}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Gallery Image Row Component
const GalleryImageRow = ({
  image,
  isSelected,
  onSelect,
  onDetail,
  onEdit,
  onDelete,
  getProgramName,
  formatFileSize,
  getImageUrl
}) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
  >
    <td className="py-4 px-6">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="rounded"
      />
    </td>
    <td className="py-4 px-6">
      <img
        src={getImageUrl(image)}
        alt={image.original_name}
        className="w-16 h-16 object-cover rounded-lg cursor-pointer"
        onClick={onDetail}
        onError={(e) => {
          e.target.src = '/images/image-placeholder.png';
        }}
      />
    </td>
    <td className="py-4 px-6">
      <div className="font-medium text-gray-800 truncate max-w-xs" title={image.original_name}>
        {image.original_name}
      </div>
      <div className="text-sm text-gray-500">{image.extension?.toUpperCase()}</div>
    </td>
    <td className="py-4 px-6 text-sm text-gray-600">
      {getProgramName(image.program_kerja_id)}
    </td>
    <td className="py-4 px-6 text-sm text-gray-600">
      {formatFileSize(image.size)}
    </td>
    <td className="py-4 px-6 text-sm text-gray-600">
      <div>{image.uploader?.name || 'Unknown'}</div>
      <div className="text-xs text-gray-400">
        {new Date(image.created_at).toLocaleDateString('id-ID')}
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="flex space-x-2">
        <button
          onClick={onDetail}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Detail"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button
          onClick={onEdit}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </td>
  </motion.tr>
);

// Empty State Component
const EmptyState = ({ onUpload }) => (
  <div className="text-center py-16">
    <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <h3 className="text-lg font-medium text-gray-800 mb-2">Belum ada foto</h3>
    <p className="text-gray-500 mb-6">Upload foto pertama untuk dokumentasi program kerja</p>
    <button
      onClick={onUpload}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Upload Foto Pertama
    </button>
  </div>
);

// Placeholder components for Edit and Detail modals
const EditModal = ({ editForm, setEditForm, programs, onSubmit, onClose, isLoading, message, messageType, image }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-xl font-bold mb-4">Edit Foto</h2>
      <p>Edit modal will be implemented here</p>
      <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
        Close
      </button>
    </div>
  </motion.div>
);

const DetailModal = ({ image, onClose, onEdit, onDelete, getProgramName, formatFileSize, getImageUrl }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-xl font-bold mb-4">Detail Foto</h2>
      <img src={getImageUrl(image)} alt={image.original_name} className="w-full h-64 object-cover rounded-lg mb-4" />
      <p><strong>Nama:</strong> {image.original_name}</p>
      <p><strong>Program:</strong> {getProgramName(image.program_kerja_id)}</p>
      <p><strong>Ukuran:</strong> {formatFileSize(image.size)}</p>
      <p><strong>Upload:</strong> {image.uploader?.name || 'Unknown'}</p>
      <p><strong>Tanggal:</strong> {new Date(image.created_at).toLocaleDateString('id-ID')}</p>
      <div className="flex space-x-2 mt-4">
        <button onClick={onEdit} className="px-4 py-2 bg-blue-500 text-white rounded">
          Edit
        </button>
        <button onClick={onDelete} className="px-4 py-2 bg-red-500 text-white rounded">
          Delete
        </button>
        <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  </motion.div>
);

export default GalleryAdminPage;
