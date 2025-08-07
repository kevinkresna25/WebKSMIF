<?php

namespace App\Http\Controllers;

use App\Models\Galeri;
use App\Http\Requests\StoreGaleriRequest;
use App\Http\Requests\UpdateGaleriRequest;
use App\Models\Program_kerja;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GaleriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $perPage = 12;

            // Query gallery dengan relationships
            $query = Galeri::with(['programKerja:id,nama', 'uploader:id,name'])
                ->orderBy('created_at', 'desc');

            $galleries = $query->paginate($perPage);

            // Transform data untuk frontend
            $galleryData = $galleries->getCollection()->map(function ($galeri) {
                return [
                    'id' => $galeri->id,
                    'program_kerja_id' => $galeri->program_kerja_id,
                    'original_name' => $galeri->original_name,
                    'storage_path' => $galeri->storage_path,
                    'image_url' => asset('storage/' . $galeri->storage_path),
                    'extension' => $galeri->extension,
                    'size' => $galeri->size,
                    'size_formatted' => $this->formatFileSize($galeri->size),
                    'uploaded_by' => $galeri->uploaded_by,
                    'program_kerja' => $galeri->programKerja ? [
                        'id' => $galeri->programKerja->id,
                        'nama' => $galeri->programKerja->nama,
                    ] : null,
                    'uploader' => $galeri->uploader ? [
                        'id' => $galeri->uploader->id,
                        'name' => $galeri->uploader->name,
                    ] : null,
                    'created_at' => $galeri->created_at,
                    'updated_at' => $galeri->updated_at,
                ];
            });

            // Ambil daftar program untuk filter
            $programs = Program_kerja::select('id', 'nama')
                ->orderBy('nama')
                ->get();

            // Statistik gallery
            $stats = [
                'total_photos' => Galeri::count(),
                'total_size' => Galeri::sum('size'),
                'total_size_formatted' => $this->formatFileSize(Galeri::sum('size')),
                'programs_with_photos' => Program_kerja::whereHas('galeris')->count(),
                'recent_uploads' => Galeri::where('created_at', '>=', now()->subDays(7))->count(),
            ];

            return Inertia::render('admin/gallery/index', [
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
                'stats' => $stats,
                'filters' => [
                    'per_page' => $perPage,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading gallery index:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Gagal memuat data gallery.');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Log incoming request for debugging
            Log::info('Gallery upload request received:', [
                'program_kerja_id' => $request->input('program_kerja_id'),
                'files_count' => $request->hasFile('images') ? count($request->file('images')) : 0,
                'uploaded_by' => auth()->id()
            ]);

            // Validation rules
            $validator = Validator::make($request->all(), [
                'program_kerja_id' => 'required|exists:program_kerjas,id',
                'images' => 'required|array|min:1|max:10',
                'images.*' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB per file
            ], [
                'program_kerja_id.required' => 'Program kerja harus dipilih.',
                'program_kerja_id.exists' => 'Program kerja tidak valid.',
                'images.required' => 'Minimal satu foto harus diupload.',
                'images.min' => 'Minimal satu foto harus diupload.',
                'images.max' => 'Maksimal 10 foto dapat diupload sekaligus.',
                'images.*.required' => 'File foto harus diisi.',
                'images.*.file' => 'Upload harus berupa file.',
                'images.*.image' => 'File harus berupa gambar.',
                'images.*.mimes' => 'Format gambar harus JPEG, PNG, JPG, GIF, atau WEBP.',
                'images.*.max' => 'Ukuran file maksimal 5MB per foto.',
            ]);

            if ($validator->fails()) {
                Log::warning('Gallery upload validation failed:', $validator->errors()->toArray());

                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $uploadedImages = [];
            $programKerjaId = $request->input('program_kerja_id');
            $uploadedBy = auth()->id();
            $errors = [];

            // Start database transaction
            DB::beginTransaction();

            foreach ($request->file('images') as $index => $image) {
                try {
                    // Additional file validation
                    if (!$image->isValid()) {
                        $errors[] = "File " . ($index + 1) . " tidak valid.";
                        continue;
                    }

                    // Check file size (double check)
                    if ($image->getSize() > 5 * 1024 * 1024) {
                        $errors[] = "File " . ($index + 1) . " terlalu besar (maksimal 5MB).";
                        continue;
                    }

                    // Generate unique filename
                    $originalName = $image->getClientOriginalName();
                    $extension = $image->getClientOriginalExtension();
                    $filename = time() . '_' . Str::random(10) . '_' . $index . '.' . $extension;

                    // Create directory if not exists
                    $directory = 'gallery/program-kerja';
                    if (!Storage::disk('public')->exists($directory)) {
                        Storage::disk('public')->makeDirectory($directory);
                    }

                    // Store image
                    $storagePath = $image->storeAs($directory, $filename, 'public');

                    if (!$storagePath) {
                        $errors[] = "Gagal menyimpan file " . ($index + 1) . ".";
                        continue;
                    }

                    // Create gallery record
                    $galeri = Galeri::create([
                        'program_kerja_id' => $programKerjaId,
                        'original_name' => $originalName,
                        'storage_path' => $storagePath,
                        'extension' => strtolower($extension),
                        'size' => $image->getSize(),
                        'uploaded_by' => $uploadedBy,
                    ]);

                    // Load relationships for response
                    $galeri->load(['programKerja:id,nama', 'uploader:id,name']);

                    $uploadedImages[] = [
                        'id' => $galeri->id,
                        'program_kerja_id' => $galeri->program_kerja_id,
                        'original_name' => $galeri->original_name,
                        'storage_path' => $galeri->storage_path,
                        'image_url' => asset('storage/' . $galeri->storage_path),
                        'extension' => $galeri->extension,
                        'size' => $galeri->size,
                        'size_formatted' => $this->formatFileSize($galeri->size),
                        'uploaded_by' => $galeri->uploaded_by,
                        'program_kerja' => $galeri->programKerja ? [
                            'id' => $galeri->programKerja->id,
                            'nama' => $galeri->programKerja->nama,
                        ] : null,
                        'uploader' => $galeri->uploader ? [
                            'id' => $galeri->uploader->id,
                            'name' => $galeri->uploader->name,
                        ] : null,
                        'created_at' => $galeri->created_at,
                        'updated_at' => $galeri->updated_at,
                    ];

                    Log::info('Image uploaded successfully:', [
                        'id' => $galeri->id,
                        'original_name' => $galeri->original_name,
                        'storage_path' => $galeri->storage_path,
                        'size' => $galeri->size
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error uploading individual image:', [
                        'index' => $index,
                        'error' => $e->getMessage(),
                        'file_name' => $image->getClientOriginalName() ?? 'unknown'
                    ]);

                    $errors[] = "Gagal mengupload file " . ($index + 1) . ": " . $e->getMessage();
                    continue;
                }
            }

            // Check if any images were uploaded successfully
            if (empty($uploadedImages)) {
                DB::rollback();

                $errorMessage = !empty($errors)
                    ? 'Semua upload gagal: ' . implode(', ', $errors)
                    : 'Tidak ada foto yang berhasil diupload.';

                return response()->json([
                    'success' => false,
                    'message' => $errorMessage,
                    'errors' => $errors,
                ], 400);
            }

            // Commit transaction
            DB::commit();

            $successCount = count($uploadedImages);
            $errorCount = count($errors);

            $message = $successCount . ' foto berhasil diupload';
            if ($errorCount > 0) {
                $message .= ', ' . $errorCount . ' foto gagal diupload.';
            }

            Log::info('Gallery upload completed:', [
                'program_kerja_id' => $programKerjaId,
                'success_count' => $successCount,
                'error_count' => $errorCount,
                'uploaded_by' => $uploadedBy
            ]);

            return response()->json([
                'success' => true,
                'message' => $message,
                'images' => $uploadedImages,
                'upload_summary' => [
                    'total_files' => $request->hasFile('images') ? count($request->file('images')) : 0,
                    'successful_uploads' => $successCount,
                    'failed_uploads' => $errorCount,
                    'errors' => $errors
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            // Clean up any uploaded files if transaction failed
            if (isset($uploadedImages)) {
                foreach ($uploadedImages as $imageData) {
                    if (isset($imageData['storage_path']) && Storage::disk('public')->exists($imageData['storage_path'])) {
                        Storage::disk('public')->delete($imageData['storage_path']);
                    }
                }
            }

            Log::error('Gallery upload error:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['images']) // Exclude files from log
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupload foto: ' . $e->getMessage(),
                'error_details' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Galeri $galeri)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Galeri $galeri)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGaleriRequest $request, Galeri $galeri)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            // Log delete request
            Log::info('Gallery delete request:', [
                'id' => $id,
                'deleted_by' => auth()->id()
            ]);

            // Find galeri by ID
            $galeri = Galeri::find($id);

            if (!$galeri) {
                return response()->json([
                    'success' => false,
                    'message' => 'Foto tidak ditemukan.'
                ], 404);
            }

            // Start database transaction
            DB::beginTransaction();

            // Delete file from storage
            $fileDeleted = false;
            if ($galeri->storage_path && Storage::disk('public')->exists($galeri->storage_path)) {
                $fileDeleted = Storage::disk('public')->delete($galeri->storage_path);

                if ($fileDeleted) {
                    Log::info('File deleted from storage:', [
                        'path' => $galeri->storage_path
                    ]);
                } else {
                    Log::warning('Failed to delete file from storage:', [
                        'path' => $galeri->storage_path
                    ]);
                }
            } else {
                Log::warning('File not found in storage:', [
                    'path' => $galeri->storage_path ?? 'null'
                ]);
                $fileDeleted = true; // Consider as success if file doesn't exist
            }

            // Store galeri data for response
            $deletedGaleri = [
                'id' => $galeri->id,
                'original_name' => $galeri->original_name,
                'storage_path' => $galeri->storage_path,
                'program_kerja_id' => $galeri->program_kerja_id
            ];

            // Delete record from database
            $galeri->delete();

            // Commit transaction
            DB::commit();

            Log::info('Gallery deleted successfully:', [
                'id' => $id,
                'original_name' => $deletedGaleri['original_name'],
                'file_deleted' => $fileDeleted,
                'deleted_by' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Foto berhasil dihapus.',
                'data' => $deletedGaleri,
                'file_deleted' => $fileDeleted
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Gallery delete error:', [
                'id' => $id,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'deleted_by' => auth()->id()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus foto: ' . $e->getMessage(),
                'error_details' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            ], 500);
        }
    }

    /**
     * Bulk delete multiple galleries
     * Menghapus multiple galeri sekaligus
     */
    public function bulkDelete(Request $request)
    {
        try {
            // Log bulk delete request
            Log::info('Gallery bulk delete request:', [
                'ids' => $request->input('ids', []),
                'deleted_by' => auth()->id()
            ]);

            // Validation
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array|min:1',
                'ids.*' => 'required|integer|exists:galeris,id'
            ], [
                'ids.required' => 'ID foto harus disediakan.',
                'ids.array' => 'ID foto harus berupa array.',
                'ids.min' => 'Minimal satu foto harus dipilih.',
                'ids.*.required' => 'ID foto tidak boleh kosong.',
                'ids.*.integer' => 'ID foto harus berupa angka.',
                'ids.*.exists' => 'Foto dengan ID tersebut tidak ditemukan.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors()
                ], 422);
            }

            $ids = $request->input('ids');
            $deletedCount = 0;
            $errors = [];
            $deletedItems = [];
            $filesDeleted = 0;

            // Start database transaction
            DB::beginTransaction();

            // Get all galleries to delete
            $galleries = Galeri::whereIn('id', $ids)->get();

            if ($galleries->count() !== count($ids)) {
                $foundIds = $galleries->pluck('id')->toArray();
                $missingIds = array_diff($ids, $foundIds);

                Log::warning('Some galleries not found:', [
                    'requested_ids' => $ids,
                    'found_ids' => $foundIds,
                    'missing_ids' => $missingIds
                ]);
            }

            foreach ($galleries as $galeri) {
                try {
                    // Store galeri data for response
                    $deletedItem = [
                        'id' => $galeri->id,
                        'original_name' => $galeri->original_name,
                        'storage_path' => $galeri->storage_path,
                        'program_kerja_id' => $galeri->program_kerja_id
                    ];

                    // Delete file from storage
                    $fileDeleted = false;
                    if ($galeri->storage_path && Storage::disk('public')->exists($galeri->storage_path)) {
                        $fileDeleted = Storage::disk('public')->delete($galeri->storage_path);

                        if ($fileDeleted) {
                            $filesDeleted++;
                            Log::info('File deleted from storage:', [
                                'id' => $galeri->id,
                                'path' => $galeri->storage_path
                            ]);
                        } else {
                            Log::warning('Failed to delete file from storage:', [
                                'id' => $galeri->id,
                                'path' => $galeri->storage_path
                            ]);
                            $errors[] = "Gagal menghapus file untuk foto: {$galeri->original_name}";
                        }
                    } else {
                        // File doesn't exist, consider as success
                        $fileDeleted = true;
                        Log::info('File not found in storage (considering as deleted):', [
                            'id' => $galeri->id,
                            'path' => $galeri->storage_path ?? 'null'
                        ]);
                    }

                    // Delete record from database
                    $galeri->delete();
                    $deletedCount++;

                    $deletedItem['file_deleted'] = $fileDeleted;
                    $deletedItems[] = $deletedItem;

                    Log::info('Gallery deleted successfully in bulk:', [
                        'id' => $galeri->id,
                        'original_name' => $galeri->original_name,
                        'file_deleted' => $fileDeleted
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error deleting individual gallery in bulk:', [
                        'id' => $galeri->id,
                        'error' => $e->getMessage()
                    ]);

                    $errors[] = "Gagal menghapus foto {$galeri->original_name}: {$e->getMessage()}";
                    continue;
                }
            }

            // Check if any galleries were deleted
            if ($deletedCount === 0) {
                DB::rollback();

                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada foto yang berhasil dihapus.',
                    'errors' => $errors
                ], 400);
            }

            // Commit transaction
            DB::commit();

            $message = "{$deletedCount} foto berhasil dihapus";
            if (count($errors) > 0) {
                $message .= " dengan " . count($errors) . " error.";
            }

            Log::info('Gallery bulk delete completed:', [
                'total_requested' => count($ids),
                'successfully_deleted' => $deletedCount,
                'files_deleted' => $filesDeleted,
                'errors_count' => count($errors),
                'deleted_by' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => $message,
                'deleted_count' => $deletedCount,
                'files_deleted' => $filesDeleted,
                'deleted_items' => $deletedItems,
                'errors' => $errors,
                'summary' => [
                    'total_requested' => count($ids),
                    'successfully_deleted' => $deletedCount,
                    'failed_deletions' => count($errors),
                    'files_deleted_from_storage' => $filesDeleted
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Gallery bulk delete error:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'deleted_by' => auth()->id(),
                'request_data' => $request->only(['ids'])
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus foto: ' . $e->getMessage(),
                'error_details' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            ], 500);
        }
    }


    private function formatFileSize($bytes, $precision = 2)
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }

    public function detail($program, $tab = 'photos')
    {
        $galleryData = Galeri::where('program_id', $program)->first();

        return view('gallery.detail', compact('galleryData', 'tab'));
    }
}
