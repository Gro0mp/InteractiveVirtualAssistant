import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Button({
                           children,
                           className = '',
                           variant = 'primary',
                           size = 'md',
                           isLoading = false,
                           leftIcon,
                           rightIcon,
                           disabled,
                           ...props
                       }: ButtonProps) {
    const base =
        'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black focus-visible:ring-offset-white disabled:opacity-40 disabled:pointer-events-none select-none rounded-sm';

    const variants = {
        primary:
            'bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200 focus-visible:ring-neutral-900 dark:focus-visible:ring-white active:scale-[0.98]',
        secondary:
            'bg-blue-600 text-white hover:bg-blue-500 focus-visible:ring-blue-500 shadow-[0_0_18px_rgba(37,99,235,0.3)] hover:shadow-[0_0_26px_rgba(37,99,235,0.45)] dark:shadow-[0_0_18px_rgba(37,99,235,0.4)] dark:hover:shadow-[0_0_26px_rgba(37,99,235,0.55)] active:scale-[0.98]',
        outline:
            'border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-400 hover:text-neutral-900 dark:hover:text-white focus-visible:ring-neutral-500 active:scale-[0.98]',
        ghost:
            'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 focus-visible:ring-neutral-500',
        link: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline-offset-4 hover:underline p-0 h-auto font-normal',
    };

    const sizes = {
        sm: 'h-8 px-3.5 text-xs gap-1.5',
        md: 'h-9 px-4 text-sm gap-2',
        lg: 'h-11 px-6 text-sm gap-2',
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className} cursor-pointer`}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {!isLoading && leftIcon && <span>{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span>{rightIcon}</span>}
        </button>
    );
}