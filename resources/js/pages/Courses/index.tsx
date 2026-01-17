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

export default function Index({ program, courses }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: '/programs' },
        { title: program.name, href: `/programs/${program.id}` },
        { title: 'Courses', href: `/programs/${program.id}/courses` },
    ];

    console.log('Course CLOs:', program.plos);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        name: '',
        code: '',
        credit_hours: '',
        level: '',
        semester: '',
        session: '',
        type_theory_sessional: 'Theory',
        type_core_optional: 'Core',
        prerequisite: '',
        summary: '',
    });

    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [coModal, setCoModal] = useState({ isOpen: false, course: null, co: null });
    const [cloModal, setCloModal] = useState({ isOpen: false, course: null, clo: null });
    const [contentModal, setContentModal] = useState({
        isOpen: false,
        course: null,
        content: null,
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.id) {
            put(`/programs/${program.id}/courses/${data.id}`, {
                onSuccess: () => reset(),
            });
        } else {
            post(`/programs/${program.id}/courses`, {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Courses - ${program.name}`} />
            <CoModal
                program={program}
                course={coModal.course}
                co={coModal.co}
                isOpen={coModal.isOpen}
                onClose={() =>
                    setCoModal({ isOpen: false, course: null, co: null })
                }
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
            <div className="p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Retouched Form Section */}
                    <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                            <Layers className="h-5 w-5 text-blue-600" />
                            {data.id ? 'Edit Course' : 'Add New Course'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                                        Course Code
                                    </label>
                                    <input
                                        className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                        placeholder="CSE 101"
                                    />
                                    {errors.code && (
                                        <p className="text-[10px] text-red-500">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                                        Credits
                                    </label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.credit_hours}
                                        onChange={(e) =>
                                            setData(
                                                'credit_hours',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="3.0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                    Course Name
                                </label>
                                <input
                                    className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Computer Fundamentals"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                                        Level
                                    </label>
                                    <input
                                        className="w-full rounded-lg border bg-background p-2"
                                        value={data.level}
                                        onChange={(e) =>
                                            setData('level', e.target.value)
                                        }
                                        placeholder="1"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                                        Semester
                                    </label>
                                    <input
                                        className="w-full rounded-lg border bg-background p-2"
                                        value={data.semester}
                                        onChange={(e) =>
                                            setData('semester', e.target.value)
                                        }
                                        placeholder="I"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">
                                        Session
                                    </label>
                                    <input
                                        className="w-full rounded-lg border bg-background p-2"
                                        value={data.session}
                                        onChange={(e) =>
                                            setData('session', e.target.value)
                                        }
                                        placeholder="2023-24"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                                        Type
                                    </label>
                                    <select
                                        className="w-full rounded-lg border bg-background p-2"
                                        value={data.type_theory_sessional}
                                        onChange={(e) =>
                                            setData(
                                                'type_theory_sessional',
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="Theory">Theory</option>
                                        <option value="Sessional">
                                            Sessional
                                        </option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                                        Category
                                    </label>
                                    <select
                                        className="w-full rounded-lg border bg-background p-2"
                                        value={data.type_core_optional}
                                        onChange={(e) =>
                                            setData(
                                                'type_core_optional',
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="Core">Core</option>
                                        <option value="Optional">
                                            Optional
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                    Prerequisite
                                </label>
                                <input
                                    className="w-full rounded-lg border bg-background p-2"
                                    value={data.prerequisite}
                                    onChange={(e) =>
                                        setData('prerequisite', e.target.value)
                                    }
                                    placeholder="None or Course Code"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                    Course Summary
                                </label>
                                <textarea
                                    className="min-h-[80px] w-full rounded-lg border bg-background p-2"
                                    value={data.summary}
                                    onChange={(e) =>
                                        setData('summary', e.target.value)
                                    }
                                    placeholder="Brief overview..."
                                />
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    disabled={processing}
                                    className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {data.id
                                        ? 'Update Course'
                                        : 'Create Course'}
                                </button>
                                {data.id && (
                                    <button
                                        type="button"
                                        onClick={() => reset()}
                                        className="w-full text-sm text-gray-500 hover:underline"
                                    >
                                        Cancel Editing
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List Section remains essentially same but with consistent spacing */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold">
                                Program Curriculum
                            </h2>
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                                {courses.length} Courses Total
                            </span>
                        </div>

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
                                        <button
                                            onClick={() => {
                                                setData({
                                                    id: course.id,
                                                    name: course.name,
                                                    code: course.code,
                                                    credit_hours:
                                                        course.credit_hours,
                                                    level: course.level,
                                                    semester: course.semester,
                                                    session: course.session,
                                                    type_theory_sessional:
                                                        course.type_theory_sessional,
                                                    type_core_optional:
                                                        course.type_core_optional,
                                                    prerequisite:
                                                        course.prerequisite ||
                                                        '',
                                                    summary:
                                                        course.summary || '',
                                                });
                                            }}
                                            className="rounded-full p-2 text-blue-600 hover:bg-blue-50"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        'Delete this course?',
                                                    )
                                                )
                                                    router.delete(
                                                        `/programs/${program.id}/courses/${course.id}`,
                                                    );
                                            }}
                                            className="rounded-full p-2 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {expandedId === course.id && (
                                    <div className="animate-in space-y-6 border-t border-dashed bg-slate-50 p-5 duration-300 fade-in">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                                    <ul className="space-y-2">
                                                        {course.cos.map(
                                                            (co: any) => (
                                                                <li
                                                                    key={co.id}
                                                                    className="flex items-start justify-between"
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
                                                    <ul className="space-y-2">
                                                        {course.clos.map(
                                                            (clo: any) => (
                                                                <li
                                                                    key={clo.id}
                                                                    className="group flex items-start justify-between"
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

                                                                        {/* PLO Badges Section */}
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
                                                                                        } // Shows full description on hover
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
                                                                                    to
                                                                                    PLO
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
                                                        No learning outcomes
                                                        defined.
                                                    </p>
                                                )}
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
        </AppLayout>
    );
}

