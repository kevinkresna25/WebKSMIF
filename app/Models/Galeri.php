<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Galeri extends Model
{
    /** @use HasFactory<\Database\Factories\GaleriFactory> */
    use HasFactory;

    protected $fillable = [
        'program_kerja_id',
        'original_name',
        'storage_path',
        'extension',
        'size',
        'uploaded_by'
    ];

    // Relationships
    public function programKerja()
    {
        return $this->belongsTo(Program_kerja::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // Scopes
    public function scopeByProgram($query, $programId)
    {
        return $query->where('program_kerja_id', $programId);
    }

    public function scopeTerbaru($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Accessors
    public function getUrlAttribute()
    {
        return $this->storage_path ? Storage::url($this->storage_path) : null;
    }

    public function getThumbnailUrlAttribute()
    {
        if (!$this->storage_path) return null;

        $pathInfo = pathinfo($this->storage_path);
        $thumbnailPath = $pathInfo['dirname'] . '/thumb_' . $pathInfo['basename'];

        return Storage::url($thumbnailPath);
    }
}
