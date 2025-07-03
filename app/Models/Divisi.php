<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Divisi extends Model
{
    /** @use HasFactory<\Database\Factories\DivisiFactory> */
    use HasFactory;

    protected $primaryKey = 'kode';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode',
        'nama',
        'deskripsi',
        'warna'
    ];

    // Relationships
    public function strukturKsm()
    {
        return $this->hasMany(Struktur_ksm::class, 'divisi_kode', 'kode');
    }

    public function anggotaAktif()
    {
        return $this->hasMany(Struktur_ksm::class, 'divisi_kode', 'kode')
            ->where('is_active', true);
    }

    // Accessors
    public function getJumlahAnggotaAttribute()
    {
        return $this->anggotaAktif()->count();
    }

    // Auto uppercase kode saat save
    public function setKodeAttribute($value)
    {
        $this->attributes['kode'] = strtoupper($value);
    }

    // Static methods
    public static function getByKode($kode)
    {
        return static::where('kode', strtoupper($kode))->first();
    }
}
