export function getMagneticOffset({ x, y, width, height }) {
  const normalize = (value, size) => Math.max(-3, Math.min(3, ((value / size) - 0.5) * 6));
  return { x: normalize(x, width), y: normalize(y, height) };
}

function initializePortfolioInteractions() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) document.documentElement.classList.add('portfolio-motion');

  document.querySelectorAll('[data-pointer-glow]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });

  if (!reduced) {
    document.querySelectorAll('[data-magnetic]').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const bounds = button.getBoundingClientRect();
        const offset = getMagneticOffset({
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
          width: bounds.width,
          height: bounds.height,
        });
        button.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
      }, { passive: true });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('portfolio-reveal--visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('portfolio-reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => observer.observe(item));
  }

  const header = document.getElementById('site-header');
  const updateHeader = () => header?.classList.toggle('portfolio-header--scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('#site-header a[aria-current="location"]').forEach((link) => link.removeAttribute('aria-current'));
        
        const id = entry.target.id;
        let selectors = [`#site-header a[href$="#${id}"]`];
        if (id === 'resume-experience' || id === 'experience' || id === 'education') {
          selectors.push('#site-header a[href$="#experience"]', '#site-header a[href$="#resume-experience"]');
        }
        if (id === 'work' || id === 'projects' || id === 'featured-projects') {
          selectors.push('#site-header a[href$="#work"]', '#site-header a[href$="#projects"]');
        }
        
        const active = document.querySelector(selectors.join(', '));
        active?.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-35% 0px -55%', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const pillarRows = document.querySelectorAll('.research-list__row');
  pillarRows.forEach((row) => {
    const trigger = row.querySelector('.research-list__trigger');
    const drawer = row.querySelector('.research-list__drawer');
    if (!trigger || !drawer) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !isExpanded);
      drawer.setAttribute('aria-hidden', isExpanded);
      row.classList.toggle('is-expanded', !isExpanded);
    });
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolioInteractions, { once: true });
  } else {
    initializePortfolioInteractions();
  }
}
