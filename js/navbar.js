document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('primary-navigation');
  const overlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav-cta');

  if (!btn || !nav) return;

  // 1. Ruckelfreies Scroll-Verhalten (Performance-optimiert)
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        header?.classList.toggle('is-scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 2. Mobile-Menü Logik (Verhindert das Springen durch Scrollbar-Kompensation)
  const toggleMenu = () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    btn.setAttribute('aria-expanded', !isOpen);
    nav.classList.toggle('is-open', !isOpen);
    overlay?.classList.toggle('is-active', !isOpen);

    if (!isOpen) {
      // Verhindert das Springen der Seite beim Ausblenden der Scrollbar
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      if (header) header.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      closeMenu();
    }
  };

  const closeMenu = () => {
    btn.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    overlay?.classList.remove('is-active');
    
    // Layout-Padding nach dem Schließen zurücksetzen
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (header) header.style.paddingRight = '';
  };

  // Event Listener
  btn.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
    }
  });
});