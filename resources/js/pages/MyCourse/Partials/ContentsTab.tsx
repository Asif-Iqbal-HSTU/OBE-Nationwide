import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import ContentModal from '../../Courses/ContentModal';

interface ContentsTabProps {
    course: any;
    program: any;
}

export default function ContentsTab({ course, program }: ContentsTabProps) {
    const [contentModal, setContentModal] = useState<any>({ isOpen: false, content: null });
    const { delete: destroy } = useForm({});

    const handleDeleteContent = (contentId: number) => {
        if (confirm('Are you sure you want to delete this content?')) {
            destroy(route('programs.courses.contents.destroy', [program.id, course.id, contentId]));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Course Contents</h3>
                    <p className="text-sm text-muted-foreground">Topics covered in this course</p>
                </div>
                <Button onClick={() => setContentModal({ isOpen: true, content: null })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Content
                </Button>
            </div>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium w-16">No.</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Content</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Teaching Strategy</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Assessment Strategy</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Mapped CLOs</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {course.contents?.map((content: any) => (
                            <tr key={content.id} className="border-t">
                                <td className="px-4 py-3 font-medium text-blue-600">{content.content_no}</td>
                                <td className="px-4 py-3">{content.content}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{content.teaching_strategy}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{content.assessment_strategy}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {content.clos?.map((clo: any) => (
                                            <Badge key={clo.id} variant="outline" className="text-xs">
                                                CLO-{clo.clo_no}
                                            </Badge>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setContentModal({ isOpen: true, content })}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteContent(content.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!course.contents || course.contents.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                        No contents defined yet.
                    </div>
                )}
            </div>

            <ContentModal
                isOpen={contentModal.isOpen}
                onClose={() => setContentModal({ isOpen: false, content: null })}
                programId={program?.id}
                courseId={course.id}
                content={contentModal.content}
                clos={course.clos || []}
            />
        </div>
    );
}
