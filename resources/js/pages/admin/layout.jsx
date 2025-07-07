import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ===========================
// NAVIGATION DATA
// ===========================
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    path: '/admin/dashboard'
  },
  {
    id: 'program-kerja',
    label: 'Program Kerja',
    icon: '📋',
    path: '/admin/program-kerja'
  },
  {
    id: 'struktur-organisasi',
    label: 'Struktur Organisasi',
    icon: '🏢',
    path: '/admin/struktur-organisasi'
  },
  {
    id: 'daftar-peserta',
    label: 'Daftar Peserta',
    icon: '👥',
    path: '/admin/daftar-peserta'
  },
  {
    id: 'galeri',
    label: 'Galeri Program Kerja',
    icon: '📸',
    path: '/admin/galeri'
  },
  {
    id: 'bursa-soal',
    label: 'Bursa Soal',
    icon: '📚',
    path: '/admin/bursa-soal'
  },
  {
    id: 'settings',
    label: 'Pengaturan',
    icon: '⚙️',
    path: '/admin/settings'
  }
];

// ===========================
// ADMIN SIDEBAR COMPONENT
// ===========================
const AdminSidebar = ({
  user,
  currentPage,
  onNavigate,
  sidebarOpen = true,
  notifications = []
}) => {
  const handleNavigation = (item) => {
    if (onNavigate) {
      onNavigate(item.id, item.path);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      try {
        await fetch('/admin/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
          }
        });
        window.location.href = '/admin/login';
      } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/admin/login';
      }
    }
  };

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{
        x: 0,
        width: sidebarOpen ? 288 : 80
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-gradient-to-b from-[#120D2C] to-[#1a1147] shadow-2xl z-30 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
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
      <nav className={`mt-4 px-4 flex-1 ${sidebarOpen ? 'overflow-y-auto' : 'overflow-hidden'} scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent`}>
        <div className={`${!sidebarOpen ? 'flex flex-col items-center' : ''}`}>
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`${sidebarOpen ? 'w-full' : 'w-12 h-12'} flex items-center ${sidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center'} rounded-xl mb-2 transition-all duration-300 group relative ${
                currentPage === item.id
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={!sidebarOpen ? item.label : ''}
            >
              <span className={`${sidebarOpen ? 'text-xl' : 'text-lg'} flex-shrink-0`}>{item.icon}</span>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium text-sm truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {currentPage === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className={`w-2 h-2 bg-white rounded-full ${sidebarOpen ? 'ml-auto' : 'absolute -right-1 -top-1'}`}
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

          {/* Divider */}
          <div className={`my-4 border-t border-white/10 ${!sidebarOpen ? 'w-8' : ''}`}></div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            className={`${sidebarOpen ? 'w-full' : 'w-12 h-12'} flex items-center ${sidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center'} rounded-xl mb-2 transition-all duration-300 group text-white/70 hover:bg-red-500/20 hover:text-red-300`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <span className={`${sidebarOpen ? 'text-xl' : 'text-lg'} flex-shrink-0`}>🚪</span>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>

            {/* Logout Tooltip */}
            {!sidebarOpen && (
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
                Logout
              </div>
            )}
          </motion.button>
        </div>
      </nav>

      {/* Sidebar Footer - User Info */}
      <div className="border-t border-white/10 p-4 flex-shrink-0">
        <AnimatePresence>
          {sidebarOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-white/60 text-xs truncate">
                      {user?.email || 'admin@ksmif.ac.id'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ===========================
// ADMIN HEADER COMPONENT
// ===========================
const AdminHeader = ({
  title,
  subtitle,
  user,
  notifications = [],
  sidebarOpen = true,
  onToggleSidebar
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 p-6 sticky top-0 z-20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button */}
          <motion.button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={sidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
          >
            <motion.div
              className="w-6 h-6 flex flex-col justify-center items-center space-y-1"
              animate={sidebarOpen ? "open" : "closed"}
            >
              <motion.span
                className="w-6 h-0.5 bg-gray-600 rounded-full block"
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 6 }
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-6 h-0.5 bg-gray-600 rounded-full block"
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 }
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-6 h-0.5 bg-gray-600 rounded-full block"
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -6 }
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.button>

          {/* Title Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={notifications?.length > 0 ? `${notifications.length} notifikasi` : 'Tidak ada notifikasi'}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM5 12V7a5 5 0 1110 0v5l-5 5-5-5z" />
              </svg>
              {notifications?.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                />
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-sm">Tidak ada notifikasi</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <motion.div
            className="flex items-center space-x-2 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <span className="text-gray-700 font-medium">{user?.name || 'Admin'}</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

// ===========================
// ADMIN LAYOUT COMPONENT
// ===========================
const AdminLayout = ({
  children,
  user,
  currentPage,
  title,
  subtitle,
  notifications = []
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (pageId, path) => {
    console.log('Navigating to:', pageId, path);
    // Handle navigation logic here
    // This could be used with React Router or any other navigation system

    // Example with window.location (for server-side routing)
    if (path) {
      window.location.href = path;
    }

    // Example for client-side routing (uncomment if using React Router)
    // navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        currentPage={currentPage}
        onNavigate={handleNavigation}
        sidebarOpen={sidebarOpen}
        notifications={notifications}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Header */}
        <AdminHeader
          title={title}
          subtitle={subtitle}
          user={user}
          notifications={notifications}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// ===========================
// EXPORTS
// ===========================
export { AdminSidebar, AdminHeader, AdminLayout, navigationItems };
export default AdminLayout;
