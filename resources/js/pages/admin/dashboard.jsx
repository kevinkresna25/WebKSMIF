import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeMembers] = useState(24);
  const [totalPrograms] = useState(12);
  const [totalParticipants] = useState(156);

  // Sample data
  const recentMembers = [
    { id: 1, name: 'Ahmad Fauzi', role: 'Ketua Umum', avatar: '👨‍💼', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Sari Dewi', role: 'Sekretaris', avatar: '👩‍💼', status: 'active', joinDate: '2024-01-20' },
    { id: 3, name: 'Budi Santoso', role: 'Bendahara', avatar: '👨‍💼', status: 'active', joinDate: '2024-02-01' },
    { id: 4, name: 'Maya Sari', role: 'Koordinator Acara', avatar: '👩‍💼', status: 'active', joinDate: '2024-02-10' },
    { id: 5, name: 'Andi Rahman', role: 'Humas', avatar: '👨‍💼', status: 'active', joinDate: '2024-02-15' }
  ];

  const recentPrograms = [
    { id: 1, title: 'Workshop Machine Learning', date: '2024-03-15', participants: 45, status: 'completed' },
    { id: 2, title: 'Seminar AI & Ethics', date: '2024-04-20', participants: 78, status: 'completed' },
    { id: 3, title: 'Hackathon 2024', date: '2024-05-10', participants: 32, status: 'upcoming' },
    { id: 4, title: 'Tech Talk: Cloud Computing', date: '2024-05-25', participants: 56, status: 'upcoming' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', active: true },
    { id: 'program-kerja', label: 'Program Kerja', icon: '📋' },
    { id: 'struktur-organisasi', label: 'Struktur Organisasi', icon: '🏢' },
    { id: 'daftar-peserta', label: 'Daftar Peserta', icon: '👥' },
    { id: 'galeri', label: 'Galeri Program Kerja', icon: '📸' },
    { id: 'bursa-soal', label: 'Bursa Soal', icon: '📚' },
    { id: 'settings', label: 'Pengaturan', icon: '⚙️' }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: 0, width: sidebarOpen ? 288 : 80 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed left-0 top-0 h-full bg-gradient-to-b from-[#120D2C] to-[#1a1147] shadow-2xl z-30 transition-all duration-300"
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-white font-bold text-xl">KSM-IF</h1>
                    <p className="text-white/60 text-sm">Admin Panel</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 group relative ${
                  currentPage === item.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {currentPage === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`w-2 h-2 bg-white rounded-full ${sidebarOpen ? 'ml-auto' : 'absolute right-1'}`}
                  />
                )}

                {/* Tooltip for collapsed sidebar */}
                {!sidebarOpen && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">AD</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Admin User</p>
                      <p className="text-white/60 text-xs">admin@ksmif.ac.id</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed Sidebar Footer */}
          {!sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AD</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Top Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 p-6 sticky top-0 z-20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: sidebarOpen ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </motion.svg>
              </motion.button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600">Selamat datang di panel admin KSM-IF</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <motion.button
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300 relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM5 12V7a5 5 0 1110 0v5l-5 5-5-5z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </motion.button>
              </div>

              <motion.button
                className="flex items-center space-x-2 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AD</span>
                </div>
                <span className="text-gray-700 font-medium">Admin</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <StatsCard
              title="Anggota Aktif"
              value={activeMembers}
              icon="👥"
              color="blue"
              change="+12%"
            />
            <StatsCard
              title="Total Program"
              value={totalPrograms}
              icon="📋"
              color="green"
              change="+8%"
            />
            <StatsCard
              title="Total Peserta"
              value={totalParticipants}
              icon="🎓"
              color="purple"
              change="+25%"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About KSM-IF */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Tentang KSM-IF
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Visi</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Menjadi komunitas mahasiswa Teknik Informatika yang unggul dalam bidang teknologi,
                    inovasi, dan pengembangan sumber daya manusia yang berkualitas.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Misi</h4>
                  <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                    <li>Mengembangkan kemampuan teknis dan soft skill mahasiswa</li>
                    <li>Memfasilitasi kolaborasi antar mahasiswa dalam bidang IT</li>
                    <li>Menyelenggarakan program-program edukatif dan inovatif</li>
                    <li>Membangun network dengan industri teknologi</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Recent Members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6"
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

              <div className="space-y-3">
                {recentMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-xl">{member.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{member.name}</p>
                        <p className="text-gray-600 text-xs">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                        {member.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6"
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
        </main>
      </div>
    </div>
  );
};

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

export default AdminDashboard;
