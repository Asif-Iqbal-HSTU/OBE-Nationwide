import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Target, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ umissions }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'University Missions', href: '/umissions' },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        umission_no: '',
        umission_name: '',
    });

    const isEditing = data.id !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route('umissions.update', data.id), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('umissions.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (u: any) => {
        setData({
            id: u.id,
            umission_no: u.umission_no,
            umission_name: u.umission_name,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this mission?')) {
            router.delete(route('umissions.destroy', id), {
                onSuccess: () => {
                    if (data.id === id) reset();
                },
            });
        }
    };

    const sortedUmissions = [...umissions].sort(
        (a: any, b: any) => Number(a.umission_no) - Number(b.umission_no)
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="University Missions" />

            <div className="p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                            <Target className="h-5 w-5 text-blue-600" />
                            {isEditing ? 'Edit Mission' : 'Add New Mission'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Mission Number
                                </label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.umission_no}
                                    onChange={(e) => setData('umission_no', e.target.value)}
                                    placeholder="1"
                                />
                                {errors.umission_no && (
                                    <p className="text-[10px] text-red-500">{errors.umission_no}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Mission Statement
                                </label>
                                <textarea
                                    className="min-h-[120px] w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.umission_name}
                                    onChange={(e) => setData('umission_name', e.target.value)}
                                    placeholder="Enter the mission statement..."
                                />
                                {errors.umission_name && (
                                    <p className="text-[10px] text-red-500">{errors.umission_name}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isEditing ? 'Update Mission' : 'Create Mission'}
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
                            <h2 className="text-xl font-bold">University Missions</h2>
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {umissions.length} Missions Total
                            </span>
                        </div>

                        {umissions.length === 0 ? (
                            <div className="rounded-xl border bg-card p-8 text-center">
                                <Target className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                <p className="mt-4 text-muted-foreground">
                                    No missions found. Add your first university mission.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedUmissions.map((u: any) => (
                                    <div
                                        key={u.id}
                                        className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4 p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {u.umission_no}
                                                </div>
                                                <div className="pt-1">
                                                    <p className="text-sm leading-relaxed text-foreground">
                                                        {u.umission_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    onClick={() => handleEdit(u)}
                                                    className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(u.id)}
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
