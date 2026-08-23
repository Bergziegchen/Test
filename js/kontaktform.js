document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const dateInput = document.getElementById('date');
  const responseDiv = document.getElementById('formResponse');
  const submitBtn = document.getElementById('submitBtn');

  // Datum-Einschränkung: Verhindert die Auswahl von vergangenen Tagen
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI zurücksetzen
    responseDiv.className = 'form-response';
    responseDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.innerText = 'Wird gesendet...';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        responseDiv.classList.add('success');
        responseDiv.innerText = result.message;
        form.reset();
      } else {
        throw new Error(result.message || 'Ein Fehler ist aufgetreten.');
      }
    } catch (error) {
      responseDiv.classList.add('error');
      responseDiv.innerText = error.message;
    } finally {
      responseDiv.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.innerText = 'Terminanfrage absenden';
    }
  });
});