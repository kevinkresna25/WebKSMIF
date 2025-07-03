<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function strukturKsm()
    {
        return $this->hasMany(Struktur_ksm::class);
    }

    public function strukturAktif()
    {
        return $this->hasOne(Struktur_ksm::class)->where('is_active', true);
    }

    public function galeris()
    {
        return $this->hasMany(Galeri::class, 'uploaded_by');
    }

    // Accessors
    public function getJabatanAttribute()
    {
        return $this->strukturAktif?->jabatan?->nama;
    }

    public function getDivisiAttribute()
    {
        return $this->strukturAktif?->divisi?->nama;
    }

    public function getFotoProfilAttribute()
    {
        return $this->strukturAktif?->foto_profil;
    }
}
