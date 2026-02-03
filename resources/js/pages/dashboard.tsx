import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BookOpen, GraduationCap, School, User as UserIcon, UserCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth, userPrograms } = usePage<SharedData>().props;
    const { user, teacher } = auth;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">

                {teacher ? (
                    <div className="grid gap-6 md:grid-cols-4">
                        {/* Profile Summary Card */}
                        <div className="md:col-span-4 rounded-2xl border bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30">
                                    <UserCircle size={60} className="text-white" />
                                </div>
                                <div className="text-center md:text-left space-y-1">
                                    <h2 className="text-3xl font-extrabold tracking-tight">{teacher.name}</h2>
                                    <p className="text-lg font-medium text-blue-100/90">{teacher.designation}</p>
                                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                                        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
                                            <School size={16} />
                                            <span>{teacher.department.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
                                            <GraduationCap size={16} />
                                            <span>{teacher.department.faculty.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-2 border-l-4 border-l-blue-500">
                            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                                <BookOpen size={24} />
                            </div>
                            <span className="text-3xl font-bold">{userPrograms?.teaching?.length || 0}</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned Programs</span>
                        </div>

                        <div className="md:col-span-3 rounded-2xl border bg-card p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Academic Context</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Department Short Name</p>
                                    <p className="font-bold text-slate-700">{teacher.department.short_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Faculty Short Name</p>
                                    <p className="font-bold text-slate-700">{teacher.department.faculty.short_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Login Email</p>
                                    <p className="font-bold text-slate-700">{user.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">System Role</p>
                                    <span className="inline-block rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-700 uppercase">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                )}

                <div className="relative min-h-[40vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center max-w-md">
                            <h4 className="text-xl font-bold text-slate-800 mb-2">Welcome back, {user.name}!</h4>
                            <p className="text-slate-500 text-sm">
                                You are now in the OBE Nationwide platform. Use the sidebar to manage your academic programs, courses, and outcomes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
