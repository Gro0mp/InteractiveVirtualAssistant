import React from 'react';

export function Scorecard({ title, value, className = '' }: { title: string; value: string | number; className?: string }) {
    return (
        <div className={`flex flex-col items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4 ${className}`}>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">{title}</p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">{value}</p>
        </div>
    );
}