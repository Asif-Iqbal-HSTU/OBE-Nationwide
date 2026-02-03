import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Users, Pencil, Trash2, Key } from 'lucide-react';
import React from 'react';

export default function Index({ teachers, departments }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teachers', href: '/teachers' },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        name: '',
        email: '',
        password: '',
        designation: '',
        department_id: '',
    });

    const isEditing = data.id !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route('teachers.update', data.id as number), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('teachers.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (teacher: any) => {
        setData({
            id: teacher.id,
            name: teacher.name,
            email: teacher.user.email,
            password: '', // Keep empty for security
            designation: teacher.designation,
            department_id: teacher.department_id,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this teacher and their user account?')) {
            router.delete(route('teachers.destroy', id as any), {
                onSuccess: () => {
                    if (data.id === id) reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teachers" />

            <div className="p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="h-fit rounded-2xl border bg-card p-6 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                            <Users className="h-5 w-5 text-blue-600" />
                            {isEditing ? 'Edit Teacher' : 'Register New Teacher'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Prof. John Doe"
                                />
                                {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Email (Username)</label>
                                <input
                                    type="email"
                                    className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="john@university.edu"
                                />
                                {errors.email && <p className="text-[10px] text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Password {isEditing && <span className="text-[10px] lowercase">(Leave blank for no change)</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        className="w-full rounded-lg border bg-background p-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    <Key className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Designation</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.designation}
                                    onChange={(e) => setData('designation', e.target.value)}
                                    placeholder="Assistant Professor"
                                />
                                {errors.designation && <p className="text-[10px] text-red-500">{errors.designation}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Department</label>
                                <select
                                    className="w-full rounded-lg border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.department_id}
                                    onChange={(e) => setData('department_id', e.target.value)}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept: any) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name} ({dept.short_name})
                                        </option>
                                    ))}
                                </select>
                                {errors.department_id && <p className="text-[10px] text-red-500">{errors.department_id}</p>}
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-blue-600 py-2.5 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isEditing ? 'Update Teacher' : 'Register Teacher'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => reset()}
                                        className="w-full text-xs text-muted-foreground hover:underline"
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
                            <h2 className="text-xl font-bold text-slate-800">Department Teachers</h2>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                {teachers.length} Teachers Total
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {teachers.length === 0 ? (
                                <div className="rounded-xl border border-dashed p-10 text-center">
                                    <Users className="mx-auto h-10 w-10 text-slate-300" />
                                    <p className="mt-2 text-sm text-slate-500">No teachers registered yet.</p>
                                </div>
                            ) : (
                                teachers.map((teacher: any) => (
                                    <div
                                        key={teacher.id}
                                        className="group rounded-xl border bg-card p-4 transition-all hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                                                    {teacher.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{teacher.name}</h3>
                                                    <p className="text-xs text-slate-500">{teacher.designation}</p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                                                            {teacher.department.short_name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {teacher.user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                                <button
                                                    onClick={() => handleEdit(teacher)}
                                                    className="rounded-full p-2 text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(teacher.id)}
                                                    className="rounded-full p-2 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
