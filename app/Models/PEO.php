<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PEO extends Model
{
    use HasFactory;
    protected $guarded = ['created_at','updated_at'];

    public function program(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Degree::class);
    }

    public function umission(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Umission::class);
    }

    public function plos(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PLO::class);
    }
}
