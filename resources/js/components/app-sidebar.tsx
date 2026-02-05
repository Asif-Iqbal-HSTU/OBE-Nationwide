import { NavMain, type NavGroup } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    ClipboardCheck,
    FileQuestion,
    GraduationCap,
    LayoutGrid,
    Lightbulb,
    Network,
    Target,
    Trophy,
    Users,
    Calendar,
    FileText,
    HelpCircle,
    BarChart3,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { userPrograms, auth } = usePage<SharedData>().props;
    const { user, isChairman, isDean, student } = auth;

    const isAdmin = user.role === 'admin';
    const isStudent = user.role === 'student';

    // Helper to build sub-items
    const buildProgramSubItems = (programs: any[]) =>
        programs?.map((program) => ({
            title: program.short_name || program.name,
            icon: GraduationCap,
            href: `/programs/${program.id}`,
            items: [
                { title: 'PEOs', href: `/programs/${program.id}/peos`, icon: Target },
                { title: 'PLOs', href: `/programs/${program.id}/plos`, icon: Trophy },
                { title: 'Generic Skills', href: `/programs/${program.id}/generic-skills`, icon: Lightbulb },
                { title: 'Courses', href: `/programs/${program.id}/courses`, icon: BookOpen },
            ],
        })) || [];

    // Build items for assigned courses
    const buildCourseItems = (courses: any[]) =>
        courses?.map((course) => ({
            title: `${course.code} ${course.name}`,
            icon: BookOpen,
            // Link to the main courses page for the program - teachers can manage their course there
            href: `/programs/${course.program_id}/courses`,
        })) || [];

    const teachingItems = buildCourseItems(userPrograms?.myCourses || []);
    const managedItems = buildProgramSubItems(userPrograms?.managed || []);

    // Build grouped navigation
    const navGroups: NavGroup[] = [];

    // 1. Dashboard always shows
    navGroups.push({
        items: [{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }],
    });

    // === STUDENT NAVIGATION ===
    if (isStudent && student) {
        navGroups.push({
            label: 'My Learning',
            items: [
                { title: 'My Courses', href: '/student/dashboard', icon: BookOpen },
                { title: 'Assignments', href: '/student/assignments', icon: FileQuestion },
                { title: 'Attendance', href: '/student/attendance', icon: Calendar },
            ],
        });

        navGroups.push({
            label: 'Progress',
            items: [
                { title: 'My Grades', href: '/student/grades', icon: BarChart3 },
                { title: 'CLO Attainment', href: '/student/grades', icon: Target },
            ],
        });

        navGroups.push({
            label: 'Support',
            items: [
                { title: 'Get Help', href: '/student/support', icon: HelpCircle },
            ],
        });

        return (
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={dashboard()} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <NavMain groups={navGroups} />
                </SidebarContent>

                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
        );
    }

    // === TEACHER/ADMIN NAVIGATION ===

    // 2. Foundation (Admin only)
    if (isAdmin) {
        navGroups.push({
            label: 'Foundation',
            items: [
                { title: 'University Missions', href: '/umissions', icon: Target },
                { title: 'Faculties', href: '/faculties', icon: Building2 },
                { title: 'Departments', href: '/departments', icon: Network },
                { title: 'Teachers', href: '/teachers', icon: Users },
            ],
        });
    }

    // 3. Your Courses (Teachers, Chairmen, Deans) - Now links to dedicated /my-courses page
    if (!isAdmin) {
        const courseLinks = teachingItems.length > 0
            ? [
                { title: 'My Courses', href: '/my-courses', icon: BookOpen },
                ...teachingItems.map((item) => ({ ...item, href: '/my-courses' })),
            ]
            : [{ title: 'My Courses', href: '/my-courses', icon: BookOpen }];

        navGroups.push({
            label: 'Your Courses',
            items: [{ title: 'My Courses', href: '/my-courses', icon: BookOpen }],
        });
    } else if (teachingItems.length > 0) {
        navGroups.push({
            label: 'Your Courses',
            items: [{ title: 'My Courses', href: '/my-courses', icon: BookOpen }],
        });
    }

    // 4. Course Distribution / Managed Programs (Admin/Chairman/Dean)
    if (isAdmin) {
        navGroups.push({
            label: 'Academic Programs',
            items: [
                { title: 'All Programs', href: '/programs', icon: GraduationCap },
                ...managedItems,
            ],
        });
    } else if (isChairman || isDean) {
        navGroups.push({
            label: 'Course Distribution',
            items: managedItems.length > 0 ? managedItems : [
                { title: 'No programs managed', href: '#', icon: GraduationCap }
            ],
        });
    }

    // 5. Examination & Moderation
    const examItems = [];
    if (isChairman || isAdmin) {
        examItems.push({ title: 'Committees', href: '/moderation-committees', icon: Users });
    }
    // Teachers can access moderation queue for questions that need review
    if (!isAdmin) {
        examItems.push({ title: 'Moderation Queue', href: '/moderation', icon: ClipboardCheck });
    }

    if (examItems.length > 0) {
        navGroups.push({
            label: 'Examination & Moderation',
            items: examItems,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
