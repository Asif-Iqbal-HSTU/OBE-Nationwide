import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import BookModal from '../../Courses/BookModal';

interface BooksTabProps {
    course: any;
    program: any;
}

export default function BooksTab({ course, program }: BooksTabProps) {
    const [bookModal, setBookModal] = useState<any>({ isOpen: false, book: null });
    const { delete: destroy } = useForm({});

    const handleDeleteBook = (bookId: number) => {
        if (confirm('Are you sure you want to delete this book?')) {
            destroy(route('programs.courses.books.destroy', [program.id, course.id, bookId]));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Reference Books</h3>
                    <p className="text-sm text-muted-foreground">Textbooks and reference materials</p>
                </div>
                <Button onClick={() => setBookModal({ isOpen: true, book: null })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Book
                </Button>
            </div>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium w-16">No.</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Book Name</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {course.books?.map((book: any) => (
                            <tr key={book.id} className="border-t">
                                <td className="px-4 py-3 font-medium text-blue-600">{book.book_no}</td>
                                <td className="px-4 py-3">{book.book_name}</td>
                                <td className="px-4 py-3 text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setBookModal({ isOpen: true, book })}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteBook(book.id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!course.books || course.books.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                        No books added yet.
                    </div>
                )}
            </div>

            <BookModal
                isOpen={bookModal.isOpen}
                onClose={() => setBookModal({ isOpen: false, book: null })}
                programId={program?.id}
                courseId={course.id}
                book={bookModal.book}
            />
        </div>
    );
}
