import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Moderation',
        href: '/moderation',
    },
];

export default function Index({ questions }: any) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Submitted': return 'bg-blue-500 hover:bg-blue-600';
            case 'Moderating': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Approved': return 'bg-green-500 hover:bg-green-600';
            case 'RevisionNeeded': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-slate-500';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Moderation Queue" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Moderation Queue</h2>
                        <p className="text-muted-foreground">
                            Review and moderate exam questions assigned to your committee.
                        </p>
                    </div>
                </div>

                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Course</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Teacher</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Session/Semester</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {questions.map((question: any) => (
                                    <tr key={question.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">
                                            {question.course.code} - {question.course.name}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {question.teacher.name}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {question.session} <span className="text-muted-foreground">({question.semester})</span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge className={getStatusColor(question.status)}>
                                                {question.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <Link href={route('moderation.show', question.id)}>
                                                <Button size="sm">
                                                    <FileText className="mr-2 h-3 w-3" />
                                                    Review
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {questions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No questions assigned for moderation.
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
