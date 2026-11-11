'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from './button';
import { MOTION_EASINGS } from '@/lib/constants/motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.05 : 0.2,
              ease: MOTION_EASINGS.architectural,
            }}
            className="fixed inset-0 bg-[#252525]/35 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog Frame */}
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.98, y: 8 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.98, y: 8 }
            }
            transition={{
              duration: shouldReduceMotion ? 0.05 : 0.22,
              ease: MOTION_EASINGS.architectural,
            }}
            className={cn(
              'relative w-full max-w-lg rounded-axis-lg bg-axis-bg-elevated border border-axis-border shadow-axis-elevated z-10 overflow-hidden',
              className
            )}
          >
            <div className="flex items-center justify-between border-b border-axis-border px-6 py-4 bg-axis-surface/40">
              <div>
                {title && (
                  <h2 className="text-base font-medium text-axis-text-primary tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-xs text-axis-text-secondary mt-0.5">{description}</p>
                )}
              </div>
              <IconButton
                variant="ghost"
                size="iconSm"
                aria-label="Close dialog"
                onClick={onClose}
                icon={<X className="w-4 h-4 text-axis-text-muted hover:text-axis-text-primary" />}
              />
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>

            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-axis-border bg-axis-surface/30">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
