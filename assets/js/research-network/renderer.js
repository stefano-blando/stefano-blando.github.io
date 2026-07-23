import { createHeroTopology, getNeighborIds } from './topology.js';

export class ResearchNetworkRenderer {
  constructor(canvas, profile) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d', { alpha: true });
    this.profile = profile;
    this.graph = createHeroTopology({ nodeCount: profile.nodeCount });
    this.nodesById = new Map(this.graph.nodes.map((node) => [node.id, node]));
    this.pointer = null;
    this.highlighted = new Set();
    this.frameId = null;
    this.hidden = document.hidden;
    this.inView = true;
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
      this.canvas.parentElement.addEventListener('pointermove', this.onPointerMove, { passive: true });
      this.canvas.parentElement.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    }
    if ('IntersectionObserver' in window) {
      this.viewObserver = new IntersectionObserver((entries) => {
        this.inView = entries.some((entry) => entry.isIntersecting);
        this.requestFrame();
      });
      this.viewObserver.observe(this.canvas);
    }
    this.draw();
    this.requestFrame();
  }

  requestFrame() {
    if (this.profile.animate && !this.hidden && this.inView && this.frameId === null) {
      this.frameId = requestAnimationFrame(this.frame);
    }
  }

  resize() {
    const host = this.canvas.parentElement.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = host.width;
    this.height = host.height;
    this.canvas.width = Math.round(this.width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.draw();
  }

  onPointerMove(event) {
    const bounds = this.canvas.getBoundingClientRect();
    this.pointer = {
      x: (event.clientX - bounds.left) / this.width,
      y: (event.clientY - bounds.top) / this.height,
    };
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
    this.requestFrame();
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
      const alpha = active ? 0.75 : Math.min(source.opacity, target.opacity) * 0.4;
      this.context.beginPath();
      this.context.moveTo(source.x * this.width, source.y * this.height);
      this.context.lineTo(target.x * this.width, target.y * this.height);
      this.context.strokeStyle = active
        ? `rgba(56, 189, 248, ${alpha})`
        : `rgba(99, 130, 180, ${alpha})`;
      this.context.lineWidth = active ? 1.6 : 0.85;
      this.context.stroke();
    }
    for (const node of this.graph.nodes) {
      const active = this.highlighted.has(node.id);
      this.context.beginPath();
      this.context.arc(
        node.x * this.width,
        node.y * this.height,
        node.radius + (active ? 2 : 0),
        0,
        Math.PI * 2,
      );
      if (active) {
        this.context.shadowColor = 'rgba(56, 189, 248, 0.9)';
        this.context.shadowBlur = 14;
        this.context.fillStyle = 'rgba(125, 211, 252, 1)';
      } else {
        this.context.shadowBlur = 0;
        this.context.fillStyle = `rgba(99, 150, 215, ${node.opacity})`;
      }
      this.context.fill();
      this.context.shadowBlur = 0;
    }
  }

  frame() {
    this.frameId = null;
    if (this.hidden || !this.inView) return;
    this.update();
    this.draw();
    this.frameId = requestAnimationFrame(this.frame);
  }

  destroy() {
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    if (this.viewObserver) this.viewObserver.disconnect();
    window.removeEventListener('resize', this.resize);
    this.canvas.parentElement.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.parentElement.removeEventListener('pointerleave', this.onPointerLeave);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}
