let next = document.getElementById('next');
let prev = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let items = document.querySelectorAll('.carousel .item');
let countItem = items.length;
let active = 1;
let other_1 = null;
let other_2 = null;
next.onclick = () => {
    carousel.classList.remove('prev');
    carousel.classList.add('next');
    active =active + 1 >= countItem ? 0 : active + 1;
    other_1 =active - 1 < 0 ? countItem -1 : active - 1;
    other_2 = active + 1 >= countItem ? 0 : active + 1;
    changeSlider();
}
prev.onclick = () => {
    carousel.classList.remove('next');
    carousel.classList.add('prev');
    active = active - 1 < 0 ? countItem - 1 : active - 1;
    other_1 = active + 1 >= countItem ? 0 : active + 1;
    other_2 = other_1 + 1 >= countItem ? 0 : other_1 + 1;
    changeSlider();
}
const changeSlider = () => {
    let itemOldActive = document.querySelector('.carousel .item.active');
    if(itemOldActive) itemOldActive.classList.remove('active');

    let itemOldOther_1 = document.querySelector('.carousel .item.other_1');
    if(itemOldOther_1) itemOldOther_1.classList.remove('other_1');

    let itemOldOther_2 = document.querySelector('.carousel .item.other_2');
    if(itemOldOther_2) itemOldOther_2.classList.remove('other_2');

    items.forEach(e => {
        e.querySelector('.image img').style.animation = 'none';
        e.querySelector('.image figcaption').style.animation = 'none';
        void e.offsetWidth;
        e.querySelector('.image img').style.animation = '';
        e.querySelector('.image figcaption').style.animation = '';
    })

    items[active].classList.add('active');
    items[other_1].classList.add('other_1');
    items[other_2].classList.add('other_2');

    clearInterval(autoPlay);
    autoPlay = setInterval(() => {
        next.click();
    }, 4000);
}
let autoPlay = setInterval(() => {
    next.click();
}, 4000);

// --- HOVER-STOPP FÜR AUTOPLAY ---

// Wenn die Maus auf das Karussell fährt: Autoplay stoppen
carousel.addEventListener('mouseenter', () => {
    clearInterval(autoPlay);
});

// Wenn die Maus das Karussell verlässt: Autoplay wieder starten
carousel.addEventListener('mouseleave', () => {
    // Wichtig: Zuerst eventuelle Reste löschen, um doppelte Timer zu verhindern
    clearInterval(autoPlay); 
    autoPlay = setInterval(() => {
        next.click();
    }, 4000);
});

// Fixt den Klick-Bug: Stoppt den Timer sofort wieder, wenn nach dem Klick die Maus noch drauf ist
carousel.addEventListener('click', () => {
    if (carousel.matches(':hover')) {
        clearInterval(autoPlay);
    }
});




















/* faq logik */

document.addEventListener('DOMContentLoaded', () => {
    // Selektoren auf die neuen BEM-Klassen und js-IDs anpassen
    const items = document.querySelectorAll('.hero-carousel__item');
    const prevBtn = document.getElementById('js-carousel-prev');
    const nextBtn = document.getElementById('js-carousel-next');
    
    let lastPosition = items.length - 1;
    let firstPosition = 0;
    let active = 0;

    // Click-Events für die Steuerung
    nextBtn.onclick = () => {
        active = active + 1;
        setSlider();
    }
    
    prevBtn.onclick = () => {
        active = active - 1;
        setSlider();
    }

    // Funktion zum Aktualisieren des aktiven Slides und der Buttons
    const setSlider = () => {
        // Altes aktives Element suchen und Klasse entfernen
        let oldActive = document.querySelector('.hero-carousel__item--active');
        if (oldActive) oldActive.classList.remove('hero-carousel__item--active');
        
        // Neuen Slide aktivieren
        items[active].classList.add('hero-carousel__item--active');
        
        // Deaktivierungs-Klassen standardmäßig entfernen
        nextBtn.classList.remove('hero-carousel__btn--disabled');
        prevBtn.classList.remove('hero-carousel__btn--disabled');
        
        // Buttons verstecken, wenn das Ende oder der Anfang erreicht ist
        if (active === lastPosition) nextBtn.classList.add('hero-carousel__btn--disabled');
        if (active === firstPosition) prevBtn.classList.add('hero-carousel__btn--disabled');
    }
    
    // Erster Aufruf zum Initialisieren
    setSlider();

    // Dynamische Berechnung des Durchmessers für den Kreis-Effekt
    const setDiameter = () => {
        let slider = document.querySelector('.hero-carousel');
        if (!slider) return;
        
        let widthSlider = slider.offsetWidth;
        let heightSlider = slider.offsetHeight;
        
        // Satz des Pythagoras für den perfekten Kreis-Durchmesser
        let diameter = Math.sqrt(Math.pow(widthSlider, 2) + Math.pow(heightSlider, 2));
        document.documentElement.style.setProperty('--diameter', diameter + 'px');
    }

    // Durchmesser beim Start und bei jedem Resize berechnen
    setDiameter();
    window.addEventListener('resize', setDiameter);
});





document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('#faqsection .faq-question').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Verhindert ungewolltes Scrollen bei Buttons
            
            const item = button.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // Schließt alle anderen Boxen (Akkordeon-Modus)
            document.querySelectorAll('#faqsection .item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Öffnet die aktuelle Box
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});













/* ==========================================
   PORTFOLIO SHOWCASE SLIDER LOGIC
   ========================================== */

const showcaseSlides = document.querySelectorAll('.showcase-slide');
const btnForward = document.querySelector('.ctrl-btn-forward');
const btnBackward = document.querySelector('.ctrl-btn-backward');
const indicatorBullets = document.querySelectorAll('.indicator-bullet');

let startOffset = 2; 

function updateSlider(direction) {
    if (direction === 'next' && startOffset < showcaseSlides.length - 1) {
        startOffset++;
    } else if (direction === 'prev' && startOffset > 0) {
        startOffset--;
    }

    showcaseSlides.forEach((slide, index) => {
        const relI = index - startOffset;
        const dist = Math.abs(relI);

        slide.style.setProperty('--i', relI);
        slide.style.setProperty('--dist', dist);
        
        const isActive = relI === 0;
        slide.classList.toggle('state-active', isActive);
    });

    if (indicatorBullets.length > 0) {
        indicatorBullets.forEach((bullet, index) => {
            bullet.classList.toggle('state-active', index === startOffset);
        });
    }

    checkButtons();
}

function checkButtons() {
    if (btnBackward) btnBackward.disabled = (startOffset === 0);
    if (btnForward) btnForward.disabled = (startOffset === showcaseSlides.length - 1);
}

if (btnForward) btnForward.addEventListener('click', () => updateSlider('next'));
if (btnBackward) btnBackward.addEventListener('click', () => updateSlider('prev'));

indicatorBullets.forEach((bullet, index) => {
    bullet.addEventListener('click', () => {
        startOffset = index;
        updateSlider();
    });
});

window.addEventListener('DOMContentLoaded', () => {
    updateSlider();
});

// Drag- & Swipe-Variablen
let isDragging = false;
let startX = 0;

const sliderContainer = document.querySelector('.portfolio-showcase');

// Zentrale Logik für die Wisch-Richtung
function handleGesture(endX) {
    const swipeThreshold = 50; // Pixel-Toleranz
    if (startX - endX > swipeThreshold) {
        updateSlider('next');
    } else if (endX - startX > swipeThreshold) {
        updateSlider('prev');
    }
}

if (sliderContainer) {
    // 1. Touch-Events (Smartphone)
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
        handleGesture(e.changedTouches[0].screenX);
    }, { passive: true });

    // 2. Maus-Events (Desktop-Dragging)
    sliderContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.screenX;
        sliderContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        sliderContainer.style.cursor = 'grab';
        handleGesture(e.screenX);
    });

    // Verhindert das "Herausziehen" von Elementen
    sliderContainer.addEventListener('dragstart', (e) => e.preventDefault());
}

// Tastatur-Steuerung
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') updateSlider('prev');
    if (e.key === 'ArrowRight') updateSlider('next');
});













































/* ==========================================
   Circle SLIDER LOGIC
   ========================================== */


document.addEventListener('DOMContentLoaded', () => {
    // 1. Elemente aus dem neuen HTML auswählen
    const carousel = document.querySelector('.hero-carousel');
    const items = document.querySelectorAll('.hero-carousel__item');
    const btnPrev = document.getElementById('js-carousel-prev');
    const btnNext = document.getElementById('js-carousel-next');

    let currentIndex = 0;
    let autoSliderInterval = null;
    const intervalDuration = 4000; // 4 Sekunden Wechselzeit

    // Falls die Elemente nicht existieren, Code abbrechen
    if (items.length === 0) return;

    // 2. SLIDE AKTIVIEREN
    const setActive = (index) => {
        items.forEach((item, i) => {
            // Klasse für den aktiven Zustand umschalten
            item.classList.toggle('hero-carousel__item--active', i === index);
        });
        currentIndex = index;
    };

    // Helfer-Funktionen für die Richtung
    const showNextSlide = () => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) nextIndex = 0;
        setActive(nextIndex);
    };

    const showPrevSlide = () => {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = items.length - 1;
        setActive(prevIndex);
    };

    // 3. AUTOMATISCHER WECHSEL (Auto-Play)
    const startAutoSlider = () => {
        stopAutoSlider(); // Sicherstellen, dass kein doppelter Timer läuft
        autoSliderInterval = setInterval(showNextSlide, intervalDuration);
    };

    const stopAutoSlider = () => {
        if (autoSliderInterval) {
            clearInterval(autoSliderInterval);
        }
    };

    // 4. EVENT LISTENERS

    // Klicks auf die Navigations-Buttons
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            showNextSlide();
            startAutoSlider(); // Timer nach manuellem Klick zurücksetzen
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            showPrevSlide();
            startAutoSlider(); // Timer nach manuellem Klick zurücksetzen
        });
    }

    // Auto-Play stoppen, wenn die Maus über dem Karussell schwebt
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlider);
        carousel.addEventListener('mouseleave', startAutoSlider);
    }

    // --- INITIALISIERUNG ---
    // Startet das automatische Durchlaufen direkt beim Laden
    startAutoSlider();
});