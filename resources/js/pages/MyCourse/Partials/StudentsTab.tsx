import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, User, Phone, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function StudentsTab({ students }: { students: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStudents = students?.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Enrolled Students</h3>
                    <p className="text-sm text-muted-foreground">Manage and view student performance in this course</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name or ID..."
                        className="pl-10 h-10 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStudents.map((student: any) => (
                    <Card key={student.id} className="overflow-hidden border-0 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 group shadow-sm hover:shadow-md">
                        <CardContent className="p-0">
                            <div className="flex items-stretch h-full">
                                {/* Left Color Strip */}
                                <div className="w-1.5 bg-blue-500" />

                                <div className="flex-1 p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-sm">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.student_id}`} />
                                                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                                                    {student.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-0.5">
                                                <h4 className="font-bold text-base group-hover:text-blue-600 transition-colors uppercase">
                                                    {student.name}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="bg-white dark:bg-slate-800 font-mono text-xs">
                                                        {student.student_id}
                                                    </Badge>
                                                    {student.email && (
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="h-3 w-3" /> {student.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Attendance
                                                </span>
                                                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                                                    {student.attendance_percentage}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${student.attendance_percentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                                                    <GraduationCap className="h-3.5 w-3.5 text-amber-500" /> Perfomance
                                                </span>
                                                <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                                                    {student.current_marks_percentage}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${student.current_marks_percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredStudents.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <User className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No students found</h3>
                        <p className="text-sm text-slate-500">No students match your search criteria or are enrolled in this course.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
