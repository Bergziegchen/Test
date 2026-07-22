document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-image, .reveal-content');

    const observerOptions = {
        root: null,
        threshold: 0.15, // Triggert, wenn 15% der Sektion sichtbar sind
        rootMargin: '0px 0px -80px 0px' 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Animation läuft nur einmal ab
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
});
















document.addEventListener('DOMContentLoaded', () => {
    // Hier wurden die neuen Klassen für die Vorteile hinzugefügt
    const revealElements = document.querySelectorAll(
        '.reveal-image, .reveal-content, .reveal-card-1, .reveal-card-2, .reveal-card-3'
    );

    const observerOptions = {
        root: null,
        threshold: 0.1, // Ein klein wenig früher triggern
        rootMargin: '0px 0px -50px 0px' 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
});