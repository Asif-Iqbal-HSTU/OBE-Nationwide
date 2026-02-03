import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

export default function CourseModal({
    program,
    course,
    isOpen,
    onClose,
}: any) {
    const { data, setData, post, put, reset, errors, processing } = useForm({
        id: null as number | null,
        name: '',
        code: '',
        credit_hours: '',
        level: '',
        semester: '',
        session: '',
        type_theory_sessional: 'Theory',
        type_core_optional: 'Core',
        prerequisite: '',
        summary: '',
    });

    useEffect(() => {
        if (course && isOpen) {
            setData({
                id: course.id,
                name: course.name || '',
                code: course.code || '',
                credit_hours: course.credit_hours || '',
                level: course.level || '',
                semester: course.semester || '',
                session: course.session || '',
                type_theory_sessional: course.type_theory_sessional || 'Theory',
                type_core_optional: course.type_core_optional || 'Core',
                prerequisite: course.prerequisite || '',
                summary: course.summary || '',
            });
        } else if (isOpen) {
            reset();
        }
    }, [course, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!program) return;

        const url = data.id
            ? `/programs/${program.id}/courses/${data.id}`
            : `/programs/${program.id}/courses`;

        if (data.id) {
            put(url, { onSuccess: () => onClose() });
        } else {
            post(url, { onSuccess: () => onClose() });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {data.id ? 'Edit Course' : 'Add New Course'}
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    id="course-form"
                    className="space-y-4 pt-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="code" className="text-xs uppercase text-muted-foreground">Course Code</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="CSE 101"
                            />
                            {errors.code && (
                                <p className="text-[10px] text-red-500">{errors.code}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="credits" className="text-xs uppercase text-muted-foreground">Credits</Label>
                            <Input
                                id="credits"
                                type="number"
                                step="0.5"
                                value={data.credit_hours}
                                onChange={(e) => setData('credit_hours', e.target.value)}
                                placeholder="3.0"
                            />
                            {errors.credit_hours && (
                                <p className="text-[10px] text-red-500">{errors.credit_hours}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs uppercase text-muted-foreground">Course Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Computer Fundamentals"
                        />
                        {errors.name && (
                            <p className="text-[10px] text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Level</Label>
                            <Input
                                value={data.level}
                                onChange={(e) => setData('level', e.target.value)}
                                placeholder="1"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Semester</Label>
                            <Input
                                value={data.semester}
                                onChange={(e) => setData('semester', e.target.value)}
                                placeholder="I"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Session</Label>
                            <Input
                                value={data.session}
                                onChange={(e) => setData('session', e.target.value)}
                                placeholder="2023-24"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs uppercase text-muted-foreground">Type</Label>
                            <select
                                className="w-full rounded-lg border bg-background p-2 text-sm"
                                value={data.type_theory_sessional}
                                onChange={(e) => setData('type_theory_sessional', e.target.value)}
                            >
                                <option value="Theory">Theory</option>
                                <option value="Sessional">Sessional</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs uppercase text-muted-foreground">Category</Label>
                            <select
                                className="w-full rounded-lg border bg-background p-2 text-sm"
                                value={data.type_core_optional}
                                onChange={(e) => setData('type_core_optional', e.target.value)}
                            >
                                <option value="Core">Core</option>
                                <option value="Optional">Optional</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="prerequisite" className="text-xs uppercase text-muted-foreground">Prerequisite</Label>
                        <Input
                            id="prerequisite"
                            value={data.prerequisite}
                            onChange={(e) => setData('prerequisite', e.target.value)}
                            placeholder="None or Course Code"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="summary" className="text-xs uppercase text-muted-foreground">Course Summary</Label>
                        <Textarea
                            id="summary"
                            className="min-h-[80px]"
                            value={data.summary}
                            onChange={(e) => setData('summary', e.target.value)}
                            placeholder="Brief overview..."
                        />
                    </div>
                </form>
                <DialogFooter className="border-t pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="course-form"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {data.id ? 'Update Course' : 'Create Course'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
