import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, isPast, formatDistanceToNow } from 'date-fns';

interface Assignment {
    id: number;
    title: string;
    description: string;
    due_date: string;
    total_marks: number;
    course: { id: number; code: string; name: string };
    teacher: { name: string } | null;
    submission: {
        id: number;
        submitted_at: string;
        marks: number | null;
        feedback: string | null;
    } | null;
    is_overdue: boolean;
    is_submitted: boolean;
}

interface AssignmentsProps {
    student: any;
    assignments: Assignment[];
}

export default function Assignments({ student, assignments }: AssignmentsProps) {
    const pending = assignments.filter(a => !a.is_submitted && !a.is_overdue);
    const submitted = assignments.filter(a => a.is_submitted);
    const overdue = assignments.filter(a => a.is_overdue);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/student/dashboard' },
            { title: 'Assignments', href: '/student/assignments' },
        ]}>
            <Head title="Assignments" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Assignments</h1>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="gap-1">
                            <Clock className="w-3 h-3" />
                            {pending.length} Pending
                        </Badge>
                        <Badge variant="default" className="gap-1 bg-green-600">
                            <CheckCircle className="w-3 h-3" />
                            {submitted.length} Submitted
                        </Badge>
                        {overdue.length > 0 && (
                            <Badge variant="destructive" className="gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {overdue.length} Overdue
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Pending Assignments */}
                {pending.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500" />
                            Pending Assignments
                        </h2>
                        <div className="grid gap-4">
                            {pending.map((assignment) => (
                                <Card key={assignment.id} className="border-l-4 border-l-amber-500">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Badge variant="outline" className="mb-2">{assignment.course.code}</Badge>
                                                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                            </div>
                                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                Due {formatDistanceToNow(new Date(assignment.due_date), { addSuffix: true })}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{assignment.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-muted-foreground">
                                                <span className="font-medium">Total Marks:</span> {assignment.total_marks}
                                            </div>
                                            <Button size="sm" className="gap-2">
                                                <Upload className="w-4 h-4" />
                                                Submit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submitted Assignments */}
                {submitted.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Submitted Assignments
                        </h2>
                        <div className="grid gap-4">
                            {submitted.map((assignment) => (
                                <Card key={assignment.id} className="border-l-4 border-l-green-500">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Badge variant="outline" className="mb-2">{assignment.course.code}</Badge>
                                                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                            </div>
                                            <div className="text-right">
                                                {assignment.submission && assignment.submission.marks !== null ? (
                                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                        {assignment.submission.marks}/{assignment.total_marks}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Awaiting Grade</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-muted-foreground">
                                            <p>
                                                <span className="font-medium">Submitted:</span>{' '}
                                                {assignment.submission?.submitted_at
                                                    ? format(new Date(assignment.submission.submitted_at), 'PPp')
                                                    : 'N/A'}
                                            </p>
                                            {assignment.submission?.feedback && (
                                                <p className="mt-2 p-3 bg-muted rounded-lg">
                                                    <span className="font-medium">Feedback:</span> {assignment.submission.feedback}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Overdue Assignments */}
                {overdue.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            Overdue Assignments
                        </h2>
                        <div className="grid gap-4">
                            {overdue.map((assignment) => (
                                <Card key={assignment.id} className="border-l-4 border-l-red-500 opacity-75">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Badge variant="outline" className="mb-2">{assignment.course.code}</Badge>
                                                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                            </div>
                                            <Badge variant="destructive">
                                                Overdue
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">Was due:</span>{' '}
                                            {format(new Date(assignment.due_date), 'PPp')}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {assignments.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="font-medium">No assignments yet.</p>
                            <p className="text-sm mt-1">Assignments from your courses will appear here.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
