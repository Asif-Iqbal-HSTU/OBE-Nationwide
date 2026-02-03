import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AssignmentModal({
    program,
    course,
    isOpen,
    onClose,
}: any) {
    const { data, setData, post, processing, reset } = useForm({
        teacher_id: '',
        session: '',
        semester: '',
    });

    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        if (isOpen && program?.id) {
            axios.get(`/teachers?department_id=${program.department_id}`).then((res) => {
                setTeachers(res.data);
            });
        }
    }, [isOpen, program]);

    useEffect(() => {
        if (course) {
            setData({
                teacher_id: course.assignments?.[0]?.teacher_id || '',
                session: course.session || '',
                semester: course.semester || '',
            });
        }
    }, [course]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!program?.id || !course?.id) return;

        post(`/programs/${program.id}/courses/${course.id}/assignments`, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Course to Teacher</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} id="assignment-form" className="space-y-4">
                    <div className="space-y-1">
                        <Label>Select Teacher</Label>
                        <select
                            className="w-full rounded-lg border bg-background p-2 text-sm"
                            value={data.teacher_id}
                            onChange={(e) => setData('teacher_id', e.target.value)}
                            required
                        >
                            <option value="">Choose a teacher...</option>
                            {teachers.map((t: any) => (
                                <option key={t.id} value={t.id}>
                                    {t.name} ({t.designation})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Session</Label>
                            <input
                                className="w-full rounded-lg border bg-background p-2 text-sm"
                                value={data.session}
                                onChange={(e) => setData('session', e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Semester</Label>
                            <input
                                className="w-full rounded-lg border bg-background p-2 text-sm"
                                value={data.semester}
                                onChange={(e) => setData('semester', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="assignment-form" disabled={processing || !course} className="bg-blue-600 hover:bg-blue-700">
                        {course?.assignments?.length > 0 ? 'Reassign' : 'Assign'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
