<?php

namespace Database\Seeders;

use App\Models\Divisi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DivisiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisis = [
            [
                'kode' => 'BPH',
                'nama' => 'Badan Pengurus Harian',
                'deskripsi' => 'Badan pengurus inti yang bertanggung jawab atas keseluruhan operasional dan strategis organisasi KSM-IF',
                'warna' => null,
            ],
            [
                'kode' => 'IRD',
                'nama' => 'Internal Relation Department',
                'deskripsi' => 'Departemen yang menangani hubungan internal organisasi, koordinasi antar divisi, dan pengembangan iklim kerja yang harmonis',
                'warna' => null,
            ],
            [
                'kode' => 'PRD',
                'nama' => 'Public Relation Department',
                'deskripsi' => 'Departemen yang mengelola hubungan masyarakat, komunikasi eksternal, dan membangun citra positif organisasi',
                'warna' => null,
            ],
            [
                'kode' => 'HRDD',
                'nama' => 'Human Resource Development Department',
                'deskripsi' => 'Departemen pengembangan sumber daya manusia yang fokus pada pelatihan, pengembangan skills, dan capacity building anggota',
                'warna' => null,
            ],
            [
                'kode' => 'CDD',
                'nama' => 'Creative Design Department',
                'deskripsi' => 'Departemen kreatif yang menangani desain grafis, konten visual, branding, dan semua kebutuhan kreatif organisasi',
                'warna' => null,
            ]
        ];

        foreach ($divisis as $divisi) {
            Divisi::create($divisi);
        }
    }
}
