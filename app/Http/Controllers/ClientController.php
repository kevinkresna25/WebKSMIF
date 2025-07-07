<?php

namespace App\Http\Controllers;

use App\Models\Struktur_ksm;
use App\Models\Jabatan;
use App\Models\Divisi;
use App\Models\Program_kerja;
use App\Models\Galeri;
use App\Models\Info;
use App\Models\Bursa_soal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    /**
     * Display the home page
     */
    public function home()
    {
        try {
            // Ambil info website
            $info = Info::first();

            // Ambil program kerja terbaru yang sedang buka pendaftaran
            $featuredPrograms = Program_kerja::where('masa_pendaftaran', true)
                ->where('selesai', false)
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get()
                ->map(function ($program) {
                    return [
                        'id' => $program->id,
                        'nama' => $program->nama,
                        'deskripsi' => $program->deskripsi,
                        'poster' => $program->poster ? asset('storage/' . $program->poster) : '/images/default-poster.png',
                        'lokasi' => $program->lokasi,
                        'tanggal_mulai_acara' => $program->tanggal_mulai_acara,
                        'tanggal_selesai_acara' => $program->tanggal_selesai_acara,
                        'tanggal_selesai_pendaftaran' => $program->tanggal_selesai_pendaftaran,
                        'target_peserta' => $program->target_peserta,
                        'contact_person' => $program->contact_person,
                        'masa_pendaftaran' => $program->masa_pendaftaran,
                    ];
                });

            // Ambil highlight anggota (BPH + beberapa koordinator)
            $teamHighlight = Struktur_ksm::with(['jabatan', 'divisi'])
                ->where('is_active', true)
                ->where('status_kepengurusan', 'aktif')
                ->whereIn('jabatan_id', [1, 2, 5]) // Ketua, Wakil Ketua, Koordinator
                ->orderBy('jabatan_id')
                ->orderBy('nama')
                ->limit(6)
                ->get()
                ->map(function ($member) {
                    return [
                        'name' => $member->nama,
                        'position' => $member->jabatan->nama ?? 'Unknown',
                        'image' => $member->foto_profil ? asset('storage/' . $member->foto_profil) : '/images/default-avatar.png',
                        'divisi' => $member->divisi_kode ? $member->divisi->nama : 'Badan Pengurus Harian',
                        'divisi_kode' => $member->divisi_kode ?? 'BPH',
                    ];
                });

            // Ambil beberapa foto dari galeri terbaru
            $galleryPreview = Galeri::with('programKerja')
                ->orderBy('created_at', 'desc')
                ->limit(8)
                ->get()
                ->map(function ($galeri) {
                    return [
                        'id' => $galeri->id,
                        'original_name' => $galeri->original_name,
                        'image_url' => asset('storage/' . $galeri->storage_path),
                        'program_name' => $galeri->programKerja->nama ?? 'Unknown Program',
                        'created_at' => $galeri->created_at,
                    ];
                });

            // Statistik organisasi
            $stats = [
                'total_members' => Struktur_ksm::where('is_active', true)->where('status_kepengurusan', 'aktif')->count(),
                'active_programs' => Program_kerja::where('masa_pendaftaran', true)->where('selesai', false)->count(),
                'total_programs' => Program_kerja::count(),
                'divisions' => Divisi::count(),
                'gallery_photos' => Galeri::count(),
                'establishment_year' => 1999,
            ];

            return Inertia::render('client/home', [
                'info' => $info,
                'featuredPrograms' => $featuredPrograms,
                'teamHighlight' => $teamHighlight,
                'galleryPreview' => $galleryPreview,
                'stats' => $stats,
                'currentPeriode' => $this->getCurrentPeriode(),
            ]);
        } catch (\Exception $e) {
            dd('Error loading home page: ' . $e->getMessage());
        }
    }

    /**
     * Display the team page
     */
    public function team()
    {
        try {
            // Ambil data struktur yang aktif dengan relasi, dikelompokkan berdasarkan divisi
            $strukturData = Struktur_ksm::with(['jabatan', 'divisi'])
                ->where('is_active', true)
                ->where('status_kepengurusan', 'aktif')
                ->orderBy('jabatan_id')
                ->orderBy('nama')
                ->get()
                ->groupBy(function ($item) {
                    return $item->divisi_kode ?? 'BPH';
                })
                ->map(function ($members) {
                    return $members->map(function ($member) {
                        return [
                            'id' => $member->id,
                            'name' => $member->nama,
                            'position' => $member->jabatan->nama ?? 'Unknown Position',
                            'image' => $member->foto_profil ? asset('storage/' . $member->foto_profil) : '/images/default-avatar.png',
                            'jabatan_id' => $member->jabatan_id,
                            'divisi_kode' => $member->divisi_kode,
                            'periode' => $member->periode,
                            'divisi_name' => $member->divisi ? $member->divisi->nama : 'Badan Pengurus Harian',
                        ];
                    })->values();
                });

            // Ambil daftar divisi untuk navigation
            $divisions = Divisi::withCount(['strukturKsm' => function ($query) {
                $query->where('is_active', true)->where('status_kepengurusan', 'aktif');
            }])
                ->orderBy('nama')
                ->get()
                ->map(function ($divisi) {
                    return [
                        'id' => $divisi->kode,
                        'title' => $divisi->kode,
                        'name' => $divisi->nama,
                        'description' => $divisi->deskripsi,
                        'member_count' => $divisi->struktur_ksm_count,
                    ];
                });

            // Statistik team
            $teamStats = [
                'total_members' => Struktur_ksm::where('is_active', true)->where('status_kepengurusan', 'aktif')->count(),
                'total_divisions' => Divisi::count(), // +1 untuk BPH
                'current_periode' => $this->getCurrentPeriode(),
                'leadership_count' => Struktur_ksm::whereIn('jabatan_id', [1, 2, 5, 6])->where('is_active', true)->count(), // Ketua, Wakil, Koordinator, Wakil Koordinator
            ];

            return Inertia::render('client/team', [
                'teamData' => $strukturData,
                'divisions' => $divisions,
                'teamStats' => $teamStats,
                'currentPeriode' => $this->getCurrentPeriode(),
            ]);
        } catch (\Exception $e) {
            dd('Error loading team page: ' . $e->getMessage());
        }
    }

    /**
     * Display the gallery page
     */
    public function gallery(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 12);
            $programFilter = $request->get('program');
            $search = $request->get('search');

            // Query dasar untuk galeri
            $query = Galeri::with(['programKerja', 'uploader'])
                ->orderBy('created_at', 'desc');

            // Filter berdasarkan program
            if ($programFilter && $programFilter !== 'all') {
                $query->where('program_kerja_id', $programFilter);
            }

            // Search berdasarkan nama file atau nama program
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('original_name', 'like', "%{$search}%")
                        ->orWhereHas('programKerja', function ($q2) use ($search) {
                            $q2->where('nama', 'like', "%{$search}%");
                        });
                });
            }

            // Paginate hasil
            $galleries = $query->paginate($perPage);

            // Transform data untuk frontend
            $galleryData = $galleries->getCollection()->map(function ($galeri) {
                return [
                    'id' => $galeri->id,
                    'original_name' => $galeri->original_name,
                    'image_url' => asset('storage/' . $galeri->storage_path),
                    'size' => $galeri->size,
                    'extension' => $galeri->extension,
                    'program' => [
                        'id' => $galeri->programKerja->id ?? null,
                        'nama' => $galeri->programKerja->nama ?? 'Unknown Program',
                    ],
                    'uploader' => [
                        'name' => $galeri->uploader->name ?? 'Unknown',
                    ],
                    'created_at' => $galeri->created_at,
                ];
            });

            // Ambil daftar program untuk filter
            $programs = Program_kerja::select('id', 'nama')
                ->whereHas('galeris')
                ->orderBy('nama')
                ->get()
                ->map(function ($program) {
                    return [
                        'id' => $program->id,
                        'nama' => $program->nama,
                    ];
                });

            // Statistik galeri
            $galleryStats = [
                'total_photos' => Galeri::count(),
                'total_programs_with_photos' => Program_kerja::whereHas('galeris')->count(),
                'latest_upload' => Galeri::latest()->first()?->created_at,
                'total_size' => Galeri::sum('size'), // Total ukuran file dalam bytes
            ];

            return Inertia::render('Gallery', [
                'galleries' => [
                    'data' => $galleryData,
                    'current_page' => $galleries->currentPage(),
                    'last_page' => $galleries->lastPage(),
                    'per_page' => $galleries->perPage(),
                    'total' => $galleries->total(),
                    'from' => $galleries->firstItem(),
                    'to' => $galleries->lastItem(),
                ],
                'programs' => $programs,
                'galleryStats' => $galleryStats,
                'filters' => [
                    'program' => $programFilter,
                    'search' => $search,
                    'per_page' => $perPage,
                ],
            ]);
        } catch (\Exception $e) {
            dd('Error loading gallery page: ' . $e->getMessage());

            return Inertia::render('Gallery', [
                'galleries' => [
                    'data' => collect(),
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 12,
                    'total' => 0,
                    'from' => null,
                    'to' => null,
                ],
                'programs' => collect(),
                'galleryStats' => [
                    'total_photos' => 0,
                    'total_programs_with_photos' => 0,
                    'latest_upload' => null,
                    'total_size' => 0,
                ],
                'filters' => [
                    'program' => null,
                    'search' => null,
                    'per_page' => 12,
                ],
                'error' => 'Gagal memuat data galeri',
            ]);
        }
    }

    /**
     * Display the list page (Programs + Bursa Soal)
     */
    public function list(Request $request)
    {
        try {
            $tab = $request->get('tab', 'programs'); // Default tab: programs
            $perPage = $request->get('per_page', 10);
            $search = $request->get('search');
            $status = $request->get('status');

            $data = [];

            if ($tab === 'programs') {
                // Query untuk program kerja
                $query = Program_kerja::orderBy('created_at', 'desc');

                // Filter berdasarkan status
                if ($status && $status !== 'all') {
                    switch ($status) {
                        case 'open':
                            $query->where('masa_pendaftaran', true)->where('selesai', false);
                            break;
                        case 'closed':
                            $query->where('masa_pendaftaran', false)->where('selesai', false);
                            break;
                        case 'finished':
                            $query->where('selesai', true);
                            break;
                    }
                }

                // Search
                if ($search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('nama', 'like', "%{$search}%")
                            ->orWhere('deskripsi', 'like', "%{$search}%")
                            ->orWhere('lokasi', 'like', "%{$search}%");
                    });
                }

                $programs = $query->paginate($perPage);

                $data = [
                    'programs' => [
                        'data' => $programs->getCollection()->map(function ($program) {
                            return [
                                'id' => $program->id,
                                'nama' => $program->nama,
                                'deskripsi' => $program->deskripsi,
                                'poster' => $program->poster ? asset('storage/' . $program->poster) : '/images/default-poster.png',
                                'lokasi' => $program->lokasi,
                                'tanggal_selesai_pendaftaran' => $program->tanggal_selesai_pendaftaran,
                                'tanggal_mulai_acara' => $program->tanggal_mulai_acara,
                                'tanggal_selesai_acara' => $program->tanggal_selesai_acara,
                                'masa_pendaftaran' => $program->masa_pendaftaran,
                                'selesai' => $program->selesai,
                                'target_peserta' => $program->target_peserta,
                                'contact_person' => $program->contact_person,
                                'created_at' => $program->created_at,
                                'status' => $this->getProgramStatus($program),
                            ];
                        }),
                        'current_page' => $programs->currentPage(),
                        'last_page' => $programs->lastPage(),
                        'per_page' => $programs->perPage(),
                        'total' => $programs->total(),
                        'from' => $programs->firstItem(),
                        'to' => $programs->lastItem(),
                    ],
                    'programStats' => [
                        'total' => Program_kerja::count(),
                        'open' => Program_kerja::where('masa_pendaftaran', true)->where('selesai', false)->count(),
                        'closed' => Program_kerja::where('masa_pendaftaran', false)->where('selesai', false)->count(),
                        'finished' => Program_kerja::where('selesai', true)->count(),
                    ],
                ];
            } elseif ($tab === 'bursa-soal') {
                // Query untuk bursa soal
                $query = Bursa_soal::orderBy('created_at', 'desc');

                // Search (jika ada field yang bisa di-search di bursa soal)
                if ($search) {
                    $query->where('link_soal', 'like', "%{$search}%");
                }

                $bursaSoal = $query->paginate($perPage);

                $data = [
                    'bursaSoal' => [
                        'data' => $bursaSoal->getCollection()->map(function ($bursa) {
                            return [
                                'id' => $bursa->id,
                                'link_soal' => $bursa->link_soal,
                                'link_kuesioner' => $bursa->link_kuesioner,
                                'created_at' => $bursa->created_at,
                            ];
                        }),
                        'current_page' => $bursaSoal->currentPage(),
                        'last_page' => $bursaSoal->lastPage(),
                        'per_page' => $bursaSoal->perPage(),
                        'total' => $bursaSoal->total(),
                        'from' => $bursaSoal->firstItem(),
                        'to' => $bursaSoal->lastItem(),
                    ],
                    'bursaSoalStats' => [
                        'total' => Bursa_soal::count(),
                        'latest' => Bursa_soal::latest()->first()?->created_at,
                    ],
                ];
            }

            return Inertia::render('List', array_merge($data, [
                'activeTab' => $tab,
                'filters' => [
                    'search' => $search,
                    'status' => $status,
                    'per_page' => $perPage,
                ],
            ]));
        } catch (\Exception $e) {
            dd('Error loading list page: ' . $e->getMessage());

            return Inertia::render('List', [
                'programs' => [
                    'data' => collect(),
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                    'from' => null,
                    'to' => null,
                ],
                'bursaSoal' => [
                    'data' => collect(),
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                    'from' => null,
                    'to' => null,
                ],
                'programStats' => [
                    'total' => 0,
                    'open' => 0,
                    'closed' => 0,
                    'finished' => 0,
                ],
                'bursaSoalStats' => [
                    'total' => 0,
                    'latest' => null,
                ],
                'activeTab' => $request->get('tab', 'programs'),
                'filters' => [
                    'search' => null,
                    'status' => null,
                    'per_page' => 10,
                ],
                'error' => 'Gagal memuat data',
            ]);
        }
    }

    /**
     * API: Get team data by division for AJAX requests
     */
    public function getTeamByDivision($divisi_kode = null)
    {
        try {
            $query = Struktur_ksm::with(['jabatan', 'divisi'])
                ->where('is_active', true)
                ->where('status_kepengurusan', 'aktif');

            if ($divisi_kode && $divisi_kode !== 'all') {
                if ($divisi_kode === 'BPH') {
                    $query->whereNull('divisi_kode');
                } else {
                    $query->where('divisi_kode', $divisi_kode);
                }
            }

            $members = $query->orderBy('jabatan_id')
                ->orderBy('nama')
                ->get()
                ->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->nama,
                        'position' => $member->jabatan->nama ?? 'Unknown Position',
                        'image' => $member->foto_profil ? asset('storage/' . $member->foto_profil) : '/images/default-avatar.png',
                        'jabatan_id' => $member->jabatan_id,
                        'divisi_kode' => $member->divisi_kode,
                        'periode' => $member->periode,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $members,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data team: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API: Get gallery images by program
     */
    public function getGalleryByProgram($program_id = null)
    {
        try {
            $query = Galeri::with('programKerja')
                ->orderBy('created_at', 'desc');

            if ($program_id && $program_id !== 'all') {
                $query->where('program_kerja_id', $program_id);
            }

            $galleries = $query->limit(20)->get()->map(function ($galeri) {
                return [
                    'id' => $galeri->id,
                    'original_name' => $galeri->original_name,
                    'image_url' => asset('storage/' . $galeri->storage_path),
                    'program_name' => $galeri->programKerja->nama ?? 'Unknown Program',
                    'created_at' => $galeri->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $galleries,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data galeri: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper: Get program status
     */
    private function getProgramStatus($program)
    {
        if ($program->selesai) {
            return 'finished';
        } elseif ($program->masa_pendaftaran) {
            return 'open';
        } else {
            return 'closed';
        }
    }

    /**
     * Helper: Get current periode
     */
    private function getCurrentPeriode()
    {
        $currentYear = date('Y');
        $currentMonth = date('n');

        // Asumsi periode dimulai dari bulan Juli
        if ($currentMonth >= 7) {
            return $currentYear . '/' . ($currentYear + 1);
        } else {
            return ($currentYear - 1) . '/' . $currentYear;
        }
    }
}
