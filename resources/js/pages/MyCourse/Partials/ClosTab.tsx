import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import CloModal from '../../Courses/CloModal';

interface ClosTabProps {
    course: any;
    program: any;
    plos: any;
}

export default function ClosTab({ course, program, plos }: ClosTabProps) {
    if (!course || !program) return null;

    const [cloModal, setCloModal] = useState<any>({ isOpen: false, clo: null });
    const { delete: destroy } = useForm({});

    const handleDeleteClo = (cloId: number) => {
        if (confirm('Are you sure you want to delete this CLO?')) {
            destroy(route('programs.courses.clos.destroy', [program?.id, course?.id, cloId]));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Course Learning Outcomes</h3>
                    <p className="text-sm text-muted-foreground">Measurable outcomes mapped to Program Learning Outcomes</p>
                </div>
                <Button onClick={() => setCloModal({ isOpen: true, clo: null })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add CLO
                </Button>
            </div>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">CLO</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Mapped PLOs</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {course.clos?.map((clo: any) => (
                            <tr key={clo.id} className="border-t">
                                <td className="px-4 py-3 font-medium text-blue-600">CLO-{clo.clo_no}</td>
                                <td className="px-4 py-3">{clo.clo_desc}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {clo.plos?.map((plo: any) => (
                                            <Badge key={plo.id} variant="outline" className="text-xs">
                                                PLO-{plo.plo_no}
                                            </Badge>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setCloModal({ isOpen: true, clo })}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteClo(clo.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!course.clos || course.clos.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                        No CLOs defined yet.
                    </div>
                )}
            </div>

            <CloModal
                isOpen={cloModal.isOpen}
                onClose={() => setCloModal({ isOpen: false, clo: null })}
                programId={program?.id}
                courseId={course?.id}
                clo={cloModal.clo}
                plos={plos}
            />
        </div>
    );
}
