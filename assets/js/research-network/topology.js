function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

// Normalized hero-section coordinates covered by headline/summary/CTAs.
export const TEXT_ZONE = { x0: 0.03, x1: 0.6, y0: 0.16, y1: 0.8 };

export function getNetworkProfile({ width, saveData, reducedMotion }) {
  const compact = width < 768 || saveData;
  const nodeCount = compact ? 18 : width < 1280 ? 28 : 40;
  return {
    nodeCount,
    animate: !reducedMotion,
    pointer: !compact && !reducedMotion,
  };
}

function inTextZone(x, y) {
  return x >= TEXT_ZONE.x0 && x <= TEXT_ZONE.x1 && y >= TEXT_ZONE.y0 && y <= TEXT_ZONE.y1;
}

function sampleAnchor(random) {
  // Rejection sampling: keep at most ~1 in 8 candidates that fall behind the text.
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const x = random();
    const y = random();
    if (!inTextZone(x, y) || random() < 0.125) return { x, y };
  }
  return { x: 0.65 + random() * 0.35, y: random() };
}

export function createHeroTopology({ nodeCount = 40, seed = 20260719 } = {}) {
  const random = createRandom(seed);
  const nodes = [];
  for (let index = 0; index < nodeCount; index += 1) {
    const { x, y } = sampleAnchor(random);
    const radius = 1.5 + random() * 3.5;
    nodes.push({
      id: `n${index}`,
      anchorX: x,
      anchorY: y,
      x,
      y,
      vx: 0,
      vy: 0,
      radius,
      opacity: 0.3 + ((radius - 1.5) / 3.5) * 0.6,
    });
  }

  const edges = [];
  const edgeKeys = new Set();
  const addEdge = (source, target) => {
    const key = [source, target].sort().join(':');
    if (source === target || edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ source, target });
  };

  for (const node of nodes) {
    const distances = nodes
      .filter((other) => other.id !== node.id)
      .map((other) => ({
        id: other.id,
        distance: Math.hypot(other.anchorX - node.anchorX, other.anchorY - node.anchorY),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .filter((entry) => entry.distance <= 0.3);
    for (const entry of distances) addEdge(node.id, entry.id);
  }

  return { nodes, edges };
}

export function getNeighborIds(graph, nodeId) {
  const result = new Set([nodeId]);
  for (const edge of graph.edges) {
    if (edge.source === nodeId) result.add(edge.target);
    if (edge.target === nodeId) result.add(edge.source);
  }
  return result;
}
