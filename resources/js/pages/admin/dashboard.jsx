import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from './layout'; // Import the layout component

// ===========================
// ADMIN DASHBOARD COMPONENT
// ===========================
const AdminDashboard = ({
  user,
  stats,
  recentActivities,
  userAnalytics,
  systemInfo,
  ksmInfo,
  notifications
}) => {
  // State management for KSM Info editing
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [editedInfo, setEditedInfo] = useState(ksmInfo || {});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Sample data for recent members
  const recentMembers = [
    { id: 1, name: 'Ahmad Fauzi', role: 'Ketua Umum', avatar: '👨‍💼', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Sari Dewi', role: 'Sekretaris', avatar: '👩‍💼', status: 'active', joinDate: '2024-01-20' },
    { id: 3, name: 'Budi Santoso', role: 'Bendahara', avatar: '👨‍💼', status: 'active', joinDate: '2024-02-01' },
    { id: 4, name: 'Maya Sari', role: 'Koordinator Acara', avatar: '👩‍💼', status: 'active', joinDate: '2024-02-10' },
    { id: 5, name: 'Andi Rahman', role: 'Humas', avatar: '👨‍💼', status: 'active', joinDate: '2024-02-15' }
  ];

  // Sample data for recent programs
  const recentPrograms = [
    { id: 1, title: 'Workshop Machine Learning', date: '2024-03-15', participants: 45, status: 'completed' },
    { id: 2, title: 'Seminar AI & Ethics', date: '2024-04-20', participants: 78, status: 'completed' },
    { id: 3, title: 'Hackathon 2024', date: '2024-05-10', participants: 32, status: 'upcoming' },
    { id: 4, title: 'Tech Talk: Cloud Computing', date: '2024-05-25', participants: 56, status: 'upcoming' }
  ];

  useEffect(() => {
    document.title = 'Admin KSM-IF Dashboard';
    setEditedInfo(ksmInfo || {});
  }, [ksmInfo]);

  // ===========================
  // KSM INFO MANAGEMENT FUNCTIONS
  // ===========================
  const handleEditInfo = () => {
    setIsEditingInfo(true);
    setIsEditingSocial(false);
    setMessage('');
  };

  const handleEditSocial = () => {
    setIsEditingSocial(true);
    setIsEditingInfo(false);
    setMessage('');
  };

  const handleCancelEdit = () => {
    setIsEditingInfo(false);
    setIsEditingSocial(false);
    setEditedInfo(ksmInfo || {});
    setMessage('');
  };

  const handleInputChange = (field, value) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMisiChange = (index, value) => {
    const newMisi = [...(editedInfo.misi || [])];
    newMisi[index] = value;
    setEditedInfo(prev => ({
      ...prev,
      misi: newMisi
    }));
  };

  const addMisiPoint = () => {
    setEditedInfo(prev => ({
      ...prev,
      misi: [...(prev.misi || []), '']
    }));
  };

  const removeMisiPoint = (index) => {
    const newMisi = (editedInfo.misi || []).filter((_, i) => i !== index);
    setEditedInfo(prev => ({
      ...prev,
      misi: newMisi
    }));
  };

  const handleSaveInfo = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Get CSRF token
      await fetch('/sanctum/csrf-cookie', {
        credentials: 'include'
      });

      const response = await fetch('/admin/update-ksm-info', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({
          tentang: editedInfo.tentang,
          visi: editedInfo.visi,
          misi: editedInfo.misi || [],
          email: editedInfo.email,
          instagram: editedInfo.instagram,
          line: editedInfo.line,
          whatsapp: editedInfo.whatsapp
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setMessageType('success');
        setIsEditingInfo(false);
        setIsEditingSocial(false);

        // Update the local data
        setEditedInfo(data.data);

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage(data.message || 'Terjadi kesalahan saat menyimpan data');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage('Terjadi kesalahan jaringan. Silakan coba lagi.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================
  // DASHBOARD CONTENT
  // ===========================
  return (
    <AdminLayout
      user={user}
      currentPage="dashboard"
      title="Dashboard"
      subtitle="Selamat datang di panel admin KSM-IF"
      notifications={notifications}
    >
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

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <StatsCard
          title="Anggota Aktif"
          value={stats?.active_users || 0}
          icon="👥"
          color="blue"
          change={`+${stats?.new_users_this_month || 0} bulan ini`}
        />
        <StatsCard
          title="Total Users"
          value={stats?.total_users || 0}
          icon="📋"
          color="green"
          change={`+${stats?.new_users_this_week || 0} minggu ini`}
        />
        <StatsCard
          title="Admin Users"
          value={stats?.total_admins || 0}
          icon="🎓"
          color="purple"
          change={`+${stats?.new_users_today || 0} hari ini`}
        />
      </motion.div>

      {/* About KSM-IF and Social Media Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* About KSM-IF Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">🎯</span>
              Tentang KSM-IF
            </h3>
            {!isEditingInfo && (
              <button
                onClick={handleEditInfo}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>
            )}
          </div>

          {!isEditingInfo ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Tentang</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {editedInfo?.tentang || 'Data tidak tersedia'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Visi</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {editedInfo?.visi || 'Data tidak tersedia'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Misi</h4>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  {(editedInfo?.misi || []).map((misiItem, index) => (
                    <li key={index}>{misiItem}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Edit Form for About */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tentang</label>
                <textarea
                  value={editedInfo?.tentang || ''}
                  onChange={(e) => handleInputChange('tentang', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows="3"
                  placeholder="Deskripsi tentang KSM-IF..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visi</label>
                <textarea
                  value={editedInfo?.visi || ''}
                  onChange={(e) => handleInputChange('visi', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows="2"
                  placeholder="Visi KSM-IF..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Misi</label>
                {(editedInfo?.misi || []).map((misiItem, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={misiItem}
                      onChange={(e) => handleMisiChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder={`Misi ${index + 1}...`}
                    />
                    <button
                      onClick={() => removeMisiPoint(index)}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      disabled={editedInfo?.misi?.length <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={addMisiPoint}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors text-sm"
                >
                  + Tambah Poin Misi
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveInfo}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors text-sm flex items-center space-x-2"
                >
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  <span>{isLoading ? 'Menyimpan...' : 'Simpan'}</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Social Media Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">🌐</span>
              Media Sosial
            </h3>
            {!isEditingSocial && (
              <button
                onClick={handleEditSocial}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>
            )}
          </div>

          {!isEditingSocial ? (
            <SocialMediaDisplay editedInfo={editedInfo} handleEditSocial={handleEditSocial} />
          ) : (
            <SocialMediaEditForm
              editedInfo={editedInfo}
              handleInputChange={handleInputChange}
              handleCancelEdit={handleCancelEdit}
              handleSaveInfo={handleSaveInfo}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      </div>

      {/* Recent Members */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
          <span className="flex items-center">
            <span className="mr-2">👥</span>
            Anggota Terbaru
          </span>
          <button className="text-blue-600 text-sm hover:text-blue-700 transition-colors">
            Lihat Semua
          </button>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {recentMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3">
                <span className="text-2xl">{member.avatar}</span>
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-800 text-sm">{member.name}</p>
                <p className="text-gray-600 text-xs">{member.role}</p>
                <span className="inline-flex px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium mt-2">
                  {member.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Programs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
          <span className="flex items-center">
            <span className="mr-2">📋</span>
            Program Kerja Terbaru
          </span>
          <button className="text-blue-600 text-sm hover:text-blue-700 transition-colors">
            Kelola Program
          </button>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Program</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Peserta</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentPrograms.map((program) => (
                <motion.tr
                  key={program.id}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-800">{program.title}</p>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{program.date}</td>
                  <td className="py-4 px-4 text-gray-600">{program.participants} orang</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      program.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {program.status === 'completed' ? 'Selesai' : 'Mendatang'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                      Detail
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* System Information */}
      {systemInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚙️</span>
            Informasi Sistem
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 text-sm">PHP Version</h4>
              <p className="text-gray-900 font-bold">{systemInfo.php_version}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 text-sm">Laravel Version</h4>
              <p className="text-gray-900 font-bold">{systemInfo.laravel_version}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 text-sm">Environment</h4>
              <p className="text-gray-900 font-bold capitalize">{systemInfo.environment}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 text-sm">Database Size</h4>
              <p className="text-gray-900 font-bold">{systemInfo.database_size} MB</p>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Last updated: {new Date(systemInfo.server_time).toLocaleString('id-ID')}
          </div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

// ===========================
// SUB-COMPONENTS
// ===========================

// Stats Card Component
const StatsCard = ({ title, value, icon, color, change }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`w-full h-full bg-gradient-to-br ${colorClasses[color]} rounded-full transform translate-x-6 -translate-y-6`}></div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
            <span className="text-white text-2xl">{icon}</span>
          </div>
          <span className="text-green-600 text-sm font-medium">{change}</span>
        </div>

        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
};

// Social Media Display Component
const SocialMediaDisplay = ({ editedInfo, handleEditSocial }) => (
  <div className="space-y-4">
    <div className="space-y-3">
      {editedInfo?.email && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200 hover:shadow-md transition-all duration-300"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 text-sm">Email</p>
            <a
              href={`mailto:${editedInfo.email}`}
              className="text-red-600 text-sm hover:text-red-700 transition-colors"
            >
              {editedInfo.email}
            </a>
          </div>
        </motion.div>
      )}

      {editedInfo?.instagram && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-100 border border-pink-200 hover:shadow-md transition-all duration-300"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 text-sm">Instagram</p>
            <a
              href={`https://instagram.com/${editedInfo.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 text-sm hover:text-pink-700 transition-colors"
            >
              {editedInfo.instagram}
            </a>
          </div>
        </motion.div>
      )}

      {editedInfo?.line && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 hover:shadow-md transition-all duration-300"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 text-sm">LINE</p>
            <p className="text-green-600 text-sm">{editedInfo.line}</p>
          </div>
        </motion.div>
      )}

      {editedInfo?.whatsapp && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 hover:shadow-md transition-all duration-300"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 text-sm">WhatsApp</p>
            <a
              href={`https://wa.me/${editedInfo.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 text-sm hover:text-green-700 transition-colors"
            >
              {editedInfo.whatsapp}
            </a>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!editedInfo?.email && !editedInfo?.instagram && !editedInfo?.line && !editedInfo?.whatsapp && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Belum ada kontak sosial media yang ditambahkan</p>
          <button
            onClick={handleEditSocial}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Tambah Kontak
          </button>
        </div>
      )}
    </div>
  </div>
);

// Social Media Edit Form Component
const SocialMediaEditForm = ({
  editedInfo,
  handleInputChange,
  handleCancelEdit,
  handleSaveInfo,
  isLoading
}) => (
  <div className="space-y-4">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Email
        </label>
        <input
          type="email"
          value={editedInfo?.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="contact@ksmif.ac.id"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
          </svg>
          Instagram
        </label>
        <input
          type="text"
          value={editedInfo?.line || ''}
          onChange={(e) => handleInputChange('line', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="@ksmif"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          WhatsApp
        </label>
        <input
          type="text"
          value={editedInfo?.whatsapp || ''}
          onChange={(e) => handleInputChange('whatsapp', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="+62812345678"
        />
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center justify-end space-x-3 pt-4">
      <button
        onClick={handleCancelEdit}
        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        disabled={isLoading}
      >
        Batal
      </button>
      <button
        onClick={handleSaveInfo}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors text-sm flex items-center space-x-2"
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        )}
        <span>{isLoading ? 'Menyimpan...' : 'Simpan'}</span>
      </button>
    </div>
  </div>
);

export default AdminDashboard;
