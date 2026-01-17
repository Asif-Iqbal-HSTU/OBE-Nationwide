<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CLO extends Model
{
    use HasFactory;
    protected $guarded = ['created_at','updated_at'];

    public function course(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function plos()
    {
        return $this->belongsToMany(PLO::class, 'clo_plo', 'clo_id', 'plo_id');
    }

    public function contents() {
        return $this->belongsToMany(Content::class, 'clo_content', 'clo_id', 'content_id');
    }
}
