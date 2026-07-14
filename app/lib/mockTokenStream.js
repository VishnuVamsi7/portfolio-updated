/**
 * Phase 2 mock stream — simulates FastAPI/Groq token delivery.
 * Yields word/sentence chunks at irregular intervals.
 */

export const INFERENCE_PAYLOAD =
  'Initializing audio interface... Connection established. Hello, I am the autonomous assistant for Sai Vishnu Vamsi. I handle model serving pipelines and RAG systems. Ask me anything about his technical stack.';

/** Sentence-level segments used by the mock stream. */
export const INFERENCE_SEGMENTS = [
  'Initializing audio interface...',
  'Connection established.',
  'Hello, I am the autonomous assistant for Sai Vishnu Vamsi.',
  'I handle model serving pipelines and RAG systems.',
  'Ask me anything about his technical stack.',
];

function randomMs(min, max) {
  return min + Math.random() * (max - min);
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      return;
    }
    const id = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(id);
        reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

/**
 * Async generator that mimics a live token stream with connection latency.
 * @param {AbortSignal} [signal]
 * @yields {string} text chunks (words or short phrases)
 */
export async function* mockTokenStream(signal) {
  // Simulate handshake / TTFB before first token
  await delay(randomMs(520, 1100), signal);

  for (let s = 0; s < INFERENCE_SEGMENTS.length; s += 1) {
    if (signal?.aborted) return;

    const segment = INFERENCE_SEGMENTS[s];
    // First segment arrives as one block; others stream word-by-word
    const parts =
      s === 0
        ? [segment + ' ']
        : segment.split(' ').map((word, i, arr) => (i < arr.length - 1 ? `${word} ` : word + (s < INFERENCE_SEGMENTS.length - 1 ? ' ' : '')));

    for (const part of parts) {
      if (signal?.aborted) return;
      await delay(randomMs(70, 320), signal);
      yield part;
    }

    // Occasional longer pause between sentences
    if (s < INFERENCE_SEGMENTS.length - 1) {
      await delay(randomMs(120, 400), signal);
    }
  }
}

/**
 * Factory compatible with useTypewriterStream — pass directly as `source`.
 * @param {AbortSignal} signal
 */
export function createMockTokenStream(signal) {
  return mockTokenStream(signal);
}

/**
 * Adapt a WHATWG ReadableStream<string> into an async iterable.
 * @param {ReadableStream<string>} stream
 * @param {AbortSignal} [signal]
 */
export async function* readTextStream(stream, signal) {
  const reader = stream.getReader();
  try {
    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) break;
      if (value) yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
