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
    const { data, setData, post, put, reset, processing } = useForm({
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

            setTeachingSelected(
                teachingArr.filter((t: string) => TEACHING_OPTIONS.includes(t)),
            );

            setAssessmentSelected(
                assessmentArr.filter((a: string) =>
                    ASSESSMENT_OPTIONS.includes(a),
                ),
            );

            setTeachingOther(
                teachingArr
                    .filter((t: string) => !TEACHING_OPTIONS.includes(t))
                    .join(', '),
            );

            setAssessmentOther(
                assessmentArr
                    .filter((a: string) => !ASSESSMENT_OPTIONS.includes(a))
                    .join(', '),
            );

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

    // Build comma-separated values before submit
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

        setData('teaching_strategy', teaching);
        setData('assessment_strategy', assessment);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!program || !course) return;

        buildStrategies();

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
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>
                        {data.id ? 'Edit Content' : 'Add Content'}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    id="content-form"
                    className="space-y-4 pt-4"
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
                        </div>

                        <div className="col-span-3 space-y-2">
                            <Label>Map to CLOs</Label>
                            <div className="grid max-h-[100px] grid-cols-3 gap-2 overflow-y-auto rounded border bg-slate-50 p-2">
                                {clos?.map((clo: any) => (
                                    <label
                                        key={clo.id}
                                        className="flex items-center gap-2 text-xs"
                                    >
                                        <input
                                            type="checkbox"
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
                                        CLO {clo.clo_no}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Teaching Strategy */}
                    <div className="space-y-2">
                        <Label>Teaching Strategy</Label>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {TEACHING_OPTIONS.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
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
                                value={teachingOther}
                                onChange={(e) =>
                                    setTeachingOther(e.target.value)
                                }
                            />
                        )}
                    </div>

                    {/* Assessment Strategy */}
                    <div className="space-y-2">
                        <Label>Assessment Strategy</Label>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {ASSESSMENT_OPTIONS.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
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
                                value={assessmentOther}
                                onChange={(e) =>
                                    setAssessmentOther(e.target.value)
                                }
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Content Description</Label>
                        <Textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                        />
                    </div>
                </form>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="content-form"
                        disabled={processing}
                    >
                        Save Content
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
