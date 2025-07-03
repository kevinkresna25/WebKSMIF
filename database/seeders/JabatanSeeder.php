<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JabatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jabatans = [
            [
                'nama' => 'Ketua',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Wakil Ketua',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Sekretaris',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Bendahara',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Koordinator',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Wakil Koordinator',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Anggota',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('jabatans')->insert($jabatans);
    }
}
