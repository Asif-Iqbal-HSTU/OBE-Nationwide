import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

export default function Index({ faculties }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Faculties", href: "/faculties" },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        name: "",
        short_name: "",
    });

    const isEditing = data.id !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route("faculties.update", data.id), {
                onSuccess: () => {
                    reset();
                },
            });
        } else {
            post(route("faculties.store"), {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    const handleEdit = (faculty: any) => {
        setData({
            id: faculty.id,
            name: faculty.name,
            short_name: faculty.short_name,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this faculty?")) {
            router.delete(route("faculties.destroy", id), {
                onSuccess: () => {
                    if (data.id === id) {
                        reset();
                    }
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
                <h1 className="text-xl font-bold mb-6">Faculties</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* -------------------- Form Section -------------------- */}
                    <div className="block rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition">
                        <h1 className="text-xl font-bold mb-6">
                            {isEditing ? "Edit Faculty" : "Add New Faculty"}
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium">
                                    Faculty Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block font-medium">
                                    Short Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={data.short_name}
                                    onChange={(e) =>
                                        setData("short_name", e.target.value)
                                    }
                                />
                                {errors.short_name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.short_name}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                            >
                                {processing
                                    ? "Saving..."
                                    : isEditing
                                        ? "Update Faculty"
                                        : "Create Faculty"}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="ml-2 px-4 py-2 border rounded-lg"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </form>
                    </div>

                    {/* -------------------- List Section -------------------- */}
                    <div className="block rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition flex flex-col">
                        <h1 className="text-xl font-bold mb-4">
                            All Faculties
                        </h1>

                        {faculties.length === 0 ? (
                            <p className="text-gray-500">
                                No faculties found.
                            </p>
                        ) : (
                            <div className="space-y-4 overflow-y-auto max-h-[450px] pr-2">
                                <div className="space-y-3">
                                    {sortedFaculties.map((faculty: any) => (
                                        <div
                                            key={faculty.id}
                                            className="border-b pb-3 flex justify-between gap-4 items-start"
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {faculty.name}
                                                </div>
                                                <div className="text-sm text-gray-700">
                                                    {faculty.short_name}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(faculty)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 transition"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(faculty.id)
                                                    }
                                                    className="text-red-600 hover:text-red-800 transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
