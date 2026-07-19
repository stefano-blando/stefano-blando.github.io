import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createHeroTopology,
  getNeighborIds,
  getNetworkProfile,
  TEXT_ZONE,
} from '../../assets/js/research-network/topology.js';

test('profile scales density by viewport and honors save-data/reduced-motion', () => {
  assert.deepEqual(
    getNetworkProfile({ width: 1440, saveData: false, reducedMotion: false }),
    { nodeCount: 40, animate: true, pointer: true },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 1024, saveData: false, reducedMotion: false }),
    { nodeCount: 28, animate: true, pointer: true },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 600, saveData: false, reducedMotion: false }),
    { nodeCount: 18, animate: true, pointer: false },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 1440, saveData: true, reducedMotion: false }),
    { nodeCount: 18, animate: true, pointer: false },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 1440, saveData: false, reducedMotion: true }),
    { nodeCount: 40, animate: false, pointer: false },
  );
});

test('hero topology respects node count, depth ranges, and edge validity', () => {
  const graph = createHeroTopology({ nodeCount: 40, seed: 11 });
  assert.equal(graph.nodes.length, 40);

  const ids = new Set(graph.nodes.map((node) => node.id));
  const edgeKeys = new Set();
  for (const edge of graph.edges) {
    assert.ok(ids.has(edge.source));
    assert.ok(ids.has(edge.target));
    assert.notEqual(edge.source, edge.target);
    const key = [edge.source, edge.target].sort().join(':');
    assert.ok(!edgeKeys.has(key), `duplicate edge ${key}`);
    edgeKeys.add(key);
  }

  for (const node of graph.nodes) {
    assert.ok(node.radius >= 1.5 && node.radius <= 5, `radius ${node.radius}`);
    assert.ok(node.opacity >= 0.3 && node.opacity <= 0.9, `opacity ${node.opacity}`);
    assert.ok(node.anchorX >= 0 && node.anchorX <= 1);
    assert.ok(node.anchorY >= 0 && node.anchorY <= 1);
  }

  const bigger = graph.nodes.filter((n) => n.radius > 3.5);
  const smaller = graph.nodes.filter((n) => n.radius <= 3.5);
  const avg = (nodes) => nodes.reduce((sum, n) => sum + n.opacity, 0) / nodes.length;
  assert.ok(avg(bigger) > avg(smaller), 'opacity correlates with radius');
});

test('edges only connect near neighbors', () => {
  const graph = createHeroTopology({ nodeCount: 40, seed: 3 });
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  for (const edge of graph.edges) {
    const a = byId.get(edge.source);
    const b = byId.get(edge.target);
    const distance = Math.hypot(a.anchorX - b.anchorX, a.anchorY - b.anchorY);
    assert.ok(distance <= 0.3, `edge ${edge.source}-${edge.target} spans ${distance}`);
  }
});

test('anchors avoid the headline text zone', () => {
  const graph = createHeroTopology({ nodeCount: 40, seed: 7 });
  const inTextZone = graph.nodes.filter(
    (node) =>
      node.anchorX >= TEXT_ZONE.x0 && node.anchorX <= TEXT_ZONE.x1 &&
      node.anchorY >= TEXT_ZONE.y0 && node.anchorY <= TEXT_ZONE.y1,
  );
  assert.ok(
    inTextZone.length <= graph.nodes.length * 0.15,
    `${inTextZone.length} of ${graph.nodes.length} nodes behind text`,
  );
});

test('returns the immediate neighborhood including the selected node', () => {
  const graph = createHeroTopology({ nodeCount: 28, seed: 5 });
  const first = graph.nodes[0].id;
  const neighbors = getNeighborIds(graph, first);
  assert.ok(neighbors.has(first));
  assert.ok(neighbors.size > 1);
});
