<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\CLOController;
use App\Http\Controllers\COController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ExamQuestionController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\GenericSkillController;
use App\Http\Controllers\LessonPlanController;
use App\Http\Controllers\ModerationCommitteeController;
use App\Http\Controllers\PEOController;
use App\Http\Controllers\PLOController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\UmissionController;
use App\Http\Controllers\CourseAssignmentController;
use App\Http\Controllers\MyCourseController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Teacher\AssignmentController as TeacherAssignmentController;
use App\Http\Controllers\Teacher\SubmissionController as TeacherSubmissionController;
use App\Http\Controllers\Teacher\AttendanceController as TeacherAttendanceController;
use App\Http\Controllers\Teacher\ExamMarkController as TeacherExamMarkController;
use App\Http\Controllers\Teacher\SupportController as TeacherSupportController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\CourseController as StudentCourseController;
use App\Http\Controllers\Student\AssignmentController as StudentAssignmentController;
use App\Http\Controllers\Student\SupportController as StudentSupportController;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/umissions', [UmissionController::class, 'index'])->name('umissions.index');
    Route::post('/umissions', [UmissionController::class, 'store'])->name('umissions.store');
    Route::put('/umissions/{umission}', [UmissionController::class, 'update'])->name('umissions.update');
    Route::delete('/umissions/{umission}', [UmissionController::class, 'destroy'])->name('umissions.destroy');

    Route::get('/faculties', [FacultyController::class, 'index'])->name('faculties.index');
    Route::post('/faculties', [FacultyController::class, 'store'])->name('faculties.store');
    Route::put('/faculties/{faculty}', [FacultyController::class, 'update'])->name('faculties.update');
    Route::delete('/faculties/{faculty}', [FacultyController::class, 'destroy'])->name('faculties.destroy');

    Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
    Route::post('/departments', [DepartmentController::class, 'store'])->name('departments.store');
    Route::put('/departments/{department}', [DepartmentController::class, 'update'])->name('departments.update');
    Route::delete('/departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');

    Route::get('/programs', [ProgramController::class, 'index'])->name('programs.index');
    Route::get('/programs/{program}', [ProgramController::class, 'show'])->name('programs.show');
    Route::post('/programs', [ProgramController::class, 'store'])->name('programs.store');
    Route::put('/programs/{program}', [ProgramController::class, 'update'])->name('programs.update');
    Route::delete('/programs/{program}', [ProgramController::class, 'destroy'])->name('programs.destroy');

    Route::get('/teachers', [TeacherController::class, 'index'])->name('teachers.index');
    Route::post('/teachers', [TeacherController::class, 'store'])->name('teachers.store');
    Route::put('/teachers/{teacher}', [TeacherController::class, 'update'])->name('teachers.update');
    Route::delete('/teachers/{teacher}', [TeacherController::class, 'destroy'])->name('teachers.destroy');

    // Nested routes for Program Educational Objectives, Program Learning Outcomes, and Generic Skills
    Route::prefix('programs/{program}')->group(function () {
        // PEO routes
        Route::get('/peos', [PEOController::class, 'index'])->name('programs.peos.index');
        Route::post('/peos', [PEOController::class, 'store'])->name('programs.peos.store');
        Route::put('/peos/{peo}', [PEOController::class, 'update'])->name('programs.peos.update');
        Route::delete('/peos/{peo}', [PEOController::class, 'destroy'])->name('programs.peos.destroy');

        // PLO routes
        Route::get('/plos', [PLOController::class, 'index'])->name('programs.plos.index');
        Route::post('/plos', [PLOController::class, 'store'])->name('programs.plos.store');
        Route::put('/plos/{plo}', [PLOController::class, 'update'])->name('programs.plos.update');
        Route::delete('/plos/{plo}', [PLOController::class, 'destroy'])->name('programs.plos.destroy');

        // Generic Skills routes
        Route::get('/generic-skills', [GenericSkillController::class, 'index'])->name('programs.generic-skills.index');
        Route::post('/generic-skills', [GenericSkillController::class, 'store'])->name('programs.generic-skills.store');
        Route::put('/generic-skills/{genericSkill}', [GenericSkillController::class, 'update'])->name('programs.generic-skills.update');
        Route::delete('/generic-skills/{genericSkill}', [GenericSkillController::class, 'destroy'])->name('programs.generic-skills.destroy');

        // Courses routes
        Route::get('/courses', [CourseController::class, 'index'])->name('programs.courses.index');
        Route::post('/courses', [CourseController::class, 'store'])->name('programs.courses.store');
        Route::put('/courses/{course}', [CourseController::class, 'update'])->name('programs.courses.update');
        Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->name('programs.courses.destroy');

        Route::prefix('courses/{course}')->group(function () {
            Route::post('/cos', [COController::class, 'store'])->name('programs.courses.cos.store');
            Route::put('/cos/{co}', [COController::class, 'update'])->name('programs.courses.cos.update');
            Route::delete('/cos/{co}', [COController::class, 'destroy'])->name('programs.courses.cos.destroy');

            Route::post('/clos', [CLOController::class, 'store'])->name('programs.courses.clos.store');
            Route::put('/clos/{clo}', [CLOController::class, 'update'])->name('programs.courses.clos.update');
            Route::delete('/clos/{clo}', [CLOController::class, 'destroy'])->name('programs.courses.clos.destroy');

            Route::post('/contents', [ContentController::class, 'store'])->name('programs.courses.contents.store');
            Route::put('/contents/{content}', [ContentController::class, 'update'])->name('programs.courses.contents.update');
            Route::delete('/contents/{content}', [ContentController::class, 'destroy'])->name('programs.courses.contents.destroy');

            Route::post('/books', [BookController::class, 'store'])->name('programs.courses.books.store');
            Route::put('/books/{book}', [BookController::class, 'update'])->name('programs.courses.books.update');
            Route::delete('/books/{book}', [BookController::class, 'destroy'])->name('programs.courses.books.destroy');

            Route::post('/lesson-plans', [LessonPlanController::class, 'store'])->name('programs.courses.lesson-plans.store');
            Route::put('/lesson-plans/{lessonPlan}', [LessonPlanController::class, 'update'])->name('programs.courses.lesson-plans.update');
            Route::delete('/lesson-plans/{lessonPlan}', [LessonPlanController::class, 'destroy'])->name('programs.courses.lesson-plans.destroy');

            // Course Assignments
            Route::post('/assignments', [CourseAssignmentController::class, 'store'])->name('programs.courses.assignments.store');
        });
    });

    Route::post('/course-assignments/{assignment}', [CourseAssignmentController::class, 'destroy'])->name('course-assignments.destroy');

    // Moderation Committee Management (Chairman only)
    Route::get('/moderation-committees', [ModerationCommitteeController::class, 'index'])->name('moderation-committees.index');
    Route::post('/moderation-committees', [ModerationCommitteeController::class, 'store'])->name('moderation-committees.store');
    Route::put('/moderation-committees/{committee}', [ModerationCommitteeController::class, 'update'])->name('moderation-committees.update');
    Route::delete('/moderation-committees/{committee}', [ModerationCommitteeController::class, 'destroy'])->name('moderation-committees.destroy');

    // Exam Questions - Question Paper Creation by Course Teachers
    Route::get('/exam-questions', [ExamQuestionController::class, 'index'])->name('exam-questions.index');
    Route::get('/exam-questions/create', [ExamQuestionController::class, 'create'])->name('exam-questions.create');
    Route::post('/exam-questions', [ExamQuestionController::class, 'store'])->name('exam-questions.store');
    Route::get('/exam-questions/{examQuestion}/edit', [ExamQuestionController::class, 'edit'])->name('exam-questions.edit');
    Route::put('/exam-questions/{examQuestion}', [ExamQuestionController::class, 'update'])->name('exam-questions.update');
    Route::delete('/exam-questions/{examQuestion}', [ExamQuestionController::class, 'destroy'])->name('exam-questions.destroy');
    Route::post('/exam-questions/{examQuestion}/submit', [ExamQuestionController::class, 'submit'])->name('exam-questions.submit');
    Route::get('/exam-questions/{examQuestion}/print', [ExamQuestionController::class, 'print'])->name('exam-questions.print');

    // Moderation Process - For Committee Members
    Route::get('/moderation', [ExamQuestionController::class, 'moderation'])->name('moderation.index');
    Route::get('/moderation/{examQuestion}', [ExamQuestionController::class, 'showModeration'])->name('moderation.show');
    Route::post('/moderation/{examQuestion}/approve', [ExamQuestionController::class, 'approve'])->name('moderation.approve');
    Route::post('/moderation/{examQuestion}/revision', [ExamQuestionController::class, 'requestRevision'])->name('moderation.revision');

    // My Courses - For Course Teachers
    Route::get('/my-courses', [MyCourseController::class, 'index'])->name('my-courses.index');
    Route::get('/my-courses/{assignment}', [MyCourseController::class, 'show'])->name('my-courses.show');
    Route::get('/my-courses/{assignment}/exam-questions/create', [MyCourseController::class, 'createExamQuestion'])->name('my-courses.exam-questions.create');
    Route::post('/my-courses/{assignment}/exam-questions', [MyCourseController::class, 'storeExamQuestion'])->name('my-courses.exam-questions.store');

    // Teacher LMS Routes
    Route::prefix('teacher')->name('teacher.')->group(function () {
        // Assignments
        Route::post('/courses/{course}/assignments', [TeacherAssignmentController::class, 'store'])->name('assignments.store');
        Route::delete('/assignments/{assignment}', [TeacherAssignmentController::class, 'destroy'])->name('assignments.destroy');

        // Submissions (Grading)
        Route::put('/submissions/{submission}', [TeacherSubmissionController::class, 'update'])->name('submissions.update');

        // Attendance
        Route::post('/courses/{course}/attendance', [TeacherAttendanceController::class, 'store'])->name('attendance.store');

        // Exam Marks
        Route::post('/courses/{course}/exam-marks', [TeacherExamMarkController::class, 'store'])->name('exam-marks.store');

        // Support
        Route::put('/supports/{support}', [TeacherSupportController::class, 'update'])->name('supports.update');
    });

    // Student LMS Routes
    Route::prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/assignments', [StudentDashboardController::class, 'assignments'])->name('assignments');
        Route::get('/attendance', [StudentDashboardController::class, 'attendance'])->name('attendance');
        Route::get('/grades', [StudentDashboardController::class, 'grades'])->name('grades');
        Route::get('/support', [StudentDashboardController::class, 'support'])->name('support');

        Route::get('/courses/{course}', [StudentCourseController::class, 'show'])->name('courses.show');

        // Assignments
        Route::post('/assignments/{assignment}/submit', [StudentAssignmentController::class, 'submit'])->name('assignments.submit');

        // Support
        Route::post('/courses/{course}/support', [StudentSupportController::class, 'store'])->name('support.store');
    });
});


require __DIR__ . '/settings.php';
