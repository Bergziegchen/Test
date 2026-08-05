document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('laptop-scroll-section');
  const fixedWrapper = document.getElementById('js-fixed-wrapper');
  const scene = document.getElementById('js-laptop-scene');
  const laptopLid = document.getElementById('js-laptop-lid');
  const laptopScreen = document.getElementById('js-laptop-screen');
  const glare = document.getElementById('js-glare');
  const baseShadow = document.getElementById('js-base-shadow');
  const screenShadow = document.getElementById('js-screen-shadow');
  const websiteLayer = document.getElementById('js-website-layer');

  if (!container || !fixedWrapper || !laptopLid || !websiteLayer || !laptopScreen) return;

  let targetProgress = 0;
  let currentProgress = 0;
  let isAnimating = false;

  const lerpFactor = 0.08; 

  // WANN DAS GERÄT ERSCHEINT UND ANIMIERT WIRD:
  const animPhaseStart = 0.15; // Erscheint nach 15% Scrollweg
  const animPhaseEnd = 0.45;   // Ist bei 45% voll da und beginnt innen zu scrollen

  let windowHeight = window.innerHeight;
  let screenHeight = laptopScreen.getBoundingClientRect().height;
  let contentHeight = websiteLayer.scrollHeight;
  let isMobile = window.innerWidth <= 767;

  // DYNAMISCHER BUFFER:
  // Mobile (iPhone): -8 (stoppt früher, um den weißen Spalt unten zu verhindern)
  // Desktop: 20 (scrollt weiter runter)
  let scrollBuffer = isMobile ? -8 : 20; 

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function updateDimensions() {
    windowHeight = window.innerHeight;
    screenHeight = laptopScreen.getBoundingClientRect().height;
    contentHeight = Math.max(
      websiteLayer.scrollHeight,
      websiteLayer.getBoundingClientRect().height
    );
    isMobile = window.innerWidth <= 767;
    
    // Hier kannst du den iPhone-Wert bei Bedarf auf -12 oder -15 anpassen:
    scrollBuffer = isMobile ? -8 : 20;
  }

  function updateScrollTarget() {
    const rect = container.getBoundingClientRect();

    const isInSection = rect.top <= 0 && rect.bottom >= windowHeight;
    const isPastSection = rect.bottom < windowHeight;
    const isBeforeSection = rect.top > 0;

    if (isInSection) {
      const totalScrollable = container.clientHeight - windowHeight;
      let rawProgress = -rect.top / totalScrollable;
      targetProgress = Math.max(0, Math.min(1, rawProgress));
    } else if (isPastSection) {
      targetProgress = 1;
    } else if (isBeforeSection) {
      targetProgress = 0;
    }

    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(renderLoop);
    }
  }

  function renderLoop() {
    currentProgress += (targetProgress - currentProgress) * lerpFactor;

    if (Math.abs(targetProgress - currentProgress) < 0.0005) {
      currentProgress = targetProgress;
      isAnimating = false;
    }

    const rect = container.getBoundingClientRect();

    // SECTION FIXIERUNG
    if (rect.top <= 0 && rect.bottom >= windowHeight) {
      fixedWrapper.style.opacity = '1';
      fixedWrapper.style.transform = 'translateY(0px)';
    } else if (rect.bottom < windowHeight) {
      fixedWrapper.style.opacity = '1';
      const translateY = rect.bottom - windowHeight;
      fixedWrapper.style.transform = `translateY(${translateY}px)`;
    } else if (rect.top > 0) {
      if (currentProgress < 0.01) {
        fixedWrapper.style.opacity = '0';
      } else {
        fixedWrapper.style.opacity = '1';
        fixedWrapper.style.transform = 'translateY(0px)';
      }
    }

    // VOR PHASE 1: Gerät bleibt unsichtbar
    if (currentProgress < animPhaseStart) {
      if (isMobile) {
        scene.style.transform = `translateX(-100%)`;
        scene.style.opacity = '0';
      } else {
        scene.style.transform = `translateX(-160%) rotateX(8deg)`;
        scene.style.opacity = '0';
      }
      websiteLayer.style.transform = `translateY(0px)`;
      websiteLayer.style.pointerEvents = 'none';
    }
    // PHASE 1: REINSLIDEN / EINFADEN
    else if (currentProgress <= animPhaseEnd) {
      const progress = (currentProgress - animPhaseStart) / (animPhaseEnd - animPhaseStart);
      const slideProgress = easeOutCubic(progress);

      if (isMobile) {
        const translateX = -100 + (100 * slideProgress);
        const opacity = Math.min(1, progress * 2);
        
        scene.style.transform = `translateX(${translateX}%)`;
        scene.style.opacity = opacity.toString();
        laptopLid.style.transform = 'none';
      } else {
        const translateX = -160 + (160 * slideProgress);
        const openRaw = Math.max(0, (progress - 0.1) / 0.9); 
        const openProgress = easeInOutCubic(openRaw);

        const lidAngle = -95.5 + (95.5 * openProgress);
        const cameraTilt = 8 - (8 * openProgress);

        scene.style.transform = `translateX(${translateX}%) rotateX(${cameraTilt}deg)`;
        scene.style.opacity = Math.min(1, progress * 2).toString();
        laptopLid.style.transform = `rotateX(${lidAngle}deg)`;

        if (glare) glare.style.opacity = ((1 - openProgress) * 0.7).toString();
        if (baseShadow) baseShadow.style.opacity = (1 - openProgress).toString();
        if (screenShadow) {
          screenShadow.style.transform = `scaleY(${1 - openProgress})`;
          screenShadow.style.opacity = ((1 - openProgress) * 0.8).toString();
        }
      }

      websiteLayer.style.transform = `translateY(0px)`;
      websiteLayer.style.pointerEvents = 'none';
    } 
    // PHASE 2: GERÄT FIXIERT, INHALT SCROLLT
    else {
      if (isMobile) {
        scene.style.transform = `translateX(0%)`;
        scene.style.opacity = '1';
      } else {
        scene.style.transform = `translateX(0%) rotateX(0deg)`;
        scene.style.opacity = '1';
        laptopLid.style.transform = `rotateX(0deg)`;
        if (glare) glare.style.opacity = '0.15';
        if (baseShadow) baseShadow.style.opacity = '0';
        if (screenShadow) screenShadow.style.opacity = '0';
      }

      websiteLayer.style.pointerEvents = 'auto';

      screenHeight = laptopScreen.getBoundingClientRect().height;
      contentHeight = Math.max(
        websiteLayer.scrollHeight,
        websiteLayer.getBoundingClientRect().height
      );

      const websiteScrollProgress = (currentProgress - animPhaseEnd) / (1 - animPhaseEnd);
      
      const maxScrollY = Math.max(0, (contentHeight - screenHeight) + scrollBuffer);
      
      let scrollY = maxScrollY * websiteScrollProgress;

      websiteLayer.style.transform = `translateY(-${scrollY.toFixed(2)}px)`;
    }

    if (isAnimating) {
      requestAnimationFrame(renderLoop);
    }
  }

  // Events
  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  window.addEventListener('resize', () => {
    updateDimensions();
    updateScrollTarget();
  }, { passive: true });

  window.addEventListener('load', updateDimensions);

  updateDimensions();
  updateScrollTarget();
});