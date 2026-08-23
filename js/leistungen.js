document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.service-tabs [role="tab"]');
  const panels = document.querySelectorAll('.service-panels .service-panel');

  if (!tabs.length || !panels.length) return;

  function switchTab(targetTab) {
    // 1. Alle Tabs deaktivieren
    tabs.forEach(tab => {
      tab.classList.remove('is-active');
      tab.setAttribute('aria-selected', 'false');
    });

    // 2. Alle Panels ausblenden
    panels.forEach(panel => {
      panel.classList.remove('is-active');
      panel.setAttribute('hidden', 'true');
    });

    // 3. Gewählten Tab aktivieren
    targetTab.classList.add('is-active');
    targetTab.setAttribute('aria-selected', 'true');

    // 4. Dazugehöriges Panel einblenden
    const targetPanelId = targetTab.getAttribute('aria-controls');
    const targetPanel = document.getElementById(targetPanelId);

    if (targetPanel) {
      targetPanel.classList.add('is-active');
      targetPanel.removeAttribute('hidden');
    }
  }

  // Event-Listener für Click & Tastatur-Steuerung auf Tabs setzen
  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab));

    // Barrierefreiheit: Pfeiltasten-Navigation zwischen Tabs
    tab.addEventListener('keydown', (e) => {
      const tabArray = Array.from(tabs);
      const index = tabArray.indexOf(tab);

      if (e.key === 'ArrowRight') {
        const nextTab = tabArray[(index + 1) % tabArray.length];
        nextTab.focus();
        switchTab(nextTab);
      } else if (e.key === 'ArrowLeft') {
        const prevTab = tabArray[(index - 1 + tabArray.length) % tabArray.length];
        prevTab.focus();
        switchTab(prevTab);
      }
    });
  });
});