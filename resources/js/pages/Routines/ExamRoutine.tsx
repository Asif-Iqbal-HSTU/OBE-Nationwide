import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, Calendar, FileText, Trash2, Wand2 } from 'lucide-react';
import React from 'react';

export default function ExamRoutine({
    programs,
    needsSetup,
    classroomCount,
    timeSlotCount,
    routines,
    courses,
    filters,
    activeFilters,
    classrooms,
    timeSlots,
    teachers,
}: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Exam Routines', href: '/routines/exam' },
    ];

    const { flash } = usePage().props as any;

    // Set default start date to 10 days in future
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 10);
    const defaultDateString = defaultDate.toISOString().split('T')[0];

    const { data, setData, get, post, processing } = useForm({
        program_id: filters.program_id || '',
        level: filters.level || '',
        semester: filters.semester || '',
        session: filters.session || new Date().getFullYear().toString(),
        start_date: defaultDateString,
        gap_days: '2',
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('routines.exam.index'), {
            preserveState: true,
        });
    };

    const handleGenerate = () => {
        router.post(route('routines.exam.generate'), {
            program_id: data.program_id,
            level: data.level,
            semester: data.semester,
            session: data.session,
            start_date: data.start_date,
            gap_days: data.gap_days,
        });
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear this exam routine? This will delete all scheduled exams for this semester.')) {
            router.post(route('routines.exam.clear'), {
                program_id: data.program_id,
                level: data.level,
                semester: data.semester,
                session: data.session,
            });
        }
    };

    // Sort routines by date then start_time
    const sortedRoutines = [...routines].sort((a: any, b: any) => {
        const dateCompare = a.exam_date.localeCompare(b.exam_date);
        if (dateCompare !== 0) return dateCompare;
        return (a.time_slot?.start_time || '').localeCompare(b.time_slot?.start_time || '');
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exam Routines" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Exam Routines</h1>
                        <p className="text-sm text-muted-foreground">Automatically schedule dates, sessions, rooms, and proctors for course exams.</p>
                    </div>

                    <Link
                        href="/routines/setup"
                        className="inline-flex h-9 items-center justify-center rounded-lg border bg-background px-4 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Routine Setup
                    </Link>
                </div>

                {/* Setup Required Prompt */}
                {needsSetup ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-center dark:border-amber-900/50 dark:bg-amber-900/10">
                        <AlertCircle className="mx-auto h-12 w-12 text-amber-600 dark:text-amber-400" />
                        <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-200">Exam Setup Required</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
                            timetables require classrooms and dedicated exam time slots to be configured first. You currently have:
                        </p>
                        <div className="mt-4 flex justify-center gap-6 text-sm font-semibold">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                Classrooms: {classroomCount}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                Exam Slots: {timeSlotCount}
                            </span>
                        </div>
                        <div className="mt-6">
                            <Link
                                href="/routines/setup"
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-amber-600 px-6 text-sm font-bold text-white hover:bg-amber-700 transition-colors"
                            >
                                Configure Setup First
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Filters Card */}
                        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Semester, Session & Generator Options</h3>
                            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6 items-end">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Program</label>
                                    <select
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.program_id}
                                        onChange={(e) => setData('program_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Program</option>
                                        {programs.map((p: any) => (
                                            <option key={p.id} value={p.id}>
                                                {p.short_name || p.name} ({p.department?.short_name})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Level</label>
                                    <select
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.level}
                                        onChange={(e) => setData('level', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Level</option>
                                        <option value="Level 1">Level 1</option>
                                        <option value="Level 2">Level 2</option>
                                        <option value="Level 3">Level 3</option>
                                        <option value="Level 4">Level 4</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Semester</label>
                                    <select
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.semester}
                                        onChange={(e) => setData('semester', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Semester</option>
                                        <option value="Semester I">Semester I</option>
                                        <option value="Semester II">Semester II</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Session</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.session}
                                        onChange={(e) => setData('session', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-blue-600 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Load Exams
                                </button>
                            </form>

                            <div className="pt-2 border-t flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <span className="text-slate-500">Gap Between Exams:</span>
                                    <select
                                        className="rounded-md border bg-background px-2.5 py-1 text-xs outline-none"
                                        value={data.gap_days}
                                        onChange={(e) => setData('gap_days', e.target.value)}
                                    >
                                        <option value="0">0 Days (Consecutive)</option>
                                        <option value="1">1 Day Gap</option>
                                        <option value="2">2 Days Gap</option>
                                        <option value="3">3 Days Gap</option>
                                        <option value="4">4 Days Gap</option>
                                        <option value="5">5 Days Gap</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Flash Warnings / Warnings list */}
                        {flash?.warning && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/10 dark:text-amber-300">
                                <p className="font-semibold flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    Scheduling Note:
                                </p>
                                <p className="mt-1">{flash.warning}</p>
                            </div>
                        )}

                        {/* Routine Layout Table */}
                        {activeFilters && (
                            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">Exam Schedule</h2>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Term-end Timetable for Session {data.session}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleGenerate}
                                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                                        >
                                            <Wand2 size={16} />
                                            {routines.length > 0 ? 'Regenerate Schedule' : 'Generate Schedule'}
                                        </button>
                                        {routines.length > 0 && (
                                            <button
                                                onClick={handleClear}
                                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-50 px-4 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                                Clear Schedule
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {routines.length === 0 ? (
                                    <div className="rounded-xl border border-dashed p-12 text-center">
                                        <FileText className="mx-auto h-12 w-12 text-muted-foreground/30 animate-pulse" />
                                        <h4 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">No Exam Routine Generated</h4>
                                        <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                                            There are {courses.length} courses listed for this semester. Click "Generate Schedule" to automatically assign dates, exam slots, rooms, and proctors.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                                        <table className="w-full border-collapse text-left text-sm">
                                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                                <tr>
                                                    <th className="border-b p-4 font-bold">Exam Date</th>
                                                    <th className="border-b p-4 font-bold">Time Session</th>
                                                    <th className="border-b p-4 font-bold">Course Code & Title</th>
                                                    <th className="border-b p-4 font-bold text-center">Classroom</th>
                                                    <th className="border-b p-4 font-bold">Invigilator (Proctor)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {sortedRoutines.map((item: any) => {
                                                    const formattedDate = new Date(item.exam_date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    });
                                                    return (
                                                        <tr key={item.id} className="hover:bg-slate-50/50">
                                                            <td className="p-4 font-semibold text-slate-900 dark:text-white">
                                                                {formattedDate}
                                                            </td>
                                                            <td className="p-4 text-slate-700 dark:text-slate-300">
                                                                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold dark:bg-slate-800">
                                                                    {item.time_slot?.start_time} - {item.time_slot?.end_time}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="font-bold text-blue-700 dark:text-blue-400">
                                                                    {item.course?.code}
                                                                </div>
                                                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                                                    {item.course?.name}
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                                                    {item.classroom?.room_number}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                                                                {item.invigilator?.name}
                                                                <span className="block text-[10px] text-slate-400 dark:text-slate-500 italic mt-0.5">
                                                                    {item.invigilator?.designation} ({item.invigilator?.department?.short_name})
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
