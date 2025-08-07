<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Struktur_ksm extends Model
{
    /** @use HasFactory<\Database\Factories\StrukturKsmFactory> */
    use HasFactory;

    protected $fillable = [
        'nama',
        'jabatan_id',
        'divisi_kode',
        'periode',
        'status_kepengurusan',
        'foto_profil'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jabatan()
    {
        return $this->belongsTo(Jabatan::class);
    }

    public function divisi()
    {
        return $this->belongsTo(Divisi::class, 'divisi_kode', 'kode');
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('status_kepengurusan', 'aktif');
    }

    public function scopePeriode($query, $periode)
    {
        return $query->where('periode', $periode);
    }

    public function scopeByDivisi($query, $divisiKode)
    {
        return $query->where('divisi_kode', $divisiKode);
    }

    public function scopePeriodeSaatIni($query)
    {
        $currentYear = now()->year;
        $currentPeriod = $currentYear . '-' . ($currentYear + 1);
        return $query->where('periode', $currentPeriod);
    }

    public function scopeUrutan($query)
    {
        return $query->orderBy('created_at');
    }

    // Accessors
    public function getFotoProfilUrlAttribute()
    {
        return $this->foto_profil ? Storage::url($this->foto_profil) : null;
    }

    public function getNamaLengkapAttribute()
    {
        return $this->user->name;
    }

    public function getJabatanNamaAttribute()
    {
        return $this->jabatan->nama;
    }

    public function getDivisiNamaAttribute()
    {
        return $this->divisi?->nama;
    }

    public function getInfoLengkapAttribute()
    {
        return [
            'nama' => $this->user->name,
            'email' => $this->user->email,
            'jabatan' => $this->jabatan->nama,
            'divisi' => $this->divisi?->nama,
            'periode' => $this->periode,
            'foto' => $this->foto_profil_url,
            'status' => $this->status_kepengurusan
        ];
    }

    // Static methods
    public static function getCurrentPeriod()
    {
        $year = now()->year;
        return $year . '-' . ($year + 1);
    }

    public static function getStrukturAktif($periode = null)
    {
        $periode = $periode ?? static::getCurrentPeriod();

        return static::with(['user', 'jabatan', 'divisi'])
            ->aktif()
            ->periode($periode)
            ->urutan()
            ->get();
    }

    public static function getByDivisi($divisiKode, $periode = null)
    {
        $periode = $periode ?? static::getCurrentPeriod();

        return static::with(['user', 'jabatan'])
            ->aktif()
            ->periode($periode)
            ->byDivisi($divisiKode)
            ->urutan()
            ->get();
    }

    // Methods
    public function aktifkan()
    {
        $this->update([
            'status_kepengurusan' => 'aktif'
        ]);
    }

    public function nonaktifkan()
    {
        $this->update([
            'status_kepengurusan' => 'non-aktif'
        ]);
    }
}
