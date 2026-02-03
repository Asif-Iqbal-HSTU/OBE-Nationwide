<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamQuestionItem extends Model
{
    use HasFactory;
    protected $guarded = ['created_at', 'updated_at'];

    public function examQuestion()
    {
        return $this->belongsTo(ExamQuestion::class);
    }

    public function clo()
    {
        return $this->belongsTo(CLO::class, 'clo_id');
    }
}
