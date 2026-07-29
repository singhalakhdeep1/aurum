/**
 * Toast Component
 * Displays temporary notifications
 */

'use client';

import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/ui/button';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  onClose: () => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const colorMap = {
  success: 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  error: 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  info: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  warning: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
};

export function Toast({ type, title, message, onClose }: ToastProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${colors} shadow-lg`}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        {message && (
          <p className="text-sm mt-1 opacity-90">{message}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 flex-shrink-0"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Toast manager for handling multiple toasts
let toastId = 0;
const toasts: Map<number, { type: ToastType; title: string; message?: string }> = new Map();
const listeners: Set<(toasts: Map<number, { type: ToastType; title: string; message?: string }>) => void> = new Set();

export function showToast(type: ToastType, title: string, message?: string, duration = 5000) {
  const id = toastId++;
  toasts.set(id, { type, title, message });
  notifyListeners();

  setTimeout(() => {
    removeToast(id);
  }, duration);

  return id;
}

export function removeToast(id: number) {
  toasts.delete(id);
  notifyListeners();
}

export function subscribeToToasts(listener: (toasts: Map<number, { type: ToastType; title: string; message?: string }>) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach(listener => listener(new Map(toasts)));
}

export function useToasts() {
  const [currentToasts, setCurrentToasts] = React.useState<Map<number, { type: ToastType; title: string; message?: string }>>(new Map(toasts));

  React.useEffect(() => {
    return subscribeToToasts((newToasts) => {
      setCurrentToasts(new Map(newToasts));
    });
  }, []);

  return {
    toasts: currentToasts,
    showToast,
    removeToast,
  };
}
