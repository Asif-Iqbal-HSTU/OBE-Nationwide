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

const STRATEGY_OPTIONS = [
    'Lecture',
    'Demonstration',
    'Discussion',
    'Power point presentation',
    'Group work',
    'Others',
];

const AID_OPTIONS = [
    'Books',
    'Online Resources',
    'Multimedia',
    'Pictures',
    'Reports',
    'Charts',
    'Newspapers',
    'Handouts',
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

export default function LessonPlanModal({
    program,
    course,
    clos,
    lessonPlan,
    isOpen,
    onClose,
}: any) {
    const { data, setData, post, put, transform, reset, errors, processing } = useForm({
        id: null as number | null,
        week: '',
        topics: '',
        outcomes: '',
        teaching_strategies: '',
        teaching_aids: '',
        assessment_technique: '',
        clo_ids: [] as number[],
    });

    // Local UI state
    const [strategySelected, setStrategySelected] = useState<string[]>([]);
    const [aidSelected, setAidSelected] = useState<string[]>([]);
    const [assessmentSelected, setAssessmentSelected] = useState<string[]>([]);

    const [strategyOther, setStrategyOther] = useState('');
    const [aidOther, setAidOther] = useState('');
    const [assessmentOther, setAssessmentOther] = useState('');

    useEffect(() => {
        if (lessonPlan && isOpen) {
            const strategyArr = lessonPlan.teaching_strategies
                ? lessonPlan.teaching_strategies
                    .split(',')
                    .map((s: string) => s.trim())
                : [];
            const aidArr = lessonPlan.teaching_aids
                ? lessonPlan.teaching_aids.split(',').map((s: string) => s.trim())
                : [];
            const assessmentArr = lessonPlan.assessment_technique
                ? lessonPlan.assessment_technique
                    .split(',')
                    .map((s: string) => s.trim())
                : [];

            setStrategySelected(
                strategyArr.filter((s: string) => STRATEGY_OPTIONS.includes(s)),
            );
            setAidSelected(aidArr.filter((a: string) => AID_OPTIONS.includes(a)));
            setAssessmentSelected(
                assessmentArr.filter((a: string) =>
                    ASSESSMENT_OPTIONS.includes(a),
                ),
            );

            const sOther = strategyArr
                .filter((s: string) => !STRATEGY_OPTIONS.includes(s))
                .join(', ');
            const aOther = aidArr
                .filter((a: string) => !AID_OPTIONS.includes(a))
                .join(', ');
            const assOther = assessmentArr
                .filter((a: string) => !ASSESSMENT_OPTIONS.includes(a))
                .join(', ');

            if (sOther) {
                setStrategySelected((prev) => [...prev, 'Others']);
                setStrategyOther(sOther);
            }
            if (aOther) {
                setAidSelected((prev) => [...prev, 'Others']);
                setAidOther(aOther);
            }
            if (assOther) {
                setAssessmentSelected((prev) => [...prev, 'Others']);
                setAssessmentOther(assOther);
            }

            setData({
                id: lessonPlan.id,
                week: lessonPlan.week || '',
                topics: lessonPlan.topics || '',
                outcomes: lessonPlan.outcomes || '',
                teaching_strategies: lessonPlan.teaching_strategies || '',
                teaching_aids: lessonPlan.teaching_aids || '',
                assessment_technique: lessonPlan.assessment_technique || '',
                clo_ids: lessonPlan.clos
                    ? lessonPlan.clos.map((c: any) => c.id)
                    : [],
            });
        } else if (isOpen) {
            reset();
            setStrategySelected([]);
            setAidSelected([]);
            setAssessmentSelected([]);
            setStrategyOther('');
            setAidOther('');
            setAssessmentOther('');
        }
    }, [lessonPlan, isOpen]);

    const buildStrings = () => {
        const strategies = [
            ...strategySelected.filter((v) => v !== 'Others'),
            ...(strategySelected.includes('Others') && strategyOther
                ? strategyOther.split(',').map((s) => s.trim())
                : []),
        ].join(', ');

        const aids = [
            ...aidSelected.filter((v) => v !== 'Others'),
            ...(aidSelected.includes('Others') && aidOther
                ? aidOther.split(',').map((s) => s.trim())
                : []),
        ].join(', ');

        const assessments = [
            ...assessmentSelected.filter((v) => v !== 'Others'),
            ...(assessmentSelected.includes('Others') && assessmentOther
                ? assessmentOther.split(',').map((s) => s.trim())
                : []),
        ].join(', ');

        return { strategies, aids, assessments };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!program || !course) return;

        const { strategies, aids, assessments } = buildStrings();

        // transform is the correct Inertia way to modify data before it's sent
        // it applies to the subsequent post/put call
        transform((data: any) => ({
            ...data,
            teaching_strategies: strategies,
            teaching_aids: aids,
            assessment_technique: assessments,
        }));

        const url = data.id
            ? `/programs/${program.id}/courses/${course.id}/lesson-plans/${data.id}`
            : `/programs/${program.id}/courses/${course.id}/lesson-plans`;

        if (data.id) {
            put(url, { onSuccess: () => onClose() });
        } else {
            post(url, { onSuccess: () => onClose() });
        }
    };

    const toggle = (setter: any, value: string) => {
        setter((prev: string[]) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value],
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>
                        {data.id
                            ? 'Edit Weekly Lesson Plan'
                            : 'Add Weekly Lesson Plan'}
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    id="lesson-plan-form"
                    className="space-y-6 pt-4"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="week">Date and Week Covered</Label>
                            <Input
                                id="week"
                                placeholder="e.g., Week-1"
                                value={data.week}
                                onChange={(e) => setData('week', e.target.value)}
                            />
                            {errors.week && (
                                <p className="text-xs text-red-500">
                                    {errors.week}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="topics">Topics</Label>
                            <Input
                                id="topics"
                                placeholder="Enter topics..."
                                value={data.topics}
                                onChange={(e) =>
                                    setData('topics', e.target.value)
                                }
                            />
                            {errors.topics && (
                                <p className="text-xs text-red-500">
                                    {errors.topics}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="outcomes">Specific Outcomes (KSA)</Label>
                        <Textarea
                            id="outcomes"
                            placeholder="What students will achieve..."
                            value={data.outcomes}
                            onChange={(e) => setData('outcomes', e.target.value)}
                        />
                        {errors.outcomes && (
                            <p className="text-xs text-red-500">
                                {errors.outcomes}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 rounded-lg border bg-slate-50/50 p-4">
                        <Label className="text-blue-700 font-bold">Teaching Strategies & Activities</Label>
                        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                            {STRATEGY_OPTIONS.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={strategySelected.includes(opt)}
                                        onChange={() =>
                                            toggle(setStrategySelected, opt)
                                        }
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                        {strategySelected.includes('Others') && (
                            <Input
                                placeholder="Specify others (comma separated)..."
                                className="mt-2"
                                value={strategyOther}
                                onChange={(e) =>
                                    setStrategyOther(e.target.value)
                                }
                            />
                        )}
                    </div>

                    <div className="space-y-3 rounded-lg border bg-slate-50/50 p-4">
                        <Label className="text-blue-700 font-bold">Teaching Aids/Tools/Materials</Label>
                        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                            {AID_OPTIONS.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={aidSelected.includes(opt)}
                                        onChange={() =>
                                            toggle(setAidSelected, opt)
                                        }
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                        {aidSelected.includes('Others') && (
                            <Input
                                placeholder="Specify others (comma separated)..."
                                className="mt-2"
                                value={aidOther}
                                onChange={(e) => setAidOther(e.target.value)}
                            />
                        )}
                    </div>

                    <div className="space-y-3 rounded-lg border bg-slate-50/50 p-4">
                        <Label className="text-blue-700 font-bold">Assessment Technique</Label>
                        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                            {ASSESSMENT_OPTIONS.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={assessmentSelected.includes(opt)}
                                        onChange={() =>
                                            toggle(setAssessmentSelected, opt)
                                        }
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                        {assessmentSelected.includes('Others') && (
                            <Input
                                placeholder="Specify others (comma separated)..."
                                className="mt-2"
                                value={assessmentOther}
                                onChange={(e) =>
                                    setAssessmentOther(e.target.value)
                                }
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Alignment with CLOs</Label>
                        <div className="grid max-h-[120px] grid-cols-2 gap-2 overflow-y-auto rounded-lg border bg-background p-3">
                            {clos?.map((clo: any) => (
                                <label
                                    key={clo.id}
                                    className="flex cursor-pointer items-center gap-2 rounded p-1 text-sm hover:bg-slate-50"
                                >
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={data.clo_ids.includes(clo.id)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setData(
                                                'clo_ids',
                                                checked
                                                    ? [...data.clo_ids, clo.id]
                                                    : data.clo_ids.filter(
                                                        (id) => id !== clo.id,
                                                    ),
                                            );
                                        }}
                                    />
                                    <span className="font-bold text-blue-600">
                                        CLO {clo.clo_no}
                                    </span>
                                </label>
                            ))}
                            {(!clos || clos.length === 0) && (
                                <p className="col-span-2 text-xs italic text-muted-foreground text-center">
                                    No CLOs defined for this course.
                                </p>
                            )}
                        </div>
                        {errors.clo_ids && (
                            <p className="text-xs text-red-500">
                                {errors.clo_ids}
                            </p>
                        )}
                    </div>
                </form>
                <DialogFooter className="border-t pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="lesson-plan-form"
                        disabled={processing || !program || !course}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {data.id ? 'Save Changes' : 'Add Lesson Plan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
