import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Users, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Moderation Committees',
        href: '/moderation-committees',
    },
];

export default function Committees({ committees, teachers, departments }: any) {
    const { auth } = usePage<SharedData>().props;
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const form = useForm({
        department_id: auth.teacher?.department_id || '',
        session: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
        semester: '',
        member_ids: [] as number[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/moderation-committees', {
            onSuccess: () => {
                setIsCreateOpen(false);
                form.reset();
            },
        });
    };

    const handleMemberChange = (teacherId: number, checked: boolean) => {
        const currentMembers = form.data.member_ids as number[];
        if (checked) {
            form.setData('member_ids', [...currentMembers, teacherId]);
        } else {
            form.setData('member_ids', currentMembers.filter((id) => id !== teacherId));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Moderation Committees" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Moderation Committees</h2>
                        <p className="text-muted-foreground">
                            Manage exam moderation committees for your department.
                        </p>
                    </div>
                    {(auth.isChairman || auth.user.role === 'chairman' || auth.user.role === 'admin') && (
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Form Committee
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Form Moderation Committee</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Select
                                            value={form.data.department_id.toString()}
                                            onValueChange={(val) => form.setData('department_id', val)}
                                            disabled={!auth.user.role.includes('admin')}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept: any) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="session">Session</Label>
                                            <Input
                                                id="session"
                                                value={form.data.session}
                                                onChange={(e) => form.setData('session', e.target.value)}
                                                placeholder="e.g. 2021-2022"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="semester">Semester</Label>
                                            <Input
                                                id="semester"
                                                value={form.data.semester}
                                                onChange={(e) => form.setData('semester', e.target.value)}
                                                placeholder="e.g. 1/I"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Select Members</Label>
                                        <div className="max-h-[200px] overflow-y-auto rounded-md border p-2 space-y-2">
                                            {teachers.map((teacher: any) => (
                                                <div key={teacher.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`teacher-${teacher.id}`}
                                                        checked={(form.data.member_ids as number[]).includes(teacher.id)}
                                                        onCheckedChange={(checked) => handleMemberChange(teacher.id, checked as boolean)}
                                                    />
                                                    <Label htmlFor={`teacher-${teacher.id}`} className="font-normal cursor-pointer">
                                                        {teacher.name} ({teacher.designation})
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={form.processing}>
                                            Create Committee
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {committees.map((committee: any) => (
                        <div key={committee.id} className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold">{committee.session}</h3>
                                    <p className="text-sm text-muted-foreground">Semester: {committee.semester}</p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                                    <Users size={20} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Chairman</p>
                                <p className="text-sm font-medium">{committee.chairman?.name}</p>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Members</p>
                                <div className="space-y-1">
                                    {committee.members.map((member: any) => (
                                        <div key={member.id} className="text-sm flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                            {member.teacher.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {committees.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            No moderation committees formed yet.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
