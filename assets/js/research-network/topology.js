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

function distributeCount(total, communities = 3) {
  const base = Math.floor(total / communities);
  const remainder = total % communities;
  return Array.from(
    { length: communities },
    (_, index) => base + (index < remainder ? 1 : 0),
  );
}

export function getNetworkProfile({ width, saveData, reducedMotion }) {
  const compact = width < 768 || saveData;
  return {
    nodeCount: compact ? 18 : 30,
    animate: !reducedMotion,
    pointer: !compact && !reducedMotion,
  };
}

export function createModularTopology({
  communitySizes = distributeCount(30),
  seed = 20260718,
} = {}) {
  const random = createRandom(seed);
  const centers = [
    { x: 0.2, y: 0.28 },
    { x: 0.76, y: 0.3 },
    { x: 0.52, y: 0.73 },
  ];
  const nodes = [];
  const edges = [];
  const edgeKeys = new Set();
  const addEdge = (source, target, bridge = false) => {
    const key = [source, target].sort().join(':');
    if (source === target || edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ source, target, bridge });
  };

  communitySizes.forEach((size, community) => {
    const center = centers[community % centers.length];
    for (let index = 0; index < size; index += 1) {
      const angle = (Math.PI * 2 * index) / size + random() * 0.35;
      const radius = 0.055 + random() * 0.09;
      nodes.push({
        id: `c${community}-n${index}`,
        community,
        anchorX: center.x + Math.cos(angle) * radius,
        anchorY: center.y + Math.sin(angle) * radius,
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        degree: 0,
      });
    }

    for (let index = 0; index < size; index += 1) {
      const current = `c${community}-n${index}`;
      const next = `c${community}-n${(index + 1) % size}`;
      addEdge(current, next);
      if (size > 3 && index % 2 === 0) {
        const chord = `c${community}-n${(index + 2) % size}`;
        addEdge(current, chord);
      }
    }
  });

  for (let community = 0; community < communitySizes.length - 1; community += 1) {
    addEdge(`c${community}-n0`, `c${community + 1}-n0`, true);
  }

  const degreeById = new Map(nodes.map((node) => [node.id, 0]));
  for (const edge of edges) {
    degreeById.set(edge.source, degreeById.get(edge.source) + 1);
    degreeById.set(edge.target, degreeById.get(edge.target) + 1);
  }
  for (const node of nodes) node.degree = degreeById.get(node.id);

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
