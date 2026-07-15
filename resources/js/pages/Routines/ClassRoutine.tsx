import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, Calendar, RefreshCw, Trash2, Wand2 } from 'lucide-react';
import React from 'react';

export default function ClassRoutine({
    programs,
    needsSetup,
    classroomCount,
    timeSlotCount,
    routines,
    assignedCourses,
    filters,
    activeFilters,
    classrooms,
    timeSlots,
}: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Class Routines', href: '/routines/class' },
    ];

    const { flash } = usePage().props as any;

    const { data, setData, get, post, processing } = useForm({
        program_id: filters.program_id || '',
        level: filters.level || '',
        semester: filters.semester || '',
        session: filters.session || new Date().getFullYear().toString(),
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('routines.class.index'), {
            preserveState: true,
        });
    };

    const handleGenerate = () => {
        router.post(route('routines.class.generate'), {
            program_id: data.program_id,
            level: data.level,
            semester: data.semester,
            session: data.session,
        });
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear this routine? This will delete all scheduled classes for this semester.')) {
            router.post(route('routines.class.clear'), {
                program_id: data.program_id,
                level: data.level,
                semester: data.semester,
                session: data.session,
            });
        }
    };

    // Standard days for class routines
    const weekDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

    // Find class item for specific slot and day
    const getRoutineItem = (day: string, slotId: number) => {
        return routines.find(
            (r: any) => r.time_slot?.day === day && r.time_slot_id === slotId
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Class Routines" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Class Routines</h1>
                        <p className="text-sm text-muted-foreground">Generate and view semester-wise class timetables automatically.</p>
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
                        <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-200">Routine Setup Required</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
                            timetables require classrooms and class time slots to be configured first. You currently have:
                        </p>
                        <div className="mt-4 flex justify-center gap-6 text-sm font-semibold">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                Classrooms: {classroomCount}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                Class Slots: {timeSlotCount}
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
                        <div className="rounded-2xl border bg-card p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Semester & Session</h3>
                            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5 items-end">
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

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-blue-600 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Load Timetable
                                </button>
                            </form>
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

                        {/* Routine Layout Grid */}
                        {activeFilters && (
                            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Weekly Schedule
                                        </h2>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Timetable Grid for Session {data.session}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleGenerate}
                                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                                        >
                                            <Wand2 size={16} />
                                            {routines.length > 0 ? 'Regenerate' : 'Generate Routine'}
                                        </button>
                                        {routines.length > 0 && (
                                            <button
                                                onClick={handleClear}
                                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-50 px-4 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                                Clear Routine
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {routines.length === 0 ? (
                                    <div className="rounded-xl border border-dashed p-12 text-center">
                                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground/30 animate-pulse" />
                                        <h4 className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">No Routine Generated</h4>
                                        <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                                            There are {assignedCourses.length} courses assigned for this semester. Click "Generate Routine" to automatically build the weekly schedule.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                                        <table className="w-full border-collapse text-left text-sm">
                                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                                <tr>
                                                    <th className="border-b p-4 font-bold w-40">Time Slot</th>
                                                    {weekDays.map((day) => (
                                                        <th key={day} className="border-b p-4 font-bold text-center">
                                                            {day}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {timeSlots.map((slot: any) => (
                                                    <tr key={slot.id} className="hover:bg-slate-50/50">
                                                        <td className="p-4 font-semibold border-r border-slate-100 dark:border-slate-800 bg-slate-50/30">
                                                            <div className="text-sm font-bold">{slot.start_time} - {slot.end_time}</div>
                                                        </td>
                                                        {weekDays.map((day) => {
                                                            const item = getRoutineItem(day, slot.id);
                                                            return (
                                                                <td key={day} className="p-3 border-r border-slate-100 dark:border-slate-800 text-center align-middle min-w-[150px]">
                                                                    {item ? (
                                                                        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50/80 p-3 text-left border border-blue-100/50 shadow-sm dark:from-slate-800 dark:to-slate-800/80 dark:border-slate-700">
                                                                            <div className="font-bold text-xs text-blue-700 dark:text-blue-400">
                                                                                {item.course?.code}
                                                                            </div>
                                                                            <div className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 truncate mt-0.5">
                                                                                {item.course?.name}
                                                                            </div>
                                                                            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                                                                                <span className="font-bold text-slate-700 dark:text-slate-300">
                                                                                    Room: {item.classroom?.room_number}
                                                                                </span>
                                                                                <span className="italic">
                                                                                    {item.teacher?.name.split(' ')[0]}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-slate-300 text-xs italic">-</span>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
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
