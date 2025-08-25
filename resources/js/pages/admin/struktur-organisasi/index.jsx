import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../layout';

// ===========================
// STRUKTUR ORGANISASI PAGE
// ===========================
const StrukturOrganisasiPage = ({
  user,
  strukturList: initialStruktur = [],
  jabatanList = [],
  divisiList = [],
  notifications = []
}) => {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  const [strukturList, setStrukturList] = useState(initialStruktur);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStruktur, setSelectedStruktur] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJabatan, setFilterJabatan] = useState('all');
  const [filterDivisi, setFilterDivisi] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('nama');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // View mode state
  const [viewMode, setViewMode] = useState('grid');

  // Form data state
  const [formData, setFormData] = useState({
    nama: '',
    jabatan_id: '',
    divisi_kode: '',
    periode: '',
    status_kepengurusan: '',
    foto_profil: null
  });

  // ===========================
  // EFFECTS
  // ===========================
  useEffect(() => {
    document.title = 'Kelola Struktur Organisasi - Admin KSM-IF';
  }, []);

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================
  const getStatusColor = (struktur) => {
    if (struktur.status_kepengurusan === 'aktif') {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (struktur.status_kepengurusan === 'non-aktif') {
      return 'bg-red-100 text-red-800 border-red-200';
    } else {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusText = (struktur) => {
    console.log('Struktur status_kepengurusan:', struktur);
    if (struktur.status_kepengurusan == 'aktif') {
      return 'Aktif';
    } else if (struktur.status_kepengurusan == 'non-aktif') {
      return 'Non-Aktif';
    } else {
      return struktur.status_kepengurusan || 'Tidak Diketahui';
    }
  };

  const getJabatanName = (jabatan_id) => {
    const jabatan = jabatanList.find(j => j.id == jabatan_id);
    return jabatan ? jabatan.nama : 'Unknown';
  };

  const getDivisiName = (divisi_kode) => {
    if (!divisi_kode) return 'Umum';
    const divisi = divisiList.find(d => d.kode === divisi_kode);
    return divisi ? divisi.nama : divisi_kode;
  };

  // ===========================
  // DATA PROCESSING
  // ===========================
  const filteredAndSortedStruktur = strukturList
    .filter(struktur => {
      if (!struktur) return false;

      const nama = struktur.nama || '';
      const matchesSearch = nama.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesJabatan = filterJabatan === 'all' || struktur.jabatan_id === parseInt(filterJabatan);
      const matchesDivisi = filterDivisi === 'all' || struktur.divisi_kode === filterDivisi;

      let matchesStatus = true;
      if (filterStatus === 'aktif') {
        matchesStatus = struktur.status_kepengurusan === 'aktif';
      } else if (filterStatus === 'non-aktif') {
        matchesStatus = struktur.status_kepengurusan === 'non-aktif';
      }

      return matchesSearch && matchesJabatan && matchesDivisi && matchesStatus;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;

      switch (sortBy) {
        case 'nama':
          return (a.nama || '').localeCompare(b.nama || '');
        case 'jabatan':
          return getJabatanName(a.jabatan_id).localeCompare(getJabatanName(b.jabatan_id));
        case 'divisi':
          return getDivisiName(a.divisi_kode).localeCompare(getDivisiName(b.divisi_kode));
        case 'periode':
          return (a.periode || '').localeCompare(b.periode || '');
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        default:
          return 0;
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedStruktur.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStruktur = filteredAndSortedStruktur.slice(startIndex, startIndex + itemsPerPage);

  // ===========================
  // FORM MANAGEMENT
  // ===========================
  const resetForm = () => {
    setFormData({
      nama: '',
      jabatan_id: '',
      divisi_kode: '',
      periode: '',
      status_kepengurusan: 'aktif',
      foto_profil: null
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
    setSelectedStruktur(null);
    setShowAddModal(true);
    setMessage('');
  };

  const openEditModal = (struktur) => {
    setFormData({
        id: struktur.id,
      nama: struktur.nama || '',
      jabatan_id: struktur.jabatan_id || '',
      divisi_kode: struktur.divisi_kode || '',
      periode: struktur.periode || '',
      status_kepengurusan: struktur.status_kepengurusan || 'aktif',
      foto_profil: struktur.foto_profil || ''
    });
    setSelectedStruktur(struktur);
    setShowEditModal(true);
    setMessage('');
  };

  const openDetailModal = (struktur) => {
    setSelectedStruktur(struktur);
    setShowDetailModal(true);
  };

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedStruktur(null);
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

      // Add all form fields to FormData
      formDataToSend.append('id', formData.id);
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('jabatan_id', formData.jabatan_id);
      formDataToSend.append('periode', formData.periode);
      formDataToSend.append('status_kepengurusan', formData.status_kepengurusan);

      if (formData.divisi_kode) {
        formDataToSend.append('divisi_kode', formData.divisi_kode);
      }
      if (formData.foto_profil) {
        formDataToSend.append('foto_profil', formData.foto_profil);
      }

      const url = selectedStruktur
        ? `/admin/struktur-organisasi/${selectedStruktur.id}`
        : '/admin/struktur-organisasi';

      const method = 'POST';

      if (selectedStruktur) {
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

        // Update struktur list
        if (selectedStruktur) {
          setStrukturList(prev => prev.map(struktur =>
            struktur.id === selectedStruktur.id ? data.struktur : struktur
          ));
        } else {
          setStrukturList(prev => [data.struktur, ...prev]);
        }

        // Close modal after success
        setTimeout(() => {
          closeAllModals();
        }, 1500);
      } else {
        setMessage(data.message || 'Terjadi kesalahan saat menyimpan data');
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

  const handleDelete = async (struktur) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${struktur.nama}" dari struktur organisasi?`)) {
        return;
    }

    setIsLoading(true);
    setMessage('');

    try {
        // Get CSRF token
        await fetch('/sanctum/csrf-cookie', {
        credentials: 'include'
        });

        // Log untuk debugging
        console.log('Deleting struktur:', {
        id: struktur.id,
        nama: struktur.nama
        });

        const response = await fetch(`/admin/struktur-organisasi/${struktur.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            'Accept': 'application/json'
        },
        // TAMBAHKAN: Kirim data dalam body untuk memastikan request diterima dengan benar
        body: JSON.stringify({
            id: struktur.id,
            _method: 'DELETE' // Laravel method spoofing
        })
        });

        console.log('Delete response status:', response.status);

        // Cek apakah response berhasil
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Delete response data:', data);

        if (data.success) {
        // Update state untuk menghapus item dari list
        setStrukturList(prev => prev.filter(s => s.id !== struktur.id));

        setMessage('Data berhasil dihapus');
        setMessageType('success');

        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
        } else {
        setMessage(data.message || 'Gagal menghapus data');
        setMessageType('error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        setMessage('Terjadi kesalahan saat menghapus data: ' + error.message);
        setMessageType('error');
    } finally {
        setIsLoading(false);
    }
    };

  // ===========================
  // MAIN RENDER
  // ===========================
  return (
    <AdminLayout
        user={user}
      currentPage="struktur-organisasi"
      title="Struktur Organisasi"
      subtitle="Kelola dan pantau struktur kepengurusan KSM-IF"
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

        {/* Add Button */}
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
            <span>Tambah Anggota</span>
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
                  placeholder="Cari nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={filterJabatan}
                onChange={(e) => setFilterJabatan(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Jabatan</option>
                {jabatanList.map(jabatan => (
                  <option key={jabatan.id} value={jabatan.id}>{jabatan.nama}</option>
                ))}
              </select>

              <select
                value={filterDivisi}
                onChange={(e) => setFilterDivisi(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Divisi</option>
                <option value="">Umum/BPH</option>
                {divisiList.map(divisi => (
                  <option key={divisi.kode} value={divisi.kode}>{divisi.nama}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="non-aktif">Non-Aktif</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="nama">Nama A-Z</option>
                <option value="jabatan">Jabatan</option>
                <option value="divisi">Divisi</option>
                <option value="periode">Periode</option>
                <option value="newest">Terbaru</option>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{strukturList.length}</div>
                <div className="text-sm text-gray-600">Total Anggota</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {strukturList.filter(s => s.status_kepengurusan === 'aktif').length}
                </div>
                <div className="text-sm text-gray-600">Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {strukturList.filter(s => s.status_kepengurusan === 'non-aktif').length}
                </div>
                <div className="text-sm text-gray-600">Non-Aktif</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Struktur List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden"
        >
          {viewMode === 'grid' ? (
            <div className="p-6">
              {paginatedStruktur.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedStruktur.map((struktur) => (
                    <StrukturCard
                      key={struktur.id}
                      struktur={struktur}
                      onDetail={() => openDetailModal(struktur)}
                      onEdit={() => openEditModal(struktur)}
                      onDelete={() => handleDelete(struktur)}
                      getStatusColor={getStatusColor}
                      getStatusText={getStatusText}
                      getJabatanName={getJabatanName}
                      getDivisiName={getDivisiName}
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
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Jabatan</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Divisi</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Periode</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStruktur.length > 0 ? (
                    paginatedStruktur.map((struktur) => (
                      <StrukturTableRow
                        key={struktur.id}
                        struktur={struktur}
                        onDetail={() => openDetailModal(struktur)}
                        onEdit={() => openEditModal(struktur)}
                        onDelete={() => handleDelete(struktur)}
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                        getJabatanName={getJabatanName}
                        getDivisiName={getDivisiName}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-gray-500">
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
                  Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredAndSortedStruktur.length)} dari {filteredAndSortedStruktur.length} anggota
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
            <StrukturModal
              title="Tambah Anggota Struktur"
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onClose={closeAllModals}
              isLoading={isLoading}
              message={message}
              messageType={messageType}
              jabatanList={jabatanList}
              divisiList={divisiList}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditModal && (
            <StrukturModal
              title="Edit Anggota Struktur"
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onClose={closeAllModals}
              isLoading={isLoading}
              message={message}
              messageType={messageType}
              jabatanList={jabatanList}
              divisiList={divisiList}
              isEdit={true}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDetailModal && selectedStruktur && (
            <DetailModal
              struktur={selectedStruktur}
              onClose={closeAllModals}
              onEdit={() => {
                closeAllModals();
                openEditModal(selectedStruktur);
              }}
              onDelete={() => {
                closeAllModals();
                handleDelete(selectedStruktur);
              }}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getJabatanName={getJabatanName}
              getDivisiName={getDivisiName}
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

// Struktur Card Component for Grid View
const StrukturCard = ({
  struktur,
  onDetail,
  onEdit,
  onDelete,
  getStatusColor,
  getStatusText,
  getJabatanName,
  getDivisiName
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
  >
    {/* Profile Image Header */}
    <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
      {struktur.foto_profil ? (
        <img
          src={`/storage/${struktur.foto_profil}`}
          alt={struktur.nama}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className="w-full h-full flex items-center justify-center" style={{ display: struktur.foto_profil ? 'none' : 'flex' }}>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute top-3 left-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(struktur)}`}>
          {getStatusText(struktur)}
        </span>
      </div>

      {/* Periode Badge */}
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 bg-white/90 text-gray-800 rounded-full text-xs font-medium">
          {struktur.periode}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 mb-1 text-lg">{struktur.nama}</h3>
      <p className="text-blue-600 font-medium text-sm mb-1">{getJabatanName(struktur.jabatan_id)}</p>
      <p className="text-gray-600 text-sm mb-3">{getDivisiName(struktur.divisi_kode)}</p>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
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

// Struktur Table Row Component for Table View
const StrukturTableRow = ({
  struktur,
  onDetail,
  onEdit,
  onDelete,
  getStatusColor,
  getStatusText,
  getJabatanName,
  getDivisiName
}) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
  >
    <td className="py-4 px-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          {struktur.foto_profil ? (
            <img
              src={`/${struktur.foto_profil}`}
              alt={struktur.nama}
              className="w-full h-full object-cover rounded-full"
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
            style={{ display: struktur.foto_profil ? 'none' : 'block' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{struktur.nama}</h4>
        </div>
      </div>
    </td>
    <td className="py-4 px-6 text-sm text-gray-600">
      {getJabatanName(struktur.jabatan_id)}
    </td>
    <td className="py-4 px-6 text-sm text-gray-600">
      {getDivisiName(struktur.divisi_kode)}
    </td>
    <td className="py-4 px-6 text-sm text-gray-600">
      {struktur.periode}
    </td>
    <td className="py-4 px-6">
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(struktur)}`}>
        {getStatusText(struktur)}
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <p className="text-gray-500 text-lg mb-2">Tidak ada data struktur yang ditemukan</p>
    <p className="text-gray-400 text-sm">Coba ubah filter atau tambah anggota baru</p>
  </div>
);

// Struktur Modal Component
const StrukturModal = ({
  title,
  formData,
  onInputChange,
  onSubmit,
  onClose,
  isLoading,
  message,
  messageType,
  jabatanList,
  divisiList,
  isEdit = false
}) => {
  const [fotoPreview, setFotoPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onInputChange('foto_profil', file);

      // Create preview for image
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
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
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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

        <div className="p-6 space-y-4">
          {message && (
            <div className={`p-4 rounded-xl text-sm border ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nama || ''}
              onChange={(e) => onInputChange('nama', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Jabatan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jabatan <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.jabatan_id || ''}
              onChange={(e) => onInputChange('jabatan_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Jabatan</option>
              {jabatanList.map(jabatan => (
                <option key={jabatan.id} value={jabatan.id}>{jabatan.nama}</option>
              ))}
            </select>
          </div>

          {/* Divisi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Divisi
            </label>
            <select
              value={formData.divisi_kode || ''}
              onChange={(e) => onInputChange('divisi_kode', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Umum/BPH</option>
              {divisiList.map(divisi => (
                <option key={divisi.kode} value={divisi.kode}>{divisi.nama}</option>
              ))}
            </select>
          </div>

          {/* Periode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.periode || ''}
              onChange={(e) => onInputChange('periode', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contoh: 2024/2025"
            />
          </div>

          {/* Foto Profil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Profil
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {fotoPreview && (
                <div className="mt-2">
                  <img
                    src={fotoPreview}
                    alt="Preview foto"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
              {isEdit && !fotoPreview && (
                <p className="text-sm text-gray-500">
                  Kosongkan jika tidak ingin mengubah foto
                </p>
              )}
            </div>
          </div>

          {/* Status Kepengurusan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Kepengurusan
            </label>
            <select
              value={formData.status_kepengurusan || 'aktif'}
              onChange={(e) => onInputChange('status_kepengurusan', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="aktif">Aktif</option>
              <option value="non-aktif">Non-Aktif</option>
            </select>
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
              <span>{isLoading ? 'Menyimpan...' : (isEdit ? 'Update Data' : 'Simpan Data')}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Detail Modal Component
const DetailModal = ({
  struktur,
  onClose,
  onEdit,
  onDelete,
  getStatusColor,
  getStatusText,
  getJabatanName,
  getDivisiName
}) => (
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
      className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{struktur.nama}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusColor(struktur)}`}>
              {getStatusText(struktur)}
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
        {/* Foto Profil */}
        <div className="text-center">
          {struktur.foto_profil ? (
            <img
              src={`/storage/${struktur.foto_profil}`}
              alt={struktur.nama}
              className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Detail Informasi */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Jabatan</h4>
              <p className="text-gray-600">{getJabatanName(struktur.jabatan_id)}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Divisi</h4>
              <p className="text-gray-600">{getDivisiName(struktur.divisi_kode)}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Periode</h4>
              <p className="text-gray-600">{struktur.periode}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-1">Status Kepengurusan</h4>
              <p className="text-gray-600 capitalize">{struktur.status_kepengurusan}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={onDelete}
            className="px-6 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Hapus Data
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            Edit Data
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default StrukturOrganisasiPage;
