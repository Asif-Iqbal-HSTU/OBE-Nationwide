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
        Schema::create('clo_lesson_plan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clo_id')->constrained('c_l_o_s')->onDelete('cascade');
            $table->foreignId('lesson_plan_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clo_lesson_plan');
    }
};
