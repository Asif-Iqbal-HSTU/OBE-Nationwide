import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function BookModal({
                                    program,
                                    course,
                                    book,
                                    isOpen,
                                    onClose,
                                }: any) {
    const { data, setData, post, put, reset, errors, processing } = useForm({
        id: null as number | null,
        book_no: '',
        book_name: '',
    });

    useEffect(() => {
        if (book) {
            setData({
                id: book.id,
                book_no: book.book_no || '',
                book_name: book.book_name || '',
            });
        } else {
            reset();
        }
    }, [book, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!program || !course) return;

        const url = data.id
            ? `/programs/${program.id}/courses/${course.id}/books/${data.id}`
            : `/programs/${program.id}/courses/${course.id}/books`;

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
                    <DialogTitle>{data.id ? 'Edit Reference Book' : 'Add Reference Book'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} id="book-form" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="book_no">Book No.</Label>
                        <Input
                            id="book_no"
                            type="number"
                            placeholder="e.g., 1"
                            value={data.book_no}
                            onChange={(e) => setData('book_no', e.target.value)}
                        />
                        {errors.book_no && <p className="text-xs text-red-500">{errors.book_no}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="book_name">Book Name / Title</Label>
                        <Input
                            id="book_name"
                            placeholder="Enter book title, author, edition..."
                            value={data.book_name}
                            onChange={(e) => setData('book_name', e.target.value)}
                        />
                        {errors.book_name && <p className="text-xs text-red-500">{errors.book_name}</p>}
                    </div>
                </form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="book-form"
                        disabled={processing || !program || !course}
                    >
                        {data.id ? 'Update Book' : 'Add Book'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
