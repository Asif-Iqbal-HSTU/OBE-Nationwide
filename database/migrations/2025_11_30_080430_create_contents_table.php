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
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->integer('content_no');
            $table->text('content');
            $table->text('teaching_strategy');
            $table->text('assessment_strategy');
//            $table->foreignId('c_l_o_id')->constrained()->onDelete('cascade');

            $table->foreignId('c_l_o_id')
                ->references('id')
                ->on('c_l_o_s')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contents');
    }
};
