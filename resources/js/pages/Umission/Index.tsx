import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
// import { route } from 'ziggy-js';
// import route from "ziggy-js";
import { Pencil } from "lucide-react";

export default function Index({ umissions }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "University Missions", href: "/umissions" },
    ];

    /* ---------------- FORM ---------------- */
    /*const { data, setData, post, processing, reset, errors } = useForm({
        umission_no: "",
        umission_name: "",
    });*/

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        umission_no: "",
        umission_name: "",
    });

    const isEditing = data.id !== null;


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route("umissions.update", data.id), {
                onSuccess: () => {
                    reset();
                },
            });
        } else {
            post(route("umissions.store"), {
                onSuccess: () => {
                    reset();
                },
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


    const sortedUmissions = [...umissions].sort(
        (a: any, b: any) => Number(a.umission_no) - Number(b.umission_no)
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="University Missions" />

            <div className="p-6">
                <h1 className="text-xl font-bold mb-6">University Missions</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* -------------------- Form Section -------------------- */}
                    <div className="block rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition">
                        <h1 className="text-xl font-bold mb-6">
                            Add New Umission
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium">
                                    Umission No
                                </label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg p-2"
                                    value={data.umission_no}
                                    onChange={(e) =>
                                        setData("umission_no", e.target.value)
                                    }
                                />
                                {errors.umission_no && (
                                    <p className="text-red-500 text-sm">
                                        {errors.umission_no}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block font-medium">
                                    Umission Name
                                </label>
                                <textarea
                                    className="w-full border rounded-lg p-2"
                                    rows={4}
                                    value={data.umission_name}
                                    onChange={(e) =>
                                        setData(
                                            "umission_name",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.umission_name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.umission_name}
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
                                        ? "Update Umission"
                                        : "Submit Umission"}

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
                            Uploaded Umissions
                        </h1>

                        {umissions.length === 0 ? (
                            <p className="text-gray-500">
                                No umissions found.
                            </p>
                        ) : (
                            <div className="space-y-4 overflow-y-auto max-h-[450px] pr-2">
                                <ol className="list-decimal pl-5 space-y-3">
                                    {sortedUmissions.map((u: any) => (
                                        <li key={u.id} className="border-b pb-3 flex justify-between gap-4">
                                            <div>
                                                <div className="font-medium">#{u.umission_no}</div>
                                                <div className="text-sm text-gray-700">
                                                    {u.umission_name}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleEdit(u)}
                                                className="text-blue-600 hover:text-blue-800 transition"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                        </li>
                                    ))}
                                </ol>

                            </div>
                        )}



                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
