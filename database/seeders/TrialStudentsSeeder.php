<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\ExamMark;
use App\Models\Submission;
use App\Models\Support;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TrialStudentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = [
            ['name' => 'Asif Iqbal', 'email' => 'asif@example.com', 'id' => '2102001'],
            ['name' => 'Mehedi Hasan', 'email' => 'mehedi@example.com', 'id' => '2102002'],
            ['name' => 'Sabbir Ahmed', 'email' => 'sabbir@example.com', 'id' => '2102003'],
            ['name' => 'Ruhul Amin', 'email' => 'ruhul@example.com', 'id' => '2102004'],
            ['name' => 'Tanvir Hossain', 'email' => 'tanvir@example.com', 'id' => '2102005'],
        ];

        $createdStudents = [];

        foreach ($students as $s) {
            $user = User::firstOrCreate(
                ['email' => $s['email']],
                [
                    'name' => $s['name'],
                    'password' => Hash::make('password'),
                    'role' => 'student',
                ]
            );

            $student = Student::firstOrCreate(
                ['student_id' => $s['id']],
                [
                    'user_id' => $user->id,
                    'program_id' => 1,
                    'current_semester' => 'I',
                    'current_level' => 1,
                    'session' => '2021-22',
                ]
            );

            $createdStudents[] = $student;
        }

        // Get or create courses for the program
        $courses = Course::where('program_id', 1)
            ->where('semester', 'I')
            ->where('session', '2021-22')
            ->get();

        // If no courses exist, create some sample courses
        if ($courses->isEmpty()) {
            $sampleCourses = [
                [
                    'name' => 'Introduction to Computer Science',
                    'code' => 'CSE-101',
                    'program_id' => 1,
                    'credit_hours' => 3.0,
                    'level' => '1',
                    'semester' => 'I',
                    'session' => '2021-22',
                    'type_theory_sessional' => 'Theory',
                    'type_core_optional' => 'Core',
                    'prerequisite' => 'None',
                    'summary' => 'Fundamentals of computer science including algorithms, data structures, and programming concepts.',
                ],
                [
                    'name' => 'Calculus I',
                    'code' => 'MATH-101',
                    'program_id' => 1,
                    'credit_hours' => 3.0,
                    'level' => '1',
                    'semester' => 'I',
                    'session' => '2021-22',
                    'type_theory_sessional' => 'Theory',
                    'type_core_optional' => 'Core',
                    'prerequisite' => 'None',
                    'summary' => 'Limits, derivatives, and integrals with applications.',
                ],
                [
                    'name' => 'Physics for Engineers',
                    'code' => 'PHY-101',
                    'program_id' => 1,
                    'credit_hours' => 3.0,
                    'level' => '1',
                    'semester' => 'I',
                    'session' => '2021-22',
                    'type_theory_sessional' => 'Theory',
                    'type_core_optional' => 'Core',
                    'prerequisite' => 'None',
                    'summary' => 'Mechanics, thermodynamics, and waves for engineering students.',
                ],
                [
                    'name' => 'Programming Lab',
                    'code' => 'CSE-102',
                    'program_id' => 1,
                    'credit_hours' => 1.5,
                    'level' => '1',
                    'semester' => 'I',
                    'session' => '2021-22',
                    'type_theory_sessional' => 'Sessional',
                    'type_core_optional' => 'Core',
                    'prerequisite' => 'CSE-101',
                    'summary' => 'Hands-on programming practice in C/C++.',
                ],
            ];

            foreach ($sampleCourses as $courseData) {
                Course::firstOrCreate(
                    ['code' => $courseData['code'], 'session' => $courseData['session']],
                    $courseData
                );
            }

            $courses = Course::where('program_id', 1)
                ->where('semester', 'I')
                ->where('session', '2021-22')
                ->get();
        }

        // Create sample data for the first student (Asif Iqbal)
        if (count($createdStudents) > 0 && $courses->count() > 0) {
            $primaryStudent = $createdStudents[0];
            $teacher = \App\Models\Teacher::first();
            $teacherId = $teacher ? $teacher->id : null;

            foreach ($courses as $course) {
                // Create Assignments
                $assignments = [
                    [
                        'course_id' => $course->id,
                        'teacher_id' => $teacherId,
                        'title' => "Assignment 1: {$course->name} Basics",
                        'description' => "Complete the exercises from Chapter 1 and submit your solutions.",
                        'due_date' => now()->addDays(7),
                        'total_marks' => 20,
                    ],
                    [
                        'course_id' => $course->id,
                        'teacher_id' => $teacherId,
                        'title' => "Assignment 2: {$course->name} Practice",
                        'description' => "Solve problems 1-10 from the problem set.",
                        'due_date' => now()->addDays(14),
                        'total_marks' => 25,
                    ],
                    [
                        'course_id' => $course->id,
                        'teacher_id' => $teacherId,
                        'title' => "Assignment 3: {$course->name} Advanced",
                        'description' => "Project work - build a small application.",
                        'due_date' => now()->subDays(2), // Overdue
                        'total_marks' => 30,
                    ],
                ];

                foreach ($assignments as $assignmentData) {
                    Assignment::firstOrCreate(
                        ['title' => $assignmentData['title'], 'course_id' => $assignmentData['course_id']],
                        $assignmentData
                    );
                }

                // Create Attendance Records
                for ($i = 1; $i <= 10; $i++) {
                    $date = now()->subDays($i * 3);
                    $status = $i % 5 === 0 ? 'absent' : ($i % 7 === 0 ? 'late' : 'present');

                    Attendance::firstOrCreate(
                        [
                            'course_id' => $course->id,
                            'student_id' => $primaryStudent->id,
                            'date' => $date->format('Y-m-d'),
                        ],
                        [
                            'status' => $status,
                            'recorded_by' => $teacherId,
                        ]
                    );
                }

                // Create Exam Marks
                $examTypes = ['Class Test 1', 'Mid Term', 'Class Test 2'];
                foreach ($examTypes as $index => $examType) {
                    $totalMarks = $examType === 'Mid Term' ? 30 : 15;
                    $obtained = rand(intval($totalMarks * 0.5), $totalMarks);

                    ExamMark::firstOrCreate(
                        [
                            'course_id' => $course->id,
                            'student_id' => $primaryStudent->id,
                            'exam_type' => $examType,
                        ],
                        [
                            'marks' => $obtained,
                            'total_marks' => $totalMarks,
                        ]
                    );
                }
            }

            // Create submissions for some assignments
            $assignmentsToSubmit = Assignment::whereIn('course_id', $courses->pluck('id'))
                ->take(4)
                ->get();

            foreach ($assignmentsToSubmit as $index => $assignment) {
                if ($index < 3) { // Submit first 3 assignments
                    Submission::firstOrCreate(
                        [
                            'assignment_id' => $assignment->id,
                            'student_id' => $primaryStudent->id,
                        ],
                        [
                            'file_path' => '/submissions/sample.pdf',
                            'obtained_marks' => $index < 2 ? rand(15, $assignment->total_marks) : null, // First 2 graded
                            'feedback' => $index < 2 ? 'Good work! Keep it up.' : null,
                            'submitted_at' => now(),
                        ]
                    );
                }
            }

            // Create sample support questions
            $firstCourse = $courses->first();
            if ($firstCourse) {
                Support::firstOrCreate(
                    [
                        'course_id' => $firstCourse->id,
                        'student_id' => $primaryStudent->id,
                        'question' => 'Can you explain the concept of recursion?',
                    ],
                    [
                        'answer' => 'Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. It requires a base case to terminate.',
                        'is_public' => true,
                        'answered_by' => $teacherId,
                    ]
                );

                Support::firstOrCreate(
                    [
                        'course_id' => $firstCourse->id,
                        'student_id' => $primaryStudent->id,
                        'question' => 'When is the deadline for assignment submission?',
                    ],
                    [
                        'answer' => null,
                        'is_public' => false,
                        'answered_by' => null,
                    ]
                );
            }
        }

        $this->command->info('Trial students and sample data seeded successfully!');
    }
}
