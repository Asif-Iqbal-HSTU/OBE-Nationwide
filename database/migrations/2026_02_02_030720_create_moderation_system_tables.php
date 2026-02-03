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
        // Moderation Committees
        Schema::create('moderation_committees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->string('session');
            $table->string('semester');
            $table->foreignId('chairman_id')->constrained('teachers')->onDelete('cascade');
            $table->timestamps();
        });

        // Moderation Committee Members
        Schema::create('moderation_committee_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('moderation_committee_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->timestamps();
        });

        // Exam Questions
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_teacher_id')->constrained('teachers')->onDelete('cascade');
            $table->string('session');
            $table->string('semester');
            $table->integer('total_marks')->default(70);
            $table->string('duration')->default('3 Hours');
            $table->enum('status', ['Draft', 'Submitted', 'Moderating', 'RevisionNeeded', 'Approved'])->default('Draft');
            $table->foreignId('moderation_committee_id')->nullable()->constrained()->onDelete('set null');
            $table->text('moderator_feedback')->nullable();
            $table->timestamps();
        });

        // Exam Question Items
        Schema::create('exam_question_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_question_id')->constrained()->onDelete('cascade');
            $table->string('question_label')->nullable(); // e.g., 1(a), 1(b)
            $table->text('question_text');
            $table->decimal('marks', 5, 2);
            $table->foreignId('clo_id')->nullable()->constrained('c_l_o_s')->onDelete('set null');
            $table->enum('blooms_taxonomy_level', ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create']);
            $table->integer('position')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_question_items');
        Schema::dropIfExists('exam_questions');
        Schema::dropIfExists('moderation_committee_members');
        Schema::dropIfExists('moderation_committees');
    }
};
