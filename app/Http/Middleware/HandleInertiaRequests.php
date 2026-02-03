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
