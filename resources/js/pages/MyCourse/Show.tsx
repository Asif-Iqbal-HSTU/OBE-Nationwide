import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    BookOpen,
    Layers,
    Target,
    FileText,
    Calendar,
    GraduationCap,
    FileQuestion,
    CheckCircle,
    AlertCircle,
    Users,
    ClipboardList,
    MessageCircleQuestion,
    ChevronRight
} from 'lucide-react';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

import ExamQuestionsTab from './Partials/ExamQuestionsTab';
import AssignmentsTab from './Partials/AssignmentsTab';
import AttendanceTab from './Partials/AttendanceTab';
import MarksTab from './Partials/MarksTab';
import StudentsTab from './Partials/StudentsTab';
import SupportTab from './Partials/SupportTab';
import CosTab from './Partials/CosTab';
import ClosTab from './Partials/ClosTab';
import ContentsTab from './Partials/ContentsTab';
import BooksTab from './Partials/BooksTab';
import LessonPlansTab from './Partials/LessonPlansTab';

type SheetType = 'assignments' | 'attendance' | 'marks' | 'students' | 'support' | null;

export default function Show({ course, program, plos, examQuestions, assignment, students }: any) {
    const [activeSheet, setActiveSheet] = useState<SheetType>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My Courses', href: '#' },
        { title: `${course?.code || ''} - ${course?.name || ''}`, href: '#' },
    ];

    if (!course) {
        return <div className="p-6 text-center">Loading course data...</div>;
    }

    // Calculate stats
    const assignmentCount = course.class_assignments?.length || 0;
    const attendanceCount = course.attendances?.length || 0;
    const marksCount = course.exam_marks?.length || 0;
    const studentCount = students?.length || 0;
    const pendingSupport = course.supports?.filter((s: any) => !s.answer)?.length || 0;

    const lmsActions = [
        {
            id: 'students' as SheetType,
            title: 'Students',
            description: 'Enrolled students',
            icon: Users,
            stat: studentCount,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
            iconColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            id: 'assignments' as SheetType,
            title: 'Assignments',
            description: 'Class assignments',
            icon: ClipboardList,
            stat: assignmentCount,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
            iconColor: 'text-purple-600 dark:text-purple-400'
        },
        {
            id: 'attendance' as SheetType,
            title: 'Attendance',
            description: 'Attendance records',
            icon: CheckCircle,
            stat: attendanceCount,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950/30',
            iconColor: 'text-green-600 dark:text-green-400'
        },
        {
            id: 'marks' as SheetType,
            title: 'Exam Marks',
            description: 'Recorded marks',
            icon: GraduationCap,
            stat: marksCount,
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50 dark:bg-amber-950/30',
            iconColor: 'text-amber-600 dark:text-amber-400'
        },
        {
            id: 'support' as SheetType,
            title: 'Support',
            description: 'Student queries',
            icon: MessageCircleQuestion,
            stat: pendingSupport,
            statLabel: 'Pending',
            color: 'from-rose-500 to-rose-600',
            bgColor: 'bg-rose-50 dark:bg-rose-950/30',
            iconColor: 'text-rose-600 dark:text-rose-400'
        },
    ];

    const renderSheetContent = () => {
        switch (activeSheet) {
            case 'assignments':
                return <AssignmentsTab course={course} />;
            case 'attendance':
                return <AttendanceTab course={course} students={students} />;
            case 'marks':
                return <MarksTab course={course} students={students} />;
            case 'students':
                return <StudentsTab students={students} />;
            case 'support':
                return <SupportTab course={course} />;
            default:
                return null;
        }
    };

    const getSheetTitle = () => {
        const action = lmsActions.find(a => a.id === activeSheet);
        return action?.title || '';
    };

    const getSheetDescription = () => {
        const action = lmsActions.find(a => a.id === activeSheet);
        return action?.description || '';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${course.code} - ${course.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Course Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{course.code} - {course.name}</h2>
                        <p className="text-muted-foreground">
                            {program.name} • {course.credit_hours} Credits • {course.type_theory_sessional}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline">Level {course.level}</Badge>
                            <Badge variant="outline">Semester {course.semester}</Badge>
                            <Badge variant="secondary">{course.type_core_optional}</Badge>
                        </div>
                    </div>
                </div>

                {/* LMS Quick Actions - Interactive Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {lmsActions.map((action) => (
                        <Card
                            key={action.id}
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${action.bgColor} border-0 group`}
                            onClick={() => setActiveSheet(action.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg bg-white/80 dark:bg-black/20 shadow-sm`}>
                                        <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold">{action.stat}</p>
                                    <p className="text-sm font-medium">{action.title}</p>
                                    <p className="text-xs text-muted-foreground">{action.statLabel || action.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Course Summary */}
                {course.summary && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Course Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{course.summary}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Academic Tabs - Streamlined */}
                <Tabs defaultValue="clos" className="w-full">
                    <TabsList className="mb-4 flex w-full flex-wrap items-center justify-start gap-2 h-auto bg-muted/50 p-1 rounded-lg">
                        <TabsTrigger value="cos" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                            <Layers className="mr-2 h-4 w-4" />
                            Course Objectives
                        </TabsTrigger>
                        <TabsTrigger value="clos" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                            <Target className="mr-2 h-4 w-4" />
                            Learning Outcomes
                        </TabsTrigger>
                        <TabsTrigger value="contents" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                            <FileText className="mr-2 h-4 w-4" />
                            Contents
                        </TabsTrigger>
                        <TabsTrigger value="books" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Books
                        </TabsTrigger>
                        <TabsTrigger value="lesson-plans" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                            <Calendar className="mr-2 h-4 w-4" />
                            Lesson Plans
                        </TabsTrigger>
                        <TabsTrigger value="exam-questions" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                            <FileQuestion className="mr-2 h-4 w-4" />
                            Exam Questions
                        </TabsTrigger>
                    </TabsList>

                    {/* Course Objectives Tab */}
                    <TabsContent value="cos" className="space-y-4">
                        <CosTab course={course} program={program} />
                    </TabsContent>

                    {/* CLOs Tab */}
                    <TabsContent value="clos" className="space-y-4">
                        <ClosTab course={course} program={program} plos={plos} />
                    </TabsContent>

                    {/* Contents Tab */}
                    <TabsContent value="contents" className="space-y-4">
                        <ContentsTab course={course} program={program} />
                    </TabsContent>

                    {/* Books Tab */}
                    <TabsContent value="books" className="space-y-4">
                        <BooksTab course={course} program={program} />
                    </TabsContent>

                    {/* Lesson Plans Tab */}
                    <TabsContent value="lesson-plans" className="space-y-4">
                        <LessonPlansTab course={course} program={program} />
                    </TabsContent>

                    {/* Exam Questions Tab */}
                    <TabsContent value="exam-questions" className="space-y-4">
                        <ExamQuestionsTab examQuestions={examQuestions} assignment={assignment} />
                    </TabsContent>
                </Tabs>

                {/* Side Sheet for LMS Actions */}
                <Sheet open={activeSheet !== null} onOpenChange={(open) => !open && setActiveSheet(null)}>
                    <SheetContent
                        side="right"
                        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto p-0"
                    >
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b">
                            <SheetHeader className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    {activeSheet && (
                                        <div className={`p-2.5 rounded-xl ${activeSheet === 'students' ? 'bg-blue-100 dark:bg-blue-900/50' :
                                                activeSheet === 'assignments' ? 'bg-purple-100 dark:bg-purple-900/50' :
                                                    activeSheet === 'attendance' ? 'bg-green-100 dark:bg-green-900/50' :
                                                        activeSheet === 'marks' ? 'bg-amber-100 dark:bg-amber-900/50' :
                                                            'bg-rose-100 dark:bg-rose-900/50'
                                            }`}>
                                            {activeSheet === 'students' && <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                                            {activeSheet === 'assignments' && <ClipboardList className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                                            {activeSheet === 'attendance' && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                                            {activeSheet === 'marks' && <GraduationCap className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                                            {activeSheet === 'support' && <MessageCircleQuestion className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
                                        </div>
                                    )}
                                    <div>
                                        <SheetTitle className="text-xl font-semibold">{getSheetTitle()}</SheetTitle>
                                        <SheetDescription className="text-sm">{getSheetDescription()}</SheetDescription>
                                    </div>
                                </div>
                            </SheetHeader>
                        </div>
                        <div className="px-6 py-6 min-h-[calc(100vh-120px)]">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-6">
                                {renderSheetContent()}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}
