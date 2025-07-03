<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bursa_soal extends Model
{
    /** @use HasFactory<\Database\Factories\BursaSoalFactory> */
    use HasFactory;

    protected $fillable = [
        'link_soal',
        'link_kuesioner'
    ];

    // Accessors
    public function getLinkSoalFormattedAttribute()
    {
        if (!$this->link_soal) return null;

        // Ensure it's a valid URL
        if (!str_starts_with($this->link_soal, 'http')) {
            return 'https://' . $this->link_soal;
        }

        return $this->link_soal;
    }

    public function getLinkKuesionerFormattedAttribute()
    {
        if (!$this->link_kuesioner) return null;

        // Ensure it's a valid URL
        if (!str_starts_with($this->link_kuesioner, 'http')) {
            return 'https://' . $this->link_kuesioner;
        }

        return $this->link_kuesioner;
    }

    public function getLinksAttribute()
    {
        return [
            'soal' => [
                'url' => $this->link_soal_formatted,
                'display' => 'Bank Soal',
                'icon' => 'fas fa-file-alt',
                'color' => '#3B82F6'
            ],
            'kuesioner' => [
                'url' => $this->link_kuesioner_formatted,
                'display' => 'Kuesioner',
                'icon' => 'fas fa-poll',
                'color' => '#10B981'
            ]
        ];
    }

    // Static methods
    public static function getLinks()
    {
        $bursaSoal = static::latest()->first();
        return $bursaSoal ? $bursaSoal->links : [];
    }

    public static function updateLinks($linkSoal, $linkKuesioner)
    {
        // Update atau create entry
        $bursaSoal = static::first();

        if ($bursaSoal) {
            $bursaSoal->update([
                'link_soal' => $linkSoal,
                'link_kuesioner' => $linkKuesioner
            ]);
        } else {
            static::create([
                'link_soal' => $linkSoal,
                'link_kuesioner' => $linkKuesioner
            ]);
        }

        return true;
    }
}
