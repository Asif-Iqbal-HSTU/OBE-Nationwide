import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BLOOMS_LEVELS = [
    { value: 'Remember', color: 'bg-gray-100 text-gray-800', description: 'Recall facts and basic concepts' },
    { value: 'Understand', color: 'bg-blue-100 text-blue-800', description: 'Explain ideas or concepts' },
    { value: 'Apply', color: 'bg-green-100 text-green-800', description: 'Use information in new situations' },
    { value: 'Analyze', color: 'bg-yellow-100 text-yellow-800', description: 'Draw connections among ideas' },
    { value: 'Evaluate', color: 'bg-orange-100 text-orange-800', description: 'Justify a stand or decision' },
    { value: 'Create', color: 'bg-purple-100 text-purple-800', description: 'Produce new or original work' },
];

export default function CreateExamQuestion({ assignment, course, clos, committees }: any) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'My Courses', href: '/my-courses' },
        { title: `${course.code}`, href: `/my-courses/${assignment.id}` },
        { title: 'Create Exam Question', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        session: string;
        semester: string;
        total_marks: number;
        duration: string;
        moderation_committee_id: string;
        items: Array<{
            question_label: string;
            question_text: string;
            marks: number;
            clo_id: string;
            blooms_taxonomy_level: string;
        }>;
    }>({
        session: assignment.session || '',
        semester: assignment.semester || course.semester?.toString() || '',
        total_marks: 70,
        duration: '3 Hours',
        moderation_committee_id: '',
        items: [
            { question_label: '1(a)', question_text: '', marks: 5, clo_id: '', blooms_taxonomy_level: 'Remember' }
        ],
    });

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const addItem = () => {
        const lastItem = data.items[data.items.length - 1];
        const nextLabel = generateNextLabel(lastItem?.question_label || '');
        setData('items', [
            ...data.items,
            { question_label: nextLabel, question_text: '', marks: 5, clo_id: '', blooms_taxonomy_level: 'Remember' }
        ]);
    };

    const generateNextLabel = (lastLabel: string) => {
        const match = lastLabel.match(/^(\d+)\(([a-z])\)$/);
        if (match) {
            const num = match[1];
            const letter = match[2];
            const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
            if (nextLetter <= 'z') {
                return `${num}(${nextLetter})`;
            } else {
                return `${parseInt(num) + 1}(a)`;
            }
        }
        return `${data.items.length + 1}(a)`;
    };

    const removeItem = (index: number) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/my-courses/${assignment.id}/exam-questions`);
    };

    const getTotalMarks = () => {
        return data.items.reduce((sum, item) => sum + (parseFloat(String(item.marks)) || 0), 0);
    };

    const getBloomsColor = (level: string) => {
        return BLOOMS_LEVELS.find(b => b.value === level)?.color || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Create Exam Question - ${course.code}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href={`/my-courses/${assignment.id}`}>
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Course
                                </Button>
                            </Link>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Create Exam Question Paper</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge>{course.code}</Badge>
                            <span className="text-muted-foreground">{course.name}</span>
                            <span className="text-muted-foreground">•</span>
                            <Badge variant="outline">Level {course.level}</Badge>
                            <Badge variant="outline">Semester {course.semester}</Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-bold">{getTotalMarks()}</div>
                            <div className="text-xs text-muted-foreground">/ {data.total_marks} marks</div>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Paper Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Paper Details</CardTitle>
                            <CardDescription>Basic information about the exam paper</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="session">Session <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="session"
                                        value={data.session}
                                        onChange={(e) => setData('session', e.target.value)}
                                        placeholder="e.g. 2021-2022"
                                    />
                                    {errors.session && <p className="text-sm text-red-500">{errors.session}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="semester">Semester <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="semester"
                                        value={data.semester}
                                        onChange={(e) => setData('semester', e.target.value)}
                                        placeholder="e.g. 1/I"
                                    />
                                    {errors.semester && <p className="text-sm text-red-500">{errors.semester}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total_marks">Total Marks</Label>
                                    <Input
                                        id="total_marks"
                                        type="number"
                                        value={data.total_marks}
                                        onChange={(e) => setData('total_marks', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="committee">Moderation Committee (Optional)</Label>
                                <Select
                                    value={data.moderation_committee_id}
                                    onValueChange={(val) => setData('moderation_committee_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Committee (Required for submission)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {committees?.map((committee: any) => (
                                            <SelectItem key={committee.id} value={committee.id.toString()}>
                                                {committee.session} - Sem {committee.semester}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.moderation_committee_id && <p className="text-sm text-red-500">{errors.moderation_committee_id}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Questions Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Questions</h3>
                                <p className="text-sm text-muted-foreground">Add questions and map them to CLOs</p>
                            </div>
                            <Button type="button" variant="outline" onClick={addItem}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Question
                            </Button>
                        </div>

                        {data.items.map((item, index) => (
                            <Card key={index} className="relative border-l-4 border-l-blue-500">
                                <CardContent className="pt-6">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-2 text-muted-foreground hover:text-red-500"
                                        onClick={() => removeItem(index)}
                                        disabled={data.items.length === 1}
                                    >
                                        <Trash2 size={18} />
                                    </Button>

                                    <div className="grid gap-4 md:grid-cols-12">
                                        <div className="md:col-span-1 space-y-2">
                                            <Label>No.</Label>
                                            <Input
                                                value={item.question_label}
                                                onChange={(e) => handleItemChange(index, 'question_label', e.target.value)}
                                                placeholder="1(a)"
                                                className="text-center font-medium"
                                            />
                                        </div>
                                        <div className="md:col-span-6 space-y-2">
                                            <Label>Question Text <span className="text-red-500">*</span></Label>
                                            <Textarea
                                                value={item.question_text}
                                                onChange={(e) => handleItemChange(index, 'question_text', e.target.value)}
                                                placeholder="Enter question text..."
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                        <div className="md:col-span-1 space-y-2">
                                            <Label>Marks</Label>
                                            <Input
                                                type="number"
                                                value={item.marks}
                                                onChange={(e) => handleItemChange(index, 'marks', parseFloat(e.target.value))}
                                                className="text-center"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label>CLO <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={item.clo_id?.toString()}
                                                onValueChange={(val) => handleItemChange(index, 'clo_id', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select CLO" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {clos?.map((clo: any) => (
                                                        <SelectItem key={clo.id} value={clo.id.toString()}>
                                                            <div>
                                                                <span className="font-medium">CLO-{clo.clo_no}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {clos?.find((c: any) => c.id.toString() === item.clo_id?.toString())?.clo_desc && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {clos.find((c: any) => c.id.toString() === item.clo_id?.toString())?.clo_desc}
                                                </p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Bloom's Level</Label>
                                            <Select
                                                value={item.blooms_taxonomy_level}
                                                onValueChange={(val) => handleItemChange(index, 'blooms_taxonomy_level', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {BLOOMS_LEVELS.map((level) => (
                                                        <SelectItem key={level.value} value={level.value}>
                                                            <div className="flex items-center gap-2">
                                                                <Badge className={level.color} variant="secondary">
                                                                    {level.value}
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Badge className={getBloomsColor(item.blooms_taxonomy_level)} variant="secondary">
                                                {item.blooms_taxonomy_level}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link href={`/my-courses/${assignment.id}`}>
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Save as Draft
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
