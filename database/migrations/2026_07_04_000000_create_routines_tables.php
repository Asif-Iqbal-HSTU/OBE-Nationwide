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
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_number')->unique();
            $table->integer('capacity');
            $table->string('type'); // theory, lab
            $table->timestamps();
        });

        Schema::create('time_slots', function (Blueprint $table) {
            $table->id();
            $table->string('day'); // Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday
            $table->string('start_time'); // HH:MM
            $table->string('end_time'); // HH:MM
            $table->string('type'); // class, exam
            $table->timestamps();
        });

        Schema::create('class_routines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained()->onDelete('cascade');
            $table->string('level'); // Level 1, Level 2, etc.
            $table->string('semester'); // Semester I, Semester II, etc.
            $table->string('session'); // 2026, etc.
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('classroom_id')->constrained()->onDelete('cascade');
            $table->foreignId('time_slot_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('exam_routines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained()->onDelete('cascade');
            $table->string('level');
            $table->string('semester');
            $table->string('session');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('classroom_id')->constrained()->onDelete('cascade');
            $table->foreignId('time_slot_id')->constrained()->onDelete('cascade');
            $table->date('exam_date');
            $table->foreignId('invigilator_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_routines');
        Schema::dropIfExists('class_routines');
        Schema::dropIfExists('time_slots');
        Schema::dropIfExists('classrooms');
    }
};
