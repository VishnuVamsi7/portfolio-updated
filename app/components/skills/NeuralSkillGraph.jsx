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
  getConstellationLayout,
} from '../../lib/skillNetworkData';

const GRAPH_HEIGHT = 720;
const SPRING = { type: 'spring', stiffness: 90, damping: 12 };

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

/** Zodiac stick-figure scaffold + field stars (lit edges drawn live in parent). */
function ConstellationGuide({ layout }) {
  const { constellation, starPoints, center } = layout;
  const fieldStars = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 48; i += 1) {
      const seed = (i * 97 + constellation.name.length * 13) % 1000;
      stars.push({
        x: ((seed * 37) % 1000) / 1000,
        y: ((seed * 53) % 1000) / 1000,
        r: 0.6 + (seed % 7) * 0.15,
        o: 0.15 + (seed % 5) * 0.08,
      });
    }
    return stars;
  }, [constellation.name]);

  return (
    <g>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#night-sky)" opacity="0.55" />
      {fieldStars.map((s, i) => (
        <circle
          key={`field-${i}`}
          cx={`${s.x * 100}%`}
          cy={`${s.y * 100}%`}
          r={s.r}
          fill="#E2E8F0"
          opacity={s.o}
        />
      ))}
      {constellation.edges.map(([i, j], idx) => {
        const a = starPoints[i];
        const b = starPoints[j];
        return (
          <line
            key={`scaffold-${idx}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#94A3B8"
            strokeWidth="1"
            strokeOpacity="0.22"
            strokeDasharray="3 7"
          />
        );
      })}
      {starPoints.map((p, i) => (
        <circle
          key={`scaffold-star-${i}`}
          cx={p.x}
          cy={p.y}
          r={i === constellation.hub ? 3.2 : 2}
          fill={i === constellation.hub ? '#F8FAFC' : '#CBD5E1'}
          opacity={i === constellation.hub ? 0.55 : 0.28}
        />
      ))}
      <text
        x={center.x}
        y={28}
        textAnchor="middle"
        fill="#E2E8F0"
        style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.18em' }}
        opacity="0.85"
      >
        {constellation.symbol} {constellation.name.toUpperCase()} · ZODIAC ALIGNMENT
      </text>
    </g>
  );
}

function SkillNode({
  node,
  position,
  illuminated,
  isDirectMatch,
  hasSearch,
  isStarHub,
  isStarRay,
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
  const scale = isStarHub ? 1.18 : isHovered ? 1.12 : isLinkedToHover || isStarRay ? 1.05 : 1;

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
        borderColor:
          isStarHub || isHovered || isLinkedToHover
            ? cluster.color
            : isStarRay
              ? `${cluster.color}aa`
              : `${cluster.color}66`,
        backgroundColor: isStarHub ? 'rgba(30, 27, 55, 0.95)' : 'rgba(20, 22, 27, 0.88)',
        color: illuminated ? '#F4F4F6' : '#A7ADB8',
        boxShadow: isStarHub
          ? `0 0 28px ${cluster.glow}, 0 0 56px rgba(248,250,252,0.25)`
          : isHovered
            ? `0 0 24px ${cluster.glow}, 0 0 48px ${cluster.glow}`
            : isDirectMatch && hasSearch
              ? `0 0 16px ${cluster.glow}`
              : isStarRay
                ? `0 0 14px ${cluster.glow}`
                : '0 4px 16px rgba(0,0,0,0.35)',
        willChange: 'transform, opacity',
      }}
      animate={{
        scale,
        opacity: illuminated ? 1 : hasSearch ? 0.06 : 0.15,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      {isStarHub && (
        <span className="mr-1 inline-block align-middle text-[10px] text-sky-200" aria-hidden="true">
          ✦
        </span>
      )}
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

  const starLayout = useMemo(
    () => (width > 0 ? getConstellationLayout(deferredQuery, width, height) : null),
    [deferredQuery, width, height]
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

  // Initialise simulation positions when anchors change
  useEffect(() => {
    if (!width) return;
    SKILL_NODES.forEach((node) => {
      if (!simRef.current[node.id]) {
        simRef.current[node.id] = { ...anchors[node.id], vx: 0, vy: 0 };
      } else if (!hasSearch) {
        // Snap back toward cluster anchors when clearing search
        simRef.current[node.id].x = anchors[node.id].x;
        simRef.current[node.id].y = anchors[node.id].y;
      }
    });
  }, [anchors, width, hasSearch]);

  // Move once per layout/search change. A permanent requestAnimationFrame loop
  // made this below-the-fold graph consume CPU even when it was not visible.
  useEffect(() => {
    if (!width) return;

    SKILL_NODES.forEach((node) => {
      const sim = simRef.current[node.id];
      const target = starLayout?.targets.get(node.id) ?? anchors[node.id];
      if (!sim || !target || draggingId.current === node.id) return;
      sim.x = target.x;
      sim.y = target.y;
      sim.vx = 0;
      sim.vy = 0;
    });
    setTick((n) => (n + 1) % 100000);
  }, [width, anchors, starLayout]);

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
          placeholder="Search a skill to see its zodiac constellation alignment..."
          aria-label="Search technology stack"
          className="w-full rounded-xl border border-line-subtle bg-surface/60 py-3.5 pl-10 pr-4 font-mono text-sm text-ink-primary shadow-glass backdrop-blur-md transition-colors duration-200 placeholder:text-ink-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        {hasSearch && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-wider text-accent-bright">
            {starLayout
              ? `${starLayout.constellation.symbol} ${starLayout.constellation.name}`
              : `${directMatches.size} match${directMatches.size !== 1 ? 'es' : ''}`}
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
        {/* Cluster zone labels — hide while star search is active */}
        {width > 0 &&
          !starLayout &&
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

        {/* SVG edges + search ★ star guide */}
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
              <linearGradient id="star-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#F472B6" stopOpacity="0.8" />
              </linearGradient>
              <radialGradient id="night-sky" cx="50%" cy="45%" r="65%">
                <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.35" />
                <stop offset="55%" stopColor="#0f172a" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.7" />
              </radialGradient>
            </defs>

            {starLayout && <ConstellationGuide layout={starLayout} />}

            {/* Zodiac figure lines follow live node positions */}
            {starLayout?.figureEdges?.map(([a, b]) => {
              const pa = getDisplayPosition(a);
              const pb = getDisplayPosition(b);
              return (
                <line
                  key={`zodiac-${a}-${b}`}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke="url(#star-stroke)"
                  strokeWidth="2"
                  strokeOpacity="0.9"
                  filter="url(#edge-glow)"
                />
              );
            })}

            {SKILL_EDGES.map(([a, b]) => {
              const pa = getDisplayPosition(a);
              const pb = getDisplayPosition(b);
              const edgeKey = `${a}:${b}`;
              const lit = illuminatedEdges.has(edgeKey);
              const hoverLit =
                hoveredId && (a === hoveredId || b === hoveredId || linkedToHover.has(a) || linkedToHover.has(b));
              const constellationLink =
                starLayout &&
                illuminatedEdges.has(edgeKey) &&
                (starLayout.hubs.includes(a) ||
                  starLayout.hubs.includes(b) ||
                  starLayout.neighbors.includes(a) ||
                  starLayout.neighbors.includes(b));
              const cluster = getCluster(
                SKILL_NODES.find((n) => n.id === a)?.clusterId ?? 'core'
              );
              const opacity = hoverLit ? 0.9 : constellationLink ? 0.55 : lit ? 0.4 : 0.05;
              return (
                <line
                  key={edgeKey}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={constellationLink ? '#BAE6FD' : cluster.color}
                  strokeWidth={hoverLit || constellationLink ? 1.75 : 1.15}
                  strokeOpacity={opacity}
                  filter={hoverLit || constellationLink ? 'url(#edge-glow)' : undefined}
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
            const role = starLayout?.targets.get(node.id)?.role;
            return (
              <SkillNode
                key={node.id}
                node={node}
                position={pos}
                illuminated={illuminatedNodes.has(node.id)}
                isDirectMatch={directMatches.has(node.id)}
                hasSearch={hasSearch}
                isStarHub={role === 'hub'}
                isStarRay={role === 'ray'}
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
        Search a skill to align it and its connected tech into a zodiac constellation (♈–♓). Clear search to
        return to the knowledge graph clusters.
      </p>
    </div>
  );
}
