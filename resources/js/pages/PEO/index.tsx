import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Target, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ program, peos, umissions }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: '/programs' },
        { title: program.short_name || program.name, href: `/programs/${program.id}` },
        { title: 'PEOs', href: `/programs/${program.id}/peos` },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        peo_no: '',
        peo_name: '',
        umission_ids: [] as number[],
    });

    const isEditing = data.id !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/programs/${program.id}/peos/${data.id}`, {
                onSuccess: () => reset(),
            });
        } else {
            post(`/programs/${program.id}/peos`, {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (peo: any) => {
        setData({
            id: peo.id,
            peo_no: peo.peo_no,
            peo_name: peo.peo_name,
            umission_ids: peo.umissions ? peo.umissions.map((um: any) => um.id) : [],
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this PEO?')) {
            router.delete(`/programs/${program.id}/peos/${id}`, {
                onSuccess: () => {
                    if (data.id === id) reset();
                },
            });
        }
    };

    const sortedPeos = [...peos].sort((a: any, b: any) => a.peo_no - b.peo_no);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`PEOs - ${program.short_name || program.name}`} />

            <div className="p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                            <Target className="h-5 w-5 text-orange-600" />
                            {isEditing ? 'Edit PEO' : 'Add New PEO'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    PEO Number
                                </label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-orange-500"
                                    value={data.peo_no}
                                    onChange={(e) => setData('peo_no', e.target.value)}
                                    placeholder="1"
                                />
                                {errors.peo_no && (
                                    <p className="text-[10px] text-red-500">{errors.peo_no}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    PEO Description
                                </label>
                                <textarea
                                    className="min-h-[120px] w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-orange-500"
                                    value={data.peo_name}
                                    onChange={(e) => setData('peo_name', e.target.value)}
                                    placeholder="Describe the Program Educational Objective..."
                                />
                                {errors.peo_name && (
                                    <p className="text-[10px] text-red-500">{errors.peo_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Map to University Missions
                                </label>
                                <div className="grid grid-cols-1 gap-2 rounded-lg border bg-background p-3 max-h-[150px] overflow-y-auto">
                                    {umissions.map((um: any) => (
                                        <label key={um.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                checked={data.umission_ids.includes(um.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setData('umission_ids', checked
                                                        ? [...data.umission_ids, um.id]
                                                        : data.umission_ids.filter(id => id !== um.id)
                                                    );
                                                }}
                                            />
                                            <span className="font-medium text-slate-700">UM {um.umission_no}</span>
                                            <span className="text-xs text-slate-500 truncate">{um.umission_name}</span>
                                        </label>
                                    ))}
                                    {umissions.length === 0 && (
                                        <p className="text-xs text-muted-foreground italic">No missions defined.</p>
                                    )}
                                </div>
                                {errors.umission_ids && (
                                    <p className="text-[10px] text-red-500">{errors.umission_ids}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-orange-600 py-2.5 font-bold text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
                                >
                                    {isEditing ? 'Update PEO' : 'Create PEO'}
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
                            <div>
                                <h2 className="text-xl font-bold">Program Educational Objectives</h2>
                                <p className="text-sm text-muted-foreground">
                                    {program.short_name || program.name}
                                </p>
                            </div>
                            <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                {peos.length} PEOs Total
                            </span>
                        </div>

                        {peos.length === 0 ? (
                            <div className="rounded-xl border bg-card p-8 text-center">
                                <Target className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                <p className="mt-4 text-muted-foreground">
                                    No PEOs found. Add your first Program Educational Objective.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedPeos.map((peo: any) => (
                                    <div
                                        key={peo.id}
                                        className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4 p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-sm font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                                    {peo.peo_no}
                                                </div>
                                                <div className="pt-1">
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                                                        PEO {peo.peo_no}
                                                    </span>
                                                    <p className="mt-1 text-sm leading-relaxed text-foreground">
                                                        {peo.peo_name}
                                                    </p>
                                                    {peo.umissions && peo.umissions.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {peo.umissions.map((um: any) => (
                                                                <span key={um.id} className="rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-bold text-orange-700 uppercase" title={um.umission_name}>
                                                                    UM {um.umission_no}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    onClick={() => handleEdit(peo)}
                                                    className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(peo.id)}
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
