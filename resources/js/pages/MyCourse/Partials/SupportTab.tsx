import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function SupportTab({ course }: { course: any }) {
    if (!course) return null;

    const [supportOpen, setSupportOpen] = useState<any>({ isOpen: false, support: null });

    const { data: supportData, setData: setSupportData, put: putSupport, processing: supportProcessing, reset: resetSupport } = useForm({
        answer: '',
    });

    const handleAnswerSupport = (e: React.FormEvent) => {
        e.preventDefault();
        putSupport(route('teacher.supports.update', supportOpen.support?.id), {
            onSuccess: () => {
                setSupportOpen({ isOpen: false, support: null });
                resetSupport();
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Student Support</h3>
                    <p className="text-sm text-muted-foreground">Answer student queries</p>
                </div>
            </div>
            <div className="grid gap-4">
                {course.supports?.map((sup: any) => (
                    <Card key={sup.id}>
                        <CardHeader>
                            <div className="flex justify-between">
                                <CardTitle className="text-base">Q: {sup.question}</CardTitle>
                                <Badge variant={sup.answer ? 'default' : 'secondary'}>
                                    {sup.answer ? 'Answered' : 'Pending'}
                                </Badge>
                            </div>
                            <CardDescription>
                                Asked by Student ID: {sup.student_id} • {new Date(sup.created_at).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sup.answer ? (
                                <div className="bg-green-50 p-3 rounded text-sm">
                                    <span className="font-bold text-green-700">A: </span>
                                    {sup.answer}
                                    <Button size="sm" variant="link" onClick={() => {
                                        setSupportOpen({ isOpen: true, support: sup });
                                        setSupportData({ answer: sup.answer });
                                    }}>Edit Answer</Button>
                                </div>
                            ) : (
                                <Button variant="outline" onClick={() => {
                                    setSupportOpen({ isOpen: true, support: sup });
                                    setSupportData({ answer: '' });
                                }}>Answer Question</Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {(!course.supports || course.supports.length === 0) && (
                    <div className="text-center p-8 border rounded-md text-muted-foreground">
                        No questions yet.
                    </div>
                )}
            </div>

            {/* Support Dialog */}
            <Dialog open={supportOpen.isOpen} onOpenChange={open => setSupportOpen({ ...supportOpen, isOpen: open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Answer Question</DialogTitle>
                        <DialogDescription>{supportOpen.support?.question}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAnswerSupport} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Your Answer</Label>
                            <Textarea value={supportData.answer} onChange={e => setSupportData('answer', e.target.value)} required />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={supportProcessing}>Submit Answer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
