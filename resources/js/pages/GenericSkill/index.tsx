import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Lightbulb, Pencil, Trash2 } from 'lucide-react';
import React from 'react';

export default function Index({ program, genericSkills }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Programs', href: '/programs' },
        { title: program.short_name || program.name, href: `/programs/${program.id}` },
        { title: 'Generic Skills', href: `/programs/${program.id}/generic-skills` },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        skill_no: '',
        skill_name: '',
    });

    const isEditing = data.id !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/programs/${program.id}/generic-skills/${data.id}`, {
                onSuccess: () => reset(),
            });
        } else {
            post(`/programs/${program.id}/generic-skills`, {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (skill: any) => {
        setData({
            id: skill.id,
            skill_no: skill.skill_no,
            skill_name: skill.skill_name,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this Generic Skill?')) {
            router.delete(`/programs/${program.id}/generic-skills/${id}`, {
                onSuccess: () => {
                    if (data.id === id) reset();
                },
            });
        }
    };

    const sortedSkills = [...genericSkills].sort(
        (a: any, b: any) => a.skill_no - b.skill_no
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Generic Skills - ${program.short_name || program.name}`} />

            <div className="p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                            <Lightbulb className="h-5 w-5 text-amber-600" />
                            {isEditing ? 'Edit Generic Skill' : 'Add New Generic Skill'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Skill Number
                                </label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-amber-500"
                                    value={data.skill_no}
                                    onChange={(e) => setData('skill_no', e.target.value)}
                                    placeholder="1"
                                />
                                {errors.skill_no && (
                                    <p className="text-[10px] text-red-500">{errors.skill_no}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Skill Name
                                </label>
                                <textarea
                                    className="min-h-[100px] w-full rounded-lg border bg-background p-2 outline-none focus:ring-2 focus:ring-amber-500"
                                    value={data.skill_name}
                                    onChange={(e) => setData('skill_name', e.target.value)}
                                    placeholder="Describe the generic skill..."
                                />
                                {errors.skill_name && (
                                    <p className="text-[10px] text-red-500">{errors.skill_name}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-amber-600 py-2.5 font-bold text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
                                >
                                    {isEditing ? 'Update Skill' : 'Create Skill'}
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
                                <h2 className="text-xl font-bold">Generic Skills</h2>
                                <p className="text-sm text-muted-foreground">
                                    {program.short_name || program.name}
                                </p>
                            </div>
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                {genericSkills.length} Skills Total
                            </span>
                        </div>

                        {genericSkills.length === 0 ? (
                            <div className="rounded-xl border bg-card p-8 text-center">
                                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/30" />
                                <p className="mt-4 text-muted-foreground">
                                    No generic skills found. Add your first generic skill.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sortedSkills.map((skill: any) => (
                                    <div
                                        key={skill.id}
                                        className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4 p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                                    {skill.skill_no}
                                                </div>
                                                <div className="pt-1">
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                                        Skill {skill.skill_no}
                                                    </span>
                                                    <p className="mt-1 text-sm leading-relaxed text-foreground">
                                                        {skill.skill_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    onClick={() => handleEdit(skill)}
                                                    className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(skill.id)}
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
