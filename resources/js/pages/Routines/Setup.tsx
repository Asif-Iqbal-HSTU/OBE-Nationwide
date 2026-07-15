import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Building2, Calendar, Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

export default function Setup({ classrooms, timeSlots }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Routine Setup', href: '/routines/setup' },
    ];

    const [activeTab, setActiveTab] = useState<'classrooms' | 'timeSlots'>('classrooms');

    // Classroom Form
    const classroomForm = useForm({
        id: null as number | null,
        room_number: '',
        capacity: '',
        type: 'theory', // theory, lab
    });

    // Time Slot Form
    const timeSlotForm = useForm({
        id: null as number | null,
        day: 'Sunday',
        start_time: '',
        end_time: '',
        type: 'class', // class, exam
    });

    const isClassroomEditing = classroomForm.data.id !== null;
    const isTimeSlotEditing = timeSlotForm.data.id !== null;

    const handleClassroomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isClassroomEditing) {
            classroomForm.put(route('routines.setup.updateClassroom', classroomForm.data.id as number), {
                onSuccess: () => classroomForm.reset(),
            });
        } else {
            classroomForm.post(route('routines.setup.storeClassroom'), {
                onSuccess: () => classroomForm.reset(),
            });
        }
    };

    const handleTimeSlotSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isTimeSlotEditing) {
            timeSlotForm.put(route('routines.setup.updateTimeSlot', timeSlotForm.data.id as number), {
                onSuccess: () => timeSlotForm.reset(),
            });
        } else {
            timeSlotForm.post(route('routines.setup.storeTimeSlot'), {
                onSuccess: () => timeSlotForm.reset(),
            });
        }
    };

    const handleClassroomEdit = (room: any) => {
        classroomForm.setData({
            id: room.id,
            room_number: room.room_number,
            capacity: room.capacity.toString(),
            type: room.type,
        });
    };

    const handleTimeSlotEdit = (slot: any) => {
        timeSlotForm.setData({
            id: slot.id,
            day: slot.day,
            start_time: slot.start_time,
            end_time: slot.end_time,
            type: slot.type,
        });
    };

    const handleClassroomDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this classroom?')) {
            router.delete(route('routines.setup.destroyClassroom', id), {
                onSuccess: () => {
                    if (classroomForm.data.id === id) classroomForm.reset();
                },
            });
        }
    };

    const handleTimeSlotDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this time slot?')) {
            router.delete(route('routines.setup.destroyTimeSlot', id), {
                onSuccess: () => {
                    if (timeSlotForm.data.id === id) timeSlotForm.reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Routine Setup" />

            <div className="p-6">
                {/* Header Section */}
                <div className="mb-6 flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Routine Configuration</h1>
                        <p className="text-sm text-muted-foreground">Manage classrooms and time slots required for routine generation.</p>
                    </div>

                    {/* Tab Toggles */}
                    <div className="flex rounded-lg border bg-muted p-1">
                        <button
                            onClick={() => setActiveTab('classrooms')}
                            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                                activeTab === 'classrooms'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Building2 size={16} />
                            Classrooms ({classrooms.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('timeSlots')}
                            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
                                activeTab === 'timeSlots'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Clock size={16} />
                            Time Slots ({timeSlots.length})
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                {activeTab === 'classrooms' ? (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Classroom Form */}
                        <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
                            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                {isClassroomEditing ? 'Edit Classroom' : 'Add Classroom'}
                            </h2>

                            <form onSubmit={handleClassroomSubmit} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Room Number
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={classroomForm.data.room_number}
                                        onChange={(e) => classroomForm.setData('room_number', e.target.value)}
                                        placeholder="e.g. Room 402, CSE Lab 1"
                                    />
                                    {classroomForm.errors.room_number && (
                                        <p className="text-[10px] text-red-500">{classroomForm.errors.room_number}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Seating Capacity
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={classroomForm.data.capacity}
                                        onChange={(e) => classroomForm.setData('capacity', e.target.value)}
                                        placeholder="e.g. 60"
                                    />
                                    {classroomForm.errors.capacity && (
                                        <p className="text-[10px] text-red-500">{classroomForm.errors.capacity}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Classroom Type
                                    </label>
                                    <select
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={classroomForm.data.type}
                                        onChange={(e) => classroomForm.setData('type', e.target.value)}
                                    >
                                        <option value="theory">Theory (General Lecture Room)</option>
                                        <option value="lab">Lab (Practical / Sessional Room)</option>
                                    </select>
                                    {classroomForm.errors.type && (
                                        <p className="text-[10px] text-red-500">{classroomForm.errors.type}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={classroomForm.processing}
                                        className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isClassroomEditing ? 'Update Classroom' : 'Create Classroom'}
                                    </button>
                                    {isClassroomEditing && (
                                        <button
                                            type="button"
                                            onClick={() => classroomForm.reset()}
                                            className="w-full text-sm text-muted-foreground hover:underline"
                                        >
                                            Cancel Editing
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Classrooms List */}
                        <div className="space-y-4 lg:col-span-2">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-xl font-bold">Classroom Directory</h2>
                            </div>

                            {classrooms.length === 0 ? (
                                <div className="rounded-xl border bg-card p-8 text-center">
                                    <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                    <p className="mt-4 text-muted-foreground">No classrooms configured yet. Add your first room.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {classrooms.map((room: any) => (
                                        <div
                                            key={room.id}
                                            className="group relative rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                                                        {room.room_number}
                                                    </h3>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                            Cap: {room.capacity} seats
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                                                room.type === 'theory'
                                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                                            }`}
                                                        >
                                                            {room.type === 'theory' ? 'Theory Room' : 'Lab / Practical'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleClassroomEdit(room)}
                                                        className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleClassroomDelete(room.id)}
                                                        className="rounded-full p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Time Slot Form */}
                        <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
                            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                                <Clock className="h-5 w-5 text-green-600" />
                                {isTimeSlotEditing ? 'Edit Time Slot' : 'Add Time Slot'}
                            </h2>

                            <form onSubmit={handleTimeSlotSubmit} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Day of the Week
                                    </label>
                                    <select
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={timeSlotForm.data.day}
                                        onChange={(e) => timeSlotForm.setData('day', e.target.value)}
                                    >
                                        <option value="Sunday">Sunday</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Friday">Friday</option>
                                    </select>
                                    {timeSlotForm.errors.day && (
                                        <p className="text-[10px] text-red-500">{timeSlotForm.errors.day}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase text-muted-foreground">
                                            Start Time
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                            value={timeSlotForm.data.start_time}
                                            onChange={(e) => timeSlotForm.setData('start_time', e.target.value)}
                                            placeholder="e.g. 09:00"
                                        />
                                        {timeSlotForm.errors.start_time && (
                                            <p className="text-[10px] text-red-500">{timeSlotForm.errors.start_time}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase text-muted-foreground">
                                            End Time
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                            value={timeSlotForm.data.end_time}
                                            onChange={(e) => timeSlotForm.setData('end_time', e.target.value)}
                                            placeholder="e.g. 10:30"
                                        />
                                        {timeSlotForm.errors.end_time && (
                                            <p className="text-[10px] text-red-500">{timeSlotForm.errors.end_time}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Slot Type
                                    </label>
                                    <select
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={timeSlotForm.data.type}
                                        onChange={(e) => timeSlotForm.setData('type', e.target.value)}
                                    >
                                        <option value="class">Class Slot (Weekly Timetable)</option>
                                        <option value="exam">Exam Slot (Term-end Timetable)</option>
                                    </select>
                                    {timeSlotForm.errors.type && (
                                        <p className="text-[10px] text-red-500">{timeSlotForm.errors.type}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={timeSlotForm.processing}
                                        className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isTimeSlotEditing ? 'Update Time Slot' : 'Create Time Slot'}
                                    </button>
                                    {isTimeSlotEditing && (
                                        <button
                                            type="button"
                                            onClick={() => timeSlotForm.reset()}
                                            className="w-full text-sm text-muted-foreground hover:underline"
                                        >
                                            Cancel Editing
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Time Slots List */}
                        <div className="space-y-4 lg:col-span-2">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-xl font-bold">Time Slots Directory</h2>
                            </div>

                            {timeSlots.length === 0 ? (
                                <div className="rounded-xl border bg-card p-8 text-center">
                                    <Clock className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                    <p className="mt-4 text-muted-foreground">No time slots configured yet. Add your first time slot.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {timeSlots.map((slot: any) => (
                                        <div
                                            key={slot.id}
                                            className="group relative rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-slate-400" />
                                                        {slot.day}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500 font-medium">
                                                        {slot.start_time} - {slot.end_time}
                                                    </p>
                                                    <div className="mt-2">
                                                        <span
                                                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                                                slot.type === 'class'
                                                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                                    : 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                                                            }`}
                                                        >
                                                            {slot.type === 'class' ? 'Class Routine Slot' : 'Exam Routine Slot'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleTimeSlotEdit(slot)}
                                                        className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleTimeSlotDelete(slot.id)}
                                                        className="rounded-full p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
