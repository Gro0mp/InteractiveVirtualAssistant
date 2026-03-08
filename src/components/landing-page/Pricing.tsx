import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button.tsx";

type PricingPlan = {
    title: string;
    price: string;
    cadence: string;
    description: string;
    features: string[];
    ctaLabel: string;
    ctaHref: string;
    highlighted?: boolean;
};

const pricing: PricingPlan[] = [
    {
        title: 'Free',
        price: '$0',
        cadence: 'forever',
        description: 'Try IVA with the essentials — no credit card needed.',
        features: [
            'Assistant chat (limited)',
            'Basic task guidance',
            'Single workspace',
            'Community support'
        ],
        ctaLabel: 'Start free',
        ctaHref: '/signup',
    },
    {
        title: 'Basic',
        price: '$19.99',
        cadence: 'per month',
        description: 'For individuals getting started with IVA automation.',
        features: [
            'Core assistant chat + task guidance',
            'Basic document & invoice workflows',
            'Email reminders and simple automations',
            'Community support'
        ],
        ctaLabel: 'Get started',
        ctaHref: '/signup',
        highlighted: true
    },
    {
        title: 'Pro',
        price: '$29.99',
        cadence: 'per month',
        description: 'For pros who want faster workflows and more power.',
        features: [
            'Everything in Basic',
            'Priority execution for automations',
            'Advanced templates and exports',
            'Priority support'
        ],
        ctaLabel: 'Start Pro',
        ctaHref: '/signup',
    },
];

function PricingCard({ plan }: { plan: PricingPlan }) {
    const cardInner = (
        <div
            className={
                plan.highlighted
                    ? "rounded-2xl bg-white p-8 sm:p-10 shadow-lg shadow-slate-900/5 border border-white/60"
                    : "rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-slate-200"
            } id={"pricing"}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-900">
                            {plan.title}
                        </h3>
                        {plan.highlighted && (
                            <span className="inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 ring-1 ring-inset ring-cyan-200">
                                Most popular
                            </span>
                        )}
                    </div>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {plan.description}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-end gap-2">
                <div className="text-4xl font-bold tracking-tight text-slate-900">
                    {plan.price}
                </div>
                <div className="pb-1 text-sm text-slate-500">{plan.cadence}</div>
            </div>

            <div className="mt-6">
                <ul className="space-y-3">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-50 ring-1 ring-cyan-200">
                                <Check className="h-3.5 w-3.5 text-black" />
                            </span>
                            <span className="leading-relaxed">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8">
                <Link to={plan.ctaHref} className="block">
                    <Button
                        size="lg"
                        variant={plan.highlighted ? 'secondary' : 'outline'}
                        className="w-full">
                        {plan.ctaLabel}
                    </Button>
                </Link>
                <div className="mt-3 text-xs text-slate-500">
                    Cancel anytime. No long-term contracts.
                </div>
            </div>
        </div>
    );

    if (!plan.highlighted) return cardInner;

    // Gradient border treatment for the featured plan
    return (
        <div className="rounded-2xl bg-gradient-to-r from-cyan-200/80 via-cyan-200/70 to-blue-200/70 p-[1px]">
            {cardInner}
        </div>
    );
}

export function Pricing() {
    return (
        <section
            id="pricing"
            aria-labelledby="pricing-title"
            className="py-24 bg-slate-50 relative overflow-hidden">

            {/* Subtle background accents (kept minimal + on-theme) */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-24 left-[-120px] h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
                <div className="absolute -bottom-24 right-[-140px] h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-white to-cyan-50/50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        id="pricing-title"
                        initial={{
                            opacity: 0,
                            y: 20
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}
                        viewport={{
                            once: true
                        }}
                        transition={{
                            duration: 0.5
                        }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">

                        Pricing Plans
                    </motion.h2>
                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 20
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}
                        viewport={{
                            once: true
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1
                        }}
                        className="text-lg text-slate-600">

                        Choose a plan that fits your workflow. Upgrade anytime.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {pricing.map((plan, index) => (
                        <motion.div
                            key={plan.title}
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.08
                            }}
                            className={plan.highlighted ? "md:-mt-2" : ""}>
                            <PricingCard plan={plan} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-14 text-center text-sm text-slate-500">
                    Need something custom?{' '}
                    <a
                        href="#"
                        className="text-cyan-700 hover:text-cyan-800 underline underline-offset-4">
                        Contact us
                    </a>
                </div>
            </div>
        </section>
    );
}