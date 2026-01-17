<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;
    protected $guarded = ['created_at','updated_at'];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function clos() {
        return $this->belongsToMany(CLO::class, 'clo_content', 'content_id', 'clo_id');
    }
}
