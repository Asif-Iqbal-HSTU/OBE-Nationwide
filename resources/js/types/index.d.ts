import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface StudentStats {
    enrolledCourses: number;
    pendingAssignments: number;
    attendancePercentage: number | null;
    totalClasses: number;
    presentClasses: number;
}

export interface Auth {
    user: User;
    teacher: Teacher | null;
    student: Student | null;
    studentStats: StudentStats | null;
    isChairman: boolean;
    isDean: boolean;
}

export interface Teacher {
    id: number;
    user_id: number;
    name: string;
    designation: string;
    department_id: number;
    department: {
        id: number;
        name: string;
        short_name: string;
        faculty: {
            id: number;
            name: string;
            short_name: string;
        };
    };
}

export interface Student {
    id: number;
    user_id: number;
    student_id: string;
    program_id: number;
    current_semester: string;
    current_level: number;
    session: string;
    program: {
        id: number;
        name: string;
        short_name: string;
        department: {
            id: number;
            name: string;
            short_name: string;
            faculty: {
                id: number;
                name: string;
                short_name: string;
            };
        };
    };
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    userPrograms: { teaching: Program[], myCourses: Course[], managed: Program[] };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Program {
    id: number;
    name: string;
    short_name: string;
}

export interface Course {
    id: number;
    program_id: number;
    code: string;
    name: string;
    program?: Program;
}
