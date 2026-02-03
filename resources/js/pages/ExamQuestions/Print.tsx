import { Head, Link } from '@inertiajs/react';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Print({ examQuestion }: any) {
    const handlePrint = () => {
        window.print();
    };

    const course = examQuestion.course;
    const department = course?.program?.department;
    const faculty = department?.faculty;

    return (
        <div className="bg-white min-h-screen p-8 text-black print:p-0">
            <Head title={`Print - ${course?.code}`} />

            {/* Action Buttons - Hidden when printing */}
            <div className="print:hidden flex justify-between items-center mb-8 max-w-5xl mx-auto">
                <Link href="/exam-questions">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Questions
                    </Button>
                </Link>
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Question Paper
                </Button>
            </div>

            <div className="max-w-5xl mx-auto space-y-6 print:max-w-none">
                {/* Header Section */}
                <div className="text-center space-y-1 border-b-2 border-black pb-4">
                    <h1 className="text-xl font-bold">
                        Hajee Mohammad Danesh Science and Technology University, Dinajpur.
                    </h1>
                    <h2 className="text-lg font-semibold">
                        {faculty?.name || 'Faculty of Computer Science and Engineering'}
                    </h2>
                    <h3 className="text-base font-medium">
                        Department of {department?.name || 'Electronics and Communication Engineering'}
                    </h3>

                    <div className="mt-4 pt-4 border-t border-gray-300">
                        <h4 className="text-lg font-bold italic text-blue-800">
                            Question Moderation Form for Final Exam/Term Final Examination
                        </h4>
                    </div>
                </div>

                {/* Course Info Row */}
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm border-b pb-4">
                    <div>
                        <span className="font-semibold">Course Title…</span> {course?.name || 'Electronics-I'}
                        <span className="mx-4">……………………</span>
                    </div>
                    <div>
                        <span className="font-semibold">Course Code …</span>{course?.code || 'ECE 101'}……
                    </div>
                    <div>
                        <span className="font-semibold">Session…</span>{examQuestion.session}………
                    </div>
                    <div>
                        <span className="font-semibold">Term/Semester</span> {examQuestion.semester}
                    </div>
                </div>

                <div className="text-sm mb-2">
                    <span className="font-semibold">Course Teacher…………………………………</span>
                    <span className="italic ml-2">{examQuestion.teacher?.name}</span>
                </div>

                {/* Main Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-blue-100">
                                <th colSpan={4} className="border border-black px-2 py-1.5 text-center font-semibold">
                                    Section 1
                                </th>
                                <th colSpan={2} className="border border-black px-2 py-1.5 text-center font-semibold">
                                    Section 2
                                </th>
                            </tr>
                            <tr className="bg-blue-100">
                                <th colSpan={4} className="border border-black px-2 py-1.5 text-center text-xs">
                                    To be Completed by Course Teacher
                                </th>
                                <th colSpan={2} className="border border-black px-2 py-1.5 text-center text-xs">
                                    To be Completed by Moderator (s)
                                </th>
                            </tr>
                            <tr className="bg-blue-50 text-xs">
                                <th className="border border-black px-2 py-1.5 w-12">No.</th>
                                <th className="border border-black px-2 py-1.5 w-16">CLOs</th>
                                <th className="border border-black px-2 py-1.5">Exam questions Addressing to CLO(s)</th>
                                <th className="border border-black px-2 py-1.5 w-28">Level of Bloom's Taxonomy</th>
                                <th className="border border-black px-2 py-1.5 w-32">
                                    Question (s) Addresses the CLO Satisfactorily<br />(Yes/No/ NA)
                                </th>
                                <th className="border border-black px-2 py-1.5 w-24">Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Part A Header */}
                            <tr className="bg-gray-100">
                                <td colSpan={6} className="border border-black px-2 py-1.5 text-center font-bold">
                                    Part A
                                </td>
                            </tr>
                            {examQuestion.items?.map((item: any, index: number) => (
                                <tr key={item.id}>
                                    <td className="border border-black px-2 py-1.5 text-center align-top">
                                        {item.question_label}
                                    </td>
                                    <td className="border border-black px-2 py-1.5 text-center align-top font-medium">
                                        CLO {item.clo?.clo_no || 'N/A'}
                                    </td>
                                    <td className="border border-black px-2 py-1.5 align-top whitespace-pre-wrap">
                                        {item.question_text}
                                    </td>
                                    <td className="border border-black px-2 py-1.5 text-center align-top">
                                        {item.blooms_taxonomy_level}
                                    </td>
                                    <td className="border border-black px-2 py-1.5 text-center align-top">
                                        {/* Will be filled by moderator */}
                                        Yes
                                    </td>
                                    <td className="border border-black px-2 py-1.5 align-top">
                                        {/* Comments column - left empty for moderator */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                <div className="mt-8 pt-4 border-t flex justify-between text-sm">
                    <div>
                        <p className="font-semibold">Duration: {examQuestion.duration}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Total Marks: {examQuestion.total_marks}</p>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="mt-12 grid grid-cols-3 gap-8 text-sm">
                    <div className="text-center">
                        <div className="border-t border-black pt-2 mt-12">
                            <p>Signature of Course Teacher</p>
                            <p className="text-xs text-gray-600">Date: _______________</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="border-t border-black pt-2 mt-12">
                            <p>Signature of Moderator</p>
                            <p className="text-xs text-gray-600">Date: _______________</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="border-t border-black pt-2 mt-12">
                            <p>Signature of Chairman</p>
                            <p className="text-xs text-gray-600">Date: _______________</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { 
                        margin: 1.5cm; 
                        size: A4 landscape;
                    }
                    body { 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
