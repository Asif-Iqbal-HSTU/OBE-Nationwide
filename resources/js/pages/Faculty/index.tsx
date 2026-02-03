import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Building2, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ faculties, teachers }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Faculties', href: '/faculties' },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        name: '',
        short_name: '',
        dean_id: '' as string | number,
    });

    const isEditing = data.id !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route('faculties.update', data.id as number), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('faculties.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (faculty: any) => {
        setData({
            id: faculty.id,
            name: faculty.name,
            short_name: faculty.short_name,
            dean_id: faculty.dean_id || '',
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this faculty?')) {
            router.delete(route('faculties.destroy', id as any), {
                onSuccess: () => {
                    if (data.id === id) reset();
                },
            });
        }
    };

    const sortedFaculties = [...faculties].sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faculties" />

            <div className="p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            {isEditing ? 'Edit Faculty' : 'Add New Faculty'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Faculty Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Faculty of Engineering"
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
                                    placeholder="FoE"
                                />
                                {errors.short_name && (
                                    <p className="text-[10px] text-red-500">{errors.short_name}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Assign Dean
                                </label>
                                <select
                                    className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.dean_id}
                                    onChange={(e) => setData('dean_id', e.target.value)}
                                >
                                    <option value="">Select Dean</option>
                                    {teachers.map((teacher: any) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.name} ({teacher.designation})
                                        </option>
                                    ))}
                                </select>
                                {errors.dean_id && (
                                    <p className="text-[10px] text-red-500">{errors.dean_id}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isEditing ? 'Update Faculty' : 'Create Faculty'}
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
                            <h2 className="text-xl font-bold">All Faculties</h2>
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {faculties.length} Faculties Total
                            </span>
                        </div>

                        {faculties.length === 0 ? (
                            <div className="rounded-xl border bg-card p-8 text-center">
                                <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                <p className="mt-4 text-muted-foreground">
                                    No faculties found. Add your first faculty.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedFaculties.map((faculty: any) => (
                                    <div
                                        key={faculty.id}
                                        className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                    <Building2 className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-foreground">
                                                        {faculty.name}
                                                    </h3>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            {faculty.short_name}
                                                        </span>
                                                        {faculty.dean && (
                                                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600">
                                                                Dean: {faculty.dean.name}
                                                            </span>
                                                        )}
                                                        {faculty.departments_count !== undefined && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {faculty.departments_count} Department{faculty.departments_count !== 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    onClick={() => handleEdit(faculty)}
                                                    className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(faculty.id)}
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
            </div>
        </AppLayout>
    );
}
