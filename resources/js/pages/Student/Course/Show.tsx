import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    BookOpen, FileText, CheckCircle, GraduationCap, AlertCircle,
    Upload, FileQuestion
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function Show({
    course, assignments, attendances, examMarks,
    publicQuestions, myQuestions
}: any) {

    // Assignment Submission Form
    const { data: subData, setData: setSubData, post: postSub, processing: subProcessing, reset: resetSub } = useForm({
        file: null as File | null,
    });

    const submitAssignment = (e: React.FormEvent, assignmentId: number) => {
        e.preventDefault();
        postSub(route('student.assignments.submit', assignmentId), {
            onSuccess: () => resetSub(),
        });
    };

    // Support Question Form
    const { data: sqData, setData: setSqData, post: postSq, processing: sqProcessing, reset: resetSq } = useForm({
        question: '',
        is_public: false,
    });

    const submitQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        postSq(route('student.support.store', course.id), {
            onSuccess: () => resetSq(),
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800';
            case 'absent': return 'bg-red-100 text-red-800';
            case 'late': return 'bg-yellow-100 text-yellow-800';
            case 'excuse': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100';
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: route('student.dashboard') },
            { title: course.code, href: '#' }
        ]}>
            <Head title={course.name} />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">{course.name}</h1>
                    <div className="flex gap-2">
                        <Badge variant="outline">{course.code}</Badge>
                        <Badge>{course.credit_hours} Credits</Badge>
                    </div>
                    {course.summary && <p className="text-muted-foreground mt-2">{course.summary}</p>}
                </div>

                <Tabs defaultValue="assignments" className="w-full">
                    <TabsList className="mb-4 flex flex-wrap h-auto gap-2">
                        <TabsTrigger value="assignments"><FileText className="mr-2 h-4 w-4" /> Assignments</TabsTrigger>
                        <TabsTrigger value="attendance"><CheckCircle className="mr-2 h-4 w-4" /> Attendance</TabsTrigger>
                        <TabsTrigger value="marks"><GraduationCap className="mr-2 h-4 w-4" /> Marks</TabsTrigger>
                        <TabsTrigger value="support"><AlertCircle className="mr-2 h-4 w-4" /> Support</TabsTrigger>
                    </TabsList>

                    <TabsContent value="assignments" className="space-y-4">
                        <h2 className="text-xl font-semibold">Course Assignments</h2>
                        <div className="grid gap-4">
                            {assignments.map((assign: any) => {
                                const mySubmission = assign.submissions?.[0];
                                return (
                                    <Card key={assign.id}>
                                        <CardHeader>
                                            <div className="flex justify-between">
                                                <CardTitle>{assign.title}</CardTitle>
                                                <Badge variant={mySubmission ? "secondary" : "default"}>
                                                    {mySubmission ? "Submitted" : "Pending"}
                                                </Badge>
                                            </div>
                                            <CardDescription>
                                                Due: {new Date(assign.due_date).toLocaleDateString()} • Marks: {assign.total_marks}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p>{assign.description}</p>
                                            {assign.file_path && (
                                                <a href={`/storage/${assign.file_path}`} target="_blank" className="text-blue-600 hover:underline">
                                                    Download Attachment
                                                </a>
                                            )}

                                            {mySubmission ? (
                                                <div className="bg-muted p-4 rounded-md">
                                                    <p className="font-medium">Your Submission</p>
                                                    <p className="text-sm">Submitted on: {new Date(mySubmission.submitted_at).toLocaleString()}</p>
                                                    {mySubmission.obtained_marks !== null && (
                                                        <div className="mt-2">
                                                            <span className="font-bold text-green-600">
                                                                Grade: {mySubmission.obtained_marks} / {assign.total_marks}
                                                            </span>
                                                            {mySubmission.feedback && (
                                                                <p className="text-sm mt-1 text-muted-foreground">Feedback: {mySubmission.feedback}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <form onSubmit={(e) => submitAssignment(e, assign.id)} className="space-y-2 border-t pt-4">
                                                    <Label>Upload Solution</Label>
                                                    <Input
                                                        type="file"
                                                        onChange={(e) => setSubData('file', e.target.files?.[0] || null)}
                                                        required
                                                    />
                                                    <Button type="submit" disabled={subProcessing}>
                                                        <Upload className="mr-2 h-4 w-4" /> Submit Assignment
                                                    </Button>
                                                </form>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                            {assignments.length === 0 && <p className="text-muted-foreground">No assignments posted.</p>}
                        </div>
                    </TabsContent>

                    <TabsContent value="attendance" className="space-y-4">
                        <h2 className="text-xl font-semibold">My Attendance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {attendances.map((att: any) => (
                                <div key={att.id} className={`p-4 rounded-md border text-center ${getStatusColor(att.status)}`}>
                                    <div className="font-bold">{new Date(att.date).toLocaleDateString()}</div>
                                    <div className="uppercase text-sm mt-1">{att.status}</div>
                                </div>
                            ))}
                        </div>
                        {attendances.length === 0 && <p className="text-muted-foreground">No attendance records found.</p>}
                    </TabsContent>

                    <TabsContent value="marks" className="space-y-4">
                        <h2 className="text-xl font-semibold">Exam Results</h2>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="p-3 text-left">Exam</th>
                                        <th className="p-3 text-right">Obtained</th>
                                        <th className="p-3 text-right">Total</th>
                                        <th className="p-3 text-right">%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examMarks.map((mark: any) => (
                                        <tr key={mark.id} className="border-t">
                                            <td className="p-3 font-medium capitalize">{mark.exam_type}</td>
                                            <td className="p-3 text-right">{mark.marks}</td>
                                            <td className="p-3 text-right">{mark.total_marks}</td>
                                            <td className="p-3 text-right">
                                                {((mark.marks / mark.total_marks) * 100).toFixed(1)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {examMarks.length === 0 && <p className="text-muted-foreground mt-4">No marks recorded yet.</p>}
                    </TabsContent>

                    <TabsContent value="support" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ask a Question</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitQuestion} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Your Question</Label>
                                        <Textarea
                                            value={sqData.question}
                                            onChange={e => setSqData('question', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="public"
                                            checked={sqData.is_public}
                                            onChange={e => setSqData('is_public', e.target.checked)}
                                        />
                                        <Label htmlFor="public">Make Public (Visible to other students)</Label>
                                    </div>
                                    <Button type="submit" disabled={sqProcessing}>
                                        <FileQuestion className="mr-2 h-4 w-4" /> Post Question
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">My Questions</h3>
                            {myQuestions.map((q: any) => (
                                <Card key={q.id}>
                                    <CardContent className="pt-6">
                                        <p className="font-medium">Q: {q.question}</p>
                                        {q.answer ? (
                                            <div className="mt-2 bg-blue-50 p-3 rounded-md text-sm">
                                                <span className="font-semibold text-blue-700">Answer:</span> {q.answer}
                                                <div className="text-xs text-blue-500 mt-1">
                                                    by {q.answered_by?.name || 'Teacher'}
                                                </div>
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="mt-2">Pending Answer</Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Public Questions</h3>
                            {publicQuestions.map((q: any) => (
                                <Card key={q.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between">
                                            <p className="font-medium">Q: {q.question}</p>
                                            <span className="text-xs text-muted-foreground">by {q.student?.user?.name || 'Student'}</span>
                                        </div>
                                        {q.answer && (
                                            <div className="mt-2 bg-green-50 p-3 rounded-md text-sm">
                                                <span className="font-semibold text-green-700">Answer:</span> {q.answer}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
