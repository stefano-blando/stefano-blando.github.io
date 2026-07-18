import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createModularTopology,
  getNeighborIds,
  getNetworkProfile,
} from '../../assets/js/research-network/topology.js';

test('creates connected modular communities with valid degree metadata', () => {
  const graph = createModularTopology({ communitySizes: [4, 4, 4], seed: 19 });

  assert.equal(graph.nodes.length, 12);
  assert.equal(new Set(graph.nodes.map((node) => node.community)).size, 3);
  assert.ok(graph.edges.filter((edge) => edge.bridge).length >= 2);

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
    const measuredDegree = graph.edges.filter(
      (edge) => edge.source === node.id || edge.target === node.id,
    ).length;
    assert.equal(node.degree, measuredDegree);
  }
});

test('returns the immediate neighborhood including the selected node', () => {
  const graph = createModularTopology({ communitySizes: [4, 4, 4], seed: 7 });
  const neighbors = getNeighborIds(graph, 'c0-n0');

  assert.ok(neighbors.has('c0-n0'));
  assert.ok(neighbors.size > 1);
});

test('selects a reduced static profile for accessibility and small screens', () => {
  assert.deepEqual(
    getNetworkProfile({ width: 1440, saveData: false, reducedMotion: false }),
    { nodeCount: 30, animate: true, pointer: true },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 600, saveData: false, reducedMotion: false }),
    { nodeCount: 18, animate: true, pointer: false },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 1440, saveData: false, reducedMotion: true }),
    { nodeCount: 30, animate: false, pointer: false },
  );
});
