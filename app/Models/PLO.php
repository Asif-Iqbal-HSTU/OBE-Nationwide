<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PLO extends Model
{
    use HasFactory;
    protected $table = 'p_l_o_s'; // Explicitly define table name
    protected $guarded = ['created_at', 'updated_at'];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    // Add this to allow reverse lookup of CLOs from a PLO
    public function clos()
    {
        return $this->belongsToMany(CLO::class, 'clo_plo', 'plo_id', 'clo_id');
    }

    public function peos(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(PEO::class, 'peo_plo', 'plo_id', 'peo_id');
    }
}
