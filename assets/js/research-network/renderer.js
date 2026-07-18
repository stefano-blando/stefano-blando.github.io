import { createModularTopology, getNeighborIds } from './topology.js';

export class ResearchNetworkRenderer {
  constructor(canvas, profile) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d', { alpha: true });
    this.profile = profile;
    this.graph = createModularTopology({
      communitySizes: profile.nodeCount === 18 ? [6, 6, 6] : [10, 10, 10],
    });
    this.nodesById = new Map(this.graph.nodes.map((node) => [node.id, node]));
    this.pointer = null;
    this.highlighted = new Set();
    this.frameId = null;
    this.hidden = document.hidden;
    this.resize = this.resize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.frame = this.frame.bind(this);
  }

  start() {
    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    if (this.profile.pointer) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    }
    this.draw();
    if (this.profile.animate) this.frameId = requestAnimationFrame(this.frame);
  }

  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.draw();
  }

  onPointerMove(event) {
    this.pointer = { x: event.clientX / this.width, y: event.clientY / this.height };
    let nearest = null;
    let distance = Number.POSITIVE_INFINITY;
    for (const node of this.graph.nodes) {
      const measured = Math.hypot(node.x - this.pointer.x, node.y - this.pointer.y);
      if (measured < distance) {
        nearest = node;
        distance = measured;
      }
    }
    this.highlighted = nearest && distance < 0.16
      ? getNeighborIds(this.graph, nearest.id)
      : new Set();
  }

  onPointerLeave() {
    this.pointer = null;
    this.highlighted.clear();
  }

  onVisibilityChange() {
    this.hidden = document.hidden;
    if (!this.hidden && this.profile.animate && this.frameId === null) {
      this.frameId = requestAnimationFrame(this.frame);
    }
  }

  update() {
    for (const node of this.graph.nodes) {
      node.vx += (node.anchorX - node.x) * 0.0007;
      node.vy += (node.anchorY - node.y) * 0.0007;
      if (this.pointer) {
        const dx = this.pointer.x - node.x;
        const dy = this.pointer.y - node.y;
        const distance = Math.max(Math.hypot(dx, dy), 0.03);
        if (distance < 0.18) {
          node.vx += (dx / distance) * 0.00005;
          node.vy += (dy / distance) * 0.00005;
        }
      }
      node.vx *= 0.985;
      node.vy *= 0.985;
      node.x += node.vx;
      node.y += node.vy;
    }
  }

  draw() {
    if (!this.context || !this.width || !this.height) return;
    this.context.clearRect(0, 0, this.width, this.height);
    for (const edge of this.graph.edges) {
      const source = this.nodesById.get(edge.source);
      const target = this.nodesById.get(edge.target);
      const active = this.highlighted.has(source.id) && this.highlighted.has(target.id);
      this.context.beginPath();
      this.context.moveTo(source.x * this.width, source.y * this.height);
      this.context.lineTo(target.x * this.width, target.y * this.height);
      this.context.strokeStyle = active
        ? 'rgba(146, 190, 232, 0.68)'
        : edge.bridge
          ? 'rgba(104, 147, 196, 0.30)'
          : 'rgba(126, 151, 184, 0.18)';
      this.context.lineWidth = active ? 1.4 : 0.8;
      this.context.stroke();
    }
    for (const node of this.graph.nodes) {
      const active = this.highlighted.has(node.id);
      const radius = Math.min(2.2 + node.degree * 0.55, 6.5) + (active ? 1.2 : 0);
      this.context.beginPath();
      this.context.arc(node.x * this.width, node.y * this.height, radius, 0, Math.PI * 2);
      this.context.fillStyle = active
        ? 'rgba(181, 210, 239, 0.95)'
        : 'rgba(118, 151, 191, 0.58)';
      this.context.fill();
    }
  }

  frame() {
    this.frameId = null;
    if (this.hidden) return;
    this.update();
    this.draw();
    this.frameId = requestAnimationFrame(this.frame);
  }

  destroy() {
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}
