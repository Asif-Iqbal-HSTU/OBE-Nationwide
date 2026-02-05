import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Lightbulb, BookOpen, Building2, School, ChevronRight } from 'lucide-react';

interface Program {
    id: number;
    name: string;
    short_name: string;
    vision: string | null;
    mission: string | null;
    description: string | null;
    faculty: { id: number; name: string; short_name: string };
    department: { id: number; name: string; short_name: string };
    peos_count: number;
    plos_count: number;
    courses_count: number;
    generic_skills_count: number;
}

interface ProgramShowProps {
    program: Program;
}

export default function ProgramShow({ program }: ProgramShowProps) {
    const navItems = [
        {
            title: 'PEOs',
            description: 'Program Educational Objectives',
            href: `/programs/${program.id}/peos`,
            icon: Target,
            count: program.peos_count,
            color: 'bg-blue-500',
        },
        {
            title: 'PLOs',
            description: 'Program Learning Outcomes',
            href: `/programs/${program.id}/plos`,
            icon: Trophy,
            count: program.plos_count,
            color: 'bg-green-500',
        },
        {
            title: 'Generic Skills',
            description: 'Graduate Attributes',
            href: `/programs/${program.id}/generic-skills`,
            icon: Lightbulb,
            count: program.generic_skills_count,
            color: 'bg-amber-500',
        },
        {
            title: 'Courses',
            description: 'Course Catalog',
            href: `/programs/${program.id}/courses`,
            icon: BookOpen,
            count: program.courses_count,
            color: 'bg-purple-500',
        },
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Programs', href: '/programs' },
            { title: program.short_name || program.name, href: `/programs/${program.id}` },
        ]}>
            <Head title={program.name} />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="border-b pb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">{program.name}</h1>
                            {program.short_name && (
                                <Badge variant="outline" className="mt-2">{program.short_name}</Badge>
                            )}
                            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    <span>{program.faculty?.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <School className="w-4 h-4" />
                                    <span>{program.department?.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision & Mission */}
                {(program.vision || program.mission) && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {program.vision && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Vision</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{program.vision}</p>
                                </CardContent>
                            </Card>
                        )}
                        {program.mission && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Mission</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{program.mission}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Description */}
                {program.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">About This Program</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{program.description}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Navigation Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {navItems.map((item) => (
                        <Link key={item.title} href={item.href}>
                            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className={`p-2 rounded-lg ${item.color} text-white`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-1">
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                        <Badge variant="secondary">{item.count}</Badge>
                                    </div>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
