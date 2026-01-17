import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ program, peos }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: '/programs' },
        { title: program.name, href: `/programs/${program.id}` },
        { title: 'PEOs', href: `/programs/${program.id}/peos` },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        peo_no: '',
        peo_name: '',
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
            <Head title={`PEOs - ${program.name}`} />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        Program Educational Objectives (PEOs)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {program.name} ({program.short_name})
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Form Section */}
                    <div className="block rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md">
                        <h2 className="mb-6 text-xl font-bold">
                            {isEditing ? 'Edit PEO' : 'Add New PEO'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium">PEO No.</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border p-2"
                                    value={data.peo_no}
                                    onChange={(e) => setData('peo_no', e.target.value)}
                                />
                                {errors.peo_no && (
                                    <p className="text-sm text-red-500">{errors.peo_no}</p>
                                )}
                            </div>

                            <div>
                                <label className="block font-medium">PEO Name</label>
                                <textarea
                                    className="w-full rounded-lg border p-2"
                                    rows={4}
                                    value={data.peo_name}
                                    onChange={(e) => setData('peo_name', e.target.value)}
                                />
                                {errors.peo_name && (
                                    <p className="text-sm text-red-500">{errors.peo_name}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {processing
                                    ? 'Saving...'
                                    : isEditing
                                      ? 'Update PEO'
                                      : 'Create PEO'}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="ml-2 rounded-lg border px-4 py-2"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="block flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md">
                        <h2 className="mb-4 text-xl font-bold">All PEOs</h2>

                        {peos.length === 0 ? (
                            <p className="text-gray-500">No PEOs found.</p>
                        ) : (
                            <div className="max-h-[450px] space-y-4 overflow-y-auto pr-2">
                                {sortedPeos.map((peo: any) => (
                                    <div
                                        key={peo.id}
                                        className="flex items-start justify-between gap-4 border-b pb-3"
                                    >
                                        <div>
                                            <div className="font-medium">PEO {peo.peo_no}</div>
                                            <div className="text-sm text-gray-700">
                                                {peo.peo_name}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(peo)}
                                                className="text-blue-600 transition hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(peo.id)}
                                                className="text-red-600 transition hover:text-red-800"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
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
