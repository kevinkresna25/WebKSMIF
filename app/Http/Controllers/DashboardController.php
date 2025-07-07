<?php

namespace App\Http\Controllers;

use App\Models\Info;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user();

            $ksmInfo = $this->getKsmInfo();

            return Inertia::render('admin/dashboard', [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ?? 'admin',
                    'avatar' => $user->avatar ?? null,
                    'last_login_at' => $user->last_login_at ?? null,
                ],
                'ksmInfo' => $ksmInfo,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('admin/dashboard', [
                'user' => Auth::user(),
                'error' => 'Some dashboard data could not be loaded.'
            ]);
        }
    }

    public function updateKsmInfo(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'tentang' => 'required|string',
                'visi' => 'required|string',
                'misi' => 'required|array|min:1',
                'misi.*' => 'required|string',
                'email' => 'nullable|email',
                'instagram' => 'nullable|string|max:255',
                'line' => 'nullable|string|max:255',
                'whatsapp' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Convert misi array to JSON string for database storage
            $misiJson = json_encode($request->misi);

            // Check if Info record exists
            $info = Info::first();

            if ($info) {
                // Update existing record
                $info->update([
                    'tentang' => $request->tentang,
                    'visi' => $request->visi,
                    'misi' => $misiJson,
                    'email' => $request->email,
                    'instagram' => $request->instagram,
                    'line' => $request->line,
                    'whatsapp' => $request->whatsapp,
                ]);
            } else {
                // Create new record
                $info = Info::create([
                    'tentang' => $request->tentang,
                    'visi' => $request->visi,
                    'misi' => $misiJson,
                    'email' => $request->email,
                    'instagram' => $request->instagram,
                    'line' => $request->line,
                    'whatsapp' => $request->whatsapp,
                ]);
            }

            // Return updated data
            $updatedInfo = $this->formatKsmInfo($info);

            return response()->json([
                'success' => true,
                'message' => 'Informasi KSM-IF berhasil diperbarui.',
                'data' => $updatedInfo,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui informasi KSM-IF: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function formatKsmInfo($info)
    {
        // Parse misi JSON if it's stored as JSON
        $misi = $info->misi;
        if (is_string($misi)) {
            $misi = json_decode($misi, true) ?? [$misi];
        }

        return [
            'id' => $info->id,
            'tentang' => $info->tentang,
            'visi' => $info->visi,
            'misi' => $misi,
            'email' => $info->email,
            'instagram' => $info->instagram,
            'line' => $info->line,
            'whatsapp' => $info->whatsapp,
            'created_at' => $info->created_at,
            'updated_at' => $info->updated_at,
        ];
    }

    private function getKsmInfo()
    {
        try {
            // Check if Info model exists, if not use DB query
            if (class_exists('App\Models\Info')) {
                $info = Info::first();
            } else {
                $info = DB::table('infos')->first();
            }

            if ($info) {
                // Parse misi JSON if it's stored as JSON
                $misi = $info->misi;
                if (is_string($misi)) {
                    $misi = json_decode($misi, true) ?? [$misi];
                }

                return [
                    'id' => $info->id,
                    'tentang' => $info->tentang,
                    'visi' => $info->visi,
                    'misi' => $misi,
                    'email' => $info->email,
                    'instagram' => $info->instagram,
                    'line' => $info->line,
                    'whatsapp' => $info->whatsapp,
                    'updated_at' => $info->updated_at ?? $info->created_at ?? now(),
                ];
            }

            // Return default data if no record found
            return [
                'id' => null,
                'tentang' => 'Kelompok Studi Mahasiswa Teknik Informatika (KSM-IF) adalah organisasi mahasiswa yang berfokus pada pengembangan skill dan pengetahuan di bidang teknologi informasi.',
                'visi' => 'Menjadi komunitas mahasiswa Teknik Informatika yang unggul dalam bidang teknologi, inovasi, dan pengembangan sumber daya manusia yang berkualitas.',
                'misi' => [
                    'Mengembangkan kemampuan teknis dan soft skill mahasiswa',
                    'Memfasilitasi kolaborasi antar mahasiswa dalam bidang IT',
                    'Menyelenggarakan program-program edukatif dan inovatif',
                    'Membangun network dengan industri teknologi'
                ],
                'email' => null,
                'instagram' => null,
                'line' => null,
                'whatsapp' => null,
                'updated_at' => now(),
            ];
        } catch (\Exception $e) {
            return [
                'id' => null,
                'tentang' => 'Data tidak dapat dimuat.',
                'visi' => 'Data tidak dapat dimuat.',
                'misi' => ['Data tidak dapat dimuat.'],
                'email' => null,
                'instagram' => null,
                'line' => null,
                'whatsapp' => null,
                'updated_at' => now(),
            ];
        }
    }
}
