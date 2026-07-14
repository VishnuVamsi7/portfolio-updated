'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { readTextStream } from '../lib/mockTokenStream';

/**
 * Consumes an async stream source and accumulates text chunks.
 *
 * @param {Object} options
 * @param {(signal: AbortSignal) => AsyncIterable<string> | ReadableStream<string>} options.source
 *   Stream factory — receives an AbortSignal for cancellation.
 * @param {boolean} options.trigger  When true, opens the stream.
 * @param {(chunk: string) => void} [options.onChunk]  Fired for each incoming chunk (e.g. speech queue).
 */
export default function useTypewriterStream({ source, trigger, onChunk }) {
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | connecting | streaming | complete | aborted | error
  const runIdRef = useRef(0);
  const abortRef = useRef(null);
  const onChunkRef = useRef(onChunk);

  onChunkRef.current = onChunk;

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  useEffect(() => {
    if (!trigger || !source) {
      abort();
      setOutput('');
      setStatus('idle');
      return undefined;
    }

    const runId = ++runIdRef.current;
    const controller = new AbortController();
    abortRef.current = controller;

    setOutput('');
    setStatus('connecting');

    let accumulated = '';

    const pushChunk = (chunk) => {
      if (runId !== runIdRef.current || controller.signal.aborted) return;
      if (!chunk) return;
      accumulated += chunk;
      setOutput(accumulated);
      setStatus('streaming');
      onChunkRef.current?.(chunk);
    };

    const consume = async () => {
      try {
        const streamable = source(controller.signal);

        if (streamable && typeof streamable[Symbol.asyncIterator] === 'function') {
          for await (const chunk of streamable) {
            if (controller.signal.aborted || runId !== runIdRef.current) break;
            pushChunk(chunk);
          }
        } else if (streamable && typeof streamable.getReader === 'function') {
          for await (const chunk of readTextStream(streamable, controller.signal)) {
            if (controller.signal.aborted || runId !== runIdRef.current) break;
            pushChunk(chunk);
          }
        } else {
          throw new Error('Stream source must return an AsyncIterable or ReadableStream');
        }

        if (!controller.signal.aborted && runId === runIdRef.current) {
          setStatus('complete');
        }
      } catch (err) {
        if (controller.signal.aborted || err?.name === 'AbortError') {
          if (runId === runIdRef.current) setStatus('aborted');
        } else if (runId === runIdRef.current) {
          setStatus('error');
        }
      }
    };

    consume();

    return () => {
      runIdRef.current += 1;
      controller.abort();
      abortRef.current = null;
    };
  }, [source, trigger, abort]);

  return {
    output,
    status,
    isConnecting: status === 'connecting',
    isStreaming: status === 'streaming',
    isComplete: status === 'complete',
    abort,
  };
}
