import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

export default function Index({ programs, faculties, departments }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Programs", href: "/programs" },
    ];

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        name: "",
        short_name: "",
        faculty_id: "",
        department_id: "",
        vision: "",
        mission: "",
        description: "",
    });

    const isEditing = data.id !== null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route("programs.update", data.id), {
                onSuccess: () => {
                    reset();
                },
            });
        } else {
            post(route("programs.store"), {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    const handleEdit = (program: any) => {
        setData({
            id: program.id,
            name: program.name,
            short_name: program.short_name || "",
            faculty_id: program.faculty_id,
            department_id: program.department_id,
            vision: program.vision || "",
            mission: program.mission || "",
            description: program.description || "",
        });
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this program?")) {
            router.delete(route("programs.destroy", id), {
                onSuccess: () => {
                    if (data.id === id) {
                        reset();
                    }
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
                <h1 className="text-xl font-bold mb-6">Programs</h1>

                {faculties.length === 0 ? (
                    <div className="block rounded-2xl border bg-card p-6 shadow-sm">
                        <p className="text-gray-500">
                            Please create at least one faculty and department
                            before adding programs.
                        </p>
                    </div>
                ) : departments.length === 0 ? (
                    <div className="block rounded-2xl border bg-card p-6 shadow-sm">
                        <p className="text-gray-500">
                            Please create at least one department before adding
                            programs.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* -------------------- Form Section -------------------- */}
                        <div className="lg:col-span-2 block rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition">
                            <h1 className="text-xl font-bold mb-6">
                                {isEditing
                                    ? "Edit Program"
                                    : "Add New Program"}
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-medium">
                                            Faculty
                                        </label>
                                        <select
                                            className="w-full border rounded-lg p-2"
                                            value={data.faculty_id}
                                            onChange={(e) => {
                                                setData("faculty_id", e.target.value);
                                                setData("department_id", "");
                                            }}
                                        >
                                            <option value="">
                                                Select Faculty
                                            </option>
                                            {faculties.map((faculty: any) => (
                                                <option
                                                    key={faculty.id}
                                                    value={faculty.id}
                                                >
                                                    {faculty.name} (
                                                    {faculty.short_name})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.faculty_id && (
                                            <p className="text-red-500 text-sm">
                                                {errors.faculty_id}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block font-medium">
                                            Department
                                        </label>
                                        <select
                                            className="w-full border rounded-lg p-2"
                                            value={data.department_id}
                                            onChange={(e) =>
                                                setData(
                                                    "department_id",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!data.faculty_id}
                                        >
                                            <option value="">
                                                Select Department
                                            </option>
                                            {filteredDepartments.map(
                                                (department: any) => (
                                                    <option
                                                        key={department.id}
                                                        value={department.id}
                                                    >
                                                        {department.name} (
                                                        {department.short_name})
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        {errors.department_id && (
                                            <p className="text-red-500 text-sm">
                                                {errors.department_id}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium">
                                        Program Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg p-2"
                                        placeholder="e.g., B.Sc. in Electrical and Communication Engineering"
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
                                        Short Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg p-2"
                                        placeholder="e.g., BSc in ECE"
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

                                <div>
                                    <label className="block font-medium">
                                        Vision of the Program
                                    </label>
                                    <textarea
                                        className="w-full border rounded-lg p-2"
                                        rows={6}
                                        placeholder="Enter vision with bullet points..."
                                        value={data.vision}
                                        onChange={(e) =>
                                            setData("vision", e.target.value)
                                        }
                                    />
                                    {errors.vision && (
                                        <p className="text-red-500 text-sm">
                                            {errors.vision}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-medium">
                                        Mission of the Program
                                    </label>
                                    <textarea
                                        className="w-full border rounded-lg p-2"
                                        rows={8}
                                        placeholder="Enter mission with bullet points..."
                                        value={data.mission}
                                        onChange={(e) =>
                                            setData("mission", e.target.value)
                                        }
                                    />
                                    {errors.mission && (
                                        <p className="text-red-500 text-sm">
                                            {errors.mission}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-medium">
                                        Description of the Program
                                    </label>
                                    <textarea
                                        className="w-full border rounded-lg p-2"
                                        rows={10}
                                        placeholder="Enter detailed description..."
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                                    >
                                        {processing
                                            ? "Saving..."
                                            : isEditing
                                                ? "Update Program"
                                                : "Create Program"}
                                    </button>

                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => reset()}
                                            className="px-4 py-2 border rounded-lg"
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* -------------------- List Section -------------------- */}
                        <div className="block rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition flex flex-col">
                            <h1 className="text-xl font-bold mb-4">
                                All Programs
                            </h1>

                            {programs.length === 0 ? (
                                <p className="text-gray-500">
                                    No programs found.
                                </p>
                            ) : (
                                <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                                    <div className="space-y-3">
                                        {sortedPrograms.map((program: any) => (
                                            <div
                                                key={program.id}
                                                className="border-b pb-3 flex justify-between gap-4 items-start"
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {program.name}
                                                        {program.short_name && (
                                                            <span className="text-sm font-normal text-gray-600">
                                                                {" "}({program.short_name})
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Faculty:{" "}
                                                        {program.faculty.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Department:{" "}
                                                        {program.department.name}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(program)
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 transition"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                program.id
                                                            )
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
                )}
            </div>
        </AppLayout>
    );
}
