'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { springSmooth } from '../../lib/motion';

export default function PageLoader() {
  const [show, setShow] = useState(true);
  const reduceMotion = useReducedMotion();

  const dismiss = useCallback(() => setShow(false), []);

  // Hard failsafe — never block the site behind the loader
  useEffect(() => {
    const failsafe = setTimeout(dismiss, 2500);
    return () => clearTimeout(failsafe);
  }, [dismiss]);

  useEffect(() => {
    if (reduceMotion === null) return;
    const main = setTimeout(dismiss, reduceMotion ? 0 : 850);
    return () => clearTimeout(main);
  }, [dismiss, reduceMotion]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-base"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={dismiss}
          role="status"
          aria-label="Loading portfolio"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
          <div className="relative text-center">
            <motion.div
              className="font-display text-3xl font-bold md:text-5xl"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springSmooth}
            >
              <motion.span
                className="inline-block text-ink-primary"
                initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Sai Vishnu
              </motion.span>{' '}
              <motion.span
                className="inline-block text-gradient"
                initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 }}
              >
                Vamsi
              </motion.span>
            </motion.div>
            <motion.p
              className="mt-3 text-sm text-ink-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              AI · ML · Data Engineering
            </motion.p>
            {!reduceMotion && (
              <p className="mt-6 text-xs text-ink-muted">Click to skip</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
