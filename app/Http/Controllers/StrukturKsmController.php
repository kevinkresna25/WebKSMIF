<?php

namespace App\Http\Controllers;

use App\Models\Struktur_ksm;
use App\Models\Jabatan;
use App\Models\Divisi;
use App\Http\Requests\StoreStruktur_ksmRequest;
use App\Http\Requests\UpdateStruktur_ksmRequest;
use Illuminate\Http\Request;
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
                        'is_active' => $struktur->is_active,
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
                'is_active' => 'boolean',
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
                'is_active' => $request->boolean('is_active', true),
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
                        'is_active' => $struktur->is_active,
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
                'is_active' => $struktur_ksm->is_active,
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
            'is_active' => $struktur_ksm->is_active,
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
            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:255',
                'jabatan_id' => 'required|exists:jabatans,id',
                'divisi_kode' => 'nullable|exists:divisis,kode',
                'periode' => 'required|string|max:9',
                'is_active' => 'boolean',
                'status_kepengurusan' => 'required|in:aktif,non-aktif',
                'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Validasi gagal.',
                        'errors' => $validator->errors(),
                    ], 422);
                }

                return redirect()->back()
                    ->withErrors($validator)
                    ->withInput()
                    ->with('error', 'Validasi gagal. Silakan periksa input Anda.');
            }

            $updateData = [
                'nama' => $request->nama,
                'jabatan_id' => $request->jabatan_id,
                'divisi_kode' => $request->divisi_kode,
                'periode' => $request->periode,
                'is_active' => $request->boolean('is_active', true),
                'status_kepengurusan' => $request->status_kepengurusan ?? 'aktif',
            ];

            // Handle foto profil upload
            if ($request->hasFile('foto_profil')) {
                // Delete old foto if exists
                if ($struktur_ksm->foto_profil && Storage::disk('public')->exists($struktur_ksm->foto_profil)) {
                    Storage::disk('public')->delete($struktur_ksm->foto_profil);
                }

                $foto = $request->file('foto_profil');
                $filename = time() . '_' . Str::random(10) . '.' . $foto->getClientOriginalExtension();
                $fotoPath = $foto->storeAs('struktur-ksm/foto-profil', $filename, 'public');
                $updateData['foto_profil'] = $fotoPath;
            }

            $struktur_ksm->update($updateData);

            // For AJAX requests (React component)
            if ($request->expectsJson()) {
                $struktur_ksm->load(['jabatan', 'divisi']);

                return response()->json([
                    'success' => true,
                    'message' => 'Data struktur organisasi berhasil diperbarui.',
                    'struktur' => [
                        'id' => $struktur_ksm->id,
                        'nama' => $struktur_ksm->nama,
                        'jabatan_id' => $struktur_ksm->jabatan_id,
                        'divisi_kode' => $struktur_ksm->divisi_kode,
                        'periode' => $struktur_ksm->periode,
                        'is_active' => $struktur_ksm->is_active,
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
            }

            return redirect()->route('admin.struktur-organisasi.index')
                ->with('success', 'Data struktur organisasi berhasil diperbarui.');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal memperbarui data struktur organisasi: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()
                ->with('error', 'Gagal memperbarui data struktur organisasi: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Struktur_ksm $struktur_ksm)
    {
        try {
            // Delete foto profil if exists
            if ($struktur_ksm->foto_profil && Storage::disk('public')->exists($struktur_ksm->foto_profil)) {
                Storage::disk('public')->delete($struktur_ksm->foto_profil);
            }

            $struktur_ksm->delete();

            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Data struktur organisasi berhasil dihapus.',
                ]);
            }

            return redirect()->route('admin.struktur-organisasi.index')
                ->with('success', 'Data struktur organisasi berhasil dihapus.');
        } catch (\Exception $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menghapus data struktur organisasi: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Gagal menghapus data struktur organisasi: ' . $e->getMessage());
        }
    }

    /**
     * Get struktur data for API
     */
    public function getStrukturData()
    {
        try {
            $strukturList = Struktur_ksm::with(['jabatan', 'divisi'])
                ->where('is_active', true)
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
                        'is_active' => $struktur->is_active,
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
                'is_active' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $struktur_ksm->update([
                'status_kepengurusan' => $request->status_kepengurusan,
                'is_active' => $request->boolean('is_active', $struktur_ksm->is_active),
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
                    'is_active' => $struktur_ksm->is_active,
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
                ->where('is_active', true)
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
                        'is_active' => $struktur->is_active,
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
