import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, FileText, Printer, Send, Edit, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Exam Questions',
        href: '/exam-questions',
    },
];

export default function Index({ examQuestions }: any) {
    const { post } = useForm();

    const handleSubmit = (id: number) => {
        if (confirm('Are you sure you want to submit this question for moderation? You cannot edit it afterwards.')) {
            post(route('exam-questions.submit', id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Draft': return 'bg-slate-500 hover:bg-slate-600';
            case 'Submitted': return 'bg-blue-500 hover:bg-blue-600';
            case 'Moderating': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Approved': return 'bg-green-500 hover:bg-green-600';
            case 'RevisionNeeded': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-slate-500';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Exam Questions" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">My Exam Questions</h2>
                        <p className="text-muted-foreground">
                            Create and manage your exam question papers.
                        </p>
                    </div>
                    <Link href={route('exam-questions.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Question
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Course</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Session/Semester</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Updated</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {examQuestions.map((question: any) => (
                                    <tr key={question.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">
                                            {question.course.code} - {question.course.name}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {question.session} <span className="text-muted-foreground">({question.semester})</span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge className={getStatusColor(question.status)}>
                                                {question.status}
                                            </Badge>
                                            {question.status === 'RevisionNeeded' && (
                                                <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle size={12} /> Needs Revision
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {new Date(question.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle text-right space-x-2">
                                            {(question.status === 'Draft' || question.status === 'RevisionNeeded') && (
                                                <>
                                                    <Link href={route('exam-questions.edit', question.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="mr-2 h-3 w-3" />
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button variant="default" size="sm" onClick={() => handleSubmit(question.id)}>
                                                        <Send className="mr-2 h-3 w-3" />
                                                        Submit
                                                    </Button>
                                                </>
                                            )}
                                            {question.status === 'Approved' && (
                                                <Link href={route('exam-questions.print', question.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Printer className="mr-2 h-3 w-3" />
                                                        Print
                                                    </Button>
                                                </Link>
                                            )}
                                            {/* Allow viewing even if not approved, maybe? */}
                                        </td>
                                    </tr>
                                ))}
                                {examQuestions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No exam questions created yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
