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
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

const TEACHING_OPTIONS = [
    'Lecture',
    'Demonstration',
    'Discussion',
    'Power point presentation',
    'Others',
];

const ASSESSMENT_OPTIONS = [
    'MCQ',
    'Quiz',
    'Assignment',
    'Presentation',
    'Final Examination',
    'Others',
];

export default function ContentModal({
    program,
    course,
    clos,
    content,
    isOpen,
    onClose,
}: any) {
    const { data, setData, post, put, transform, reset, processing, errors } = useForm({
        id: null as number | null,
        content_no: '',
        content: '',
        teaching_strategy: '',
        assessment_strategy: '',
        clo_ids: [] as number[],
    });

    // Local UI state
    const [teachingSelected, setTeachingSelected] = useState<string[]>([]);
    const [assessmentSelected, setAssessmentSelected] = useState<string[]>([]);
    const [teachingOther, setTeachingOther] = useState('');
    const [assessmentOther, setAssessmentOther] = useState('');

    // Populate when editing
    useEffect(() => {
        if (content && isOpen) {
            const teachingArr = content.teaching_strategy
                ? content.teaching_strategy
                    .split(',')
                    .map((s: string) => s.trim())
                : [];

            const assessmentArr = content.assessment_strategy
                ? content.assessment_strategy
                    .split(',')
                    .map((s: string) => s.trim())
                : [];

            const baseTeaching = teachingArr.filter((t: string) => TEACHING_OPTIONS.includes(t));
            const baseAssessment = assessmentArr.filter((a: string) => ASSESSMENT_OPTIONS.includes(a));

            setTeachingSelected(baseTeaching);
            setAssessmentSelected(baseAssessment);

            const tOther = teachingArr
                .filter((t: string) => !TEACHING_OPTIONS.includes(t))
                .join(', ');

            const aOther = assessmentArr
                .filter((a: string) => !ASSESSMENT_OPTIONS.includes(a))
                .join(', ');

            if (tOther) {
                setTeachingSelected(prev => [...prev, 'Others']);
                setTeachingOther(tOther);
            }

            if (aOther) {
                setAssessmentSelected(prev => [...prev, 'Others']);
                setAssessmentOther(aOther);
            }

            setData({
                id: content.id,
                content_no: content.content_no ?? '',
                content: content.content ?? '',
                teaching_strategy: content.teaching_strategy ?? '',
                assessment_strategy: content.assessment_strategy ?? '',
                clo_ids: content.clos ? content.clos.map((c: any) => c.id) : [],
            });
        } else if (isOpen) {
            reset();
            setTeachingSelected([]);
            setAssessmentSelected([]);
            setTeachingOther('');
            setAssessmentOther('');
        }
    }, [content, isOpen]);

    // Toggle handlers
    const toggleTeaching = (value: string) => {
        setTeachingSelected((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value],
        );
    };

    const toggleAssessment = (value: string) => {
        setAssessmentSelected((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value],
        );
    };

    // Build comma-separated values
    const buildStrategies = () => {
        const teaching = [
            ...teachingSelected.filter((v) => v !== 'Others'),
            ...(teachingSelected.includes('Others') && teachingOther
                ? teachingOther.split(',').map((s) => s.trim())
                : []),
        ].join(', ');

        const assessment = [
            ...assessmentSelected.filter((v) => v !== 'Others'),
            ...(assessmentSelected.includes('Others') && assessmentOther
                ? assessmentOther.split(',').map((s) => s.trim())
                : []),
        ].join(', ');

        return { teaching, assessment };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!program || !course) return;

        const { teaching, assessment } = buildStrategies();

        transform((data: any) => ({
            ...data,
            teaching_strategy: teaching,
            assessment_strategy: assessment,
        }));

        const url = data.id
            ? `/programs/${program.id}/courses/${course.id}/contents/${data.id}`
            : `/programs/${program.id}/courses/${course.id}/contents`;

        if (data.id) {
            put(url, { onSuccess: () => onClose() });
        } else {
            post(url, { onSuccess: () => onClose() });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>
                        {data.id ? 'Edit Content' : 'Add Content'}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    id="content-form"
                    className="space-y-6 pt-4"
                >
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 space-y-2">
                            <Label>No.</Label>
                            <Input
                                type="number"
                                value={data.content_no}
                                onChange={(e) =>
                                    setData('content_no', e.target.value)
                                }
                            />
                            {errors.content_no && <p className="text-xs text-red-500">{errors.content_no}</p>}
                        </div>

                        <div className="col-span-3 space-y-2">
                            <Label className="font-bold text-slate-700">Map to CLOs</Label>
                            <div className="grid max-h-[100px] grid-cols-3 gap-2 overflow-y-auto rounded-lg border bg-slate-50/50 p-2">
                                {clos?.map((clo: any) => (
                                    <label
                                        key={clo.id}
                                        className="flex cursor-pointer items-center gap-2 rounded p-1 text-xs hover:bg-white"
                                    >
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={
                                                data.clo_ids?.includes(
                                                    clo.id,
                                                ) || false
                                            }
                                            onChange={() => {
                                                const current =
                                                    data.clo_ids ?? [];
                                                setData(
                                                    'clo_ids',
                                                    current.includes(clo.id)
                                                        ? current.filter(
                                                            (id) =>
                                                                id !== clo.id,
                                                        )
                                                        : [...current, clo.id],
                                                );
                                            }}
                                        />
                                        <span className="font-bold text-blue-600">CLO {clo.clo_no}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.clo_ids && <p className="text-xs text-red-500">{errors.clo_ids}</p>}
                        </div>
                    </div>

                    <div className="space-y-3 rounded-lg border bg-slate-50/50 p-4">
                        <Label className="text-blue-700 font-bold">Teaching Strategy</Label>
                        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                            {TEACHING_OPTIONS.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex cursor-pointer items-center gap-2 hover:text-blue-600 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={teachingSelected.includes(opt)}
                                        onChange={() => toggleTeaching(opt)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>

                        {teachingSelected.includes('Others') && (
                            <Input
                                placeholder="Enter other strategies separated by comma"
                                className="mt-2"
                                value={teachingOther}
                                onChange={(e) =>
                                    setTeachingOther(e.target.value)
                                }
                            />
                        )}
                        {errors.teaching_strategy && <p className="text-xs text-red-500">{errors.teaching_strategy}</p>}
                    </div>

                    <div className="space-y-3 rounded-lg border bg-slate-50/50 p-4">
                        <Label className="text-blue-700 font-bold">Assessment Strategy</Label>
                        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                            {ASSESSMENT_OPTIONS.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex cursor-pointer items-center gap-2 hover:text-blue-600 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={assessmentSelected.includes(
                                            opt,
                                        )}
                                        onChange={() => toggleAssessment(opt)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>

                        {assessmentSelected.includes('Others') && (
                            <Input
                                placeholder="Enter other assessments separated by comma"
                                className="mt-2"
                                value={assessmentOther}
                                onChange={(e) =>
                                    setAssessmentOther(e.target.value)
                                }
                            />
                        )}
                        {errors.assessment_strategy && <p className="text-xs text-red-500">{errors.assessment_strategy}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Content Description</Label>
                        <Textarea
                            placeholder="Enter description of the course content..."
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="min-h-[100px]"
                        />
                        {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
                    </div>
                </form>

                <DialogFooter className="border-t pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="content-form"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Save Content
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

