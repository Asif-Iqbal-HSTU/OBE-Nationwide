<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('peo_umission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('peo_id')->constrained('p_e_o_s')->onDelete('cascade');
            $table->foreignId('umission_id')->constrained('umissions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peo_umission');
    }
};
