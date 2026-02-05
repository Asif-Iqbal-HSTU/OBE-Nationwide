import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, MessageCircle, CheckCircle, Clock, Send, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { useState } from 'react';

interface SupportQuestion {
    id: number;
    question: string;
    answer: string | null;
    is_public: boolean;
    created_at: string;
    course: { id: number; code: string; name: string };
    student?: { student_id: string };
    answered_by?: { name: string };
}

interface SupportProps {
    student: any;
    courses: any[];
    myQuestions: SupportQuestion[];
    publicQuestions: SupportQuestion[];
}

export default function Support({ student, courses, myQuestions, publicQuestions }: SupportProps) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        course_id: '',
        question: '',
        is_public: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.course_id) return;

        post(`/student/courses/${data.course_id}/support`, {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/student/dashboard' },
            { title: 'Support', href: '/student/support' },
        ]}>
            <Head title="Support" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Support & Help</h1>
                    <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                        <HelpCircle className="w-4 h-4" />
                        {showForm ? 'Cancel' : 'Ask a Question'}
                    </Button>
                </div>

                {/* Ask Question Form */}
                {showForm && (
                    <Card className="border-2 border-dashed border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Ask a New Question
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="course">Select Course</Label>
                                    <Select
                                        value={data.course_id}
                                        onValueChange={(value) => setData('course_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {courses.map((course: any) => (
                                                <SelectItem key={course.id} value={course.id.toString()}>
                                                    {course.code} - {course.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.course_id && (
                                        <p className="text-sm text-red-500">{errors.course_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="question">Your Question</Label>
                                    <Textarea
                                        id="question"
                                        placeholder="Type your question here..."
                                        value={data.question}
                                        onChange={(e) => setData('question', e.target.value)}
                                        rows={4}
                                    />
                                    {errors.question && (
                                        <p className="text-sm text-red-500">{errors.question}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_public"
                                        checked={data.is_public}
                                        onCheckedChange={(checked) => setData('is_public', checked as boolean)}
                                    />
                                    <Label htmlFor="is_public" className="text-sm text-muted-foreground">
                                        Make this question public (other students can see it once answered)
                                    </Label>
                                </div>

                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Send className="w-4 h-4" />
                                    Submit Question
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* My Questions */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        My Questions ({myQuestions.length})
                    </h2>
                    {myQuestions.length > 0 ? (
                        <div className="space-y-4">
                            {myQuestions.map((question) => (
                                <Card key={question.id} className={question.answer ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-amber-500'}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <Badge variant="outline">{question.course.code}</Badge>
                                            <div className="flex items-center gap-2">
                                                {question.is_public && (
                                                    <Badge variant="secondary" className="text-xs">Public</Badge>
                                                )}
                                                {question.answer ? (
                                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Answered
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Pending
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Question:</p>
                                                <p>{question.question}</p>
                                            </div>
                                            {question.answer && (
                                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                                    <p className="text-sm font-medium text-green-800 dark:text-green-400 mb-1">
                                                        Answer by {question.answered_by?.name || 'Teacher'}:
                                                    </p>
                                                    <p className="text-green-900 dark:text-green-300">{question.answer}</p>
                                                </div>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                Asked on {format(new Date(question.created_at), 'PPp')}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">You haven't asked any questions yet.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Public Q&A */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Public Q&A
                    </h2>
                    {publicQuestions.length > 0 ? (
                        <div className="space-y-4">
                            {publicQuestions.map((question) => (
                                <Card key={question.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <Badge variant="outline">{question.course.code}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(question.created_at), 'PP')}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                                    Q: (by Student {question.student?.student_id})
                                                </p>
                                                <p>{question.question}</p>
                                            </div>
                                            {question.answer && (
                                                <div className="bg-muted p-4 rounded-lg">
                                                    <p className="text-sm font-medium mb-1">
                                                        A: ({question.answered_by?.name || 'Teacher'})
                                                    </p>
                                                    <p>{question.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No public Q&A available yet.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
