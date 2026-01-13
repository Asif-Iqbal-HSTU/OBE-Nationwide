<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;
    protected $guarded = ['created_at','updated_at'];

    public function department(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function faculty(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function degree(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Degree::class);
    }

    public function plos(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PLO::class);
    }

    public function peos(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PEO::class);
    }

    public function genericSkills(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(GenericSkill::class);
    }

    public function courses(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Course::class);
    }
}
