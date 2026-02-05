import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    FileQuestion,
    Clock,
    Send,
    CheckCircle,
    AlertCircle,
    Pencil,
    Printer,
    Eye
} from 'lucide-react';

export default function ExamQuestionsTab({ examQuestions, assignment }: { examQuestions: any[], assignment: any }) {
    if (!assignment) return null;
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Draft':
                return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Draft</Badge>;
            case 'Submitted':
                return <Badge variant="outline" className="bg-blue-50"><Send className="mr-1 h-3 w-3" />Submitted</Badge>;
            case 'Approved':
                return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
            case 'RevisionNeeded':
                return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" />Revision Needed</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Exam Questions</h3>
                    <p className="text-sm text-muted-foreground">Create and manage exam question papers for this course</p>
                </div>
                <Link href={`/my-courses/${assignment?.id}/exam-questions/create`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Question Paper
                    </Button>
                </Link>
            </div>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Session</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Semester</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Total Marks</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Committee</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examQuestions?.map((eq: any) => (
                            <tr key={eq.id} className="border-t">
                                <td className="px-4 py-3 font-medium">{eq.session}</td>
                                <td className="px-4 py-3">{eq.semester}</td>
                                <td className="px-4 py-3">{eq.total_marks}</td>
                                <td className="px-4 py-3">{getStatusBadge(eq.status)}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {eq.moderation_committee?.session || '-'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex gap-1 justify-end">
                                        {(eq.status === 'Draft' || eq.status === 'RevisionNeeded') && (
                                            <Link href={`/exam-questions/${eq.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {eq.status === 'Approved' && (
                                            <Link href={`/exam-questions/${eq.id}/print`}>
                                                <Button variant="ghost" size="sm">
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        <Link href={`/exam-questions/${eq.id}/print`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {(eq.status === 'Draft' || eq.status === 'RevisionNeeded') && eq.moderation_committee_id && (
                                            <Link href={`/exam-questions/${eq.id}/submit`} method="post" as="button" preserveScroll>
                                                <Button variant="ghost" size="sm" title="Submit for Moderation">
                                                    <Send className="h-4 w-4 text-blue-600" />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!examQuestions || examQuestions.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                        <FileQuestion className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No exam questions created yet.</p>
                        <p className="text-sm">Click "Create Question Paper" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
