import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Award, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ExamMark {
    id: number;
    exam_type: string;
    marks: number;
    total_marks: number;
    course: { id: number; code: string; name: string };
}

interface AssignmentGrade {
    title: string;
    marks: number;
    total_marks: number;
    feedback: string | null;
}

interface CourseGrade {
    course: { id: number; code: string; name: string; credit_hours: number };
    exams: ExamMark[];
    assignments: AssignmentGrade[];
}

interface GradesProps {
    student: any;
    gradesByCourse: CourseGrade[];
}

export default function Grades({ student, gradesByCourse }: GradesProps) {
    const getGradeColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-blue-600';
        if (percentage >= 40) return 'text-amber-600';
        return 'text-red-600';
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return '[&>div]:bg-green-500';
        if (percentage >= 60) return '[&>div]:bg-blue-500';
        if (percentage >= 40) return '[&>div]:bg-amber-500';
        return '[&>div]:bg-red-500';
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/student/dashboard' },
            { title: 'Grades', href: '/student/grades' },
        ]}>
            <Head title="My Grades" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Grades</h1>
                </div>

                {/* Grades by Course */}
                <div className="space-y-6">
                    {gradesByCourse.map((courseData) => {
                        const hasData = courseData.exams.length > 0 || courseData.assignments.length > 0;

                        // Calculate course totals
                        const examTotal = courseData.exams.reduce((acc, e) => acc + e.marks, 0);
                        const examMaxTotal = courseData.exams.reduce((acc, e) => acc + e.total_marks, 0);
                        const assignmentTotal = courseData.assignments.reduce((acc, a) => acc + a.marks, 0);
                        const assignmentMaxTotal = courseData.assignments.reduce((acc, a) => acc + a.total_marks, 0);

                        const overallTotal = examTotal + assignmentTotal;
                        const overallMaxTotal = examMaxTotal + assignmentMaxTotal;
                        const overallPercentage = overallMaxTotal > 0 ? Math.round((overallTotal / overallMaxTotal) * 100) : null;

                        return (
                            <Card key={courseData.course.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Badge variant="outline" className="mb-2">{courseData.course.code}</Badge>
                                            <CardTitle>{courseData.course.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Credit Hours: {courseData.course.credit_hours}
                                            </p>
                                        </div>
                                        {overallPercentage !== null && (
                                            <div className="text-right">
                                                <p className={`text-3xl font-bold ${getGradeColor(overallPercentage)}`}>
                                                    {overallPercentage}%
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {overallTotal}/{overallMaxTotal} marks
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {overallPercentage !== null && (
                                        <Progress
                                            value={overallPercentage}
                                            className={`h-2 mt-4 ${getProgressColor(overallPercentage)}`}
                                        />
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {hasData ? (
                                        <div className="space-y-4">
                                            {/* Exam Marks */}
                                            {courseData.exams.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                                        <Award className="w-4 h-4" />
                                                        Examinations
                                                    </h4>
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <table className="w-full text-sm">
                                                            <thead className="bg-muted">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left">Exam Type</th>
                                                                    <th className="px-4 py-2 text-right">Marks</th>
                                                                    <th className="px-4 py-2 text-right">Percentage</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {courseData.exams.map((exam: any) => {
                                                                    const pct = Math.round((exam.marks / exam.total_marks) * 100);
                                                                    return (
                                                                        <tr key={exam.id} className="border-t">
                                                                            <td className="px-4 py-2">{exam.exam_type}</td>
                                                                            <td className="px-4 py-2 text-right">
                                                                                {exam.marks}/{exam.total_marks}
                                                                            </td>
                                                                            <td className={`px-4 py-2 text-right font-semibold ${getGradeColor(pct)}`}>
                                                                                {pct}%
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Assignment Grades */}
                                            {courseData.assignments.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        Assignments
                                                    </h4>
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <table className="w-full text-sm">
                                                            <thead className="bg-muted">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left">Assignment</th>
                                                                    <th className="px-4 py-2 text-right">Marks</th>
                                                                    <th className="px-4 py-2 text-right">Percentage</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {courseData.assignments.map((assignment: any, idx: number) => {
                                                                    const pct = Math.round((assignment.marks / assignment.total_marks) * 100);
                                                                    return (
                                                                        <tr key={idx} className="border-t">
                                                                            <td className="px-4 py-2">{assignment.title}</td>
                                                                            <td className="px-4 py-2 text-right">
                                                                                {assignment.marks}/{assignment.total_marks}
                                                                            </td>
                                                                            <td className={`px-4 py-2 text-right font-semibold ${getGradeColor(pct)}`}>
                                                                                {pct}%
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No grades recorded for this course yet.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Empty State */}
                {gradesByCourse.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="font-medium">No grades available yet.</p>
                            <p className="text-sm mt-1">Grades will appear here once your exams and assignments are graded.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
