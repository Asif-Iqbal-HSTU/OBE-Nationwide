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
        Schema::table('exam_question_items', function (Blueprint $table) {
            $table->enum('is_satisfactory', ['Yes', 'No', 'N/A'])->nullable()->after('blooms_taxonomy_level');
            $table->text('moderator_comment')->nullable()->after('is_satisfactory');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_question_items', function (Blueprint $table) {
            $table->dropColumn(['is_satisfactory', 'moderator_comment']);
        });
    }
};