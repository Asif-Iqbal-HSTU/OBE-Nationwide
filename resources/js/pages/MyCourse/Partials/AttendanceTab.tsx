import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Check, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function AttendanceTab({ course, students }: { course: any, students: any[] }) {
    if (!course) return null;

    const [attendanceOpen, setAttendanceOpen] = useState(false);

    const { data: attData, setData: setAttData, post: postAtt, processing: attProcessing, reset: resetAtt } = useForm({
        date: new Date().toISOString().split('T')[0],
        attendances: [] as { student_id: number, status: string }[],
    });

    useEffect(() => {
        if (students && students.length > 0) {
            setAttData('attendances', students.map(s => ({ student_id: s.id, status: 'present' })));
        }
    }, [students]);

    const handleStatusChange = (studentId: number, status: string) => {
        const newAttendances = attData.attendances.map(a =>
            a.student_id === studentId ? { ...a, status } : a
        );
        setAttData('attendances', newAttendances);
    };

    const handleTakeAttendance = (e: React.FormEvent) => {
        e.preventDefault();
        postAtt(route('teacher.attendance.store', course?.id), {
            onSuccess: () => {
                setAttendanceOpen(false);
                resetAtt();
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Attendance</h3>
                    <p className="text-sm text-muted-foreground">Track student attendance</p>
                </div>
                <Button onClick={() => setAttendanceOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Take Attendance
                </Button>
            </div>
            <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted">
                        <tr>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Student ID</th>
                            <th className="p-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {course.attendances?.map((att: any) => (
                            <tr key={att.id} className="hover:bg-muted/50 transition-colors">
                                <td className="p-3">{new Date(att.date).toLocaleDateString()}</td>
                                <td className="p-3 font-medium uppercase">{att.student?.student_id || 'N/A'}</td>
                                <td className="p-3 text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${att.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {att.status === 'present' ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                        {att.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!course.attendances || course.attendances.length === 0) && (
                    <div className="text-center p-8 text-muted-foreground">
                        No attendance records found.
                    </div>
                )}
            </div>

            <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Take Attendance</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTakeAttendance} className="flex-1 flex flex-col overflow-hidden">
                        <div className="py-4 space-y-4 flex-1 overflow-y-auto pr-2">
                            <div className="space-y-2">
                                <Label htmlFor="attendance-date">Date</Label>
                                <Input
                                    id="attendance-date"
                                    type="date"
                                    value={attData.date}
                                    onChange={e => setAttData('date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <Label className="text-base font-semibold">Student List</Label>
                                <div className="space-y-2">
                                    {students?.map((student: any) => {
                                        const currentAtt = attData.attendances.find(a => a.student_id === student.id);
                                        return (
                                            <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.student_id}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={currentAtt?.status === 'present' ? 'default' : 'outline'}
                                                        className={currentAtt?.status === 'present' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                                                        onClick={() => handleStatusChange(student.id, 'present')}
                                                    >
                                                        Present
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={currentAtt?.status === 'absent' ? 'default' : 'outline'}
                                                        className={currentAtt?.status === 'absent' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                                                        onClick={() => handleStatusChange(student.id, 'absent')}
                                                    >
                                                        Absent
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="pt-4 border-t mt-4">
                            <Button type="button" variant="outline" onClick={() => setAttendanceOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={attProcessing}>Save Attendance</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
