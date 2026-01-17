import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ program, plos }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: '/programs' },
        { title: program.name, href: `/programs/${program.id}` },
        { title: 'PLOs', href: `/programs/${program.id}/plos` },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        plo_no: '',
        plo_desc: '',
    });

    const isEditing = data.id !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/programs/${program.id}/plos/${data.id}`, {
                onSuccess: () => reset(),
            });
        } else {
            post(`/programs/${program.id}/plos`, {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (plo: any) => {
        setData({
            id: plo.id,
            plo_no: plo.plo_no,
            plo_desc: plo.plo_desc,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this PLO?')) {
            router.delete(`/programs/${program.id}/plos/${id}`, {
                onSuccess: () => {
                    if (data.id === id) reset();
                },
            });
        }
    };

    const sortedPlos = [...plos].sort((a: any, b: any) => a.plo_no - b.plo_no);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`PLOs - ${program.name}`} />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        Program Learning Outcomes (PLOs)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {program.name} ({program.short_name})
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Form Section */}
                    <div className="block rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md">
                        <h2 className="mb-6 text-xl font-bold">
                            {isEditing ? 'Edit PLO' : 'Add New PLO'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium">PLO No.</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border p-2"
                                    value={data.plo_no}
                                    onChange={(e) => setData('plo_no', e.target.value)}
                                />
                                {errors.plo_no && (
                                    <p className="text-sm text-red-500">{errors.plo_no}</p>
                                )}
                            </div>

                            <div>
                                <label className="block font-medium">Description</label>
                                <textarea
                                    className="w-full rounded-lg border p-2"
                                    rows={4}
                                    value={data.plo_desc}
                                    onChange={(e) => setData('plo_desc', e.target.value)}
                                />
                                {errors.plo_desc && (
                                    <p className="text-sm text-red-500">{errors.plo_desc}</p>
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
                                      ? 'Update PLO'
                                      : 'Create PLO'}
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
                        <h2 className="mb-4 text-xl font-bold">All PLOs</h2>

                        {plos.length === 0 ? (
                            <p className="text-gray-500">No PLOs found.</p>
                        ) : (
                            <div className="max-h-[450px] space-y-4 overflow-y-auto pr-2">
                                {sortedPlos.map((plo: any) => (
                                    <div
                                        key={plo.id}
                                        className="flex items-start justify-between gap-4 border-b pb-3"
                                    >
                                        <div>
                                            <div className="font-medium">PLO {plo.plo_no}</div>
                                            <div className="text-sm text-gray-700">
                                                {plo.plo_desc}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(plo)}
                                                className="text-blue-600 transition hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(plo.id)}
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
