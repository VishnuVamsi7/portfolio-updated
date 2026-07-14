'use client';

import { useCallback, useEffect, useRef } from 'react';

const VOICE_PATTERNS = [
  /google us english/i,
  /microsoft zira/i,
  /google uk english/i,
  /microsoft david/i,
  /natural/i,
];

/** Pick the best available English voice for the mechanical agent persona. */
export function pickAgentVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  for (const pattern of VOICE_PATTERNS) {
    const match = voices.find((v) => pattern.test(v.name));
    if (match) return match;
  }
  return voices.find((v) => v.lang?.startsWith('en')) ?? null;
}

/** Configure and return a mechanical-agent utterance. */
export function createAgentUtterance(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 0.85;
  utterance.rate = 0.9;
  utterance.volume = 0.95;
  const voice = pickAgentVoice();
  if (voice) utterance.voice = voice;
  return utterance;
}

/** Cancel any in-flight speech synthesis. */
export function cancelAgentSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speaks `text` with agent voice settings when `trigger` becomes true.
 * Cancels any in-flight synthesis on unmount or re-trigger.
 */
export default function useAgentSpeech(text, trigger) {
  const utteranceRef = useRef(null);

  const cancel = useCallback(() => {
    cancelAgentSpeech();
  }, []);

  useEffect(() => {
    if (!trigger || !text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return undefined;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const speak = () => {
      const utterance = createAgentUtterance(text);
      utteranceRef.current = utterance;
      synth.speak(utterance);
    };

    if (synth.getVoices().length > 0) {
      speak();
    } else {
      const onVoicesChanged = () => {
        speak();
        synth.removeEventListener('voiceschanged', onVoicesChanged);
      };
      synth.addEventListener('voiceschanged', onVoicesChanged);
      return () => {
        synth.removeEventListener('voiceschanged', onVoicesChanged);
        synth.cancel();
      };
    }

    return () => synth.cancel();
  }, [text, trigger]);

  return { cancel };
}
