'use client';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
                                       icon: Icon,
                                       title,
                                       description,
                                       actionLabel,
                                       onAction
                                   }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="p-4 bg-slate-800 rounded-2xl mb-4 text-blue-500 shadow-xl shadow-blue-500/5">
                <Icon size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm max-w-xs mb-6">
                {description}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}