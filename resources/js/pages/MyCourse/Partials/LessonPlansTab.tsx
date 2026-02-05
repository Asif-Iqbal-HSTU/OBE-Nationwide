import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import LessonPlanModal from '../../Courses/LessonPlanModal';

interface LessonPlansTabProps {
    course: any;
    program: any;
}

export default function LessonPlansTab({ course, program }: LessonPlansTabProps) {
    const [lessonPlanModal, setLessonPlanModal] = useState<any>({ isOpen: false, lessonPlan: null });
    const { delete: destroy } = useForm({});

    const handleDeleteLessonPlan = (lessonPlanId: number) => {
        if (confirm('Are you sure you want to delete this lesson plan?')) {
            destroy(route('programs.courses.lesson-plans.destroy', [program.id, course.id, lessonPlanId]));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Lesson Plans</h3>
                    <p className="text-sm text-muted-foreground">Weekly lesson schedule</p>
                </div>
                <Button onClick={() => setLessonPlanModal({ isOpen: true, lessonPlan: null })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lesson Plan
                </Button>
            </div>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Week</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Topics</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Outcomes</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Teaching Strategies</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Mapped CLOs</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {course.lesson_plans?.map((lp: any) => (
                            <tr key={lp.id} className="border-t">
                                <td className="px-4 py-3 font-medium text-blue-600">{lp.week}</td>
                                <td className="px-4 py-3">{lp.topics}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{lp.outcomes}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{lp.teaching_strategies}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {lp.clos?.map((clo: any) => (
                                            <Badge key={clo.id} variant="outline" className="text-xs">
                                                CLO-{clo.clo_no}
                                            </Badge>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setLessonPlanModal({ isOpen: true, lessonPlan: lp })}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteLessonPlan(lp.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!course.lesson_plans || course.lesson_plans.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                        No lesson plans defined yet.
                    </div>
                )}
            </div>

            <LessonPlanModal
                isOpen={lessonPlanModal.isOpen}
                onClose={() => setLessonPlanModal({ isOpen: false, lessonPlan: null })}
                programId={program?.id}
                courseId={course.id}
                lessonPlan={lessonPlanModal.lessonPlan}
                clos={course.clos || []}
            />
        </div>
    );
}
