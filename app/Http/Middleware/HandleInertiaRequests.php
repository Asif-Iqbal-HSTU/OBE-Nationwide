<?php

namespace App\Http\Middleware;

use App\Models\Program;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Get student statistics for dashboard display
     */
    private function getStudentStats(Request $request): ?array
    {
        $user = $request->user();
        if (!$user || !$user->student) {
            return null;
        }

        $student = $user->student;

        // Fetch courses for this student
        $courses = \App\Models\Course::where('program_id', $student->program_id)
            ->where('semester', $student->current_semester)
            ->where('session', $student->session)
            ->get();

        $courseIds = $courses->pluck('id');

        // Count pending assignments
        $pendingAssignments = \App\Models\Assignment::whereIn('course_id', $courseIds)
            ->where('due_date', '>=', now())
            ->whereDoesntHave('submissions', function ($q) use ($student) {
                $q->where('student_id', $student->id);
            })
            ->count();

        // Get attendance stats
        $attendanceRecords = \App\Models\Attendance::whereIn('course_id', $courseIds)
            ->where('student_id', $student->id)
            ->get();

        $totalClasses = $attendanceRecords->count();
        $presentClasses = $attendanceRecords->where('status', 'present')->count();
        $attendancePercentage = $totalClasses > 0 ? round(($presentClasses / $totalClasses) * 100) : null;

        return [
            'enrolledCourses' => $courses->count(),
            'pendingAssignments' => $pendingAssignments,
            'attendancePercentage' => $attendancePercentage,
            'totalClasses' => $totalClasses,
            'presentClasses' => $presentClasses,
        ];
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'userPrograms' => function () use ($request) {
                $user = $request->user();
                if (!$user)
                    return ['teaching' => [], 'managed' => []];

                if ($user->isAdmin()) {
                    $managed = Program::whereHas('faculty', function ($query) use ($user) {
                        $query->where('user_id', $user->id);
                    })
                        ->select('id', 'name', 'short_name')
                        ->orderBy('name')
                        ->get();
                    return ['teaching' => [], 'managed' => $managed];
                }

                $teacher = $user->teacher;
                if (!$teacher)
                    return ['teaching' => [], 'managed' => []];

                $teaching = Program::whereHas('courses.assignments', function ($sq) use ($teacher) {
                    $sq->where('teacher_id', $teacher->id);
                })
                    ->select('id', 'name', 'short_name')
                    ->distinct()
                    ->orderBy('name')
                    ->get();

                $myCourses = \App\Models\Course::whereHas('assignments', function ($q) use ($teacher) {
                    $q->where('teacher_id', $teacher->id);
                })
                    ->with('program:id,name,short_name')
                    ->select('id', 'program_id', 'code', 'name')
                    ->orderBy('code')
                    ->get();

                $managed = [];
                $isChairman = \App\Models\Department::where('chairman_id', $teacher->id)->exists();
                $isDean = \App\Models\Faculty::where('dean_id', $teacher->id)->exists();

                if ($isChairman || $isDean) {
                    $managed = Program::whereIn('department_id', \App\Models\Department::where('chairman_id', $teacher->id)->pluck('id'))
                        ->orWhereIn('faculty_id', \App\Models\Faculty::where('dean_id', $teacher->id)->pluck('id'))
                        ->select('id', 'name', 'short_name')
                        ->distinct()
                        ->orderBy('name')
                        ->get();
                }

                return [
                    'teaching' => $teaching,
                    'myCourses' => $myCourses,
                    'managed' => $managed
                ];
            },
            'auth' => [
                'user' => $request->user(),
                'teacher' => $request->user() && $request->user()->teacher
                    ? $request->user()->teacher->load(['department.faculty'])
                    : null,
                'student' => $request->user() && $request->user()->student
                    ? $request->user()->student->load(['program.department.faculty'])
                    : null,
                'studentStats' => $this->getStudentStats($request),
                'isChairman' => $request->user() && $request->user()->teacher
                    ? \App\Models\Department::where('chairman_id', $request->user()->teacher->id)->exists()
                    : false,
                'isDean' => $request->user() && $request->user()->teacher
                    ? \App\Models\Faculty::where('dean_id', $request->user()->teacher->id)->exists()
                    : false,
            ],
        ];
    }
}
