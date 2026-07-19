import test from 'node:test';
import assert from 'node:assert/strict';
import { getMagneticOffset } from '../../assets/js/portfolio-interactions.js';

test('magnetic offset is capped at three pixels', () => {
  assert.deepEqual(getMagneticOffset({ x: 100, y: 50, width: 100, height: 50 }), { x: 3, y: 3 });
  assert.deepEqual(getMagneticOffset({ x: 0, y: 0, width: 100, height: 50 }), { x: -3, y: -3 });
});

test('magnetic offset is centered at zero', () => {
  assert.deepEqual(getMagneticOffset({ x: 50, y: 25, width: 100, height: 50 }), { x: 0, y: 0 });
});
