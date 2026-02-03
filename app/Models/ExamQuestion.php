<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamQuestion extends Model
{
    use HasFactory;
    protected $guarded = ['created_at', 'updated_at'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'course_teacher_id');
    }

    public function items()
    {
        return $this->hasMany(ExamQuestionItem::class)->orderBy('position');
    }

    public function moderationCommittee()
    {
        return $this->belongsTo(ModerationCommittee::class);
    }
}
