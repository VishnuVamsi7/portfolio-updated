'use client';

import { useCallback, useEffect, useRef } from 'react';
import { cancelAgentSpeech, createAgentUtterance, pickAgentVoice } from './useAgentSpeech';

/**
 * Queues speech segments and speaks them sequentially as stream chunks arrive.
 * Prevents overlapping utterances by chaining on `utterance.onend`.
 */
export default function useQueuedAgentSpeech(enabled) {
  const queueRef = useRef([]);
  const speakingRef = useRef(false);
  const enabledRef = useRef(enabled);
  const voicesReadyRef = useRef(false);

  enabledRef.current = enabled;

  const flush = useCallback(() => {
    queueRef.current = [];
    speakingRef.current = false;
    cancelAgentSpeech();
  }, []);

  const speakNext = useCallback(() => {
    if (!enabledRef.current || speakingRef.current) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const next = queueRef.current.shift();
    if (!next?.trim()) {
      speakingRef.current = false;
      if (queueRef.current.length > 0) speakNext();
      return;
    }

    speakingRef.current = true;
    const synth = window.speechSynthesis;
    const utterance = createAgentUtterance(next.trim());

    const advance = () => {
      speakingRef.current = false;
      if (enabledRef.current && queueRef.current.length > 0) {
        speakNext();
      }
    };

    utterance.onend = advance;
    utterance.onerror = advance;
    synth.speak(utterance);
  }, []);

  const enqueueSegment = useCallback(
    (text) => {
      if (!enabledRef.current || !text?.trim()) return;
      queueRef.current.push(text);
      if (!speakingRef.current) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const synth = window.speechSynthesis;
          if (synth.getVoices().length === 0 && !voicesReadyRef.current) {
            const onVoices = () => {
              voicesReadyRef.current = true;
              synth.removeEventListener('voiceschanged', onVoices);
              speakNext();
            };
            synth.addEventListener('voiceschanged', onVoices);
          } else {
            speakNext();
          }
        }
      }
    },
    [speakNext]
  );

  useEffect(() => {
    if (!enabled) {
      flush();
      return undefined;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      pickAgentVoice();
    }

    return flush;
  }, [enabled, flush]);

  return { enqueueSegment, flush };
}
