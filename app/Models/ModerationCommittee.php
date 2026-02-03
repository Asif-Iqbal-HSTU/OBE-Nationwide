<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModerationCommittee extends Model
{
    use HasFactory;
    protected $guarded = ['created_at', 'updated_at'];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function chairman()
    {
        return $this->belongsTo(Teacher::class, 'chairman_id');
    }

    public function members()
    {
        return $this->hasMany(ModerationCommitteeMember::class);
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'moderation_committee_members', 'moderation_committee_id', 'teacher_id');
    }

    public function examQuestions()
    {
        return $this->hasMany(ExamQuestion::class);
    }
}
