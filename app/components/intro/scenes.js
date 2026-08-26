export const INTRO_SCENES = [
  {
    id: 'boot',
    label: 'Boot',
    hudState: 'NODE // PORTFOLIO.SYS',
    hudDomain: 'STATUS // INITIALIZING',
    title: 'SYSTEM ONLINE',
    subtitle: 'AI Developer · Zibtek',
  },
  {
    id: 'stack',
    label: 'Stack',
    hudState: 'NODE // STACK.MAP',
    hudDomain: 'STATUS // ASSEMBLING',
    title: 'LOAD THE STACK',
    subtitle: 'Languages · RAG · Cloud · Product',
  },
  {
    id: 'wake',
    label: 'Wake',
    hudState: 'NODE // VISION.WAKE',
    hudDomain: 'STATUS // CALIBRATING',
    title: 'SIGNAL WAKE',
    subtitle: 'Systems coming online',
    videoSrc: '/assets/intro/eyes-opening.mp4',
    videoLabel: 'Vision wake sequence',
  },
  {
    id: 'domain',
    label: 'Domain',
    hudState: 'NODE // DOMAIN.EXPAND',
    hudDomain: 'STATUS // LOCKING',
    title: 'DOMAIN LOCK',
    subtitle: 'Retrieval pipelines secured',
    videoSrc: '/assets/intro/hand-sign.mp4',
    videoLabel: 'Domain expansion sequence',
  },
  {
    id: 'enter',
    label: 'Enter',
    hudState: 'NODE // READY',
    hudDomain: 'STATUS // AWAITING ENTRY',
    title: 'ENTER THE WORK',
    subtitle: 'Slide up to open the portfolio',
  },
];

/** Legacy branded WebM kept as fallback poster/asset */
export const SIGNAL_VIDEO_SRC = '/assets/intro/signal-wake.webm';
