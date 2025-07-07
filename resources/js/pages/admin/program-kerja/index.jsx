import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../layout';

// ===========================
// PROGRAM KERJA PAGE WITH CORRECT DATABASE MAPPING
// ===========================
const ProgramKerjaPage = ({ user, programs: initialPrograms = [], notifications = [] }) => {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  const [programs, setPrograms] = useState(initialPrograms);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // View mode state
  const [viewMode, setViewMode] = useState('grid');

  // Form data state - sesuai dengan database schema
  const [formData, setFormData] = useState({
    nama: '',
    poster: null,
    deskripsi: '',
    lokasi: '',
    tanggal_selesai_pendaftaran: '',
    masa_pendaftaran: false,
    selesai: false,
    tanggal_mulai_acara: '',
    tanggal_selesai_acara: '',
    target_peserta: '',
    contact_person: ''
  });

  // ===========================
  // EFFECTS
  // ===========================
  useEffect(() => {
    document.title = 'Kelola Program Kerja - Admin KSM-IF';
  }, []);

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================
  const getStatusColor = (program) => {
    if (program.selesai) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    } else if (program.masa_pendaftaran) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusText = (program) => {
    if (program.selesai) {
      return 'Selesai';
    } else if (program.masa_pendaftaran) {
      return 'Pendaftaran Dibuka';
    } else {
      return 'Pendaftaran Ditutup';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // ===========================
  // DATA PROCESSING - Fixed mapping
  // ===========================
  const filteredAndSortedPrograms = programs
    .filter(program => {
      if (!program) return false;

      const nama = program.nama || '';
      const deskripsi = program.deskripsi || '';

      const matchesSearch = nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deskripsi.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (filterStatus === 'open') {
        matchesStatus = program.masa_pendaftaran === true || program.masa_pendaftaran === 1;
      } else if (filterStatus === 'closed') {
        matchesStatus = program.masa_pendaftaran === false || program.masa_pendaftaran === 0;
      } else if (filterStatus === 'finished') {
        matchesStatus = program.selesai === true || program.selesai === 1;
      }

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;

      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case 'oldest':
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case 'nama':
          return (a.nama || '').localeCompare(b.nama || '');
        case 'tanggal_mulai':
          return new Date(a.tanggal_mulai_acara || 0) - new Date(b.tanggal_mulai_acara || 0);
        default:
          return 0;
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedPrograms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrograms = filteredAndSortedPrograms.slice(startIndex, startIndex + itemsPerPage);

  // ===========================
  // FORM MANAGEMENT
  // ===========================
  const resetForm = () => {
    setFormData({
      nama: '',
      poster: null,
      deskripsi: '',
      lokasi: '',
      tanggal_selesai_pendaftaran: '',
      masa_pendaftaran: false,
      selesai: false,
      tanggal_mulai_acara: '',
      tanggal_selesai_acara: '',
      target_peserta: '',
      contact_person: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ===========================
  // MODAL MANAGEMENT
  // ===========================
  const openAddModal = () => {
    resetForm();
    setSelectedProgram(null);
    setShowAddModal(true);
    setMessage('');
  };

  const openEditModal = (program) => {
    setFormData({
      nama: program.nama || '',
      poster: null,
      deskripsi: program.deskripsi || '',
      lokasi: program.lokasi || '',
      tanggal_selesai_pendaftaran: program.tanggal_selesai_pendaftaran ?
        new Date(program.tanggal_selesai_pendaftaran).toISOString().slice(0, 16) : '',
      masa_pendaftaran: Boolean(program.masa_pendaftaran),
      selesai: Boolean(program.selesai),
      tanggal_mulai_acara: program.tanggal_mulai_acara ?
        new Date(program.tanggal_mulai_acara).toISOString().slice(0, 16) : '',
      tanggal_selesai_acara: program.tanggal_selesai_acara ?
        new Date(program.tanggal_selesai_acara).toISOString().slice(0, 16) : '',
      target_peserta: program.target_peserta || '',
      contact_person: program.contact_person || ''
    });
    setSelectedProgram(program);
    setShowEditModal(true);
    setMessage('');
  };

  const openDetailModal = (program) => {
    setSelectedProgram(program);
    setShowDetailModal(true);
  };

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedProgram(null);
    resetForm();
    setMessage('');
  };

  // ===========================
  // API OPERATIONS
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Get CSRF token
      await fetch('/sanctum/csrf-cookie', {
        credentials: 'include'
      });

      const formDataToSend = new FormData();

      // Add all form fields to FormData - sesuai database schema
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('lokasi', formData.lokasi);
      formDataToSend.append('tanggal_selesai_pendaftaran', formData.tanggal_selesai_pendaftaran);
      formDataToSend.append('masa_pendaftaran', formData.masa_pendaftaran ? '1' : '0');
      formDataToSend.append('selesai', formData.selesai ? '1' : '0');
      formDataToSend.append('tanggal_mulai_acara', formData.tanggal_mulai_acara);
      formDataToSend.append('tanggal_selesai_acara', formData.tanggal_selesai_acara);

      if (formData.target_peserta) {
        formDataToSend.append('target_peserta', formData.target_peserta);
      }
      if (formData.contact_person) {
        formDataToSend.append('contact_person', formData.contact_person);
      }
      if (formData.poster) {
        formDataToSend.append('poster', formData.poster);
      }

      const url = selectedProgram
        ? `/admin/program-kerja/${selectedProgram.id}`
        : '/admin/program-kerja';

      const method = selectedProgram ? 'POST' : 'POST'; // Laravel uses POST with _method for PUT

      if (selectedProgram) {
        formDataToSend.append('_method', 'PUT');
      }

      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setMessageType('success');

        // Update programs list
        if (selectedProgram) {
          setPrograms(prev => prev.map(program =>
            program.id === selectedProgram.id ? data.program : program
          ));
        } else {
          setPrograms(prev => [data.program, ...prev]);
        }

        // Close modal after success
        setTimeout(() => {
          closeAllModals();
        }, 1500);
      } else {
        setMessage(data.message || 'Terjadi kesalahan saat menyimpan program');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('Terjadi kesalahan jaringan. Silakan coba lagi.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (program) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus program "${program.nama}"?`)) {
      return;
    }

    try {
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });

      const response = await fetch(`/admin/program-kerja/${program.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      const data = await response.json();

      if (data.success) {
        setPrograms(prev => prev.filter(p => p.id !== program.id));
        setMessage('Program berhasil dihapus');
        setMessageType('success');

        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Gagal menghapus program');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Terjadi kesalahan saat menghapus program');
      setMessageType('error');
    }
  };

  // ===========================
  // MAIN RENDER
  // ===========================
  return (
    <AdminLayout
        user={user}
      currentPage="program-kerja"
      title="Program Kerja"
      subtitle="Kelola dan pantau semua program kerja KSM-IF"
      notifications={notifications}>
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

        {/* Add Program Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-end"
        >
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Tambah Program</span>
          </button>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="open">Pendaftaran Dibuka</option>
                <option value="closed">Pendaftaran Ditutup</option>
                <option value="finished">Selesai</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="nama">Nama A-Z</option>
                <option value="tanggal_mulai">Tanggal Mulai</option>
              </select>
            </div>

            {/* View Mode Toggle */}
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
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{programs.length}</div>
                <div className="text-sm text-gray-600">Total Program</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {programs.filter(p => p.masa_pendaftaran).length}
                </div>
                <div className="text-sm text-gray-600">Pendaftaran Dibuka</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {programs.filter(p => !p.masa_pendaftaran && !p.selesai).length}
                </div>
                <div className="text-sm text-gray-600">Pendaftaran Ditutup</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {programs.filter(p => p.selesai).length}
                </div>
                <div className="text-sm text-gray-600">Selesai</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Programs List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden"
        >
          {viewMode === 'grid' ? (
            <div className="p-6">
              {paginatedPrograms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedPrograms.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      onDetail={() => openDetailModal(program)}
                      onEdit={() => openEditModal(program)}
                      onDelete={() => handleDelete(program)}
                      getStatusColor={getStatusColor}
                      getStatusText={getStatusText}
                      formatDateOnly={formatDateOnly}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Program</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Lokasi</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Tanggal Mulai</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPrograms.length > 0 ? (
                    paginatedPrograms.map((program) => (
                      <ProgramTableRow
                        key={program.id}
                        program={program}
                        onDetail={() => openDetailModal(program)}
                        onEdit={() => openEditModal(program)}
                        onDelete={() => handleDelete(program)}
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                        formatDate={formatDate}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-500">
                        <EmptyState />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredAndSortedPrograms.length)} dari {filteredAndSortedPrograms.length} program
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sebelumnya
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Modal Components */}
        <AnimatePresence>
          {showAddModal && (
            <ProgramModal
              title="Tambah Program Kerja"
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onClose={closeAllModals}
              isLoading={isLoading}
              message={message}
              messageType={messageType}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditModal && (
            <ProgramModal
              title="Edit Program Kerja"
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onClose={closeAllModals}
              isLoading={isLoading}
              message={message}
              messageType={messageType}
              isEdit={true}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDetailModal && selectedProgram && (
            <DetailModal
              program={selectedProgram}
              onClose={closeAllModals}
              onEdit={() => {
                closeAllModals();
                openEditModal(selectedProgram);
              }}
              onDelete={() => {
                closeAllModals();
                handleDelete(selectedProgram);
              }}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
    </AdminLayout>
  );
};

// ===========================
// SUB-COMPONENTS
// ===========================

// Program Card Component for Grid View - Updated with correct database fields
const ProgramCard = ({ program, onDetail, onEdit, onDelete, getStatusColor, getStatusText, formatDateOnly }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
  >
    {/* Program Image Header */}
    <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
      {program.poster ? (
        <img
          src={`/storage/${program.poster}`}
          alt={program.nama}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className="w-full h-full flex items-center justify-center" style={{ display: program.poster ? 'none' : 'flex' }}>
        <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>

      {/* Status Badge */}
      <div className="absolute top-3 left-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(program)}`}>
          {getStatusText(program)}
        </span>
      </div>
    </div>

    {/* Program Content */}
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{program.nama}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{program.deskripsi}</p>

      {/* Program Details */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDateOnly(program.tanggal_mulai_acara)}
        </div>

        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{program.lokasi}</span>
        </div>

        {program.target_peserta && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span className="truncate">{program.target_peserta}</span>
          </div>
        )}

        {program.contact_person && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="truncate">{program.contact_person}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={onDetail}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          Detail
        </button>

        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={onDelete}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Program Table Row Component for Table View - Updated with correct database fields
const ProgramTableRow = ({ program, onDetail, onEdit, onDelete, getStatusColor, getStatusText, formatDate }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
  >
    <td className="py-4 px-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          {program.poster ? (
            <img
              src={`/storage/${program.poster}`}
              alt={program.nama}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ display: program.poster ? 'none' : 'block' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{program.nama}</h4>
          <p className="text-sm text-gray-600 truncate max-w-xs">{program.deskripsi}</p>
        </div>
      </div>
    </td>
    <td className="py-4 px-6 text-sm text-gray-600">
      {program.lokasi}
    </td>
    <td className="py-4 px-6 text-sm text-gray-600">
      <div>
        <div>{new Date(program.tanggal_mulai_acara).toLocaleDateString('id-ID')}</div>
        <div className="text-xs text-gray-500">{new Date(program.tanggal_mulai_acara).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </td>
    <td className="py-4 px-6">
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(program)}`}>
        {getStatusText(program)}
      </span>
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
const EmptyState = () => (
  <div className="text-center py-12">
    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <p className="text-gray-500 text-lg mb-2">Tidak ada program kerja yang ditemukan</p>
    <p className="text-gray-400 text-sm">Coba ubah filter atau tambah program baru</p>
  </div>
);

// Program Modal Component - Updated with correct database fields
const ProgramModal = ({
  title,
  formData,
  onInputChange,
  onSubmit,
  onClose,
  isLoading,
  message,
  messageType,
  isEdit = false
}) => {
  const [posterPreview, setPosterPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onInputChange('poster', file);

      // Create preview for image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPosterPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateTimeChange = (field, value) => {
    onInputChange(field, value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
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
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {message && (
            <div className={`p-4 rounded-xl text-sm border ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Nama Program */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Program <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama || ''}
                  onChange={(e) => onInputChange('nama', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan nama program"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.deskripsi || ''}
                  onChange={(e) => onInputChange('deskripsi', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Deskripsi program kerja..."
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lokasi || ''}
                  onChange={(e) => onInputChange('lokasi', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Lokasi pelaksanaan"
                />
              </div>

              {/* Target Peserta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Peserta
                </label>
                <input
                  type="text"
                  value={formData.target_peserta || ''}
                  onChange={(e) => onInputChange('target_peserta', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contoh: Mahasiswa Teknik Informatika"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contact_person || ''}
                  onChange={(e) => onInputChange('contact_person', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nomor telepon/WhatsApp"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Poster */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poster <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {posterPreview && (
                    <div className="mt-2">
                      <img
                        src={posterPreview}
                        alt="Preview poster"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                  {isEdit && !posterPreview && (
                    <p className="text-sm text-gray-500">
                      Kosongkan jika tidak ingin mengubah poster
                    </p>
                  )}
                </div>
              </div>

              {/* Tanggal Selesai Pendaftaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Selesai Pendaftaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.tanggal_selesai_pendaftaran || ''}
                  onChange={(e) => handleDateTimeChange('tanggal_selesai_pendaftaran', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tanggal Mulai Acara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai Acara <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.tanggal_mulai_acara || ''}
                  onChange={(e) => handleDateTimeChange('tanggal_mulai_acara', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tanggal Selesai Acara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Selesai Acara <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.tanggal_selesai_acara || ''}
                  onChange={(e) => handleDateTimeChange('tanggal_selesai_acara', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="masa_pendaftaran"
                    checked={formData.masa_pendaftaran || false}
                    onChange={(e) => onInputChange('masa_pendaftaran', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="masa_pendaftaran" className="text-sm font-medium text-gray-700">
                    Masa Pendaftaran Aktif
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="selesai"
                    checked={formData.selesai || false}
                    onChange={(e) => onInputChange('selesai', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="selesai" className="text-sm font-medium text-gray-700">
                    Program Selesai
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-300 flex items-center space-x-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span>{isLoading ? 'Menyimpan...' : (isEdit ? 'Update Program' : 'Simpan Program')}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Detail Modal Component - Updated with correct database fields
const DetailModal = ({ program, onClose, onEdit, onDelete, formatDate, getStatusColor, getStatusText }) => (
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
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{program.nama}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusColor(program)}`}>
              {getStatusText(program)}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Poster */}
        {program.poster && (
          <div>
            <img
              src={`/storage/${program.poster}`}
              alt={program.nama}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Deskripsi */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Deskripsi</h3>
          <p className="text-gray-600">{program.deskripsi}</p>
        </div>

        {/* Detail Program */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">Lokasi</h4>
            <p className="text-gray-600">{program.lokasi}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-1">Target Peserta</h4>
            <p className="text-gray-600">{program.target_peserta || '-'}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-1">Contact Person</h4>
            <p className="text-gray-600">{program.contact_person || '-'}</p>
          </div>
        </div>

        {/* Jadwal */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Jadwal</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Batas Pendaftaran:</span>
              <span className="font-medium">{formatDate(program.tanggal_selesai_pendaftaran)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mulai:</span>
              <span className="font-medium">{formatDate(program.tanggal_mulai_acara)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Selesai:</span>
              <span className="font-medium">{formatDate(program.tanggal_selesai_acara)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={onDelete}
            className="px-6 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Hapus Program
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            Edit Program
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default ProgramKerjaPage;
