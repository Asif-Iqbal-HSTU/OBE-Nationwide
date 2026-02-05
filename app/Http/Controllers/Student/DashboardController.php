<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\ExamMark;
use App\Models\Support;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $student = $user->student;

        if (!$student) {
            return redirect()->route('dashboard');
        }

        $student->load('program.department.faculty', 'user');

        // Fetch courses based on Program and Current Semester and Session
        $courses = Course::where('program_id', $student->program_id)
            ->where('semester', $student->current_semester)
            ->where('session', $student->session)
            ->get();

        // Get all pending assignments count
        $courseIds = $courses->pluck('id');
        $pendingAssignments = Assignment::whereIn('course_id', $courseIds)
            ->where('due_date', '>=', now())
            ->whereDoesntHave('submissions', function ($q) use ($student) {
                $q->where('student_id', $student->id);
            })
            ->count();

        // Get attendance stats
        $attendanceRecords = Attendance::whereIn('course_id', $courseIds)
            ->where('student_id', $student->id)
            ->get();

        $totalClasses = $attendanceRecords->count();
        $presentClasses = $attendanceRecords->where('status', 'present')->count();
        $attendancePercentage = $totalClasses > 0 ? round(($presentClasses / $totalClasses) * 100) : null;

        return Inertia::render('Student/Dashboard', [
            'student' => $student,
            'courses' => $courses,
            'stats' => [
                'enrolledCourses' => $courses->count(),
                'pendingAssignments' => $pendingAssignments,
                'attendancePercentage' => $attendancePercentage,
                'totalClasses' => $totalClasses,
                'presentClasses' => $presentClasses,
            ],
        ]);
    }

    public function assignments()
    {
        $user = Auth::user();
        $student = $user->student;

        if (!$student) {
            return redirect()->route('dashboard');
        }

        $student->load('program', 'user');

        // Fetch courses for this student
        $courses = Course::where('program_id', $student->program_id)
            ->where('semester', $student->current_semester)
            ->where('session', $student->session)
            ->get();

        $courseIds = $courses->pluck('id');

        // Get all assignments with submission status
        $assignments = Assignment::whereIn('course_id', $courseIds)
            ->with([
                'course',
                'teacher',
                'submissions' => function ($q) use ($student) {
                    $q->where('student_id', $student->id);
                }
            ])
            ->orderBy('due_date', 'asc')
            ->get()
            ->map(function ($assignment) {
                $submission = $assignment->submissions->first();
                return [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'description' => $assignment->description,
                    'due_date' => $assignment->due_date,
                    'total_marks' => $assignment->total_marks,
                    'course' => $assignment->course,
                    'teacher' => $assignment->teacher,
                    'submission' => $submission ? [
                        'id' => $submission->id,
                        'submitted_at' => $submission->submitted_at,
                        'marks' => $submission->obtained_marks,
                        'feedback' => $submission->feedback,
                    ] : null,
                    'is_overdue' => $assignment->due_date < now() && !$submission,
                    'is_submitted' => !!$submission,
                ];
            });

        return Inertia::render('Student/Assignments', [
            'student' => $student,
            'assignments' => $assignments,
        ]);
    }

    public function attendance()
    {
        $user = Auth::user();
        $student = $user->student;

        if (!$student) {
            return redirect()->route('dashboard');
        }

        $student->load('program');

        // Fetch courses for this student
        $courses = Course::where('program_id', $student->program_id)
            ->where('semester', $student->current_semester)
            ->where('session', $student->session)
            ->get();

        $courseIds = $courses->pluck('id');

        // Get attendance records grouped by course
        $attendanceRecords = Attendance::whereIn('course_id', $courseIds)
            ->where('student_id', $student->id)
            ->with('course')
            ->orderBy('date', 'desc')
            ->get();

        // Calculate attendance by course
        $attendanceByCourse = $courses->map(function ($course) use ($attendanceRecords) {
            $courseAttendance = $attendanceRecords->where('course_id', $course->id);
            $total = $courseAttendance->count();
            $present = $courseAttendance->where('status', 'present')->count();
            $absent = $courseAttendance->where('status', 'absent')->count();
            $late = $courseAttendance->where('status', 'late')->count();

            return [
                'course' => $course,
                'total' => $total,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'percentage' => $total > 0 ? round(($present / $total) * 100) : null,
                'records' => $courseAttendance->values(),
            ];
        });

        return Inertia::render('Student/Attendance', [
            'student' => $student,
            'attendanceByCourse' => $attendanceByCourse,
        ]);
    }

    public function grades()
    {
        $user = Auth::user();
        $student = $user->student;

        if (!$student) {
            return redirect()->route('dashboard');
        }

        $student->load('program');

        // Fetch courses for this student
        $courses = Course::where('program_id', $student->program_id)
            ->where('semester', $student->current_semester)
            ->where('session', $student->session)
            ->get();

        $courseIds = $courses->pluck('id');

        // Get exam marks
        $examMarks = ExamMark::whereIn('course_id', $courseIds)
            ->where('student_id', $student->id)
            ->with('course')
            ->get();

        // Get assignment submissions with grades
        $submissions = \App\Models\Submission::where('student_id', $student->id)
            ->whereHas('assignment', function ($q) use ($courseIds) {
                $q->whereIn('course_id', $courseIds);
            })
            ->with(['assignment.course'])
            ->whereNotNull('obtained_marks')
            ->get();

        // Group by course
        $gradesByCourse = $courses->map(function ($course) use ($examMarks, $submissions) {
            $courseExams = $examMarks->where('course_id', $course->id);
            $courseSubmissions = $submissions->filter(function ($s) use ($course) {
                return $s->assignment->course_id == $course->id;
            });

            return [
                'course' => $course,
                'exams' => $courseExams->values(),
                'assignments' => $courseSubmissions->map(function ($s) {
                    return [
                        'title' => $s->assignment->title,
                        'marks' => $s->obtained_marks,
                        'total_marks' => $s->assignment->total_marks,
                        'feedback' => $s->feedback,
                    ];
                })->values(),
            ];
        });

        return Inertia::render('Student/Grades', [
            'student' => $student,
            'gradesByCourse' => $gradesByCourse,
        ]);
    }

    public function support()
    {
        $user = Auth::user();
        $student = $user->student;

        if (!$student) {
            return redirect()->route('dashboard');
        }

        $student->load('program');

        // Fetch courses for this student
        $courses = Course::where('program_id', $student->program_id)
            ->where('semester', $student->current_semester)
            ->where('session', $student->session)
            ->get();

        $courseIds = $courses->pluck('id');

        // Get my support questions
        $myQuestions = Support::where('student_id', $student->id)
            ->whereIn('course_id', $courseIds)
            ->with(['course', 'answeredBy'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get public questions (answered)
        $publicQuestions = Support::whereIn('course_id', $courseIds)
            ->where('is_public', true)
            ->whereNotNull('answer')
            ->with(['course', 'student', 'answeredBy'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return Inertia::render('Student/Support', [
            'student' => $student,
            'courses' => $courses,
            'myQuestions' => $myQuestions,
            'publicQuestions' => $publicQuestions,
        ]);
    }
}
