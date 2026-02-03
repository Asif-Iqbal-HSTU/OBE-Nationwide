<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PEO extends Model
{
    use HasFactory;

    protected $guarded = ['created_at', 'updated_at'];

    public function program(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function umissions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Umission::class, 'peo_umission', 'peo_id', 'umission_id');
    }

    public function plos(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(PLO::class, 'peo_plo', 'peo_id', 'plo_id');
    }
}
