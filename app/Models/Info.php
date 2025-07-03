<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Info extends Model
{
    /** @use HasFactory<\Database\Factories\InfoFactory> */
    use HasFactory;

    protected $fillable = [
        'tentang',
        'visi',
        'misi',
        'email',
        'instagram',
        'line',
        'whatsapp'
    ];

    // Static methods untuk mengambil data info
    public static function getInfo()
    {
        return static::first();
    }

    public static function getVisi()
    {
        $info = static::getInfo();
        return $info ? $info->visi : null;
    }

    public static function getMisi()
    {
        $info = static::getInfo();
        return $info ? $info->misi : null;
    }

    public static function getTentang()
    {
        $info = static::getInfo();
        return $info ? $info->tentang : null;
    }

    public static function getKontak()
    {
        $info = static::getInfo();
        if (!$info) return [];

        return [
            'email' => $info->email,
            'instagram' => $info->instagram,
            'line' => $info->line,
            'whatsapp' => $info->whatsapp,
        ];
    }

    // Accessors untuk link social media
    public function getWhatsappLinkAttribute()
    {
        if (!$this->whatsapp) return null;
        $number = preg_replace('/[^0-9]/', '', $this->whatsapp);
        return 'https://wa.me/' . $number;
    }

    public function getInstagramLinkAttribute()
    {
        if (!$this->instagram) return null;
        $username = str_replace('@', '', $this->instagram);
        return 'https://instagram.com/' . $username;
    }

    public function getLineLinkAttribute()
    {
        if (!$this->line) return null;
        return 'https://line.me/ti/p/' . $this->line;
    }

    public function getEmailLinkAttribute()
    {
        if (!$this->email) return null;
        return 'mailto:' . $this->email;
    }
}
