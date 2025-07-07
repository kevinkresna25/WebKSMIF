<?php

namespace App\Http\Controllers;

use App\Models\Program_kerja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProgramKerjaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Program_kerja::with(['uploader:id,name,email'])
                ->orderBy('created_at', 'desc');

            // Filter berdasarkan status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter berdasarkan pencarian
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('deskripsi', 'like', "%{$search}%")
                        ->orWhere('lokasi', 'like', "%{$search}%");
                });
            }

            $programs = $query->paginate(12);

            return Inertia::render('admin/program-kerja/index', [
                'programs' => $programs->items(),
                'pagination' => [
                    'current_page' => $programs->currentPage(),
                    'last_page' => $programs->lastPage(),
                    'per_page' => $programs->perPage(),
                    'total' => $programs->total(),
                ],
                'filters' => $request->only(['status', 'search']),
                'user' => Auth::user(),
            ]);
        } catch (\Exception $e) {
            return Inertia::render('admin/program-kerja/index', [
                'programs' => [],
                'pagination' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 12,
                    'total' => 0,
                ],
                'error' => 'Gagal memuat data program kerja.',
                'user' => Auth::user(),
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Cek apakah user sudah login
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Please login first.',
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:255',
                'deskripsi' => 'required|string',
                'lokasi' => 'required|string|max:255',
                'tanggal_selesai_pendaftaran' => 'required|date',
                'tanggal_mulai_acara' => 'required|date',
                'tanggal_selesai_acara' => 'required|date|after:tanggal_mulai_acara',
                'target_peserta' => 'nullable|string|max:255',
                'contact_person' => 'nullable|string|max:255',
                'poster' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Handle poster upload
            $posterPath = null;
            if ($request->hasFile('poster')) {
                $poster = $request->file('poster');
                $filename = time() . '_' . Str::random(10) . '.' . $poster->getClientOriginalExtension();
                $posterPath = $poster->storeAs('program-kerja/posters', $filename, 'public');
            }

            // Determine registration status
            $now = now();
            $registrationEnd = \Carbon\Carbon::parse($request->tanggal_selesai_pendaftaran);
            $eventStart = \Carbon\Carbon::parse($request->tanggal_mulai_acara);
            $eventEnd = \Carbon\Carbon::parse($request->tanggal_selesai_acara);

            $masaPendaftaran = $now->lte($registrationEnd);
            $selesai = $now->gt($eventEnd);

            // Pastikan uploaded_by tidak null
            $uploadedBy = Auth::id();
            if (!$uploadedBy) {
                return response()->json([
                    'success' => false,
                    'message' => 'User authentication required.',
                ], 401);
            }

            $program = Program_kerja::create([
                'nama' => $request->nama,
                'poster' => $posterPath,
                'deskripsi' => $request->deskripsi,
                'lokasi' => $request->lokasi,
                'tanggal_selesai_pendaftaran' => $request->tanggal_selesai_pendaftaran,
                'masa_pendaftaran' => $masaPendaftaran,
                'selesai' => $selesai,
                'tanggal_mulai_acara' => $request->tanggal_mulai_acara,
                'tanggal_selesai_acara' => $request->tanggal_selesai_acara,
                'target_peserta' => $request->target_peserta,
                'contact_person' => $request->contact_person,
                'uploaded_by' => $uploadedBy,
            ]);

            // Load relationship for response
            $program->load(['uploader:id,name,email']);

            return response()->json([
                'success' => true,
                'message' => 'Program kerja berhasil ditambahkan.',
                'program' => $program,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan program kerja: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $program = Program_kerja::with(['uploader:id,name,email', 'galeris'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'program' => $program,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Program tidak ditemukan.',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $program = Program_kerja::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nama' => 'required|string|max:255',
                'deskripsi' => 'required|string',
                'lokasi' => 'required|string|max:255',
                'tanggal_selesai_pendaftaran' => 'required|date',
                'tanggal_mulai_acara' => 'required|date',
                'tanggal_selesai_acara' => 'required|date|after:tanggal_mulai_acara',
                'target_peserta' => 'nullable|string|max:255',
                'contact_person' => 'nullable|string|max:255',
                'poster' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Handle poster upload if new file provided
            $posterPath = $program->poster;
            if ($request->hasFile('poster')) {
                // Delete old poster
                if ($posterPath && Storage::disk('public')->exists($posterPath)) {
                    Storage::disk('public')->delete($posterPath);
                }

                $poster = $request->file('poster');
                $filename = time() . '_' . Str::random(10) . '.' . $poster->getClientOriginalExtension();
                $posterPath = $poster->storeAs('program-kerja/posters', $filename, 'public');
            }

            // Update status
            $now = now();
            $registrationEnd = \Carbon\Carbon::parse($request->tanggal_selesai_pendaftaran);
            $eventEnd = \Carbon\Carbon::parse($request->tanggal_selesai_acara);

            $masaPendaftaran = $now->lte($registrationEnd);
            $selesai = $now->gt($eventEnd);

            $program->update([
                'nama' => $request->nama,
                'poster' => $posterPath,
                'deskripsi' => $request->deskripsi,
                'lokasi' => $request->lokasi,
                'tanggal_selesai_pendaftaran' => $request->tanggal_selesai_pendaftaran,
                'masa_pendaftaran' => $masaPendaftaran,
                'selesai' => $selesai,
                'tanggal_mulai_acara' => $request->tanggal_mulai_acara,
                'tanggal_selesai_acara' => $request->tanggal_selesai_acara,
                'target_peserta' => $request->target_peserta,
                'contact_person' => $request->contact_person,
            ]);

            // Load relationship for response
            $program->load(['uploader:id,name,email']);

            return response()->json([
                'success' => true,
                'message' => 'Program kerja berhasil diperbarui.',
                'program' => $program,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui program kerja: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $program = Program_kerja::findOrFail($id);

            // Delete poster file
            if ($program->poster && Storage::disk('public')->exists($program->poster)) {
                Storage::disk('public')->delete($program->poster);
            }

            // Delete related gallery files
            if ($program->galeris) {
                foreach ($program->galeris as $galeri) {
                    if (Storage::disk('public')->exists($galeri->storage_path)) {
                        Storage::disk('public')->delete($galeri->storage_path);
                    }
                }
            }

            $program->delete();

            return response()->json([
                'success' => true,
                'message' => 'Program kerja berhasil dihapus.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus program kerja: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update program status (masa pendaftaran, selesai)
     */
    public function updateStatus()
    {
        try {
            $now = now();

            Program_kerja::chunk(100, function ($programs) use ($now) {
                foreach ($programs as $program) {
                    $registrationEnd = \Carbon\Carbon::parse($program->tanggal_selesai_pendaftaran);
                    $eventEnd = \Carbon\Carbon::parse($program->tanggal_selesai_acara);

                    $masaPendaftaran = $now->lte($registrationEnd);
                    $selesai = $now->gt($eventEnd);

                    if ($program->masa_pendaftaran !== $masaPendaftaran || $program->selesai !== $selesai) {
                        $program->update([
                            'masa_pendaftaran' => $masaPendaftaran,
                            'selesai' => $selesai,
                        ]);
                    }
                }
            });

            return response()->json([
                'success' => true,
                'message' => 'Status program kerja berhasil diperbarui.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status program kerja: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get statistics for dashboard
     */
    public function getStats()
    {
        try {
            $total = Program_kerja::count();
            $aktif = Program_kerja::where('masa_pendaftaran', true)->count();
            $selesai = Program_kerja::where('selesai', true)->count();
            $mendatang = Program_kerja::where('masa_pendaftaran', false)
                ->where('selesai', false)
                ->count();

            return response()->json([
                'success' => true,
                'stats' => [
                    'total' => $total,
                    'aktif' => $aktif,
                    'selesai' => $selesai,
                    'mendatang' => $mendatang,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik program kerja.',
                'stats' => [
                    'total' => 0,
                    'aktif' => 0,
                    'selesai' => 0,
                    'mendatang' => 0,
                ],
            ]);
        }
    }
}
