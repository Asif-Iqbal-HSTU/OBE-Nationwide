<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Support extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'student_id',
        'question',
        'answer',
        'answered_by',
        'is_public',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function answeredBy()
    {
        return $this->belongsTo(Teacher::class, 'answered_by');
    }
}
