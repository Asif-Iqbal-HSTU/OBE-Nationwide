import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    BookOpen,
    ChevronDown,
    ChevronUp,
    Layers,
    Pencil,
    Trash2,
    ClipboardList,
} from 'lucide-react';
import React, { useState } from 'react';
import CoModal from './CoModal';
import CloModal from './CloModal';
import ContentModal from './ContentModal';
import BookModal from './BookModal';
import LessonPlanModal from './LessonPlanModal';
import CourseModal from './CourseModal';
import AssignmentModal from './AssignmentModal';
import { Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index({ program, courses, auth_teacher_id, is_admin, is_chairman }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: '/programs' },
        { title: program.name, href: `/programs/${program.id}` },
        { title: 'Courses', href: `/programs/${program.id}/courses` },
    ];

    console.log('Course CLOs:', program.plos);

    const [courseModal, setCourseModal] = useState({
        isOpen: false,
        course: null,
    });

    const [assignmentModal, setAssignmentModal] = useState({
        isOpen: false,
        course: null,
    });

    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [coModal, setCoModal] = useState<any>({ isOpen: false, course: null, co: null });
    const [cloModal, setCloModal] = useState<any>({ isOpen: false, course: null, clo: null });
    const [contentModal, setContentModal] = useState<any>({
        isOpen: false,
        course: null,
        content: null,
    });
    const [bookModal, setBookModal] = useState<any>({
        isOpen: false,
        course: null,
        book: null,
    });
    const [lessonPlanModal, setLessonPlanModal] = useState<any>({
        isOpen: false,
        course: null,
        lessonPlan: null,
    });


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Courses - ${program.name}`} />
            <CoModal
                program={program}
                course={coModal.course}
                co={coModal.co}
                isOpen={coModal.isOpen}
                onClose={() => setCoModal({ isOpen: false, course: null, co: null })}
            />
            <CourseModal
                program={program}
                course={courseModal.course}
                isOpen={courseModal.isOpen}
                onClose={() => setCourseModal({ isOpen: false, course: null })}
            />
            <CloModal
                program={program}
                course={cloModal.course}
                clo={cloModal.clo}
                plos={program.plos} // Add this line
                isOpen={cloModal.isOpen}
                onClose={() =>
                    setCloModal({ isOpen: false, course: null, clo: null })
                }
            />
            <ContentModal
                program={program}
                course={contentModal.course}
                clos={contentModal.course?.clos}
                content={contentModal.content}
                isOpen={contentModal.isOpen}
                onClose={() =>
                    setContentModal({
                        isOpen: false,
                        course: null,
                        content: null,
                    })
                }
            />
            <BookModal
                program={program}
                course={bookModal.course}
                book={bookModal.book}
                isOpen={bookModal.isOpen}
                onClose={() =>
                    setBookModal({
                        isOpen: false,
                        course: null,
                        book: null,
                    })
                }
            />
            <LessonPlanModal
                program={program}
                course={lessonPlanModal.course}
                clos={lessonPlanModal.course?.clos}
                lessonPlan={lessonPlanModal.lessonPlan}
                isOpen={lessonPlanModal.isOpen}
                onClose={() =>
                    setLessonPlanModal({
                        isOpen: false,
                        course: null,
                        lessonPlan: null,
                    })
                }
            />
            <AssignmentModal
                program={program}
                course={assignmentModal.course}
                isOpen={assignmentModal.isOpen}
                onClose={() => setAssignmentModal({ isOpen: false, course: null })}
            />
            <div className="p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Program Curriculum
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Manage courses, objectives, and lesson plans
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="hidden rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 sm:inline-block">
                                    {courses.length} Courses Total
                                </span>
                                {(is_admin || is_chairman) && (
                                    <Button
                                        onClick={() =>
                                            setCourseModal({
                                                isOpen: true,
                                                course: null,
                                            })
                                        }
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus size={16} />
                                        Add New Course
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">


                            {courses.map((course: any) => (
                                <div
                                    key={course.id}
                                    className="overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-12 items-center justify-center rounded border bg-slate-100 text-xs font-bold text-slate-700">
                                                {course.code}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {course.name}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    L-{course.level} S-
                                                    {course.semester} |{' '}
                                                    {course.credit_hours} Cr |{' '}
                                                    {course.type_theory_sessional}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    setExpandedId(
                                                        expandedId === course.id
                                                            ? null
                                                            : course.id,
                                                    )
                                                }
                                                className="rounded-full p-2 transition-colors hover:bg-slate-100"
                                            >
                                                {expandedId === course.id ? (
                                                    <ChevronUp size={18} />
                                                ) : (
                                                    <ChevronDown size={18} />
                                                )}
                                            </button>

                                            {is_chairman && (
                                                <button
                                                    onClick={() => setAssignmentModal({ isOpen: true, course })}
                                                    className="rounded-full p-2 text-emerald-600 hover:bg-emerald-50"
                                                    title="Assign Teacher"
                                                >
                                                    <UserPlus size={18} />
                                                </button>
                                            )}

                                            {(is_admin || is_chairman || course.assignments?.some((a: any) => a.teacher_id === auth_teacher_id)) && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setCourseModal({
                                                                isOpen: true,
                                                                course: course,
                                                            });
                                                        }}
                                                        className="rounded-full p-2 text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    {(is_admin || is_chairman) && (
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Delete this course?'))
                                                                    router.delete(`/programs/${program.id}/courses/${course.id}`);
                                                            }}
                                                            className="rounded-full p-2 text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {course.assignments?.length > 0 && (
                                        <div className="bg-slate-50 px-4 py-1.5 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                                <span className="font-bold uppercase text-slate-400">Assigned To:</span>
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                                    {course.teachers?.[0]?.name || 'Unknown Teacher'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 italic">
                                                {course.assignments[0].session} | {course.assignments[0].semester}
                                            </span>
                                        </div>
                                    )}

                                    {expandedId === course.id && (
                                        <div className="animate-in space-y-6 border-t border-dashed bg-slate-50 p-5 duration-300 fade-in">
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between border-b pb-1">
                                                        <h4 className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                                            <BookOpen size={14} />{' '}
                                                            Objectives (CO)
                                                        </h4>
                                                        <button
                                                            onClick={() =>
                                                                setCoModal({
                                                                    isOpen: true,
                                                                    course: course,
                                                                    co: null,
                                                                })
                                                            }
                                                            className="text-[10px] font-bold text-blue-600 hover:underline"
                                                        >
                                                            ADD NEW
                                                        </button>
                                                    </div>
                                                    {course.cos.length > 0 ? (
                                                        <ul className="space-y-3">
                                                            {course.cos.map(
                                                                (co: any) => (
                                                                    <li
                                                                        key={co.id}
                                                                        className="flex items-start justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                                                                    >
                                                                        <span className="text-sm text-slate-700">
                                                                            {
                                                                                co.co_no
                                                                            }
                                                                            .{' '}
                                                                            {
                                                                                co.co_desc
                                                                            }
                                                                        </span>
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                onClick={() =>
                                                                                    setCoModal(
                                                                                        {
                                                                                            isOpen: true,
                                                                                            course: course,
                                                                                            co: co,
                                                                                        },
                                                                                    )
                                                                                }
                                                                                className="text-blue-600"
                                                                            >
                                                                                <Pencil
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    if (
                                                                                        confirm(
                                                                                            'Delete this CO?',
                                                                                        )
                                                                                    )
                                                                                        router.delete(
                                                                                            `/programs/${program.id}/courses/${course.id}/cos/${co.id}`,
                                                                                        );
                                                                                }}
                                                                                className="text-red-600"
                                                                            >
                                                                                <Trash2
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-slate-400 italic">
                                                            No objectives defined
                                                            for this course.
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between border-b pb-1">
                                                        <h4 className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                                            <Layers size={14} />{' '}
                                                            Outcomes (CLO)
                                                        </h4>
                                                        <button
                                                            onClick={() =>
                                                                setCloModal({
                                                                    isOpen: true,
                                                                    course: course,
                                                                    clo: null,
                                                                })
                                                            }
                                                            className="text-[10px] font-bold text-blue-600 hover:underline"
                                                        >
                                                            ADD NEW
                                                        </button>
                                                    </div>
                                                    {course.clos.length > 0 ? (
                                                        <ul className="space-y-3">
                                                            {course.clos.map(
                                                                (clo: any) => (
                                                                    <li
                                                                        key={clo.id}
                                                                        className="group flex items-start justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                                                                    >
                                                                        <div className="flex flex-col gap-1.5">
                                                                            <span className="text-sm leading-tight text-slate-700">
                                                                                <span className="font-bold text-blue-600">
                                                                                    {
                                                                                        clo.clo_no
                                                                                    }
                                                                                    .
                                                                                </span>{' '}
                                                                                {
                                                                                    clo.clo_desc
                                                                                }
                                                                            </span>

                                                                            <div className="flex flex-wrap gap-1">
                                                                                {clo.plos?.map(
                                                                                    (
                                                                                        plo: any,
                                                                                    ) => (
                                                                                        <span
                                                                                            key={
                                                                                                plo.id
                                                                                            }
                                                                                            title={
                                                                                                plo.plo_desc
                                                                                            }
                                                                                            className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 uppercase"
                                                                                        >
                                                                                            PLO{' '}
                                                                                            {
                                                                                                plo.plo_no
                                                                                            }
                                                                                        </span>
                                                                                    ),
                                                                                )}
                                                                                {(!clo.plos ||
                                                                                    clo
                                                                                        .plos
                                                                                        .length ===
                                                                                    0) && (
                                                                                        <span className="text-[9px] text-slate-400 italic">
                                                                                            Not
                                                                                            mapped
                                                                                        </span>
                                                                                    )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                                            <button
                                                                                onClick={() =>
                                                                                    setCloModal(
                                                                                        {
                                                                                            isOpen: true,
                                                                                            course: course,
                                                                                            clo: clo,
                                                                                        },
                                                                                    )
                                                                                }
                                                                                className="rounded p-1 text-blue-600 hover:bg-blue-50"
                                                                            >
                                                                                <Pencil
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    if (
                                                                                        confirm(
                                                                                            'Delete this CLO?',
                                                                                        )
                                                                                    )
                                                                                        router.delete(
                                                                                            `/programs/${program.id}/courses/${course.id}/clos/${clo.id}`,
                                                                                        );
                                                                                }}
                                                                                className="rounded p-1 text-red-600 hover:bg-red-50"
                                                                            >
                                                                                <Trash2
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-slate-400 italic">
                                                            No outcomes defined.
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Reference Books Column */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between border-b pb-1">
                                                        <h4 className="flex items-center gap-1 text-xs font-bold text-slate-500 tracking-wider uppercase">
                                                            <BookOpen size={14} />{' '}
                                                            Books
                                                        </h4>
                                                        <button
                                                            onClick={() =>
                                                                setBookModal({
                                                                    isOpen: true,
                                                                    course: course,
                                                                    book: null,
                                                                })
                                                            }
                                                            className="text-[10px] font-bold text-blue-600 hover:underline"
                                                        >
                                                            ADD NEW
                                                        </button>
                                                    </div>

                                                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                                                        <table className="w-full text-left text-xs">
                                                            <tbody className="divide-y divide-slate-100">
                                                                {course.books?.length > 0 ? (
                                                                    course.books.map(
                                                                        (book: any) => (
                                                                            <tr
                                                                                key={book.id}
                                                                                className="hover:bg-slate-50"
                                                                            >
                                                                                <td className="px-2 py-2 text-slate-700">
                                                                                    <span className="font-bold text-slate-500 mr-2">{book.book_no}.</span>
                                                                                    {book.book_name}
                                                                                </td>
                                                                                <td className="px-2 py-2 text-right">
                                                                                    <div className="flex justify-end gap-1">
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                setBookModal({
                                                                                                    isOpen: true,
                                                                                                    course: course,
                                                                                                    book: book,
                                                                                                })
                                                                                            }
                                                                                            className="text-blue-600"
                                                                                        >
                                                                                            <Pencil size={12} />
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                if (confirm('Delete?'))
                                                                                                    router.delete(
                                                                                                        `/programs/${program.id}/courses/${course.id}/books/${book.id}`
                                                                                                    );
                                                                                            }}
                                                                                            className="text-red-600"
                                                                                        >
                                                                                            <Trash2 size={12} />
                                                                                        </button>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    )
                                                                ) : (
                                                                    <tr>
                                                                        <td
                                                                            className="px-2 py-3 text-center text-[10px] text-slate-400 italic"
                                                                        >
                                                                            No books added.
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Weekly Lesson Plan Section */}
                                            <div className="space-y-3 border-t border-slate-200 pt-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="flex items-center gap-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                        <ClipboardList size={14} />{' '}
                                                        Weekly Lesson Plan
                                                    </h4>
                                                    <button
                                                        onClick={() =>
                                                            setLessonPlanModal({
                                                                isOpen: true,
                                                                course: course,
                                                                lessonPlan: null,
                                                            })
                                                        }
                                                        className="text-[10px] font-bold text-blue-600 hover:underline"
                                                    >
                                                        ADD PLAN
                                                    </button>
                                                </div>

                                                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                                                    <table className="w-full text-left text-sm min-w-[1000px]">
                                                        <thead className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                                                            <tr>
                                                                <th className="px-3 py-2">Week</th>
                                                                <th className="px-3 py-2">Topics</th>
                                                                <th className="px-3 py-2">Outcomes (KSA)</th>
                                                                <th className="px-3 py-2">Strategies</th>
                                                                <th className="px-3 py-2">Aids/Materials</th>
                                                                <th className="px-3 py-2">Assessment</th>
                                                                <th className="px-3 py-2">CLO</th>
                                                                <th className="w-16 px-3 py-2 text-right">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 text-[13px]">
                                                            {course.lesson_plans?.length > 0 ? (
                                                                course.lesson_plans.map((lp: any) => (
                                                                    <tr key={lp.id} className="hover:bg-slate-50">
                                                                        <td className="px-3 py-2 font-medium text-slate-700">{lp.week}</td>
                                                                        <td className="px-3 py-2 text-slate-600">{lp.topics}</td>
                                                                        <td className="px-3 py-2 text-slate-600 whitespace-pre-wrap">{lp.outcomes}</td>
                                                                        <td className="px-3 py-2 text-slate-600 whitespace-pre-wrap">{lp.teaching_strategies}</td>
                                                                        <td className="px-3 py-2 text-slate-600 whitespace-pre-wrap">{lp.teaching_aids}</td>
                                                                        <td className="px-3 py-2 text-slate-600">{lp.assessment_technique}</td>
                                                                        <td className="px-3 py-2">
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {lp.clos?.map((clo: any) => (
                                                                                    <span key={clo.id} className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                                                                                        CLO {clo.clo_no}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-3 py-2 text-right">
                                                                            <div className="flex justify-end gap-2">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        setLessonPlanModal({
                                                                                            isOpen: true,
                                                                                            course: course,
                                                                                            lessonPlan: lp,
                                                                                        })
                                                                                    }
                                                                                    className="text-blue-600 hover:text-blue-800"
                                                                                >
                                                                                    <Pencil size={14} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        if (confirm('Delete this lesson plan?'))
                                                                                            router.delete(
                                                                                                `/programs/${program.id}/courses/${course.id}/lesson-plans/${lp.id}`
                                                                                            );
                                                                                    }}
                                                                                    className="text-red-600 hover:text-red-800"
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={8} className="px-3 py-4 text-center text-xs text-slate-400 italic">
                                                                        No weekly lesson plans added.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="space-y-3 border-t border-slate-200 pt-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="flex items-center gap-1 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                        <ClipboardList size={14} />{' '}
                                                        Course Contents & Strategies
                                                    </h4>
                                                    <button
                                                        onClick={() =>
                                                            setContentModal({
                                                                isOpen: true,
                                                                course: course,
                                                                content: null,
                                                            })
                                                        }
                                                        className="text-[10px] font-bold text-blue-600 hover:underline"
                                                    >
                                                        ADD CONTENT
                                                    </button>
                                                </div>

                                                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                                    <table className="w-full text-left text-sm">
                                                        <thead className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                                                            <tr>
                                                                <th className="w-12 px-3 py-2 text-center">
                                                                    No.
                                                                </th>
                                                                <th className="px-3 py-2">
                                                                    Content / Topics
                                                                </th>
                                                                <th className="w-24 px-3 py-2">
                                                                    CLO
                                                                </th>
                                                                <th className="px-3 py-2">
                                                                    Teaching
                                                                    Strategy
                                                                </th>
                                                                <th className="px-3 py-2">
                                                                    Assessment
                                                                </th>
                                                                <th className="w-16 px-3 py-2 text-right">
                                                                    Action
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {course.contents
                                                                ?.length > 0 ? (
                                                                course.contents.map(
                                                                    (
                                                                        content: any,
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                content.id
                                                                            }
                                                                            className="hover:bg-slate-50"
                                                                        >
                                                                            <td className="px-3 py-2 text-center font-medium text-slate-500">
                                                                                {
                                                                                    content.content_no
                                                                                }
                                                                            </td>
                                                                            <td className="px-3 py-2 whitespace-pre-wrap text-slate-700">
                                                                                {
                                                                                    content.content
                                                                                }
                                                                            </td>
                                                                            <td className="px-3 py-2">
                                                                                <div className="flex flex-wrap gap-1">
                                                                                    {content.clos?.map(
                                                                                        (
                                                                                            clo: any,
                                                                                        ) => (
                                                                                            <span
                                                                                                key={
                                                                                                    clo.id
                                                                                                }
                                                                                                className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700"
                                                                                            >
                                                                                                CLO
                                                                                                {
                                                                                                    clo.clo_no
                                                                                                }
                                                                                            </span>
                                                                                        ),
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-3 py-2 text-xs text-slate-600 italic">
                                                                                {
                                                                                    content.teaching_strategy
                                                                                }
                                                                            </td>
                                                                            <td className="px-3 py-2 text-xs text-slate-600 italic">
                                                                                {
                                                                                    content.assessment_strategy
                                                                                }
                                                                            </td>
                                                                            <td className="px-3 py-2 text-right">
                                                                                <div className="flex justify-end gap-2">
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            setContentModal(
                                                                                                {
                                                                                                    isOpen: true,
                                                                                                    course: course,
                                                                                                    content:
                                                                                                        content,
                                                                                                },
                                                                                            )
                                                                                        }
                                                                                        className="text-blue-600 hover:text-blue-800"
                                                                                    >
                                                                                        <Pencil
                                                                                            size={
                                                                                                14
                                                                                            }
                                                                                        />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                confirm(
                                                                                                    'Delete this content?',
                                                                                                )
                                                                                            )
                                                                                                router.delete(
                                                                                                    `/programs/${program.id}/courses/${course.id}/contents/${content.id}`,
                                                                                                );
                                                                                        }}
                                                                                        className="text-red-600 hover:text-red-800"
                                                                                    >
                                                                                        <Trash2
                                                                                            size={
                                                                                                14
                                                                                            }
                                                                                        />
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <tr>
                                                                    <td
                                                                        colSpan={6}
                                                                        className="px-3 py-4 text-center text-xs text-slate-400 italic"
                                                                    >
                                                                        No course
                                                                        contents
                                                                        mapped yet.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

