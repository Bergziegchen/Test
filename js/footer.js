const curvedText = document.getElementById('curvedText');
const footer = document.querySelector('.site-footer');

if (curvedText && footer) {
  const letters = Array.from(curvedText.querySelectorAll('span'));
  const total = letters.length;
  const centerIndex = (total - 1) / 2;
  let isTicking = false;

  function updateArch() {
    const rect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight) {
      // Fortschritt von 0 (Footer auftauchen) bis 1 (ganz unten angekommen)
      const rawProgress = (windowHeight - rect.top) / (windowHeight + rect.height * 0.05);
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      // Bogen-Faktor flacht ab auf 0.0 (perfekt gerade)
      const arcFactor = 1 - progress;

      const isMobile = window.innerWidth < 640;
      const maxTranslateY = isMobile ? 14 : 32; 
      const maxRotateDeg = isMobile ? 8 : 18;

      letters.forEach((letter, i) => {
        const offset = (i - centerIndex) / centerIndex;
        
        // Parabel-Formel für flüssiges Durchbiegen
        const translateY = Math.pow(offset, 2) * maxTranslateY * arcFactor;
        const rotateDeg = offset * maxRotateDeg * arcFactor;

        letter.style.transform = `translateY(${translateY.toFixed(2)}px) rotate(${rotateDeg.toFixed(2)}deg)`;
      });
    }

    isTicking = false;
  }

  function onScroll() {
    if (!isTicking) {
      requestAnimationFrame(updateArch);
      isTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  
  updateArch();
}




















