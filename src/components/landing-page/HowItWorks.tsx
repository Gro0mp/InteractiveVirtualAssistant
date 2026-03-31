import { motion } from 'framer-motion';
import { UserPlus, Speech, TrendingUp } from 'lucide-react';

const steps = [
    { icon: UserPlus, number: '01', title: 'Create your profile', description: 'Sign up in under a minute. Set your target roles, industries, and experience level so IVA can personalise everything.', detail: 'No credit card needed' },
    { icon: Speech, number: '02', title: 'Practice & prepare', description: 'Run mock interviews, review your resume, and browse curated job matches — all with AI that understands your goals.', detail: 'Real-time feedback' },
    { icon: TrendingUp, number: '03', title: 'Track & improve', description: 'Monitor your interview scores over time. IVA pinpoints exactly what to work on so every session moves the needle.', detail: 'Progress dashboard' },
];

export function HowItWorks() {
    return (
        <section
            id="how-it-works"
            aria-labelledby="how-it-works-heading"
            className="py-24 bg-white dark:bg-neutral-950 relative overflow-hidden transition-colors duration-300"
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-900" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-blue-400/5 dark:bg-blue-600/5 blur-[80px] pointer-events-none" aria-hidden />

            <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
                <div className="mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35 }}
                        className="text-[10px] font-medium text-blue-600 dark:text-blue-500 uppercase tracking-widest font-mono mb-3"
                    >
                        Process
                    </motion.p>
                    <motion.h2
                        id="how-it-works-heading"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-white tracking-tight"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        How IVA works
                    </motion.h2>
                </div>

                {/* Steps grid — gap is the separator */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-900">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: index * 0.1 }}
                                className="bg-white dark:bg-neutral-950 p-8 relative group hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors duration-200"
                            >
                <span className="absolute top-8 right-8 text-[10px] font-mono text-neutral-200 dark:text-neutral-800 group-hover:text-neutral-300 dark:group-hover:text-neutral-700 transition-colors">
                  {step.number}
                </span>

                                <div className="w-10 h-10 border border-neutral-200 dark:border-neutral-800 group-hover:border-blue-400 dark:group-hover:border-blue-500/50 flex items-center justify-center mb-6 transition-colors duration-200">
                                    <Icon className="w-4 h-4 text-neutral-400 dark:text-neutral-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" aria-hidden />
                                </div>

                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2.5">{step.title}</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-600 leading-relaxed mb-5">{step.description}</p>

                                <div className="inline-flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 px-2 py-1">
                                    <span className="w-1 h-1 rounded-full bg-blue-500" aria-hidden />
                                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">{step.detail}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}