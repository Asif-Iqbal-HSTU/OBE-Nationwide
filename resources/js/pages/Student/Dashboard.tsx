import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar, Clock, GraduationCap, School, UserCircle, ClipboardCheck, TrendingUp, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StudentDashboardProps {
    student: any;
    courses: any[];
    stats: {
        enrolledCourses: number;
        pendingAssignments: number;
        attendancePercentage: number | null;
        totalClasses: number;
        presentClasses: number;
    };
}

export default function Dashboard({ student, courses, stats }: StudentDashboardProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Student Dashboard', href: '/student/dashboard' }]}>
            <Head title="Student Dashboard" />
            <div className="p-6 space-y-6">
                {/* Profile Header */}
                <div className="rounded-2xl border bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30">
                            <UserCircle size={60} className="text-white" />
                        </div>
                        <div className="text-center md:text-left space-y-1">
                            <h2 className="text-3xl font-extrabold tracking-tight">{student.user?.name || 'Student'}</h2>
                            <p className="text-lg font-medium text-emerald-100/90">Student ID: {student.student_id}</p>
                            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
                                    <GraduationCap size={16} />
                                    <span>{student.program?.name}</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
                                    <Calendar size={16} />
                                    <span>Level {student.current_level} • Semester {student.current_semester}</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
                                    <School size={16} />
                                    <span>Session: {student.session}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Enrolled Courses</p>
                                    <p className="text-3xl font-bold">{stats.enrolledCourses}</p>
                                </div>
                                <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <BookOpen size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pending Assignments</p>
                                    <p className="text-3xl font-bold">{stats.pendingAssignments}</p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <FileText size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                                    <p className="text-3xl font-bold">
                                        {stats.attendancePercentage !== null ? `${stats.attendancePercentage}%` : '--'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.presentClasses}/{stats.totalClasses} classes
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-violet-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">CLO Attainment</p>
                                    <p className="text-3xl font-bold">--</p>
                                </div>
                                <div className="p-3 rounded-full bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                                    <Award size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Courses Grid */}
                <div>
                    <h3 className="text-lg font-bold mb-4">My Courses</h3>
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course: any) => (
                                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline">{course.code}</Badge>
                                            <Badge>{course.credit_hours} Cr</Badge>
                                        </div>
                                        <CardTitle className="mt-2 line-clamp-2">{course.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                <span>{course.type_core_optional}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>Level {course.level}</span>
                                            </div>
                                        </div>
                                        <Link href={`/student/courses/${course.id}`}>
                                            <Button className="w-full">View Course</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="font-medium">No courses found for your current semester.</p>
                                <p className="text-sm mt-1">Courses will appear here once they are registered.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
