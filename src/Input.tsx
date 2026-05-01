import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs text-text-secondary font-medium">{label}</label>
      )}
      <input
        className={
          'h-12 px-3 rounded-lg border bg-white text-text-primary ' +
          'placeholder:text-text-secondary/50 ' +
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ' +
          'transition-all duration-150 ' +
          (error ? 'border-error ring-2 ring-error/20' : 'border-gray-200') +
          ' ' + className
        }
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs text-text-secondary font-medium">{label}</label>
      )}
      <textarea
        className={
          'px-3 py-2 rounded-lg border bg-white text-text-primary ' +
          'placeholder:text-text-secondary/50 ' +
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ' +
          'transition-all duration-150 resize-none ' +
          (error ? 'border-error ring-2 ring-error/20' : 'border-gray-200') +
          ' ' + className
        }
        rows={3}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}