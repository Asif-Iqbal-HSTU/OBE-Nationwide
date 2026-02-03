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
        Schema::table('faculties', function (Blueprint $table) {
            $table->foreignId('dean_id')->nullable()->after('name')->constrained('teachers')->onDelete('set null');
        });

        Schema::table('departments', function (Blueprint $table) {
            $table->foreignId('chairman_id')->nullable()->after('name')->constrained('teachers')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faculties', function (Blueprint $table) {
            $table->dropForeign(['dean_id']);
            $table->dropColumn('dean_id');
        });

        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['chairman_id']);
            $table->dropColumn('chairman_id');
        });
    }
};
