'use client';

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import {
  SKILL_CLUSTERS,
  SKILL_EDGES,
  SKILL_NODES,
  anchorForNode,
  fuzzyMatchLabel,
  getCluster,
  getIlluminatedSet,
  getSignature,
} from '../../lib/skillNetworkData';

const GRAPH_HEIGHT = 580;
const SPRING = { type: 'spring', stiffness: 90, damping: 12 };
const CENTER_PULL = 0.32;

function useContainerSize(ref) {
  const [size, setSize] = useState({ width: 0, height: GRAPH_HEIGHT });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const update = () => {
      setSize({ width: el.clientWidth, height: GRAPH_HEIGHT });
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}

function computeAnchors(width, height) {
  const map = {};
  SKILL_NODES.forEach((node) => {
    map[node.id] = anchorForNode(node, width, height);
  });
  return map;
}

function SkillTooltip({ label, x, y, width }) {
  const sig = getSignature(label);
  const flip = x > width * 0.62;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none absolute z-30 max-w-xs rounded-lg border border-accent/40 bg-base/95 px-3 py-2 font-mono text-xs shadow-glass backdrop-blur-md"
      style={{
        left: flip ? x - 12 : x + 12,
        top: y - 8,
        transform: flip ? 'translate(-100%, -100%)' : 'translateY(-100%)',
      }}
    >
      <span className="text-ink-muted">// type signature</span>
      <p className="mt-1 whitespace-nowrap text-accent-bright">{sig}</p>
    </motion.div>
  );
}

function SkillNode({
  node,
  position,
  illuminated,
  isDirectMatch,
  hasSearch,
  cluster,
  isHovered,
  isLinkedToHover,
  onHover,
  onDragStart,
  onDrag,
  onDragEnd,
  reduceMotion,
}) {
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, SPRING);
  const springY = useSpring(offsetY, SPRING);
  const scale = isHovered ? 1.12 : isLinkedToHover ? 1.05 : 1;

  return (
    <motion.button
      type="button"
      drag={!reduceMotion}
      dragMomentum={false}
      dragElastic={0.12}
      onDragStart={() => onDragStart(node.id)}
      onDrag={(e, info) => {
        offsetX.set(info.offset.x);
        offsetY.set(info.offset.y);
        onDrag(node.id, info.offset.x, info.offset.y);
      }}
      onDragEnd={() => {
        offsetX.set(0);
        offsetY.set(0);
        onDragEnd(node.id);
      }}
      onHoverStart={() => onHover(node.id)}
      onHoverEnd={() => onHover(null)}
      aria-label={`${node.label} — ${getSignature(node.label)}`}
      data-cursor="pointer"
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{
        left: position.x,
        top: position.y,
        x: springX,
        y: springY,
        borderColor: isHovered || isLinkedToHover ? cluster.color : `${cluster.color}66`,
        backgroundColor: 'rgba(20, 22, 27, 0.88)',
        color: illuminated ? '#F4F4F6' : '#6B7280',
        boxShadow: isHovered
          ? `0 0 24px ${cluster.glow}, 0 0 48px ${cluster.glow}`
          : isDirectMatch && hasSearch
            ? `0 0 16px ${cluster.glow}`
            : '0 4px 16px rgba(0,0,0,0.35)',
        willChange: 'transform, opacity',
      }}
      animate={{
        scale,
        opacity: illuminated ? 1 : 0.15,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <span
        className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
        style={{ backgroundColor: cluster.color }}
        aria-hidden="true"
      />
      {node.label}
    </motion.button>
  );
}

export default function NeuralSkillGraph() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const { width, height } = useContainerSize(containerRef);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [hoveredId, setHoveredId] = useState(null);
  const draggingId = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const simRef = useRef({});
  const [, setTick] = useState(0);

  const anchors = useMemo(
    () => (width > 0 ? computeAnchors(width, height) : {}),
    [width, height]
  );

  const { nodes: illuminatedNodes, edges: illuminatedEdges } = useMemo(
    () => getIlluminatedSet(deferredQuery),
    [deferredQuery]
  );

  const matchKey = useMemo(
    () =>
      SKILL_NODES.filter((n) => fuzzyMatchLabel(n.label, deferredQuery))
        .map((n) => n.id)
        .sort()
        .join(','),
    [deferredQuery]
  );

  const directMatches = useMemo(
    () => new Set(matchKey ? matchKey.split(',') : []),
    [matchKey]
  );

  const hasSearch = deferredQuery.trim().length > 0;
  const centerX = width / 2;
  const centerY = height / 2;

  // Initialise simulation positions when anchors change
  useEffect(() => {
    if (!width) return;
    SKILL_NODES.forEach((node) => {
      if (!simRef.current[node.id]) {
        simRef.current[node.id] = { ...anchors[node.id], vx: 0, vy: 0 };
      } else {
        simRef.current[node.id].x = anchors[node.id].x;
        simRef.current[node.id].y = anchors[node.id].y;
      }
    });
  }, [anchors, width]);

  // Gentle force simulation + search gravity (RAF, transform-only)
  useEffect(() => {
    if (!width || reduceMotion) return undefined;

    let raf;
    let t0 = performance.now();

    const step = (now) => {
      const t = (now - t0) / 1000;
      const pull = hasSearch ? CENTER_PULL : 0;

      SKILL_NODES.forEach((node) => {
        if (draggingId.current === node.id) return;

        const sim = simRef.current[node.id];
        const anchor = anchors[node.id];
        if (!sim || !anchor) return;

        let targetX = anchor.x;
        let targetY = anchor.y;

        if (hasSearch && directMatches.has(node.id)) {
          targetX = anchor.x * (1 - pull) + centerX * pull;
          targetY = anchor.y * (1 - pull) + centerY * pull;
        }

        const dx = targetX - sim.x + Math.sin(t * 0.9 + node.phase) * 2.2;
        const dy = targetY - sim.y + Math.cos(t * 0.75 + node.phase) * 1.8;

        sim.vx = (sim.vx + dx * 0.042) * 0.86;
        sim.vy = (sim.vy + dy * 0.042) * 0.86;
        sim.x += sim.vx;
        sim.y += sim.vy;
      });

      setTick((n) => (n + 1) % 100000);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [width, height, anchors, hasSearch, matchKey, centerX, centerY, reduceMotion]);

  const getDisplayPosition = useCallback(
    (nodeId) => {
      const sim = simRef.current[nodeId];
      const anchor = anchors[nodeId];
      if (!anchor) return { x: 0, y: 0 };
      if (draggingId.current === nodeId) {
        return {
          x: anchor.x + dragOffset.current.x,
          y: anchor.y + dragOffset.current.y,
        };
      }
      return sim ? { x: sim.x, y: sim.y } : anchor;
    },
    [anchors]
  );

  const handleDragStart = useCallback((id) => {
    draggingId.current = id;
  }, []);

  const handleDrag = useCallback((id, ox, oy) => {
    dragOffset.current = { x: ox, y: oy };
    setTick((n) => n + 1);
  }, []);

  const handleDragEnd = useCallback((id) => {
    draggingId.current = null;
    dragOffset.current = { x: 0, y: 0 };
    const sim = simRef.current[id];
    const anchor = anchors[id];
    if (sim && anchor) {
      sim.x = anchor.x;
      sim.y = anchor.y;
      sim.vx = 0;
      sim.vy = 0;
    }
  }, [anchors]);

  const linkedToHover = useMemo(() => {
    if (!hoveredId) return new Set();
    const linked = new Set([hoveredId]);
    SKILL_EDGES.forEach(([a, b]) => {
      if (a === hoveredId) linked.add(b);
      if (b === hoveredId) linked.add(a);
    });
    return linked;
  }, [hoveredId]);

  const hoveredPos = hoveredId ? getDisplayPosition(hoveredId) : null;
  const hoveredLabel = hoveredId
    ? SKILL_NODES.find((n) => n.id === hoveredId)?.label
    : null;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Command search bar */}
      <div className="relative mb-6">
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-accent-bright/70"
          aria-hidden="true"
        >
          &gt;
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search technology stack..."
          aria-label="Search technology stack"
          className="w-full rounded-xl border border-line-subtle bg-surface/60 py-3.5 pl-10 pr-4 font-mono text-sm text-ink-primary shadow-glass backdrop-blur-md transition-colors duration-200 placeholder:text-ink-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        {hasSearch && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-wider text-accent-bright">
            {directMatches.size} match{directMatches.size !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Static-height graph canvas */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-line-subtle bg-base/30 shadow-glass"
        style={{ height: GRAPH_HEIGHT }}
        aria-label="Interactive neural skill network graph"
      >
        {/* Cluster zone labels */}
        {width > 0 &&
          SKILL_CLUSTERS.map((c) => (
            <span
              key={c.id}
              className="pointer-events-none absolute z-0 font-mono text-[10px] uppercase tracking-widest"
              style={{
                left: `${c.cx * 100}%`,
                top: `${c.cy * 100}%`,
                transform: 'translate(-50%, -180%)',
                color: `${c.color}99`,
              }}
            >
              {c.label}
            </span>
          ))}

        {/* SVG edges */}
        {width > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {SKILL_EDGES.map(([a, b]) => {
              const pa = getDisplayPosition(a);
              const pb = getDisplayPosition(b);
              const edgeKey = `${a}:${b}`;
              const lit = illuminatedEdges.has(edgeKey);
              const hoverLit =
                hoveredId && (a === hoveredId || b === hoveredId || linkedToHover.has(a) || linkedToHover.has(b));
              const cluster = getCluster(
                SKILL_NODES.find((n) => n.id === a)?.clusterId ?? 'core'
              );
              const opacity = hoverLit ? 0.85 : lit ? 0.45 : 0.06;
              return (
                <line
                  key={edgeKey}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={cluster.color}
                  strokeWidth={hoverLit ? 2 : 1.25}
                  strokeOpacity={opacity}
                  filter={hoverLit ? 'url(#edge-glow)' : undefined}
                />
              );
            })}
          </svg>
        )}

        {/* Skill nodes */}
        {width > 0 &&
          SKILL_NODES.map((node) => {
            const cluster = getCluster(node.clusterId);
            const pos = getDisplayPosition(node.id);
            return (
              <SkillNode
                key={node.id}
                node={node}
                position={pos}
                illuminated={illuminatedNodes.has(node.id)}
                isDirectMatch={directMatches.has(node.id)}
                hasSearch={hasSearch}
                cluster={cluster}
                isHovered={hoveredId === node.id}
                isLinkedToHover={linkedToHover.has(node.id) && hoveredId !== node.id}
                onHover={setHoveredId}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                reduceMotion={reduceMotion}
              />
            );
          })}

        {/* Compiler tooltip */}
        {hoveredId && hoveredPos && hoveredLabel && (
          <SkillTooltip
            label={hoveredLabel}
            x={hoveredPos.x}
            y={hoveredPos.y}
            width={width}
          />
        )}
      </div>

      <p className="mt-4 text-center text-sm text-ink-muted">
        Drag nodes to explore — they snap back to their cluster with spring physics.
      </p>
    </div>
  );
}
