
  document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('cutWrapper');
    const paperTop = document.getElementById('paperTop');
    const paperBottom = document.getElementById('paperBottom');
    const scissors = document.getElementById('scissors');
    const bladeTop = scissors.querySelector('.blade-top');
    const bladeBottom = scissors.querySelector('.blade-bottom');

    function animateCut() {
      const rect = wrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollableDistance = rect.height - windowHeight;
      const currentScroll = -rect.top;
      
      let progress = currentScroll / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress));

      if (progress > 0 && progress < 1) {
        scissors.style.opacity = '1';

        // 1. Schere bewegt sich zügig über den Schirm
        const xPos = progress * 105;
        scissors.style.left = `${xPos}%`;

        // 2. LANGSAMERES ÖFFNEN: 
        // Math.pow(progress, 2.2) sorgt für ein sanftes, träges Aufgleiten.
        // Der Faktor (35vh) hält den Abstand klein, damit der Inhalt erst nach und nach sichtbar wird.
        const slowProgress = Math.pow(progress, 2.2); 
        const openAmount = slowProgress * 35; // Vorher 100vh -> jetzt viel langsamer

        paperTop.style.transform = `translateY(-${openAmount}vh) rotate(-${slowProgress * 1.5}deg)`;
        paperBottom.style.transform = `translateY(${openAmount}vh) rotate(${slowProgress * 1.5}deg)`;

        // 3. Scheren-Schnippen
        const chopAngle = Math.abs(Math.sin(progress * 40)) * 18; 
        bladeTop.style.transform = `rotate(-${chopAngle}deg)`;
        bladeBottom.style.transform = `rotate(${chopAngle}deg)`;

      } else if (progress >= 1) {
        // Erst ganz am Ende klappen die Hälften komplett auf
        scissors.style.opacity = '0';
        paperTop.style.transform = `translateY(-55vh)`;
        paperBottom.style.transform = `translateY(55vh)`;
      } else {
        scissors.style.opacity = '0';
        paperTop.style.transform = `translateY(0)`;
        paperBottom.style.transform = `translateY(0)`;
      }
    }

    window.addEventListener('scroll', animateCut, { passive: true });
    animateCut();
  });











  const salonSlider = document.querySelector('.salon-slider');
const salonSlides = document.querySelectorAll('.salon-slider .salon-slide');
const salonNext = document.querySelector('#salonNext');
const salonPrev = document.querySelector('#salonPrev');

let currentSalonSlide = 0;
let salonTimer;

function updateSalonSlider(direction = 'forward') {
    salonSlider.classList.remove('slide-forward', 'slide-backward');

    if (direction === 'forward') {
        salonSlider.classList.add('slide-forward');
    } else {
        salonSlider.classList.add('slide-backward');
    }

    salonSlides.forEach(slide => {
        slide.classList.remove(
            'salon-active',
            'salon-preview-left',
            'salon-preview-right'
        );

        const picture = slide.querySelector('.salon-picture img');
        const caption = slide.querySelector('.salon-picture figcaption');

        if (picture) picture.style.animation = 'none';
        if (caption) caption.style.animation = 'none';

        void slide.offsetWidth;

        if (picture) picture.style.animation = '';
        if (caption) caption.style.animation = '';
    });

    const totalSlides = salonSlides.length;

    const previousSlide =
        (currentSalonSlide - 1 + totalSlides) % totalSlides;

    const nextSlide =
        (currentSalonSlide + 1) % totalSlides;

    salonSlides[currentSalonSlide].classList.add('salon-active');
    salonSlides[previousSlide].classList.add('salon-preview-left');
    salonSlides[nextSlide].classList.add('salon-preview-right');

    restartSalonTimer();
}

function restartSalonTimer() {
    clearInterval(salonTimer);

    salonTimer = setInterval(() => {
        currentSalonSlide =
            (currentSalonSlide + 1) % salonSlides.length;

        updateSalonSlider('forward');
    }, 5000);
}

salonNext.addEventListener('click', () => {
    currentSalonSlide =
        (currentSalonSlide + 1) % salonSlides.length;

    updateSalonSlider('forward');
});

salonPrev.addEventListener('click', () => {
    currentSalonSlide =
        (currentSalonSlide - 1 + salonSlides.length) % salonSlides.length;

    updateSalonSlider('backward');
});

salonSlider.addEventListener('mouseenter', () => {
    clearInterval(salonTimer);
});

salonSlider.addEventListener('mouseleave', () => {
    restartSalonTimer();
});

updateSalonSlider();