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
        Schema::create('program_kerjas', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->text('poster');
            $table->text('deskripsi');
            $table->string('lokasi');
            $table->datetime('tanggal_selesai_pendaftaran');
            $table->boolean('masa_pendaftaran')->default(false);
            $table->boolean('selesai')->default(false);
            $table->datetime('tanggal_mulai_acara');
            $table->datetime('tanggal_selesai_acara');
            $table->string('target_peserta')->nullable();
            $table->string('contact_person')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_kerjas');
    }
};
