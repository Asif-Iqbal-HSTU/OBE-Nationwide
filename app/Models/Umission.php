<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Umission extends Model
{

    use HasFactory;
    protected $guarded = ['created_at','updated_at'];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function peos(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PEO::class);
    }
}
