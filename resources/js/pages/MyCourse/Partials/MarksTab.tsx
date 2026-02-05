import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MarksTab({ course, students }: { course: any, students: any[] }) {
    if (!course) return null;

    const [marksOpen, setMarksOpen] = useState(false);

    const { data: marksData, setData: setMarksData, post: postMarks, processing: marksProcessing, reset: resetMarks } = useForm({
        exam_type: 'Quiz',
        total_marks: '10',
        marks: [] as { student_id: number, obtained_marks: string }[],
    });

    useEffect(() => {
        if (students && students.length > 0) {
            setMarksData('marks', students.map(s => ({ student_id: s.id, obtained_marks: '' })));
        }
    }, [students]);

    const handleMarkChange = (studentId: number, obtained_marks: string) => {
        const newMarks = marksData.marks.map(m =>
            m.student_id === studentId ? { ...m, obtained_marks } : m
        );
        setMarksData('marks', newMarks);
    };

    const handleEnterMarks = (e: React.FormEvent) => {
        e.preventDefault();
        postMarks(route('teacher.exam-marks.store', course?.id), {
            onSuccess: () => {
                setMarksOpen(false);
                resetMarks();
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Exam Marks</h3>
                    <p className="text-sm text-muted-foreground">Entry marks for exams (Quiz, Mid, Final)</p>
                </div>
                <Button onClick={() => setMarksOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Enter Marks
                </Button>
            </div>
            <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted">
                        <tr>
                            <th className="p-3 text-left">Exam</th>
                            <th className="p-3 text-left">Student ID</th>
                            <th className="p-3 text-right">Marks</th>
                            <th className="p-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {course.exam_marks?.map((mark: any) => (
                            <tr key={mark.id} className="hover:bg-muted/50 transition-colors">
                                <td className="p-3 capitalize font-medium">{mark.exam_type}</td>
                                <td className="p-3 uppercase">{mark.student?.student_id || 'N/A'}</td>
                                <td className="p-3 text-right">{mark.marks}</td>
                                <td className="p-3 text-right text-muted-foreground">{mark.total_marks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!course.exam_marks || course.exam_marks.length === 0) && (
                    <div className="text-center p-8 text-muted-foreground">
                        No marks recorded yet.
                    </div>
                )}
            </div>

            <Dialog open={marksOpen} onOpenChange={setMarksOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Enter Exam Marks</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEnterMarks} className="flex-1 flex flex-col overflow-hidden">
                        <div className="py-4 space-y-4 flex-1 overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Exam Type</Label>
                                    <Select
                                        value={marksData.exam_type}
                                        onValueChange={(val) => setMarksData('exam_type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Quiz">Quiz</SelectItem>
                                            <SelectItem value="Mid Term">Mid Term</SelectItem>
                                            <SelectItem value="Final">Final</SelectItem>
                                            <SelectItem value="Assignment">Assignment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total-marks">Total Marks</Label>
                                    <Input
                                        id="total-marks"
                                        type="number"
                                        value={marksData.total_marks}
                                        onChange={e => setMarksData('total_marks', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Label className="text-base font-semibold">Student List</Label>
                                <div className="space-y-2">
                                    {students?.map((student: any) => {
                                        const currentMark = marksData.marks.find(m => m.student_id === student.id);
                                        return (
                                            <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground uppercase">{student.student_id}</p>
                                                </div>
                                                <div className="w-24">
                                                    <Input
                                                        type="number"
                                                        placeholder="Marks"
                                                        value={currentMark?.obtained_marks || ''}
                                                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                        className="text-right"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="pt-4 border-t mt-4">
                            <Button type="button" variant="outline" onClick={() => setMarksOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={marksProcessing}>Save Marks</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
