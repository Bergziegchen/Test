document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.slider-wrapper');
  const track = document.querySelector('.slider-track');
  const cards = Array.from(document.querySelectorAll('.review-card'));
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  const progressTrack = document.getElementById('progressTrack');
  const currentSlideEl = document.getElementById('currentSlide');
  const totalSlidesEl = document.getElementById('totalSlides');

  if (!cards.length) return;

  // Start in the middle for the conveyor belt effect
  let currentIndex = Math.floor(cards.length / 2);

  function initProgressTrack() {
    progressTrack.innerHTML = '';
    totalSlidesEl.textContent = String(cards.length).padStart(2, '0');

    cards.forEach((_, idx) => {
      const segment = document.createElement('div');
      segment.classList.add('progress-segment');
      segment.setAttribute('role', 'tab');
      segment.setAttribute('aria-label', `Gehe zu Bewertung ${idx + 1}`);
      
      if (idx === currentIndex) segment.classList.add('active');
      
      segment.addEventListener('click', () => goToSlide(idx));
      progressTrack.appendChild(segment);
    });
  }

  function updateSlider() {
    // Use offsetWidth instead of getBoundingClientRect to bypass CSS scale transform measurement bugs
    const cardWidth = cards[0].offsetWidth;
    const wrapperWidth = wrapper.clientWidth;
    
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 24;

    // Precise conveyor belt calculation: align the center of the active card with the center of the wrapper
    const cardCenterOffset = currentIndex * (cardWidth + gap) + (cardWidth / 2);
    const wrapperCenter = wrapperWidth / 2;
    const translateX = wrapperCenter - cardCenterOffset;

    track.style.transform = `translateX(${translateX}px)`;

    // Update active class for opacity and scaling
    cards.forEach((card, idx) => {
      card.classList.toggle('is-center', idx === currentIndex);
    });

    // Update counter and breadcrumb segments
    currentSlideEl.textContent = String(currentIndex + 1).padStart(2, '0');

    const segments = Array.from(progressTrack.children);
    segments.forEach((seg, idx) => {
      seg.classList.toggle('active', idx === currentIndex);
    });

    // Enable/disable buttons at boundaries (first and last card)
    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = (currentIndex === cards.length - 1);
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, cards.length - 1));
    updateSlider();
  }

  function nextSlide() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateSlider();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  }

  // Event Listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateSlider, 50);
  });

  // Touch / Swipe Support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (diffX > 40) {
      nextSlide();
    } else if (diffX < -40) {
      prevSlide();
    }

    isDragging = false;
  }, { passive: true });

  // Initialize
  initProgressTrack();
  updateSlider();
});