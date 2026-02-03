<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;
    protected $guarded = ['created_at', 'updated_at'];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function assignments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(CourseAssignment::class, 'teacher_id');
    }

    public function assignedCourses(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_assignments', 'teacher_id', 'course_id')
            ->withPivot(['session', 'semester', 'assigned_by'])
            ->withTimestamps();
    }

    public function isChairmanOfDept($deptId): bool
    {
        $dept = Department::find($deptId);
        return $dept && $dept->chairman_id === $this->id;
    }

    public function isDeanOfFaculty($facultyId): bool
    {
        $faculty = Faculty::find($facultyId);
        return $faculty && $faculty->dean_id === $this->id;
    }
}
