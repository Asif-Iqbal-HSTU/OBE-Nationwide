import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Ensure you have an Input component
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CoModal({
                                    program,
                                    course,
                                    co,
                                    isOpen,
                                    onClose,
                                }: any) {
    // Aligned with database: co_no and co_desc
    const { data, setData, post, put, reset, errors, processing } = useForm({
        id: null as number | null,
        co_no: '',
        co_desc: '',
    });

    useEffect(() => {
        if (co) {
            setData({
                id: co.id,
                co_no: co.co_no || '',
                co_desc: co.co_desc || '',
            });
        } else {
            reset();
        }
    }, [co, isOpen]); // Reset when opening/closing or changing selection

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!program || !course) return;

        const url = data.id
            ? `/programs/${program.id}/courses/${course.id}/cos/${data.id}`
            : `/programs/${program.id}/courses/${course.id}/cos`;

        if (data.id) {
            put(url, { onSuccess: () => onClose() });
        } else {
            post(url, { onSuccess: () => onClose() });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{data.id ? 'Edit Course Objective' : 'Add Course Objective'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} id="co-form" className="space-y-4 pt-4">
                    {/* CO Number Field */}
                    <div className="space-y-2">
                        <Label htmlFor="co_no">CO Number</Label>
                        <Input
                            id="co_no"
                            type="number"
                            placeholder="e.g., 1"
                            value={data.co_no}
                            onChange={(e) => setData('co_no', e.target.value)}
                        />
                        {errors.co_no && <p className="text-xs text-red-500">{errors.co_no}</p>}
                    </div>

                    {/* CO Description Field */}
                    <div className="space-y-2">
                        <Label htmlFor="co_desc">Description</Label>
                        <Textarea
                            id="co_desc"
                            placeholder="Enter course objective description..."
                            rows={4}
                            value={data.co_desc}
                            onChange={(e) => setData('co_desc', e.target.value)}
                        />
                        {errors.co_desc && <p className="text-xs text-red-500">{errors.co_desc}</p>}
                    </div>
                </form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="co-form"
                        disabled={processing || !program || !course}
                    >
                        {data.id ? 'Update CO' : 'Create CO'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
