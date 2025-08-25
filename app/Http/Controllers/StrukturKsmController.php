<?php

namespace App\Http\Controllers;

use App\Models\Struktur_ksm;
use App\Models\Jabatan;
use App\Models\Divisi;
use App\Http\Requests\StoreStruktur_ksmRequest;
use App\Http\Requests\UpdateStruktur_ksmRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StrukturKsmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $strukturList = Struktur_ksm::with(['jabatan', 'divisi'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($struktur) {
                    return [
                        'id' => $struktur->id,
                        'nama' => $struktur->nama,
                        'jabatan_id' => $struktur->jabatan_id,
                        'divisi_kode' => $struktur->divisi_kode,
                        'periode' => $struktur->periode,
                        'status_kepengurusan' => $struktur->status_kepengurusan,
                        'foto_profil' => $struktur->foto_profil,
                        'jabatan' => $struktur->jabatan ? [
                            'id' => $struktur->jabatan->id,
                            'nama' => $struktur->jabatan->nama,
                        ] : null,
                        'divisi' => $struktur->divisi ? [
                            'kode' => $struktur->divisi->kode,
                            'nama' => $struktur->divisi->nama,
                        ] : null,
                        'created_at' => $struktur->created_at,
                        'updated_at' => $struktur->updated_at,
                    ];
                });

            $jabatanList = Jabatan::orderBy('nama')->get()->map(function ($jabatan) {
                return [
                    'id' => $jabatan->id,
                    'nama' => $jabatan->nama,
                ];
            });

            $divisiList = Divisi::orderBy('nama')->get()->map(function ($divisi) {
                return [
                    'kode' => $divisi->kode,
                    'nama' => $divisi->nama,
                    'deskripsi' => $divisi->deskripsi,
                ];
            });

            return Inertia::render('admin/struktur-organisasi/index', [
                'strukturList' => $strukturList,
                'jabatanList' => $jabatanList,
                'divisiList' => $divisiList,
                'notifications' => [],
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memuat data struktur organisasi: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $jabatanList = Jabatan::orderBy('nama')->get()->map(function ($jabatan) {
            return [
                'id' => $jabatan->id,
                'nama' => $jabatan->nama,
            ];
        });

        $divisiList = Divisi::orderBy('nama')->get()->map(function ($divisi) {
            return [
                'kode' => $divisi->kode,
                'nama' => $divisi->nama,
                'deskripsi' => $divisi->deskripsi,
            ];
        });

        return Inertia::render('admin/struktur-organisasi/create', [
            'jabatanList' => $jabatanList,
            'divisiList' => $divisiList,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:255',
                'jabatan_id' => 'required|exists:jabatans,id',
                'divisi_kode' => 'nullable|exists:divisis,kode',
                'periode' => 'required|string|max:9',
                'status_kepengurusan' => 'required|in:aktif,non-aktif',
                'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return redirect()->back()
                    ->withErrors($validator)
                    ->withInput()
                    ->with('error', 'Validasi gagal. Silakan periksa input Anda.');
            }

            // Handle foto profil upload
            $fotoPath = '';
            if ($request->hasFile('foto_profil')) {
                $foto = $request->file('foto_profil');
                $filename = time() . '_' . Str::random(10) . '.' . $foto->getClientOriginalExtension();
                $fotoPath = $foto->storeAs('struktur-ksm/foto-profil', $filename, 'public');
            }

            $struktur = Struktur_ksm::create([
                'nama' => $request->nama,
                'jabatan_id' => $request->jabatan_id,
                'divisi_kode' => $request->divisi_kode,
                'periode' => $request->periode,
                'status_kepengurusan' => $request->status_kepengurusan ?? 'aktif',
                'foto_profil' => $fotoPath,
            ]);

            // For AJAX requests (React component)
            if ($request->expectsJson()) {
                $struktur->load(['jabatan', 'divisi']);

                return response()->json([
                    'success' => true,
                    'message' => 'Data struktur organisasi berhasil ditambahkan.',
                    'struktur' => [
                        'id' => $struktur->id,
                        'nama' => $struktur->nama,
                        'jabatan_id' => $struktur->jabatan_id,
                        'divisi_kode' => $struktur->divisi_kode,
                        'periode' => $struktur->periode,
                        'status_kepengurusan' => $struktur->status_kepengurusan,
                        'foto_profil' => $struktur->foto_profil,
                        'jabatan' => $struktur->jabatan ? [
                            'id' => $struktur->jabatan->id,
                            'nama' => $struktur->jabatan->nama,
                        ] : null,
                        'divisi' => $struktur->divisi ? [
                            'kode' => $struktur->divisi->kode,
                            'nama' => $struktur->divisi->nama,
                        ] : null,
                        'created_at' => $struktur->created_at,
                        'updated_at' => $struktur->updated_at,
                    ],
                ]);
            }

            return redirect()->route('admin.struktur-organisasi.index')
                ->with('success', 'Data struktur organisasi berhasil ditambahkan.');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menambahkan data struktur organisasi: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()
                ->with('error', 'Gagal menambahkan data struktur organisasi: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Struktur_ksm $struktur_ksm)
    {
        try {
            $struktur_ksm->load(['jabatan', 'divisi']);

            $strukturData = [
                'id' => $struktur_ksm->id,
                'nama' => $struktur_ksm->nama,
                'jabatan_id' => $struktur_ksm->jabatan_id,
                'divisi_kode' => $struktur_ksm->divisi_kode,
                'periode' => $struktur_ksm->periode,
                'status_kepengurusan' => $struktur_ksm->status_kepengurusan,
                'foto_profil' => $struktur_ksm->foto_profil,
                'jabatan' => $struktur_ksm->jabatan ? [
                    'id' => $struktur_ksm->jabatan->id,
                    'nama' => $struktur_ksm->jabatan->nama,
                ] : null,
                'divisi' => $struktur_ksm->divisi ? [
                    'kode' => $struktur_ksm->divisi->kode,
                    'nama' => $struktur_ksm->divisi->nama,
                    'deskripsi' => $struktur_ksm->divisi->deskripsi,
                ] : null,
                'created_at' => $struktur_ksm->created_at,
                'updated_at' => $struktur_ksm->updated_at,
            ];

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'struktur' => $strukturData,
                ]);
            }

            return Inertia::render('admin/struktur-organisasi/show', [
                'struktur' => $strukturData,
            ]);
        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal memuat detail struktur organisasi: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Gagal memuat detail struktur organisasi: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Struktur_ksm $struktur_ksm)
    {
        $struktur_ksm->load(['jabatan', 'divisi']);

        $jabatanList = Jabatan::orderBy('nama')->get()->map(function ($jabatan) {
            return [
                'id' => $jabatan->id,
                'nama' => $jabatan->nama,
            ];
        });

        $divisiList = Divisi::orderBy('nama')->get()->map(function ($divisi) {
            return [
                'kode' => $divisi->kode,
                'nama' => $divisi->nama,
                'deskripsi' => $divisi->deskripsi,
            ];
        });

        $strukturData = [
            'id' => $struktur_ksm->id,
            'nama' => $struktur_ksm->nama,
            'jabatan_id' => $struktur_ksm->jabatan_id,
            'divisi_kode' => $struktur_ksm->divisi_kode,
            'periode' => $struktur_ksm->periode,
            'status_kepengurusan' => $struktur_ksm->status_kepengurusan,
            'foto_profil' => $struktur_ksm->foto_profil,
            'created_at' => $struktur_ksm->created_at,
            'updated_at' => $struktur_ksm->updated_at,
        ];

        return Inertia::render('admin/struktur-organisasi/edit', [
            'struktur' => $strukturData,
            'jabatanList' => $jabatanList,
            'divisiList' => $divisiList,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Struktur_ksm $struktur_ksm)
    {
        try {
            // ✅ SIMPLE: Validasi basic tanpa foto_profil
            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:255',
                'jabatan_id' => 'required|integer|exists:jabatans,id',
                'divisi_kode' => 'nullable|string|exists:divisis,kode',
                'periode' => 'required|string|max:9',
                'status_kepengurusan' => 'required|in:aktif,non-aktif',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // ✅ SIMPLE: Semua data dari request
            $updateData = [
                'nama' => $request->input('nama'),
                'jabatan_id' => (int) $request->input('jabatan_id'),
                'divisi_kode' => $request->input('divisi_kode'),
                'periode' => $request->input('periode'),
                'status_kepengurusan' => $request->input('status_kepengurusan', 'aktif'),
            ];

            // ✅ SIMPLE: Handle file upload jika ada
            if ($request->hasFile('foto_profil')) {
                $file = $request->file('foto_profil');

                // Simple file validation
                if ($file->isValid() && in_array($file->getMimeType(), ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'])) {
                    // Delete old file if exists
                    if ($struktur_ksm->foto_profil && Storage::disk('public')->exists($struktur_ksm->foto_profil)) {
                        Storage::disk('public')->delete($struktur_ksm->foto_profil);
                    }

                    // Upload new file
                    $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $filePath = $file->move(public_path('uploads/struktur-ksm/foto-profil'), $filename);
                    $updateData['foto_profil'] = $filePath;
                }
            }

            // ✅ SIMPLE: Direct update
            DB::table('struktur_ksms')
                ->where('id', $request->id)
                ->update(array_merge($updateData, ['updated_at' => now()]));

            // ✅ SIMPLE: Get fresh data from database
            $updatedStruktur = DB::table('struktur_ksms')
                ->leftJoin('jabatans', 'struktur_ksms.jabatan_id', '=', 'jabatans.id')
                ->leftJoin('divisis', 'struktur_ksms.divisi_kode', '=', 'divisis.kode')
                ->where('struktur_ksms.id', $request->id)
                ->select(
                    'struktur_ksms.*',
                    'jabatans.nama as jabatan_nama',
                    'divisis.nama as divisi_nama'
                )
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Data struktur organisasi berhasil diperbarui.',
                'struktur' => [
                    'id' => $updatedStruktur->id,
                    'nama' => $updatedStruktur->nama,
                    'jabatan_id' => $updatedStruktur->jabatan_id,
                    'divisi_kode' => $updatedStruktur->divisi_kode,
                    'periode' => $updatedStruktur->periode,
                    'status_kepengurusan' => $updatedStruktur->status_kepengurusan,
                    'foto_profil' => $updatedStruktur->foto_profil,
                    'jabatan' => $updatedStruktur->jabatan_nama ? [
                        'id' => $updatedStruktur->jabatan_id,
                        'nama' => $updatedStruktur->jabatan_nama,
                    ] : null,
                    'divisi' => $updatedStruktur->divisi_nama ? [
                        'kode' => $updatedStruktur->divisi_kode,
                        'nama' => $updatedStruktur->divisi_nama,
                    ] : null,
                    'created_at' => $updatedStruktur->created_at,
                    'updated_at' => $updatedStruktur->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Struktur_ksm $struktur_ksm)
    {
        try {

            // Simpan ID untuk verifikasi
            $strukturId = $request->id;
            $strukturNama = $struktur_ksm->nama;
            $fotoPath = $struktur_ksm->foto_profil;

            // Cek apakah record benar-benar ada di database
            $recordExists = DB::table('struktur_ksms')->where('id', $strukturId)->exists();

            if (!$recordExists) {
                throw new \Exception('Record tidak ditemukan di database.');
            }

            // Delete foto profil if exists
            if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                $deleteResult = Storage::disk('public')->delete($fotoPath);
            }

            // Method 1: Menggunakan Model Delete
            $deleteResult = $struktur_ksm->delete();

            // Verifikasi apakah benar-benar terhapus
            $stillExists = DB::table('struktur_ksms')->where('id', $strukturId)->exists();

            // Jika model delete gagal, coba force delete
            if ($stillExists) {

                // Cek apakah menggunakan SoftDeletes
                if (method_exists($struktur_ksm, 'forceDelete')) {
                    $forceDeleteResult = $struktur_ksm->forceDelete();

                    $stillExists = DB::table('struktur_ksms')->where('id', $strukturId)->exists();
                }

                // Jika masih gagal, gunakan raw query
                if ($stillExists) {
                    $affected = DB::table('struktur_ksms')->where('id', $strukturId)->delete();

                    if ($affected === 0) {
                        throw new \Exception('Tidak ada baris yang terhapus dari database.');
                    }

                    $finalCheck = DB::table('struktur_ksms')->where('id', $strukturId)->exists();

                    if ($finalCheck) {
                        throw new \Exception('Record masih ada di database setelah semua upaya penghapusan.');
                    }
                }
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Data struktur organisasi berhasil dihapus.',
                    'deleted_id' => $strukturId
                ]);
            }

            return redirect()->route('admin.struktur-organisasi.index')
                ->with('success', 'Data struktur organisasi berhasil dihapus.');
        } catch (\Exception $e) {

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menghapus data struktur organisasi: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()
                ->with('error', 'Gagal menghapus data struktur organisasi: ' . $e->getMessage());
        }
    }

    /**
     * Get struktur data for API
     */
    public function getStrukturData()
    {
        try {
            $strukturList = Struktur_ksm::with(['jabatan', 'divisi'])
                ->orderBy('jabatan_id')
                ->orderBy('nama')
                ->get()
                ->map(function ($struktur) {
                    return [
                        'id' => $struktur->id,
                        'nama' => $struktur->nama,
                        'jabatan_id' => $struktur->jabatan_id,
                        'divisi_kode' => $struktur->divisi_kode,
                        'periode' => $struktur->periode,
                        'status_kepengurusan' => $struktur->status_kepengurusan,
                        'foto_profil' => $struktur->foto_profil,
                        'jabatan' => $struktur->jabatan ? [
                            'id' => $struktur->jabatan->id,
                            'nama' => $struktur->jabatan->nama,
                        ] : null,
                        'divisi' => $struktur->divisi ? [
                            'kode' => $struktur->divisi->kode,
                            'nama' => $struktur->divisi->nama,
                        ] : null,
                        'created_at' => $struktur->created_at,
                        'updated_at' => $struktur->updated_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $strukturList,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data struktur organisasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update status aktif/non-aktif
     */
    public function updateStatus(Request $request, Struktur_ksm $struktur_ksm)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status_kepengurusan' => 'required|in:aktif,non-aktif',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $struktur_ksm->update([
                'status_kepengurusan' => $request->status_kepengurusan
            ]);

            $struktur_ksm->load(['jabatan', 'divisi']);

            return response()->json([
                'success' => true,
                'message' => 'Status berhasil diperbarui.',
                'struktur' => [
                    'id' => $struktur_ksm->id,
                    'nama' => $struktur_ksm->nama,
                    'jabatan_id' => $struktur_ksm->jabatan_id,
                    'divisi_kode' => $struktur_ksm->divisi_kode,
                    'periode' => $struktur_ksm->periode,
                    'status_kepengurusan' => $struktur_ksm->status_kepengurusan,
                    'foto_profil' => $struktur_ksm->foto_profil,
                    'jabatan' => $struktur_ksm->jabatan ? [
                        'id' => $struktur_ksm->jabatan->id,
                        'nama' => $struktur_ksm->jabatan->nama,
                    ] : null,
                    'divisi' => $struktur_ksm->divisi ? [
                        'kode' => $struktur_ksm->divisi->kode,
                        'nama' => $struktur_ksm->divisi->nama,
                    ] : null,
                    'created_at' => $struktur_ksm->created_at,
                    'updated_at' => $struktur_ksm->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get struktur by divisi
     */
    public function getByDivisi($divisi_kode = null)
    {
        try {
            $query = Struktur_ksm::with(['jabatan', 'divisi'])
                ->where('status_kepengurusan', 'aktif');

            if ($divisi_kode && $divisi_kode !== 'all') {
                if ($divisi_kode === 'bph') {
                    $query->whereNull('divisi_kode');
                } else {
                    $query->where('divisi_kode', $divisi_kode);
                }
            }

            $strukturList = $query->orderBy('jabatan_id')
                ->orderBy('nama')
                ->get()
                ->map(function ($struktur) {
                    return [
                        'id' => $struktur->id,
                        'nama' => $struktur->nama,
                        'jabatan_id' => $struktur->jabatan_id,
                        'divisi_kode' => $struktur->divisi_kode,
                        'periode' => $struktur->periode,
                        'status_kepengurusan' => $struktur->status_kepengurusan,
                        'foto_profil' => $struktur->foto_profil,
                        'jabatan' => $struktur->jabatan ? [
                            'id' => $struktur->jabatan->id,
                            'nama' => $struktur->jabatan->nama,
                        ] : null,
                        'divisi' => $struktur->divisi ? [
                            'kode' => $struktur->divisi->kode,
                            'nama' => $struktur->divisi->nama,
                        ] : null,
                        'created_at' => $struktur->created_at,
                        'updated_at' => $struktur->updated_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $strukturList,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data struktur organisasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk update periode
     */
    public function bulkUpdatePeriode(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'periode_baru' => 'required|string|max:9',
                'struktur_ids' => 'required|array',
                'struktur_ids.*' => 'exists:struktur_ksms,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $updated = Struktur_ksm::whereIn('id', $request->struktur_ids)
                ->update(['periode' => $request->periode_baru]);

            return response()->json([
                'success' => true,
                'message' => "Berhasil memperbarui periode untuk {$updated} anggota.",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui periode: ' . $e->getMessage(),
            ], 500);
        }
    }
}
