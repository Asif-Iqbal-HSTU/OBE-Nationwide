import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { CheckCircle, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Moderation',
        href: '/moderation',
    },
    {
        title: 'Review',
        href: '#',
    },
];

export default function Show({ examQuestion }: any) {
    const [showRevisionDialog, setShowRevisionDialog] = useState(false);

    const approveForm = useForm({});
    const revisionForm = useForm({
        feedback: '',
    });

    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this question paper? It will be marked as ready for final examination.')) {
            approveForm.post(route('moderation.approve', examQuestion.id));
        }
    };

    const handleRequestRevision = (e: React.FormEvent) => {
        e.preventDefault();
        revisionForm.post(route('moderation.revision', examQuestion.id), {
            onSuccess: () => setShowRevisionDialog(false),
        });
    };

    const getBloomsColor = (level: string) => {
        const colors: Record<string, string> = {
            Remember: 'bg-gray-100 text-gray-800',
            Understand: 'bg-blue-100 text-blue-800',
            Apply: 'bg-green-100 text-green-800',
            Analyze: 'bg-yellow-100 text-yellow-800',
            Evaluate: 'bg-orange-100 text-orange-800',
            Create: 'bg-purple-100 text-purple-800',
        };
        return colors[level] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Exam Question" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header with Actions */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/moderation">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            </Link>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Moderation Review</h2>
                        <p className="text-muted-foreground">
                            {examQuestion.course?.code} - {examQuestion.course?.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant={examQuestion.status === 'Approved' ? 'default' : 'outline'} className="text-sm px-3 py-1">
                            {examQuestion.status}
                        </Badge>

                        {examQuestion.status !== 'Approved' && (
                            <>
                                <Dialog open={showRevisionDialog} onOpenChange={setShowRevisionDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                            <AlertCircle className="mr-2 h-4 w-4" />
                                            Request Revision
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Request Revision</DialogTitle>
                                            <DialogDescription>
                                                Provide feedback for the course teacher about what needs to be changed.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleRequestRevision}>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="feedback">Feedback / Comments</Label>
                                                    <Textarea
                                                        id="feedback"
                                                        value={revisionForm.data.feedback}
                                                        onChange={(e) => revisionForm.setData('feedback', e.target.value)}
                                                        placeholder="Please describe what needs to be revised..."
                                                        className="min-h-[120px]"
                                                        required
                                                    />
                                                    {revisionForm.errors.feedback && (
                                                        <p className="text-sm text-red-500">{revisionForm.errors.feedback}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setShowRevisionDialog(false)}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" variant="destructive" disabled={revisionForm.processing}>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Send Feedback
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Button onClick={handleApprove} disabled={approveForm.processing}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Course & Paper Details */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Paper Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 text-sm">
                                <span className="font-medium text-muted-foreground">Course Teacher:</span>
                                <span>{examQuestion.teacher?.name}</span>
                            </div>
                            <div className="grid grid-cols-2 text-sm">
                                <span className="font-medium text-muted-foreground">Session:</span>
                                <span>{examQuestion.session}</span>
                            </div>
                            <div className="grid grid-cols-2 text-sm">
                                <span className="font-medium text-muted-foreground">Semester:</span>
                                <span>{examQuestion.semester}</span>
                            </div>
                            <div className="grid grid-cols-2 text-sm">
                                <span className="font-medium text-muted-foreground">Total Marks:</span>
                                <span>{examQuestion.total_marks}</span>
                            </div>
                            <div className="grid grid-cols-2 text-sm">
                                <span className="font-medium text-muted-foreground">Duration:</span>
                                <span>{examQuestion.duration}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Moderation Committee</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-sm">
                                <span className="font-medium text-muted-foreground block mb-1">Chairman:</span>
                                <span>{examQuestion.moderation_committee?.chairman?.name || 'Not assigned'}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-muted-foreground block mb-1">Members:</span>
                                <div className="space-y-1">
                                    {examQuestion.moderation_committee?.members?.map((member: any) => (
                                        <div key={member.id} className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                            <span>{member.teacher?.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Previous Feedback if any */}
                {examQuestion.moderator_feedback && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="text-yellow-800">Previous Feedback</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm text-yellow-900">{examQuestion.moderator_feedback}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Questions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Questions</CardTitle>
                        <CardDescription>
                            Review each question for CLO alignment and Bloom's taxonomy level appropriateness.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b bg-muted/50">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[8%]">No.</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[45%]">Question</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[10%]">Marks</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[12%]">CLO</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">Bloom's Level</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {examQuestion.items?.map((item: any) => (
                                            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-top font-medium">
                                                    {item.question_label}
                                                </td>
                                                <td className="p-4 align-top whitespace-pre-wrap">
                                                    {item.question_text}
                                                </td>
                                                <td className="p-4 align-top">
                                                    {item.marks}
                                                </td>
                                                <td className="p-4 align-top">
                                                    <Badge variant="outline" className="font-medium">
                                                        CLO {item.clo?.clo_no || 'N/A'}
                                                    </Badge>
                                                    {item.clo?.clo_desc && (
                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                            {item.clo.clo_desc}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="p-4 align-top">
                                                    <Badge className={getBloomsColor(item.blooms_taxonomy_level)}>
                                                        {item.blooms_taxonomy_level}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{examQuestion.items?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">Total Questions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                                {examQuestion.items?.reduce((sum: number, item: any) => sum + parseFloat(item.marks), 0) || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Total Marks Covered</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                                {new Set(examQuestion.items?.map((i: any) => i.clo_id)).size || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">CLOs Covered</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">
                                {new Set(examQuestion.items?.map((i: any) => i.blooms_taxonomy_level)).size || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Bloom's Levels Used</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
