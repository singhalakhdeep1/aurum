/**
 * Confirm Dialog Component
 * Reusable confirmation dialog for destructive actions
 */

'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/ui/card';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const variantStyles = {
  danger: {
    icon: 'text-red-500',
    confirmButton: 'bg-red-500 hover:bg-red-600',
  },
  warning: {
    icon: 'text-orange-500',
    confirmButton: 'bg-orange-500 hover:bg-orange-600',
  },
  info: {
    icon: 'text-blue-500',
    confirmButton: 'bg-blue-500 hover:bg-blue-600',
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md p-4">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${styles.icon}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <CardTitle>{title}</CardTitle>
                <CardDescription className="mt-2">{description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                {cancelText}
              </Button>
              <Button className={styles.confirmButton} onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
