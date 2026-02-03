<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModerationCommitteeMember extends Model
{
    use HasFactory;
    protected $guarded = ['created_at', 'updated_at'];

    public function committee()
    {
        return $this->belongsTo(ModerationCommittee::class, 'moderation_committee_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
