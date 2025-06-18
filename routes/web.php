<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('client/home');
});

Route::get('/team', function () {
    return Inertia::render('client/team');
});

Route::get('/gallery', function () {
    return Inertia::render('client/gallery');
});

Route::get('/lsta', function () {
    return Inertia::render('client/lsta');
});

Route::get('/login', function () {
    return Inertia::render('admin/login');
});

Route::get('/dashboard', function () {
    return Inertia::render('admin/dashboard');
});

// Admin Login Routes (tanpa middleware auth)
// Route::prefix('admin')->name('admin.')->group(function () {
//     Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('login');
//     Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
// });

/*
|--------------------------------------------------------------------------
| Protected Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {

    // Dashboard
    // Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Route::get('/', [DashboardController::class, 'index'])->name('home'); // redirect admin/ ke dashboard

    // Logout
    // Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    /*
    |--------------------------------------------------------------------------
    | Program Kerja Management
    |--------------------------------------------------------------------------
    */
    // Route::prefix('program-kerja')->name('program-kerja.')->group(function () {
    //     Route::get('/', [ProgramKerjaController::class, 'index'])->name('index');
    //     Route::get('/create', [ProgramKerjaController::class, 'create'])->name('create');
    //     Route::post('/', [ProgramKerjaController::class, 'store'])->name('store');
    //     Route::get('/{id}', [ProgramKerjaController::class, 'show'])->name('show');
    //     Route::get('/{id}/edit', [ProgramKerjaController::class, 'edit'])->name('edit');
    //     Route::put('/{id}', [ProgramKerjaController::class, 'update'])->name('update');
    //     Route::delete('/{id}', [ProgramKerjaController::class, 'destroy'])->name('destroy');

    //     // Program Kerja Actions
    //     Route::post('/{id}/duplicate', [ProgramKerjaController::class, 'duplicate'])->name('duplicate');
    //     Route::patch('/{id}/status', [ProgramKerjaController::class, 'updateStatus'])->name('update-status');
    //     Route::get('/{id}/participants', [ProgramKerjaController::class, 'participants'])->name('participants');
    //     Route::get('/{id}/export', [ProgramKerjaController::class, 'export'])->name('export');
    // });

    /*
    |--------------------------------------------------------------------------
    | Struktur Organisasi Management
    |--------------------------------------------------------------------------
    */
    // Route::prefix('struktur-organisasi')->name('struktur-organisasi.')->group(function () {
    //     Route::get('/', [StrukturOrganisasiController::class, 'index'])->name('index');
    //     Route::get('/create', [StrukturOrganisasiController::class, 'create'])->name('create');
    //     Route::post('/', [StrukturOrganisasiController::class, 'store'])->name('store');
    //     Route::get('/{id}/edit', [StrukturOrganisasiController::class, 'edit'])->name('edit');
    //     Route::put('/{id}', [StrukturOrganisasiController::class, 'update'])->name('update');
    //     Route::delete('/{id}', [StrukturOrganisasiController::class, 'destroy'])->name('destroy');

    //     // Organizational Actions
    //     Route::post('/{id}/promote', [StrukturOrganisasiController::class, 'promote'])->name('promote');
    //     Route::post('/{id}/demote', [StrukturOrganisasiController::class, 'demote'])->name('demote');
    //     Route::get('/hierarchy', [StrukturOrganisasiController::class, 'hierarchy'])->name('hierarchy');
    //     Route::post('/reorder', [StrukturOrganisasiController::class, 'reorder'])->name('reorder');
    // });

    /*
    |--------------------------------------------------------------------------
    | Daftar Peserta Management
    |--------------------------------------------------------------------------
    */
    // Route::prefix('peserta')->name('peserta.')->group(function () {
    //     Route::get('/', [PesertaController::class, 'index'])->name('index');
    //     Route::get('/create', [PesertaController::class, 'create'])->name('create');
    //     Route::post('/', [PesertaController::class, 'store'])->name('store');
    //     Route::get('/{id}', [PesertaController::class, 'show'])->name('show');
    //     Route::get('/{id}/edit', [PesertaController::class, 'edit'])->name('edit');
    //     Route::put('/{id}', [PesertaController::class, 'update'])->name('update');
    //     Route::delete('/{id}', [PesertaController::class, 'destroy'])->name('destroy');

    //     // Participant Actions
    //     Route::post('/import', [PesertaController::class, 'import'])->name('import');
    //     Route::get('/export', [PesertaController::class, 'export'])->name('export');
    //     Route::post('/{id}/activate', [PesertaController::class, 'activate'])->name('activate');
    //     Route::post('/{id}/deactivate', [PesertaController::class, 'deactivate'])->name('deactivate');
    //     Route::get('/by-program/{programId}', [PesertaController::class, 'byProgram'])->name('by-program');
    //     Route::post('/bulk-action', [PesertaController::class, 'bulkAction'])->name('bulk-action');
    // });

    /*
    |--------------------------------------------------------------------------
    | Galeri Program Kerja Management
    |--------------------------------------------------------------------------
    */
    // Route::prefix('galeri')->name('galeri.')->group(function () {
    //     Route::get('/', [GaleriController::class, 'index'])->name('index');
    //     Route::get('/create', [GaleriController::class, 'create'])->name('create');
    //     Route::post('/', [GaleriController::class, 'store'])->name('store');
    //     Route::get('/{id}', [GaleriController::class, 'show'])->name('show');
    //     Route::get('/{id}/edit', [GaleriController::class, 'edit'])->name('edit');
    //     Route::put('/{id}', [GaleriController::class, 'update'])->name('update');
    //     Route::delete('/{id}', [GaleriController::class, 'destroy'])->name('destroy');

    //     // Gallery Actions
    //     Route::post('/upload-multiple', [GaleriController::class, 'uploadMultiple'])->name('upload-multiple');
    //     Route::post('/{id}/set-featured', [GaleriController::class, 'setFeatured'])->name('set-featured');
    //     Route::get('/by-program/{programId}', [GaleriController::class, 'byProgram'])->name('by-program');
    //     Route::post('/bulk-delete', [GaleriController::class, 'bulkDelete'])->name('bulk-delete');
    //     Route::get('/download-album/{programId}', [GaleriController::class, 'downloadAlbum'])->name('download-album');
    // });

    /*
    |--------------------------------------------------------------------------
    | Bursa Soal Management
    |--------------------------------------------------------------------------
    */
    // Route::prefix('bursa-soal')->name('bursa-soal.')->group(function () {
    //     Route::get('/', [BursaSoalController::class, 'index'])->name('index');
    //     Route::get('/create', [BursaSoalController::class, 'create'])->name('create');
    //     Route::post('/', [BursaSoalController::class, 'store'])->name('store');
    //     Route::get('/{id}', [BursaSoalController::class, 'show'])->name('show');
    //     Route::get('/{id}/edit', [BursaSoalController::class, 'edit'])->name('edit');
    //     Route::put('/{id}', [BursaSoalController::class, 'update'])->name('update');
    //     Route::delete('/{id}', [BursaSoalController::class, 'destroy'])->name('destroy');

    //     // Question Bank Actions
    //     Route::get('/categories', [BursaSoalController::class, 'categories'])->name('categories');
    //     Route::post('/categories', [BursaSoalController::class, 'storeCategory'])->name('categories.store');
    //     Route::put('/categories/{id}', [BursaSoalController::class, 'updateCategory'])->name('categories.update');
    //     Route::delete('/categories/{id}', [BursaSoalController::class, 'destroyCategory'])->name('categories.destroy');

    //     Route::post('/import', [BursaSoalController::class, 'import'])->name('import');
    //     Route::get('/export', [BursaSoalController::class, 'export'])->name('export');
    //     Route::post('/{id}/approve', [BursaSoalController::class, 'approve'])->name('approve');
    //     Route::post('/{id}/reject', [BursaSoalController::class, 'reject'])->name('reject');
    //     Route::get('/pending-review', [BursaSoalController::class, 'pendingReview'])->name('pending-review');
    // });

    /*
    |--------------------------------------------------------------------------
    | User Management
    |--------------------------------------------------------------------------
    */
    // Route::prefix('users')->name('users.')->group(function () {
    //     Route::get('/', [UserController::class, 'index'])->name('index');
    //     Route::get('/create', [UserController::class, 'create'])->name('create');
    //     Route::post('/', [UserController::class, 'store'])->name('store');
    //     Route::get('/{id}', [UserController::class, 'show'])->name('show');
    //     Route::get('/{id}/edit', [UserController::class, 'edit'])->name('edit');
    //     Route::put('/{id}', [UserController::class, 'update'])->name('update');
    //     Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');

    //     // User Management Actions
    //     Route::post('/{id}/reset-password', [UserController::class, 'resetPassword'])->name('reset-password');
    //     Route::post('/{id}/toggle-status', [UserController::class, 'toggleStatus'])->name('toggle-status');
    //     Route::get('/{id}/activity-log', [UserController::class, 'activityLog'])->name('activity-log');
    //     Route::post('/bulk-action', [UserController::class, 'bulkAction'])->name('bulk-action');
    // });

    /*
    |--------------------------------------------------------------------------
    | Reports & Analytics
    |--------------------------------------------------------------------------
    */
    // Route::prefix('reports')->name('reports.')->group(function () {
    //     Route::get('/', [ReportController::class, 'index'])->name('index');
    //     Route::get('/dashboard-stats', [ReportController::class, 'dashboardStats'])->name('dashboard-stats');
    //     Route::get('/program-analytics', [ReportController::class, 'programAnalytics'])->name('program-analytics');
    //     Route::get('/participant-analytics', [ReportController::class, 'participantAnalytics'])->name('participant-analytics');
    //     Route::get('/financial-report', [ReportController::class, 'financialReport'])->name('financial-report');
    //     Route::get('/export/{type}', [ReportController::class, 'export'])->name('export');
    // });

    /*
    |--------------------------------------------------------------------------
    | Settings Management
    |--------------------------------------------------------------------------
    */
    // Route::prefix('settings')->name('settings.')->group(function () {
    //     Route::get('/', [SettingsController::class, 'index'])->name('index');
    //     Route::put('/general', [SettingsController::class, 'updateGeneral'])->name('update-general');
    //     Route::put('/email', [SettingsController::class, 'updateEmail'])->name('update-email');
    //     Route::put('/security', [SettingsController::class, 'updateSecurity'])->name('update-security');
    //     Route::put('/notifications', [SettingsController::class, 'updateNotifications'])->name('update-notifications');

    //     // System Settings
    //     Route::get('/system', [SettingsController::class, 'system'])->name('system');
    //     Route::post('/backup', [SettingsController::class, 'backup'])->name('backup');
    //     Route::post('/restore', [SettingsController::class, 'restore'])->name('restore');
    //     Route::get('/logs', [SettingsController::class, 'logs'])->name('logs');
    //     Route::post('/clear-cache', [SettingsController::class, 'clearCache'])->name('clear-cache');
    // });

    /*
    |--------------------------------------------------------------------------
    | API Routes untuk AJAX/Fetch
    |--------------------------------------------------------------------------
    */
    // Route::prefix('api')->name('api.')->group(function () {
    //     // Dashboard API
    //     Route::get('/dashboard/stats', [DashboardController::class, 'getStats'])->name('dashboard.stats');
    //     Route::get('/dashboard/recent-activities', [DashboardController::class, 'getRecentActivities'])->name('dashboard.recent-activities');

    //     // Quick Actions API
    //     Route::post('/quick-search', [DashboardController::class, 'quickSearch'])->name('quick-search');
    //     Route::get('/notifications', [DashboardController::class, 'getNotifications'])->name('notifications');
    //     Route::post('/notifications/{id}/mark-read', [DashboardController::class, 'markNotificationRead'])->name('notifications.mark-read');

    //     // File Upload API
    //     Route::post('/upload/image', [SettingsController::class, 'uploadImage'])->name('upload.image');
    //     Route::post('/upload/document', [SettingsController::class, 'uploadDocument'])->name('upload.document');
    //     Route::delete('/upload/{id}', [SettingsController::class, 'deleteUpload'])->name('upload.delete');
    // });
});
