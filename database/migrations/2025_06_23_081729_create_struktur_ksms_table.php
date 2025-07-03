<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('struktur_ksms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Anggota
            $table->foreignId('jabatan_id')->constrained()->onDelete('cascade'); // Jabatan

            $table->string('divisi_kode', 6)->nullable(); // Divisi (bisa null untuk jabatan umum)
            $table->foreign('divisi_kode')->references('kode')->on('divisis')->onDelete('cascade');

            $table->string('periode', 9);
            $table->boolean('is_active')->default(true);
            $table->string('status_kepengurusan', 20)->default('aktif');
            $table->text('foto_profil');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('struktur_ksms');
    }
};
