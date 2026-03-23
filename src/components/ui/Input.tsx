import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function Input({ label, error, helperText, className = '', id, ...props }: InputProps) {
    const inputId = id || props.name;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-widest">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined}
                aria-invalid={!!error}
                className={`
          flex h-10 w-full bg-white dark:bg-neutral-900 border text-sm text-neutral-900 dark:text-white px-3 py-2
          placeholder:text-neutral-400 dark:placeholder:text-neutral-600
          focus:outline-none focus:ring-1 focus:ring-offset-0
          disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-150 rounded-sm
          ${error
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-neutral-300 dark:border-neutral-800 focus:border-blue-500 focus:ring-blue-500 hover:border-neutral-400 dark:hover:border-neutral-600'}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <span aria-hidden>⚠</span> {error}
                </p>
            )}
            {helperText && !error && (
                <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-600">{helperText}</p>
            )}
        </div>
    );
}