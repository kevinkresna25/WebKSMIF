<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Program_kerja extends Model
{
    /** @use HasFactory<\Database\Factories\ProgramKerjaFactory> */
    use HasFactory;

    protected $fillable = [
        'nama',
        'poster',
        'deskripsi',
        'lokasi',
        'tanggal_selesai_pendaftaran',
        'masa_pendaftaran',
        'selesai',
        'tanggal_mulai_acara',
        'tanggal_selesai_acara',
        'target_peserta',
        'contact_person'
    ];

    protected $casts = [
        'tanggal_selesai_pendaftaran' => 'datetime',
        'tanggal_mulai_acara' => 'datetime',
        'tanggal_selesai_acara' => 'datetime',
        'masa_pendaftaran' => 'boolean',
        'selesai' => 'boolean'
    ];

    // Relationships
    public function galeris()
    {
        return $this->hasMany(Galeri::class);
    }

    public function galeriAktif()
    {
        return $this->hasMany(Galeri::class)->latest();
    }

    // Scopes
    public function scopeAktif($query)
    {
        return $query->where('selesai', false);
    }

    public function scopeSelesai($query)
    {
        return $query->where('selesai', true);
    }

    public function scopePendaftaranTerbuka($query)
    {
        return $query->where('masa_pendaftaran', true);
    }

    public function scopeTerbaru($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeMendatang($query)
    {
        return $query->where('tanggal_mulai_acara', '>', now());
    }

    public function scopeBerlangsung($query)
    {
        return $query->where('tanggal_mulai_acara', '<=', now())
            ->where('tanggal_selesai_acara', '>=', now());
    }

    // Accessors
    public function getPosterUrlAttribute()
    {
        return $this->poster ? Storage::url($this->poster) : null;
    }

    public function getStatusAttribute()
    {
        if ($this->selesai) return 'selesai';
        if (now()->between($this->tanggal_mulai_acara, $this->tanggal_selesai_acara)) return 'berlangsung';
        if (now() < $this->tanggal_mulai_acara) return 'mendatang';
        return 'selesai';
    }

    public function getStatusPendaftaranAttribute()
    {
        if (!$this->masa_pendaftaran) return 'tutup';
        if (now() > $this->tanggal_selesai_pendaftaran) return 'tutup';
        return 'buka';
    }

    public function getDurasiAcaraAttribute()
    {
        $start = $this->tanggal_mulai_acara;
        $end = $this->tanggal_selesai_acara;

        if ($start->isSameDay($end)) {
            return $start->format('d M Y');
        }

        return $start->format('d M') . ' - ' . $end->format('d M Y');
    }

    public function getTotalFotoAttribute()
    {
        return $this->galeris()->count();
    }

    // Methods
    public function bukaPendaftaran()
    {
        $this->update(['masa_pendaftaran' => true]);
    }

    public function tutupPendaftaran()
    {
        $this->update(['masa_pendaftaran' => false]);
    }

    public function selesaikanProgram()
    {
        $this->update([
            'selesai' => true,
            'masa_pendaftaran' => false
        ]);
    }
}
