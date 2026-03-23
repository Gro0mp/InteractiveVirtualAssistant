import React from 'react';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button.tsx';

type PricingPlan = {
    title: string;
    price: string;
    cadence: string;
    description: string;
    features: { label: string; included: boolean }[];
    ctaLabel: string;
    ctaHref: string;
    highlighted?: boolean;
};

const plans: PricingPlan[] = [
    {
        title: 'Free',
        price: '$0',
        cadence: 'forever',
        description: 'Explore IVA with no commitment.',
        features: [
            { label: '5 mock interviews / month', included: true },
            { label: 'Basic job matching', included: true },
            { label: 'Resume review (1/month)', included: true },
            { label: 'Community support', included: true },
            { label: 'Priority AI responses', included: false },
            { label: 'Advanced analytics', included: false },
        ],
        ctaLabel: 'Start free',
        ctaHref: '/signup',
    },
    {
        title: 'Basic',
        price: '$19',
        cadence: '/ month',
        description: 'For candidates actively applying.',
        features: [
            { label: 'Unlimited mock interviews', included: true },
            { label: 'Smart job matching (daily)', included: true },
            { label: 'Unlimited resume tailoring', included: true },
            { label: 'Email drafting & cover letters', included: true },
            { label: 'Priority AI responses', included: true },
            { label: 'Advanced analytics', included: false },
        ],
        ctaLabel: 'Start Basic',
        ctaHref: '/signup',
        highlighted: true,
    },
    {
        title: 'Pro',
        price: '$29',
        cadence: '/ month',
        description: 'For power users who want every edge.',
        features: [
            { label: 'Everything in Basic', included: true },
            { label: 'Advanced progress analytics', included: true },
            { label: 'Custom coaching plans', included: true },
            { label: 'Priority support (24hr)', included: true },
            { label: 'Early feature access', included: true },
            { label: 'API access (coming soon)', included: true },
        ],
        ctaLabel: 'Start Pro',
        ctaHref: '/signup',
    },
];

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.09 }}
            className="h-full"
        >
            <div
                className={`relative h-full flex flex-col p-7 border transition-colors duration-150 ${
                    plan.highlighted
                        ? 'bg-blue-600 border-blue-500'
                        : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
            >
                {plan.highlighted && (
                    <div className="absolute -top-px left-6 right-6 h-px bg-blue-400" aria-hidden />
                )}

                <div className="flex items-start justify-between mb-5">
                    <div>
                        <h3 className={`text-xs font-semibold uppercase tracking-widest font-mono mb-1.5 ${plan.highlighted ? 'text-blue-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
                            {plan.title}
                        </h3>
                        <p className={`text-xs leading-relaxed ${plan.highlighted ? 'text-blue-200' : 'text-neutral-500 dark:text-neutral-600'}`}>
                            {plan.description}
                        </p>
                    </div>
                    {plan.highlighted && (
                        <span className="text-[9px] font-semibold font-mono uppercase tracking-widest text-blue-200 border border-blue-400/50 px-2 py-1 whitespace-nowrap">
              Popular
            </span>
                    )}
                </div>

                <div className="flex items-end gap-1 mb-7">
          <span className="text-4xl font-semibold font-mono tracking-tight text-neutral-900 dark:text-white">
            {plan.price}
          </span>
                    <span className={`pb-1 text-xs font-mono ${plan.highlighted ? 'text-blue-300' : 'text-neutral-400 dark:text-neutral-600'}`}>
            {plan.cadence}
          </span>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1" role="list">
                    {plan.features.map(({ label, included }) => (
                        <li key={label} className={`flex items-center gap-2.5 text-xs ${
                            included
                                ? plan.highlighted ? 'text-blue-100' : 'text-neutral-600 dark:text-neutral-400'
                                : plan.highlighted ? 'text-blue-400/50' : 'text-neutral-300 dark:text-neutral-800'
                        }`}>
                            {included ? (
                                <Check className={`w-3.5 h-3.5 flex-shrink-0 ${plan.highlighted ? 'text-blue-200' : 'text-blue-500'}`} aria-label="Included" />
                            ) : (
                                <Minus className="w-3.5 h-3.5 flex-shrink-0 text-current" aria-label="Not included" />
                            )}
                            <span className="font-mono">{label}</span>
                        </li>
                    ))}
                </ul>

                <Link to={plan.ctaHref} className="block">
                    <Button size="lg" variant={plan.highlighted ? 'primary' : 'outline'} className="w-full">
                        {plan.ctaLabel}
                    </Button>
                </Link>
                <p className={`mt-2.5 text-center text-[10px] font-mono ${plan.highlighted ? 'text-blue-300' : 'text-neutral-400 dark:text-neutral-700'}`}>
                    Cancel anytime
                </p>
            </div>
        </motion.div>
    );
}

export function Pricing() {
    return (
        <section
            id="pricing"
            aria-labelledby="pricing-heading"
            className="py-24 bg-neutral-50 dark:bg-[#0A0A0A] relative overflow-hidden transition-colors duration-300"
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-900" />

            <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
                <div className="mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35 }}
                        className="text-[10px] font-medium text-blue-600 dark:text-blue-500 uppercase tracking-widest font-mono mb-3"
                    >
                        Pricing
                    </motion.p>
                    <motion.h2
                        id="pricing-heading"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-white tracking-tight"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        Simple, transparent pricing
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-900">
                    {plans.map((plan, i) => (
                        <PricingCard key={plan.title} plan={plan} index={i} />
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-8 text-[11px] font-mono text-neutral-400 dark:text-neutral-700"
                >
                    Need a custom plan?{' '}
                    <a href="#" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors underline underline-offset-4">
                        Contact us →
                    </a>
                </motion.p>
            </div>
        </section>
    );
}