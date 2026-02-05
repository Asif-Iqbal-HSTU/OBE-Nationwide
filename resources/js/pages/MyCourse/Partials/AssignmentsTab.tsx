import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Download } from 'lucide-react';

export default function AssignmentsTab({ course }: { course: any }) {
    if (!course) return null;

    const [createAssignOpen, setCreateAssignOpen] = useState(false);
    const [gradingOpen, setGradingOpen] = useState<any>({ isOpen: false, submission: null });

    const { data: assignData, setData: setAssignData, post: postAssign, processing: assignProcessing, reset: resetAssign } = useForm({
        title: '',
        description: '',
        due_date: '',
        total_marks: '',
        file: null as File | null,
    });

    const { data: gradeData, setData: setGradeData, put: putGrade, processing: gradeProcessing, reset: resetGrade } = useForm({
        obtained_marks: '',
        feedback: '',
    });

    const handleCreateAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        postAssign(route('teacher.assignments.store', course?.id), {
            onSuccess: () => {
                setCreateAssignOpen(false);
                resetAssign();
            }
        });
    };

    const handleGradeSubmission = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gradingOpen.submission) return;

        putGrade(route('teacher.submissions.update', gradingOpen.submission?.id), {
            onSuccess: () => {
                setGradingOpen({ isOpen: false, submission: null });
                resetGrade();
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Assignments</h3>
                    <p className="text-sm text-muted-foreground">Manage course assignments and marking</p>
                </div>
                <Button onClick={() => setCreateAssignOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Assignment
                </Button>
            </div>
            <div className="grid gap-4">
                {course.class_assignments?.map((assign: any) => (
                    <Card key={assign.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span>{assign.title}</span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    Due: {new Date(assign.due_date).toLocaleDateString()}
                                </span>
                            </CardTitle>
                            <CardDescription>
                                Total Marks: {assign.total_marks}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">{assign.description}</p>
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm">Submissions ({assign.submissions?.length || 0})</h4>
                                {assign.submissions?.map((sub: any) => (
                                    <div key={sub.id} className="flex justify-between items-center bg-muted p-2 rounded">
                                        <div className="text-sm">
                                            <span className="font-medium">Student ID: {sub.student_id}</span>
                                            <br />
                                            <span className="text-xs text-muted-foreground">
                                                Submitted: {new Date(sub.submitted_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {sub.file_path && (
                                                <a href={`/storage/${sub.file_path}`} target="_blank" rel="noreferrer">
                                                    <Button size="sm" variant="outline"><Download className="h-4 w-4" /></Button>
                                                </a>
                                            )}
                                            <Button size="sm" onClick={() => {
                                                setGradingOpen({ isOpen: true, submission: sub });
                                                setGradeData({ obtained_marks: sub.obtained_marks || '', feedback: sub.feedback || '' });
                                            }}>
                                                {sub.obtained_marks ? 'Re-grade' : 'Grade'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {(!course.class_assignments || course.class_assignments.length === 0) && (
                    <div className="text-center p-8 border rounded-md text-muted-foreground">
                        No assignments created yet.
                    </div>
                )}
            </div>

            {/* Create Assignment Dialog */}
            <Dialog open={createAssignOpen} onOpenChange={setCreateAssignOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Assignment</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAssignment} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={assignData.title} onChange={e => setAssignData('title', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={assignData.description} onChange={e => setAssignData('description', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input type="datetime-local" value={assignData.due_date} onChange={e => setAssignData('due_date', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Marks</Label>
                                <Input type="number" value={assignData.total_marks} onChange={e => setAssignData('total_marks', e.target.value)} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Attachment (Optional)</Label>
                            <Input type="file" onChange={e => setAssignData('file', e.target.files?.[0] || null)} />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={assignProcessing}>Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Grading Dialog */}
            <Dialog open={gradingOpen.isOpen} onOpenChange={open => setGradingOpen({ ...gradingOpen, isOpen: open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Grade Submission</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleGradeSubmission} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Obtained Marks</Label>
                            <Input type="number" value={gradeData.obtained_marks} onChange={e => setGradeData('obtained_marks', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Feedback</Label>
                            <Textarea value={gradeData.feedback} onChange={e => setGradeData('feedback', e.target.value)} />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={gradeProcessing}>Save Grade</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
