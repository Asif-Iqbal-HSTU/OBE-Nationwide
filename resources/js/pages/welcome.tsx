import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle2,
    GraduationCap,
    LayoutDashboard,
    LineChart,
    Layers,
    Users,
    Award,
    ArrowRight,
    Search,
    Github,
    Twitter
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen hero-mesh selection:bg-indigo-100 selection:text-indigo-700 dark:selection:bg-indigo-900/40 dark:selection:text-indigo-200">
            <Head title="OBE Nationwide - Integrated Teaching Learning System">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
            </Head>

            {/* Navigation */}
            <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-black/70">
                <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
                            OBE<span className="text-blue-600 dark:text-blue-400">Nationwide</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Login
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30"
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <main className="pt-24 lg:pt-32">
                {/* Hero Section */}
                <section className="relative px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                            <div className="max-w-2xl text-center lg:text-left">
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 dark:border-blue-900/50 dark:bg-blue-900/20">
                                    <span className="flex h-2 w-2 rounded-full bg-blue-600 shrink-0"></span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                                        Empowering Education 5.0
                                    </span>
                                </div>
                                <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl dark:text-white font-['Outfit'] leading-[1.1]">
                                    Mastering Outcomes, <br />
                                    <span className="text-gradient">Powering Futures.</span>
                                </h1>
                                <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400 lg:pr-12">
                                    The ultimate cloud-based platform for Outcome Based Education.
                                    Seamlessly integrate curriculum mapping, clinical assessment,
                                    and real-time student performance tracking in one premium platform.
                                </p>
                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                                    <Link
                                        href={register()}
                                        className="group h-14 w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 text-base font-bold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                    >
                                        Start Your Journey
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <button className="h-14 w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 text-base font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800/80">
                                        Watch Demo
                                    </button>
                                </div>

                                <div className="mt-12 flex items-center justify-center gap-8 lg:justify-start text-slate-400 dark:text-slate-500">
                                    <div className="flex flex-col items-center lg:items-start text-center">
                                        <span className="text-3xl font-bold text-slate-900 dark:text-white font-['Outfit']">50+</span>
                                        <span className="text-sm font-medium">Universities</span>
                                    </div>
                                    <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
                                    <div className="flex flex-col items-center lg:items-start text-center">
                                        <span className="text-3xl font-bold text-gradient font-['Outfit']">500k+</span>
                                        <span className="text-sm font-medium">Students</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative animate-float lg:block">
                                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-2xl"></div>
                                <div className="relative glass rounded-3xl p-2 transition-transform hover:scale-[1.02] duration-500 overflow-hidden shadow-2xl">
                                    <img
                                        src="/images/hero.png"
                                        alt="OBE Dashboard Illustration"
                                        className="rounded-2xl border border-white/10 shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="mt-32 px-4 sm:px-6 lg:px-8 py-20 bg-indigo-50/30 dark:bg-black/20">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4">Features</h2>
                            <h3 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                                Designed for Excellence
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <FeatureCard
                                icon={<Layers className="h-6 w-6 text-blue-600" />}
                                title="Outcome Mapping"
                                description="Automated alignment of Course Learning Outcomes (CLO) with Program Learning Outcomes (PLO) and PEOs."
                            />
                            <FeatureCard
                                icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
                                title="Lesson Planning"
                                description="Comprehensive lesson planning with direct resource linkage and real-time faculty collaboration."
                            />
                            <FeatureCard
                                icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
                                title="Smart Assessment"
                                description="Powerful tools for designing quizzes, assignments, and exams based on Bloom's Taxonomy."
                            />
                            <FeatureCard
                                icon={<LineChart className="h-6 w-6 text-rose-600" />}
                                title="Performance Analytics"
                                description="Visual dashboard to track cohort performance, identifying learning gaps with precision."
                            />
                            <FeatureCard
                                icon={<Users className="h-6 w-6 text-violet-600" />}
                                title="Faculty Workflow"
                                description="Streamlined moderation process and question banking for efficient academic management."
                            />
                            <FeatureCard
                                icon={<Award className="h-6 w-6 text-amber-600" />}
                                title="CO-PO Attainment"
                                description="Direct calculations of direct and indirect attainment levels for accreditation compliance."
                            />
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="my-32 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-center text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>

                        <div className="relative z-10">
                            <h2 className="mb-6 text-4xl font-bold sm:text-5xl font-['Outfit']">
                                Ready to Elevate Your Institution?
                            </h2>
                            <p className="mb-10 text-xl text-blue-100 max-w-2xl mx-auto">
                                Join hundreds of institutions worldwide transforming their teaching and
                                learning experience with OBE-Nationwide.
                            </p>
                            <Link
                                href={register()}
                                className="inline-flex h-14 items-center justify-center rounded-2xl bg-white px-10 text-lg font-bold text-blue-600 shadow-xl transition-all hover:bg-slate-50 hover:scale-105 active:scale-95"
                            >
                                Start Free Trial Now
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-16 dark:border-white/10 dark:bg-slate-900/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                        <div className="col-span-1 lg:col-span-2">
                            <div className="mb-6 flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                                    <GraduationCap className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">
                                    OBE<span className="text-blue-600 dark:text-blue-400">Nationwide</span>
                                </span>
                            </div>
                            <p className="mb-8 max-w-sm text-slate-600 dark:text-slate-400">
                                Leading the way in educational technology for over a decade.
                                Built by educators, for educators.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all dark:bg-slate-800 dark:text-slate-400">
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all dark:bg-slate-800 dark:text-slate-400">
                                    <Github className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Product</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">API Reference</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Support</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 border-t border-slate-200 pt-8 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            © 2026 OBE Nationwide Inc. All rights reserved.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-xs font-semibold text-slate-500">All systems operational</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="group relative rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-slate-900/50">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 transition-colors group-hover:bg-white dark:bg-slate-800/50 dark:group-hover:bg-slate-800">
                {icon}
            </div>
            <h4 className="mb-3 text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">{title}</h4>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {description}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                Learn more <ArrowRight className="h-4 w-4" />
            </div>
        </div>
    );
}
