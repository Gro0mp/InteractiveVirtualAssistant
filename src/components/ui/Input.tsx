import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label &&
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-700 mb-1.5">

          {label}
        </label>
      }
      <input
        id={inputId}
        className={`
          flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-slate-400 
          focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-violet-500 focus:ring-violet-100 hover:border-slate-300'}
          ${className}
        `}
        {...props} />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helperText && !error &&
      <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      }
    </div>);

}