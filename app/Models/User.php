<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    const ROLE_ADMIN = 'admin';
    const ROLE_DEAN = 'dean';
    const ROLE_CHAIRMAN = 'chairman';
    const ROLE_TEACHER = 'teacher';
    const ROLE_STUDENT = 'student';

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isDean(): bool
    {
        return $this->role === self::ROLE_DEAN;
    }

    public function isChairman(): bool
    {
        if ($this->role === self::ROLE_CHAIRMAN) {
            return true;
        }

        // Check if assigned as chairman in database
        // Load relationship if not already loaded to avoid N+1 if possible, though strict check is safer
        $teacher = $this->teacher;
        if ($teacher && Department::where('chairman_id', $teacher->id)->exists()) {
            return true;
        }

        return false;
    }

    public function isTeacher(): bool
    {
        return $this->role === self::ROLE_TEACHER;
    }

    public function isStudent(): bool
    {
        return $this->role === self::ROLE_STUDENT;
    }

    public function teacher(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Teacher::class);
    }

    public function student(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Student::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function faculties(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Faculty::class);
    }

    public function umissions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Umission::class);
    }
}
