import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, ArrowRight, Target, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Courses', href: '/my-courses' },
];

export default function Index({ courses }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Courses" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">My Assigned Courses</h2>
                    <p className="text-muted-foreground">
                        Manage your assigned courses - CLOs, Contents, Books, and Lesson Plans
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses?.map((assignment: any) => {
                        const course = assignment.course;
                        return (
                            <Card key={assignment.id} className="group hover:shadow-lg transition-all hover:border-blue-300">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">
                                                <span className="text-blue-600">{course.code}</span>
                                            </CardTitle>
                                            <CardDescription className="text-base font-medium text-foreground">
                                                {course.name}
                                            </CardDescription>
                                        </div>
                                        <div className="rounded-full bg-blue-100 p-2 text-blue-600 group-hover:bg-blue-200">
                                            <BookOpen size={20} />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">{course.credit_hours} Credits</Badge>
                                        <Badge variant="secondary">{course.type_theory_sessional}</Badge>
                                        <Badge variant="outline">Sem {course.semester}</Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Target className="h-4 w-4" />
                                            <span>{course.clos_count || 0} CLOs</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FileText className="h-4 w-4" />
                                            <span>{course.contents_count || 0} Contents</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="h-4 w-4" />
                                            <span>{course.books_count || 0} Books</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{course.lesson_plans_count || 0} Plans</span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Link href={`/my-courses/${assignment.id}`}>
                                            <Button className="w-full group-hover:bg-blue-600">
                                                Manage Course
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {(!courses || courses.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="rounded-full bg-muted p-6 mb-4">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No Courses Assigned</h3>
                        <p className="text-muted-foreground max-w-md">
                            You don't have any courses assigned to you yet. Please contact your department chairman for course assignments.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
