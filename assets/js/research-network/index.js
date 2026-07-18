import { getNetworkProfile } from './topology.js';
import { ResearchNetworkRenderer } from './renderer.js';

function initializeResearchNetwork() {
  const canvas = document.getElementById('research-network-canvas');
  if (!canvas || !canvas.getContext) return;
  if (!canvas.getContext('2d')) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const profile = getNetworkProfile({
    width: window.innerWidth,
    saveData,
    reducedMotion,
  });
  const renderer = new ResearchNetworkRenderer(canvas, profile);
  renderer.start();
  window.addEventListener('pagehide', () => renderer.destroy(), { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeResearchNetwork, { once: true });
} else {
  initializeResearchNetwork();
}
