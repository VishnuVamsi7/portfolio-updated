'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTypewriterStream from '../../hooks/useTypewriterStream';
import useQueuedAgentSpeech from '../../hooks/useQueuedAgentSpeech';
import { createMockTokenStream } from '../../lib/mockTokenStream';

function InferenceProgress({ reduceMotion }) {
  return (
    <div className="mb-4" role="status" aria-label="Opening inference stream">
      <div className="relative h-1 overflow-hidden rounded-full bg-line-subtle">
        {!reduceMotion ? (
          <motion.div
            className="absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-transparent via-accent-bright to-transparent shadow-glow-sm"
            animate={{ x: ['-40%', '260%'] }}
            transition={{ duration: 1.35, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <div className="h-full w-1/3 rounded-full bg-accent/50" />
        )}
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
        Opening inference stream…
      </p>
    </div>
  );
}

export default function TerminalBio({ active, onClose, reduceMotion }) {
  const { enqueueSegment, flush: flushSpeech } = useQueuedAgentSpeech(active);
  const speechBufferRef = useRef('');

  const streamSource = useCallback(
    (signal) => createMockTokenStream(signal),
    []
  );

  const flushSpeechBuffer = useCallback(
    (force = false) => {
      const buf = speechBufferRef.current;
      if (!buf) return;

      // Speak complete sentences; hold partial phrases until boundary or stream end
      const sentenceMatch = buf.match(/^(.*?[.!?…]+)(\s*)/);
      if (sentenceMatch) {
        enqueueSegment(sentenceMatch[1]);
        speechBufferRef.current = buf.slice(sentenceMatch[0].length);
        if (speechBufferRef.current) flushSpeechBuffer(force);
      } else if (force && buf.trim()) {
        enqueueSegment(buf.trim());
        speechBufferRef.current = '';
      }
    },
    [enqueueSegment]
  );

  const handleChunk = useCallback(
    (chunk) => {
      speechBufferRef.current += chunk;
      flushSpeechBuffer(false);
    },
    [flushSpeechBuffer]
  );

  const { output, isConnecting, isComplete, isStreaming, abort } = useTypewriterStream({
    source: streamSource,
    trigger: active,
    onChunk: handleChunk,
  });

  useEffect(() => {
    if (isComplete) flushSpeechBuffer(true);
  }, [isComplete, flushSpeechBuffer]);

  useEffect(() => {
    if (!active) speechBufferRef.current = '';
  }, [active]);

  const handleClose = () => {
    speechBufferRef.current = '';
    abort();
    flushSpeech();
    onClose?.();
  };

  const showCursor = isConnecting || isStreaming;

  return (
    <div className="rounded-xl border border-accent/25 bg-base/80 p-4 shadow-glow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 font-mono text-xs uppercase tracking-wider text-accent-bright">
            live-inference.sh
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400/90">
            <motion.span
              className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            {isConnecting ? 'connecting' : isComplete ? 'complete' : 'streaming'}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close live inference terminal"
              data-cursor="pointer"
              className="cursor-pointer rounded-md border border-line-subtle px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted transition-colors duration-200 hover:border-line-hover hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              exit
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isConnecting && (
          <motion.div
            key="progress"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            <InferenceProgress reduceMotion={reduceMotion} />
          </motion.div>
        )}
      </AnimatePresence>

      <pre
        aria-live="polite"
        aria-atomic="false"
        className="min-h-[120px] whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-emerald-300/90"
      >
        <span className="select-none text-accent-bright/80">&gt; </span>
        {output}
        {showCursor && (
          <motion.span
            aria-hidden="true"
            className="ml-px inline-block text-accent-bright"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
          >
            _
          </motion.span>
        )}
      </pre>
    </div>
  );
}
