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
import React, { useEffect } from 'react';

export default function CloModal({
    program,
    course,
    plos, // Added: Pass the program's PLOs for mapping
    clo,
    isOpen,
    onClose,
}: any) {
    const { data, setData, post, put, reset, errors, processing } = useForm({
        id: null as number | null,
        clo_no: '',
        clo_desc: '',
        plo_ids: [] as number[],
    });
    console.log(plos);

    useEffect(() => {
        if (clo) {
            setData({
                id: clo.id,
                clo_no: clo.clo_no || '',
                clo_desc: clo.clo_desc || '',
                // Extract IDs from the loaded relationship
                plo_ids: clo.plos ? clo.plos.map((p: any) => p.id) : [],
            });
        } else {
            reset();
        }
    }, [clo, isOpen]);

    const handlePloToggle = (ploId: number) => {
        const currentIds = [...data.plo_ids];
        if (currentIds.includes(ploId)) {
            setData(
                'plo_ids',
                currentIds.filter((id) => id !== ploId),
            );
        } else {
            setData('plo_ids', [...currentIds, ploId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!program || !course) return;

        const url = data.id
            ? `/programs/${program.id}/courses/${course.id}/clos/${data.id}`
            : `/programs/${program.id}/courses/${course.id}/clos`;

        if (data.id) {
            put(url, { onSuccess: () => onClose() });
        } else {
            post(url, { onSuccess: () => onClose() });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {data.id ? 'Edit CLO' : 'Add CLO'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} id="clo-form" className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 space-y-2">
                            <Label>CLO No.</Label>
                            <Input
                                type="number"
                                value={data.clo_no}
                                onChange={(e) =>
                                    setData('clo_no', e.target.value)
                                }
                            />
                        </div>

                        <div className="col-span-3 space-y-2">
                            <Label>Map to PLOs (Select Multiple)</Label>
                            <div className="grid max-h-[120px] grid-cols-3 gap-2 overflow-y-auto rounded-md border bg-slate-50 p-3">
                                {plos?.map((plo: any) => (
                                    <label
                                        key={plo.id}
                                        className="flex cursor-pointer items-center gap-2 text-xs hover:text-blue-600"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.plo_ids.includes(
                                                plo.id,
                                            )}
                                            onChange={() =>
                                                handlePloToggle(plo.id)
                                            }
                                            className="rounded border-gray-300"
                                        />
                                        PLO {plo.plo_no}
                                    </label>
                                ))}
                            </div>
                            {errors.plo_ids && (
                                <p className="text-xs text-red-500">
                                    {errors.plo_ids}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={data.clo_desc}
                            onChange={(e) =>
                                setData('clo_desc', e.target.value)
                            }
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="clo-form" disabled={processing}>
                        {data.id ? 'Update CLO' : 'Create CLO'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
