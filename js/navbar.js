document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.main-header');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');

    // Hilfsfunktion zum Schließen des Menüs
    const closeMobileMenu = () => {
        navWrapper.classList.remove('active');
        header.classList.remove('is-menu-open'); 
        navToggle.setAttribute('aria-expanded', 'false');
        
        // --- LOCK ENTFERNEN ---
        body.style.overflow = ''; 
        body.style.height = ''; 
        
        document.querySelectorAll('.has-dropdown').forEach(p => p.classList.remove('is-open'));
    };

    // --- 1. BURGER MENU TOGGLE ---
    if (navToggle && navWrapper) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            const nextState = !isExpanded;

            navToggle.setAttribute('aria-expanded', nextState);
            navWrapper.classList.toggle('active', nextState);
            header.classList.toggle('is-menu-open', nextState);
            
            // --- LOCK SETZEN/ENTFERNEN ---
            if (nextState) {
                body.style.overflow = 'hidden'; // Verhindert Scrollen
                body.style.height = '100vh';    // Fixiert die Höhe auf Viewport
            } else {
                body.style.overflow = '';
                body.style.height = '';
            }
        });
    }

    // --- 2. SCROLL EFFECT ---
    window.addEventListener('scroll', () => {
        header.classList.toggle('is-scrolled', window.scrollY > 50);
    }, { passive: true });

   // --- 3. SEAMLESS HOVER ANIMATION (SLIDER-METHODE) ---
    // Erstelle die fliegende Linie dynamisch
    const line = document.createElement('div');
    line.className = 'nav-hover-line';
    if (navLinks.length > 0) {
        // Füge die Linie in den gemeinsamen Container der Links ein (z.B. .nav-links)
        document.querySelector('.nav-links').appendChild(line);
    }

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1024) {
                const rect = link.getBoundingClientRect();
                const containerRect = link.parentElement.parentElement.getBoundingClientRect();
                
                // Berechne die exakte Position relativ zum Nav-Container
                const leftPosition = rect.left - containerRect.left;

                line.style.width = `${rect.width}px`;
                line.style.transform = `translateX(${leftPosition}px) scaleX(1)`;
                line.style.opacity = '1';
            }
        });
    });

    // Wenn die Maus das gesamte Menü verlässt, blende die Linie aus
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        navLinksContainer.addEventListener('mouseleave', () => {
            line.style.opacity = '0';
            line.style.transform = line.style.transform.replace('scaleX(1)', 'scaleX(0)');
        });
    }

    // --- 4. MOBILE DROPDOWN TOGGLE ---
    const dropdownItems = document.querySelectorAll('.has-dropdown > .nav-link');
    dropdownItems.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const parent = link.parentElement;
                const isOpen = parent.classList.contains('is-open');

                document.querySelectorAll('.has-dropdown').forEach(p => {
                    if (p !== parent) p.classList.remove('is-open');
                    p.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
                });

                parent.classList.toggle('is-open');
                link.setAttribute('aria-expanded', !isOpen);
            }
        });
    });

    // --- 5. CLOSE ON RESIZE ---
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            closeMobileMenu();
        }
    });

    // --- 6. CLOSE ON LINK CLICK ---
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const isDropdownTrigger = link.parentElement.classList.contains('has-dropdown');
            
            // Wenn es kein Dropdown ist ODER wir auf Desktop sind -> Menü schließen & Scroll freigeben
            if (!isDropdownTrigger || window.innerWidth > 1024) {
                closeMobileMenu();
            }
        });
    });
});








document.addEventListener('DOMContentLoaded', () => {
    // Elemente aus dem HTML auswählen
    const menuCard = document.querySelector('.menu-card');
    const slider = document.querySelector('.slider');
    const items = document.querySelectorAll('.slider .item');
    const produkteItem = document.querySelector('.nav-item.has-dropdown');

    let currentIndex = 0;
    let autoSliderInterval = null;

    // 1. DURCHMESSER BERECHNEN UND SETZEN
    const setDiameter = () => {
        if (!menuCard || !slider) return;

        // Tatsächliche Größe der Karte holen
        const width = menuCard.clientWidth;
        const height = menuCard.clientHeight;

        // Falls das Menü noch unsichtbar ist (0px), Berechnung überspringen
        if (width === 0 || height === 0) return;

        // Der Kreis nimmt den kleineren Wert von Breite oder Höhe
        const diameter = Math.min(width, height);

        // Slider-Größe und Abrundung anpassen
        slider.style.width = `${diameter}px`;
        slider.style.height = `${diameter}px`;
        slider.style.borderRadius = '50%';

        // CSS Variable an das Root-Element übergeben
        document.documentElement.style.setProperty('--diameter', `${diameter}px`);

        // Perfekte Zentrierung im Parent-Container
        slider.style.position = 'absolute';
        slider.style.left = '50%';
        slider.style.top = '50%';
        slider.style.transform = 'translate(-50%, -50%)';
    };

    // 2. SLIDER STEUERUNG (Bilder umschalten)
    const setActive = (index) => {
        if (items.length === 0) return;
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        currentIndex = index;
    };

    const startAutoSlider = () => {
        stopAutoSlider(); // Altes Intervall löschen
        autoSliderInterval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= items.length) nextIndex = 0;
            setActive(nextIndex);
        }, 4000); // Wechselt alle 4 Sekunden das Bild
    };

    const stopAutoSlider = () => {
        if (autoSliderInterval) {
            clearInterval(autoSliderInterval);
        }
    };

    // 3. HOVER-EFFEKTE FÜR DAS PRODUKTE-MENÜ
    if (produkteItem) {
        produkteItem.addEventListener('mouseenter', () => {
            // Durchmesser nach CSS-Öffnung berechnen
            setTimeout(() => {
                setDiameter();
            }, 50);

            // Automatischen Wechsel im Hintergrund starten
            startAutoSlider();
        });

        produkteItem.addEventListener('mouseleave', () => {
            stopAutoSlider();
        });
    }

    // --- AUTOMATISCHE BERECHNUNG BEIM LADEN ---
    // Sofort berechnen, wenn das HTML bereit ist
    setDiameter();

    // Sicherheithalber berechnen, wenn alle Styles & Bilder geladen sind
    window.addEventListener('load', setDiameter);

    // Falls der User das Browserfenster skaliert
    window.addEventListener('resize', setDiameter);
});