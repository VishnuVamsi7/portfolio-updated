'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springOverlay } from '../../lib/motion';

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 4L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function getFlipOrigin(originRect) {
  if (!originRect || typeof window === 'undefined') {
    return { x: 0, y: 40, scale: 0.92 };
  }
  const cx = originRect.left + originRect.width / 2;
  const cy = originRect.top + originRect.height / 2;
  const vx = window.innerWidth / 2;
  const vy = window.innerHeight / 2;
  return {
    x: cx - vx,
    y: cy - vy,
    scale: Math.min(originRect.width / 720, 0.35),
  };
}

export default function PopupShell({
  isOpen,
  onClose,
  onExitComplete,
  originRect,
  title,
  ariaLabel,
  children,
  footer,
}) {
  const reduceMotion = useReducedMotion();
  const labelId = useId();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(document.activeElement);

  const trapFocus = useCallback((e) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      trapFocus(e);
    };
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
      document.body.style.overflow = '';
      if (triggerRef.current?.focus) triggerRef.current.focus();
    };
  }, [isOpen, onClose, trapFocus]);

  const flip = getFlipOrigin(originRect);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && (
        <div className="fixed inset-0 z-[70]" role="presentation">
          <motion.button
            type="button"
            aria-label="Close dialog backdrop"
            className="absolute inset-0 bg-black/70 backdrop-blur-[12px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.35 }}
            onClick={onClose}
          />

          <div className="popup-shell-wrapper pointer-events-none fixed inset-0 flex items-center justify-center overflow-y-auto p-4 sm:p-8">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? labelId : undefined}
              aria-label={ariaLabel || title}
              className="popup-shell-body glass glass-glow pointer-events-auto relative w-full max-w-4xl rounded-3xl p-6 sm:p-8 md:max-w-5xl"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: flip.x, y: flip.y, scale: flip.scale }
              }
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: flip.x * 0.6, y: flip.y * 0.6, scale: flip.scale * 0.9 }
              }
              transition={reduceMotion ? { duration: 0.15 } : springOverlay}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="group absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full text-ink-secondary opacity-40 transition hover:rotate-90 hover:opacity-100 hover:text-ink-primary"
              >
                <CloseIcon />
              </button>

              {title && (
                <h2 id={labelId} className="sr-only">
                  {title}
                </h2>
              )}

              <div className="relative z-10">{children}</div>

              {footer && <div className="relative z-10 mt-6">{footer}</div>}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
