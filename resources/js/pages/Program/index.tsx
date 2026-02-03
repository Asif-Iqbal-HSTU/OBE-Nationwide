import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { BookOpen, GraduationCap, Lightbulb, Pencil, Target, Trash2, Trophy } from 'lucide-react';
import React from 'react';

export default function Index({ programs, faculties, departments }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: '/programs' },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        name: '',
        short_name: '',
        faculty_id: '',
        department_id: '',
        vision: '',
        mission: '',
        description: '',
    });

    const isEditing = data.id !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route('programs.update', data.id), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('programs.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (program: any) => {
        setData({
            id: program.id,
            name: program.name,
            short_name: program.short_name || '',
            faculty_id: program.faculty_id,
            department_id: program.department_id,
            vision: program.vision || '',
            mission: program.mission || '',
            description: program.description || '',
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this program?')) {
            router.delete(route('programs.destroy', id), {
                onSuccess: () => {
                    if (data.id === id) reset();
                },
            });
        }
    };

    const sortedPrograms = [...programs].sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
    );

    // Filter departments based on selected faculty
    const filteredDepartments = data.faculty_id
        ? departments.filter(
              (dept: any) => dept.faculty_id === parseInt(data.faculty_id)
          )
        : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />

            <div className="p-6">
                {faculties.length === 0 ? (
                    <div className="rounded-2xl border bg-card p-8 text-center">
                        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30" />
                        <p className="mt-4 text-muted-foreground">
                            Please create at least one faculty and department before adding programs.
                        </p>
                    </div>
                ) : departments.length === 0 ? (
                    <div className="rounded-2xl border bg-card p-8 text-center">
                        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30" />
                        <p className="mt-4 text-muted-foreground">
                            Please create at least one department before adding programs.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Form Section - Takes 2/3 due to many fields */}
                        <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
                            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                                {isEditing ? 'Edit Program' : 'Add New Program'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase text-muted-foreground">
                                            Faculty
                                        </label>
                                        <select
                                            className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={data.faculty_id}
                                            onChange={(e) => {
                                                setData('faculty_id', e.target.value);
                                                setData('department_id', '');
                                            }}
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
                                            Department
                                        </label>
                                        <select
                                            className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            value={data.department_id}
                                            onChange={(e) => setData('department_id', e.target.value)}
                                            disabled={!data.faculty_id}
                                        >
                                            <option value="">Select Department</option>
                                            {filteredDepartments.map((department: any) => (
                                                <option key={department.id} value={department.id}>
                                                    {department.name} ({department.short_name})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.department_id && (
                                            <p className="text-[10px] text-red-500">{errors.department_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-xs font-semibold uppercase text-muted-foreground">
                                            Program Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="B.Sc. in Computer Science and Engineering"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
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
                                            placeholder="BSc in CSE"
                                            value={data.short_name}
                                            onChange={(e) => setData('short_name', e.target.value)}
                                        />
                                        {errors.short_name && (
                                            <p className="text-[10px] text-red-500">{errors.short_name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Vision
                                    </label>
                                    <textarea
                                        className="min-h-[80px] w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter program vision..."
                                        value={data.vision}
                                        onChange={(e) => setData('vision', e.target.value)}
                                    />
                                    {errors.vision && (
                                        <p className="text-[10px] text-red-500">{errors.vision}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Mission
                                    </label>
                                    <textarea
                                        className="min-h-[100px] w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter program mission..."
                                        value={data.mission}
                                        onChange={(e) => setData('mission', e.target.value)}
                                    />
                                    {errors.mission && (
                                        <p className="text-[10px] text-red-500">{errors.mission}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Description
                                    </label>
                                    <textarea
                                        className="min-h-[120px] w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter detailed program description..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && (
                                        <p className="text-[10px] text-red-500">{errors.description}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isEditing ? 'Update Program' : 'Create Program'}
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

                        {/* List Section - Takes 1/3 */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-xl font-bold">All Programs</h2>
                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                    {programs.length} Programs
                                </span>
                            </div>

                            {programs.length === 0 ? (
                                <div className="rounded-xl border bg-card p-8 text-center">
                                    <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                    <p className="mt-4 text-sm text-muted-foreground">
                                        No programs found. Add your first program.
                                    </p>
                                </div>
                            ) : (
                                <div className="max-h-[700px] space-y-3 overflow-y-auto pr-1">
                                    {sortedPrograms.map((program: any) => (
                                        <div
                                            key={program.id}
                                            className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate font-semibold text-foreground">
                                                            {program.short_name || program.name}
                                                        </h3>
                                                        {program.short_name && (
                                                            <p className="truncate text-xs text-muted-foreground">
                                                                {program.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <button
                                                            onClick={() => handleEdit(program)}
                                                            className="rounded-full p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(program.id)}
                                                            className="rounded-full p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-2 flex flex-wrap gap-1.5">
                                                    <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                        Faculty: {program.faculty?.short_name}
                                                    </span>
                                                    <span className="rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                                                        Department: {program.department?.short_name}
                                                    </span>
                                                </div>

                                                {/* Statistics */}
                                                <div className="mt-3 flex items-center gap-3 border-t border-dashed pt-3">
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                        <Target size={12} className="text-orange-500" />
                                                        <span>{program.peos_count ?? 0} PEOs</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                        <Trophy size={12} className="text-emerald-500" />
                                                        <span>{program.plos_count ?? 0} PLOs</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                        <BookOpen size={12} className="text-blue-500" />
                                                        <span>{program.courses_count ?? 0} Courses</span>
                                                    </div>
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
