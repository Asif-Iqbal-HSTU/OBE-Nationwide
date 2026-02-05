import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

interface AttendanceRecord {
    id: number;
    date: string;
    status: 'present' | 'absent' | 'late';
    course: { id: number; code: string; name: string };
}

interface CourseAttendance {
    course: { id: number; code: string; name: string };
    total: number;
    present: number;
    absent: number;
    late: number;
    percentage: number | null;
    records: AttendanceRecord[];
}

interface AttendanceProps {
    student: any;
    attendanceByCourse: CourseAttendance[];
}

export default function Attendance({ student, attendanceByCourse }: AttendanceProps) {
    const totalClasses = attendanceByCourse.reduce((acc, c) => acc + c.total, 0);
    const totalPresent = attendanceByCourse.reduce((acc, c) => acc + c.present, 0);
    const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'absent':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'late':
                return <Clock className="w-4 h-4 text-amber-500" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'present':
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Present</Badge>;
            case 'absent':
                return <Badge variant="destructive">Absent</Badge>;
            case 'late':
                return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Late</Badge>;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/student/dashboard' },
            { title: 'Attendance', href: '/student/attendance' },
        ]}>
            <Head title="Attendance" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Attendance</h1>
                    {overallPercentage !== null && (
                        <Badge
                            className={`text-lg px-4 py-1 ${overallPercentage >= 75
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : overallPercentage >= 60
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}
                        >
                            Overall: {overallPercentage}%
                        </Badge>
                    )}
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground">Total Classes</p>
                            <p className="text-3xl font-bold">{totalClasses}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground">Present</p>
                            <p className="text-3xl font-bold text-green-600">{totalPresent}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground">Absent</p>
                            <p className="text-3xl font-bold text-red-600">
                                {attendanceByCourse.reduce((acc, c) => acc + c.absent, 0)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground">Late</p>
                            <p className="text-3xl font-bold text-amber-600">
                                {attendanceByCourse.reduce((acc, c) => acc + c.late, 0)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Attendance by Course */}
                <div className="space-y-6">
                    {attendanceByCourse.map((courseData) => (
                        <Card key={courseData.course.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Badge variant="outline" className="mb-2">{courseData.course.code}</Badge>
                                        <CardTitle>{courseData.course.name}</CardTitle>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">
                                            {courseData.percentage !== null ? `${courseData.percentage}%` : '--'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {courseData.present}/{courseData.total} classes
                                        </p>
                                    </div>
                                </div>
                                {courseData.percentage !== null && (
                                    <Progress
                                        value={courseData.percentage}
                                        className={`h-2 mt-4 ${courseData.percentage >= 75 ? '[&>div]:bg-green-500' :
                                                courseData.percentage >= 60 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'
                                            }`}
                                    />
                                )}
                            </CardHeader>
                            {courseData.records.length > 0 && (
                                <CardContent>
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Date</th>
                                                    <th className="px-4 py-2 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {courseData.records.slice(0, 5).map((record: any) => (
                                                    <tr key={record.id} className="border-t">
                                                        <td className="px-4 py-2 flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                                            {format(new Date(record.date), 'PPP')}
                                                        </td>
                                                        <td className="px-4 py-2 text-right">
                                                            {getStatusBadge(record.status)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {courseData.records.length > 5 && (
                                            <div className="px-4 py-2 text-center text-sm text-muted-foreground bg-muted/50">
                                                And {courseData.records.length - 5} more records...
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {attendanceByCourse.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="font-medium">No attendance records yet.</p>
                            <p className="text-sm mt-1">Attendance will be recorded by your teachers.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
