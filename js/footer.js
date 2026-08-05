document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamisches Copyright-Jahr
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Dynamische Bürozeiten-Anzeige (Bsp.: Mo-Fr 09:00 - 18:00 Uhr)
  const officeStatusText = document.getElementById("office-status");
  const statusDot = document.querySelector(".status-dot");

  function updateOfficeStatus() {
    if (!officeStatusText || !statusDot) return;

    const now = new Date();
    const day = now.getDay(); // 0 = So, 1 = Mo, ... 6 = Sa
    const hour = now.getHours();

    // Geöffnet von Mo-Fr zwischen 9 und 18 Uhr
    const isOpen = day >= 1 && day <= 5 && hour >= 9 && hour < 18;

    if (isOpen) {
      officeStatusText.textContent = "Büro besetzt • Bereit für neue Projekte";
      statusDot.classList.remove("closed");
    } else {
      officeStatusText.textContent = "Derzeit im Feierabend • Anfragen werden morgen bearbeitet";
      statusDot.classList.add("closed");
    }
  }
  updateOfficeStatus();

  // 3. Smart Back-to-Top Button (erscheint erst beim Scrollen)
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 4. Newsletter Validation mit Barrierefreiem Feedback
  const newsletterForm = document.getElementById("newsletter-form");
  const feedbackSpan = document.getElementById("newsletter-feedback");

  if (newsletterForm && feedbackSpan) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("newsletter-email");
      
      if (emailInput && emailInput.checkValidity()) {
        feedbackSpan.textContent = "Vielen Dank! Du wurdest erfolgreich eingetragen.";
        feedbackSpan.className = "form-feedback success";
        emailInput.value = "";
      } else {
        feedbackSpan.textContent = "Bitte gib eine gültige E-Mail-Adresse ein.";
        feedbackSpan.className = "form-feedback error";
      }
    });
  }
});