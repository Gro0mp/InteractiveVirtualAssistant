import type {LucideIcon} from "lucide-react";
import Link from "next/link";
import {motion} from "framer-motion";
import React from "react";

type FeatureTileProps = {
    icon: LucideIcon;
    label: string;
    href: string;
    index?: number;
};

export function FeatureTile({ icon: Icon, label, href, index = 0 }: FeatureTileProps) {
    return (
        <Link href={href}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
                className="group flex flex-col items-center gap-2.5 cursor-pointer select-none"
            >
                {/* Tile */}
                <div className={[
                    'w-14 h-14 flex items-center justify-center',
                    'border border-neutral-300/70 dark:border-neutral-700/80',
                    'bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md',
                    'shadow-[0_2px_8px_rgba(15,23,42,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]',
                    'transition-all duration-150',
                    'group-hover:border-blue-400 dark:group-hover:border-blue-500',
                    'group-hover:shadow-[0_4px_16px_rgba(37,99,235,0.15)] dark:group-hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)]',
                    'group-hover:bg-white dark:group-hover:bg-neutral-900',
                ].join(' ')}>
                    <Icon
                        className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150"
                        strokeWidth={1.75}
                    />
                </div>
                {/* Label */}
                <span className="text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-widest group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors duration-150 whitespace-nowrap">
                    {label}
                </span>
            </motion.div>
        </Link>
    );
}