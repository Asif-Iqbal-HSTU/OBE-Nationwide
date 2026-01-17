import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
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
    Folder,
    GraduationCap,
    LayoutGrid,
    Lightbulb,
    Network,
    Target,
    Trophy,
} from 'lucide-react';
import AppLogo from './app-logo';
import ResizableSidebar from '@/components/resizable-sidebar';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { userPrograms } = usePage<SharedData>().props;

    // Build dynamic program sub-items
    const programSubItems: NavItem[] =
        userPrograms?.map((program) => ({
            title: program.short_name || program.name,
            icon: GraduationCap,

            // 👇 clicking program name opens Program dashboard (optional)
            href: `/programs/${program.id}`,

            // 👇 second-level submenu
            items: [
                {
                    title: 'PEO',
                    href: `/programs/${program.id}/peos`,
                    icon: Target,
                },
                {
                    title: 'PLO',
                    href: `/programs/${program.id}/plos`,
                    icon: Trophy,
                },
                {
                    title: 'Generic Skills',
                    href: `/programs/${program.id}/generic-skills`,
                    icon: Lightbulb,
                },

                // 👇 Future-ready
                {
                    title: 'Courses',
                    href: `/programs/${program.id}/courses`,
                    icon: BookOpen
                },
            ],
        })) || [];

    // Build navigation items with programs nested under Programs menu
    const allNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'University Missions',
            href: '/umissions',
            icon: Target,
        },
        {
            title: 'Faculties',
            href: '/faculties',
            icon: Building2,
        },
        {
            title: 'Departments',
            href: '/departments',
            icon: Network,
        },
        // ✅ Programs links to index page AND expands dropdown
        {
            title: 'Programs',
            href: '/programs', // <-- index page
            icon: GraduationCap,
            items: programSubItems, // <-- dropdown list
        },
    ];

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
                <NavMain items={allNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} className="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
