import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import Link from 'next/link';

export function CTASection() {
    return (
        <section
            aria-labelledby="cta-heading"
            className="py-24 bg-white dark:bg-neutral-950 relative overflow-hidden transition-colors duration-300"
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-900" />

            {/* Grid texture */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.025]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <defs>
                    <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-grid)" className="text-neutral-900 dark:text-white" />
            </svg>

            {/* Blue glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-72 bg-blue-400/8 dark:bg-blue-600/12 blur-[100px] pointer-events-none" aria-hidden />

            <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
                <div className="border border-neutral-200 dark:border-neutral-800 p-12 md:p-16 relative">

                    {/* Corner accents */}
                    <span className="absolute top-0 left-0 w-8 h-px bg-blue-500" aria-hidden />
                    <span className="absolute top-0 left-0 h-8 w-px bg-blue-500" aria-hidden />
                    <span className="absolute bottom-0 right-0 w-8 h-px bg-blue-500" aria-hidden />
                    <span className="absolute bottom-0 right-0 h-8 w-px bg-blue-500" aria-hidden />

                    <div className="max-w-xl">
                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35 }}
                            className="text-[10px] font-medium text-blue-600 dark:text-blue-500 uppercase tracking-widest font-mono mb-4"
                        >
                            Get started
                        </motion.p>

                        <motion.h2
                            id="cta-heading"
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.06 }}
                            className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight mb-5 leading-tight"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                            Your next great<br />interview starts here.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.1 }}
                            className="text-sm text-neutral-500 mb-9 leading-relaxed max-w-md"
                        >
                            Join candidates who use IVA to prepare smarter, apply faster, and land the roles they actually want.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            className="flex flex-wrap gap-3"
                        >
                            <Link href="/signup">
                                <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                    Get started free
                                </Button>
                            </Link>

                            <Link href="/login">
                                <Button size="lg" variant="outline">
                                    Log in
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.22 }}
                            className="mt-5 text-[10px] font-mono text-neutral-400 dark:text-neutral-700"
                        >
                            Free forever plan · No credit card required · Cancel anytime
                        </motion.p>
                    </div>
                </div>
            </div>
        </section>
    );
}