import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    BookOpen,
    ChevronDown,
    ChevronUp,
    Layers,
    Pencil,
    Trash2,
    Target,
    FileText,
    Calendar,
    Plus,
    GraduationCap,
    FileQuestion,
    Eye,
    Send,
    Printer,
    CheckCircle,
    Clock,
    AlertCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import CoModal from '../Courses/CoModal';
import CloModal from '../Courses/CloModal';
import ContentModal from '../Courses/ContentModal';
import BookModal from '../Courses/BookModal';
import LessonPlanModal from '../Courses/LessonPlanModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Show({ course, program, plos, examQuestions, assignment }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My Courses', href: '#' },
        { title: `${course.code} - ${course.name}`, href: '#' },
    ];

    // Modal states
    const [coModal, setCoModal] = useState<any>({ isOpen: false, co: null });
    const [cloModal, setCloModal] = useState<any>({ isOpen: false, clo: null });
    const [contentModal, setContentModal] = useState<any>({ isOpen: false, content: null });
    const [bookModal, setBookModal] = useState<any>({ isOpen: false, book: null });
    const [lessonPlanModal, setLessonPlanModal] = useState<any>({ isOpen: false, lessonPlan: null });

    const { delete: destroy, processing } = useForm({});

    const handleDeleteCo = (coId: number) => {
        if (confirm('Are you sure you want to delete this Course Objective?')) {
            destroy(route('programs.courses.cos.destroy', [program.id, course.id, coId]));
        }
    };

    const handleDeleteClo = (cloId: number) => {
        if (confirm('Are you sure you want to delete this CLO?')) {
            destroy(route('programs.courses.clos.destroy', [program.id, course.id, cloId]));
        }
    };

    const handleDeleteContent = (contentId: number) => {
        if (confirm('Are you sure you want to delete this content?')) {
            destroy(route('programs.courses.contents.destroy', [program.id, course.id, contentId]));
        }
    };

    const handleDeleteBook = (bookId: number) => {
        if (confirm('Are you sure you want to delete this book?')) {
            destroy(route('programs.courses.books.destroy', [program.id, course.id, bookId]));
        }
    };

    const handleDeleteLessonPlan = (lessonPlanId: number) => {
        if (confirm('Are you sure you want to delete this lesson plan?')) {
            destroy(route('programs.courses.lesson-plans.destroy', [program.id, course.id, lessonPlanId]));
        }
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

                {/* Course Summary */}
                {course.summary && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Course Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{course.summary}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs for different sections */}
                <Tabs defaultValue="clos" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="cos">
                            <Layers className="mr-2 h-4 w-4" />
                            COs ({course.cos?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="clos">
                            <Target className="mr-2 h-4 w-4" />
                            CLOs ({course.clos?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="contents">
                            <FileText className="mr-2 h-4 w-4" />
                            Contents ({course.contents?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="books">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Books ({course.books?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="lesson-plans">
                            <Calendar className="mr-2 h-4 w-4" />
                            Lesson Plans ({course.lesson_plans?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="exam-questions">
                            <FileQuestion className="mr-2 h-4 w-4" />
                            Exam Questions ({examQuestions?.length || 0})
                        </TabsTrigger>
                    </TabsList>

                    {/* Course Objectives Tab */}
                    <TabsContent value="cos" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Course Objectives</h3>
                                <p className="text-sm text-muted-foreground">What students will achieve in this course</p>
                            </div>
                            <Button onClick={() => setCoModal({ isOpen: true, co: null })}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add CO
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            {course.cos?.map((co: any, index: number) => (
                                <Card key={co.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <span className="font-semibold text-blue-600">CO-{index + 1}:</span>
                                                <span className="ml-2">{co.co_desc}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => setCoModal({ isOpen: true, co })}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteCo(co.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {(!course.cos || course.cos.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No course objectives defined yet.
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* CLOs Tab */}
                    <TabsContent value="clos" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Course Learning Outcomes</h3>
                                <p className="text-sm text-muted-foreground">Measurable outcomes mapped to Program Learning Outcomes</p>
                            </div>
                            <Button onClick={() => setCloModal({ isOpen: true, clo: null })}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add CLO
                            </Button>
                        </div>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium">CLO</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Mapped PLOs</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {course.clos?.map((clo: any) => (
                                        <tr key={clo.id} className="border-t">
                                            <td className="px-4 py-3 font-medium text-blue-600">CLO-{clo.clo_no}</td>
                                            <td className="px-4 py-3">{clo.clo_desc}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {clo.plos?.map((plo: any) => (
                                                        <Badge key={plo.id} variant="outline" className="text-xs">
                                                            PLO-{plo.plo_no}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="sm" onClick={() => setCloModal({ isOpen: true, clo })}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteClo(clo.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!course.clos || course.clos.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No CLOs defined yet.
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Contents Tab */}
                    <TabsContent value="contents" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Course Contents</h3>
                                <p className="text-sm text-muted-foreground">Topics covered in this course</p>
                            </div>
                            <Button onClick={() => setContentModal({ isOpen: true, content: null })}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Content
                            </Button>
                        </div>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium w-16">No.</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Content</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Teaching Strategy</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Assessment Strategy</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Mapped CLOs</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {course.contents?.map((content: any) => (
                                        <tr key={content.id} className="border-t">
                                            <td className="px-4 py-3 font-medium text-blue-600">{content.content_no}</td>
                                            <td className="px-4 py-3">{content.content}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{content.teaching_strategy}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{content.assessment_strategy}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {content.clos?.map((clo: any) => (
                                                        <Badge key={clo.id} variant="outline" className="text-xs">
                                                            CLO-{clo.clo_no}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="sm" onClick={() => setContentModal({ isOpen: true, content })}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteContent(content.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!course.contents || course.contents.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No contents defined yet.
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Books Tab */}
                    <TabsContent value="books" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Reference Books</h3>
                                <p className="text-sm text-muted-foreground">Textbooks and reference materials</p>
                            </div>
                            <Button onClick={() => setBookModal({ isOpen: true, book: null })}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Book
                            </Button>
                        </div>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium w-16">No.</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Book Name</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {course.books?.map((book: any) => (
                                        <tr key={book.id} className="border-t">
                                            <td className="px-4 py-3 font-medium text-blue-600">{book.book_no}</td>
                                            <td className="px-4 py-3">{book.book_name}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="sm" onClick={() => setBookModal({ isOpen: true, book })}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteBook(book.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!course.books || course.books.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No books added yet.
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Lesson Plans Tab */}
                    <TabsContent value="lesson-plans" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Lesson Plans</h3>
                                <p className="text-sm text-muted-foreground">Weekly lesson schedule</p>
                            </div>
                            <Button onClick={() => setLessonPlanModal({ isOpen: true, lessonPlan: null })}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Lesson Plan
                            </Button>
                        </div>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Week</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Topics</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Outcomes</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Teaching Strategies</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Mapped CLOs</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {course.lesson_plans?.map((lp: any) => (
                                        <tr key={lp.id} className="border-t">
                                            <td className="px-4 py-3 font-medium text-blue-600">{lp.week}</td>
                                            <td className="px-4 py-3">{lp.topics}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{lp.outcomes}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{lp.teaching_strategies}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {lp.clos?.map((clo: any) => (
                                                        <Badge key={clo.id} variant="outline" className="text-xs">
                                                            CLO-{clo.clo_no}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button variant="ghost" size="sm" onClick={() => setLessonPlanModal({ isOpen: true, lessonPlan: lp })}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteLessonPlan(lp.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(!course.lesson_plans || course.lesson_plans.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No lesson plans defined yet.
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Exam Questions Tab */}
                    <TabsContent value="exam-questions" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Exam Questions</h3>
                                <p className="text-sm text-muted-foreground">Create and manage exam question papers for this course</p>
                            </div>
                            <Link href={`/my-courses/${assignment?.id}/exam-questions/create`}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Question Paper
                                </Button>
                            </Link>
                        </div>
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Session</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Semester</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Total Marks</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Committee</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examQuestions?.map((eq: any) => {
                                        const getStatusBadge = (status: string) => {
                                            switch (status) {
                                                case 'Draft':
                                                    return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Draft</Badge>;
                                                case 'Submitted':
                                                    return <Badge variant="outline" className="bg-blue-50"><Send className="mr-1 h-3 w-3" />Submitted</Badge>;
                                                case 'Approved':
                                                    return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
                                                case 'RevisionNeeded':
                                                    return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" />Revision Needed</Badge>;
                                                default:
                                                    return <Badge>{status}</Badge>;
                                            }
                                        };
                                        return (
                                            <tr key={eq.id} className="border-t">
                                                <td className="px-4 py-3 font-medium">{eq.session}</td>
                                                <td className="px-4 py-3">{eq.semester}</td>
                                                <td className="px-4 py-3">{eq.total_marks}</td>
                                                <td className="px-4 py-3">{getStatusBadge(eq.status)}</td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {eq.moderation_committee?.session || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        {(eq.status === 'Draft' || eq.status === 'RevisionNeeded') && (
                                                            <Link href={`/exam-questions/${eq.id}/edit`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        {eq.status === 'Approved' && (
                                                            <Link href={`/exam-questions/${eq.id}/print`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Printer className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                        <Link href={`/exam-questions/${eq.id}/print`}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        {(eq.status === 'Draft' || eq.status === 'RevisionNeeded') && eq.moderation_committee_id && (
                                                            <Link href={`/exam-questions/${eq.id}/submit`} method="post" as="button" preserveScroll>
                                                                <Button variant="ghost" size="sm" title="Submit for Moderation">
                                                                    <Send className="h-4 w-4 text-blue-600" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {(!examQuestions || examQuestions.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileQuestion className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No exam questions created yet.</p>
                                    <p className="text-sm">Click "Create Question Paper" to get started.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modals */}
            <CoModal
                isOpen={coModal.isOpen}
                onClose={() => setCoModal({ isOpen: false, co: null })}
                programId={program.id}
                courseId={course.id}
                co={coModal.co}
            />

            <CloModal
                isOpen={cloModal.isOpen}
                onClose={() => setCloModal({ isOpen: false, clo: null })}
                programId={program.id}
                courseId={course.id}
                clo={cloModal.clo}
                plos={plos}
            />

            <ContentModal
                isOpen={contentModal.isOpen}
                onClose={() => setContentModal({ isOpen: false, content: null })}
                programId={program.id}
                courseId={course.id}
                content={contentModal.content}
                clos={course.clos || []}
            />

            <BookModal
                isOpen={bookModal.isOpen}
                onClose={() => setBookModal({ isOpen: false, book: null })}
                programId={program.id}
                courseId={course.id}
                book={bookModal.book}
            />

            <LessonPlanModal
                isOpen={lessonPlanModal.isOpen}
                onClose={() => setLessonPlanModal({ isOpen: false, lessonPlan: null })}
                programId={program.id}
                courseId={course.id}
                lessonPlan={lessonPlanModal.lessonPlan}
                clos={course.clos || []}
            />
        </AppLayout>
    );
}
