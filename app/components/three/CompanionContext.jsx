'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { COMPANION_SECTIONS } from '../../lib/companionSections';

const CompanionContext = createContext(null);

/**
 * State + voice layer for the floating companion avatar.
 *
 * External AI hook: from anywhere in the app call
 *   const { say, setSectionDialogue } = useCompanion();
 *   setSectionDialogue('projects', textFromYourFastAPIBackend);  // future lines
 *   say(streamedGroqResponse);                                   // speak now
 */
export function CompanionProvider({ children }) {
  const [activeSection, setActiveSection] = useState('hero');
  const [muted, setMuted] = useState(true); // opt-in voice (autoplay policies + politeness)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [auraPulse, setAuraPulse] = useState(0);
  const dialogueRef = useRef(
    Object.fromEntries(COMPANION_SECTIONS.map((s) => [s.id, s.dialogue]))
  );
  const interactedRef = useRef(false);
  const lastSpokenRef = useRef(null);
  const activeSectionRef = useRef(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const markInteracted = () => {
      interactedRef.current = true;
    };
    window.addEventListener('pointerdown', markInteracted, { once: true, passive: true });
    window.addEventListener('keydown', markInteracted, { once: true });
    return () => {
      window.removeEventListener('pointerdown', markInteracted);
      window.removeEventListener('keydown', markInteracted);
    };
  }, []);

  const say = useCallback((text) => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.03;
    utterance.pitch = 1.08;
    utterance.volume = 0.9;
    const voice = synth
      .getVoices()
      .find((v) => v.lang?.startsWith('en') && /google|natural|aria|zira/i.test(v.name));
    if (voice) utterance.voice = voice;

    setIsSpeaking(true);
    setAuraPulse((pulse) => pulse + 1);

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAuraPulse((pulse) => pulse + 1);
    };
    utterance.onboundary = () => {
      setAuraPulse((pulse) => pulse + 1);
    };
    const stopSpeaking = () => setIsSpeaking(false);
    utterance.onend = stopSpeaking;
    utterance.onerror = stopSpeaking;

    synth.speak(utterance);
  }, []);

  const setSectionDialogue = useCallback((sectionId, text) => {
    dialogueRef.current[sectionId] = text;
  }, []);

  const announceSection = useCallback(
    (sectionId) => {
      setActiveSection(sectionId);
      if (muted || !interactedRef.current) return;
      if (lastSpokenRef.current === sectionId) return;
      lastSpokenRef.current = sectionId;
      say(dialogueRef.current[sectionId]);
    },
    [muted, say]
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (next) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
      } else {
        setAuraPulse((pulse) => pulse + 1);
        lastSpokenRef.current = null;
        if (interactedRef.current) {
          const sectionId = activeSectionRef.current;
          lastSpokenRef.current = sectionId;
          say(dialogueRef.current[sectionId]);
        }
      }
      return next;
    });
  }, [say]);

  const value = useMemo(
    () => ({
      activeSection,
      announceSection,
      muted,
      isSpeaking,
      auraPulse,
      toggleMute,
      say,
      setSectionDialogue,
    }),
    [activeSection, announceSection, muted, isSpeaking, auraPulse, toggleMute, say, setSectionDialogue]
  );

  return <CompanionContext.Provider value={value}>{children}</CompanionContext.Provider>;
}

export function useCompanion() {
  const ctx = useContext(CompanionContext);
  if (!ctx) throw new Error('useCompanion must be used within CompanionProvider');
  return ctx;
}
