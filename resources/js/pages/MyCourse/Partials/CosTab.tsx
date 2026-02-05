import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Plus } from 'lucide-react';
import CoModal from '../../Courses/CoModal';

interface CosTabProps {
    course: any;
    program: any;
}

export default function CosTab({ course, program }: CosTabProps) {
    if (!course || !program) return null;

    const [coModal, setCoModal] = useState<any>({ isOpen: false, co: null });
    const { delete: destroy } = useForm({});

    const handleDeleteCo = (coId: number) => {
        if (confirm('Are you sure you want to delete this Course Objective?')) {
            destroy(route('programs.courses.cos.destroy', [program?.id, course?.id, coId]));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Course Objectives</h3>
                    <p className="text-sm text-muted-foreground">What students will achieve in this course</p>
                </div>
                <Button onClick={() => setCoModal({ isOpen: true, co: null })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add CO
                </Button>
            </div>
            <div className="grid gap-4">
                {course.cos?.map((co: any, index: number) => (
                    <Card key={co.id}>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <span className="font-semibold text-blue-600">CO-{index + 1}:</span>
                                    <span className="ml-2">{co.co_desc}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setCoModal({ isOpen: true, co })}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCo(co.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {(!course.cos || course.cos.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                        No course objectives defined yet.
                    </div>
                )}
            </div>

            <CoModal
                isOpen={coModal.isOpen}
                onClose={() => setCoModal({ isOpen: false, co: null })}
                programId={program?.id}
                courseId={course?.id}
                co={coModal.co}
            />
        </div>
    );
}
