import React from 'react';
import {motion} from 'framer-motion';
import {ArrowRight, CheckCircle2, Mic, Briefcase, FileText} from 'lucide-react';
import {Button} from '../ui/Button.tsx';
import {GridBackground} from '../ui/GridBackground.tsx';
import {Link} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext.tsx';
import {HeroSectionAssistant} from './HeroSectionAssistant';

const capabilities = [
    {icon: Mic, label: 'Mock Interviews'},
    {icon: Briefcase, label: 'Job Matching'},
    {icon: FileText, label: 'Resume Tailoring'},
];

const trustMarks = [
    'No credit card required',
    'Free forever plan',
    'Cancel anytime',
];

export function HeroSection() {
    const {isAuthenticated} = useAuth();

    return (
        <section
            className="relative pt-28 pb-20 lg:pt-44 lg:pb-32 overflow-hidden"
            aria-labelledby="hero-heading"
        >
            <GridBackground/>

            <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left */}
                    <div>
                        {/* Status badge */}
                        <motion.div
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.4}}
                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 mb-8"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden/>
                            <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">AI-powered interview prep</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            id="hero-heading"
                            initial={{opacity: 0, y: 16}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: 0.06}}
                            className="text-4xl sm:text-5xl lg:text-[3.2rem] font-semibold text-neutral-900 dark:text-white leading-[1.1] tracking-tight mb-5"
                            style={{fontFamily: "'DM Mono', 'Fira Code', monospace"}}
                        >
                            Land your<br/>
                            dream job<br/>
                            <span className="text-blue-600 dark:text-blue-500">with IVA.</span>
                        </motion.h1>

                        <motion.p
                            initial={{opacity: 0, y: 14}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: 0.12}}
                            className="text-sm text-neutral-500 mb-8 leading-relaxed max-w-[400px]"
                        >
                            Practice realistic mock interviews, discover tailored job openings, and refine your resume
                            all in one focused workspace.
                        </motion.p>

                        {/* Capability pills */}
                        <motion.div
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.45, delay: 0.18}}
                            className="flex flex-wrap gap-2 mb-8"
                        >
                            {capabilities.map(({icon: Icon, label}) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-neutral-500 hover:border-blue-400 dark:hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 cursor-default"
                                >
									<Icon className="w-3 h-3" aria-hidden/>
                                    {label}
								</span>
                            ))}
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.45, delay: 0.22}}
                            className="flex flex-wrap gap-3 mb-7"
                        >
                            {isAuthenticated ? (
                                <Link to="/dashboard">
                                    <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4"/>}>
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/signup">
                                    <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4"/>}>
                                        Get started free
                                    </Button>
                                </Link>
                            )}
                            <Button variant="outline" size="lg">Watch demo</Button>
                        </motion.div>

                        {/* Trust marks */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{duration: 0.4, delay: 0.3}}
                            className="flex flex-wrap gap-x-5 gap-y-1.5"
                        >
                            {trustMarks.map((t) => (
                                <span key={t}
                                      className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-700">
									<CheckCircle2 className="w-3 h-3 text-blue-500 dark:text-blue-600 flex-shrink-0"
                                                  aria-hidden/>
                                    {t}
								</span>
                            ))}
                        </motion.div>
                    </div>


                    {/* Right — terminal-style scorecard */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.65, delay: 0.2, ease: 'easeOut'}}
                        className="relative flex items-center justify-center"
                        aria-hidden
                    >
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-64 h-64 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[60px]"/>
                        </div>

                        {/* Main card */}
                        <div
                            className="relative mt-16 w-full max-w-[380px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-visible shadow-lg dark:shadow-none transition-colors duration-300">
                            {/* Responsive 3D assistant */}
                            <HeroSectionAssistant className="pointer-events-none absolute -top-28 md:-top-32 left-1/2 -translate-x-1/2 w-[340px] h-[520px] sm:w-[420px] sm:h-[600px] lg:w-[480px] lg:h-[680px]"/>

                            {/* Terminal header */}
                            <div
                                className="flex items-center gap-1.5 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"/>
                                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"/>
                                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"/>
                                <span
                                    className="ml-3 text-[10px] text-neutral-400 dark:text-neutral-600 font-mono tracking-widest uppercase">
                Iva — Interview Report
            </span>
                            </div>

                            <div className="p-6">
                                {/* Score */}
                                <div className="flex items-end justify-between mb-5">
                                    <div>
                                        <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-1 font-mono">
                                            Overall score
                                        </p>
                                        <p className="text-4xl font-semibold text-neutral-900 dark:text-white font-mono">
                                            87
                                            <span className="text-lg text-neutral-300 dark:text-neutral-600">
                            /100
                        </span>
                                        </p>
                                    </div>
                                    <span
                                        className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30 px-2 py-1 font-mono">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"/>
                    LIVE
                </span>
                                </div>

                                {/* Skill bars */}
                                <div className="space-y-3">
                                    {[
                                        {label: 'Communication', score: 92},
                                        {label: 'Technical depth', score: 81},
                                        {label: 'Confidence', score: 88},
                                    ].map(({label, score}) => (
                                        <div key={label}>
                                            <div
                                                className="flex justify-between text-[10px] font-mono text-neutral-400 dark:text-neutral-600 mb-1.5">
                                                <span>{label}</span>
                                                <span className="text-neutral-500 dark:text-neutral-400">
                                {score}
                            </span>
                                            </div>
                                            <div className="h-px bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-blue-500"
                                                    initial={{width: 0}}
                                                    animate={{width: `${score}%`}}
                                                    transition={{
                                                        duration: 1,
                                                        delay: 0.7,
                                                        ease: 'easeOut',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="my-5 border-t border-neutral-100 dark:border-neutral-800"/>

                                {/* Insight rows */}
                                <div className="space-y-2.5">
                                    {[
                                        {
                                            label: 'Job match found',
                                            value: 'Senior PM @ Stripe',
                                            accent: true,
                                        },
                                        {
                                            label: 'Resume tip',
                                            value: 'Add impact metrics',
                                            accent: false,
                                        },
                                    ].map(({label, value, accent}) => (
                                        <div
                                            key={label}
                                            className="flex items-center justify-between"
                                        >
                        <span
                            className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600 uppercase tracking-wider">
                            {label}
                        </span>
                                            <span
                                                className={`text-[11px] font-mono font-medium ${
                                                    accent
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-neutral-500 dark:text-neutral-400'
                                                }`}
                                            >
                            {value}
                        </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}