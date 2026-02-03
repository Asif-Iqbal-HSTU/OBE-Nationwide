import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Network, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ departments, faculties, teachers }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Departments', href: '/departments' },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        name: '',
        short_name: '',
        faculty_id: '',
        chairman_id: '' as string | number,
    });

    const isEditing = data.id !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route('departments.update', data.id as number), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('departments.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (department: any) => {
        setData({
            id: department.id,
            name: department.name,
            short_name: department.short_name,
            faculty_id: department.faculty_id,
            chairman_id: department.chairman_id || '',
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(route('departments.destroy', id as any), {
                onSuccess: () => {
                    if (data.id === id) reset();
                },
            });
        }
    };

    const sortedDepartments = [...departments].sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
    );

    // Faculty color mapping for visual distinction
    const getFacultyColor = (facultyId: number) => {
        const colors = [
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
            'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
            'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
        ];
        return colors[facultyId % colors.length];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />

            <div className="p-6">
                {faculties.length === 0 ? (
                    <div className="rounded-2xl border bg-card p-8 text-center">
                        <Network className="mx-auto h-12 w-12 text-muted-foreground/30" />
                        <p className="mt-4 text-muted-foreground">
                            Please create at least one faculty before adding departments.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Form Section */}
                        <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
                            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                                <Network className="h-5 w-5 text-blue-600" />
                                {isEditing ? 'Edit Department' : 'Add New Department'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Faculty
                                    </label>
                                    <select
                                        className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.faculty_id}
                                        onChange={(e) => setData('faculty_id', e.target.value)}
                                    >
                                        <option value="">Select Faculty</option>
                                        {faculties.map((faculty: any) => (
                                            <option key={faculty.id} value={faculty.id}>
                                                {faculty.name} ({faculty.short_name})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.faculty_id && (
                                        <p className="text-[10px] text-red-500">{errors.faculty_id}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Department Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Department of Computer Science"
                                    />
                                    {errors.name && (
                                        <p className="text-[10px] text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Short Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.short_name}
                                        onChange={(e) => setData('short_name', e.target.value)}
                                        placeholder="CSE"
                                    />
                                    {errors.short_name && (
                                        <p className="text-[10px] text-red-500">{errors.short_name}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Assign Chairman
                                    </label>
                                    <select
                                        className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.chairman_id}
                                        onChange={(e) => setData('chairman_id', e.target.value)}
                                    >
                                        <option value="">Select Chairman</option>
                                        {teachers.map((teacher: any) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name} ({teacher.designation})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.chairman_id && (
                                        <p className="text-[10px] text-red-500">{errors.chairman_id}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isEditing ? 'Update Department' : 'Create Department'}
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => reset()}
                                            className="w-full text-sm text-muted-foreground hover:underline"
                                        >
                                            Cancel Editing
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* List Section */}
                        <div className="space-y-4 lg:col-span-2">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-xl font-bold">All Departments</h2>
                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                    {departments.length} Departments Total
                                </span>
                            </div>

                            {departments.length === 0 ? (
                                <div className="rounded-xl border bg-card p-8 text-center">
                                    <Network className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                    <p className="mt-4 text-muted-foreground">
                                        No departments found. Add your first department.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sortedDepartments.map((department: any) => (
                                        <div
                                            key={department.id}
                                            className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
                                                        <Network className="h-5 w-5 text-teal-700 dark:text-teal-300" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-foreground">
                                                            {department.name}
                                                        </h3>
                                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                {department.short_name}
                                                            </span>
                                                            <span
                                                                className={`rounded-md px-2 py-0.5 text-xs font-medium ${getFacultyColor(department.faculty_id)}`}
                                                            >
                                                                {department.faculty?.short_name || department.faculty?.name}
                                                            </span>
                                                            {department.chairman && (
                                                                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-600">
                                                                    Chair: {department.chairman.name}
                                                                </span>
                                                            )}
                                                            {department.programs_count !== undefined && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    {department.programs_count} Program{department.programs_count !== 1 ? 's' : ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <button
                                                        onClick={() => handleEdit(department)}
                                                        className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(department.id)}
                                                        className="rounded-full p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                    >
                                                        <Trash2 size={16} />
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
