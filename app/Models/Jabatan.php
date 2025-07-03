<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jabatan extends Model
{
    /** @use HasFactory<\Database\Factories\JabatanFactory> */
    use HasFactory;

    protected $fillable = [
        'nama'
    ];

    // Relationships
    public function strukturKsm()
    {
        return $this->hasMany(Struktur_ksm::class);
    }

    public function pemegang()
    {
        return $this->hasMany(Struktur_ksm::class)->where('is_active', true);
    }

    // Accessors
    public function getJumlahPemegangAttribute()
    {
        return $this->pemegang()->count();
    }

    public function getPemegangSaatIniAttribute()
    {
        return $this->pemegang()->with('user')->get();
    }
}
