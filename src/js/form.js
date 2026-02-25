/**
 * Quote form validation and submission handling
 */

const validators = {
  fullName: {
    required: true,
    validate: (value) => value.trim().length >= 2,
    message: 'Veuillez entrer votre nom complet (minimum 2 caractères).',
  },
  email: {
    required: true,
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Veuillez entrer une adresse email valide.',
  },
  phone: {
    required: true,
    validate: (value) => /^(\+33|0)\s*[1-9](\s*\d{2}){4}$/.test(value.replace(/\s/g, '')),
    message: 'Veuillez entrer un numéro de téléphone français valide.',
  },
  surfaceType: {
    required: true,
    validate: (value) => value !== '',
    message: 'Veuillez sélectionner un type de surface.',
  },
};

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (field) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
  }
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    field?.setAttribute('aria-describedby', `${fieldId}-error`);
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }
}

function validateField(fieldId) {
  const validator = validators[fieldId];
  if (!validator) return true;

  const field = document.getElementById(fieldId);
  if (!field) return true;

  const value = field.value;

  if (validator.required && !validator.validate(value)) {
    showError(fieldId, validator.message);
    return false;
  }

  clearError(fieldId);
  return true;
}

function validateForm() {
  let isValid = true;
  let firstErrorField = null;

  for (const fieldId of Object.keys(validators)) {
    if (!validateField(fieldId)) {
      isValid = false;
      if (!firstErrorField) {
        firstErrorField = document.getElementById(fieldId);
      }
    }
  }

  if (firstErrorField) {
    firstErrorField.focus();
  }

  return isValid;
}

export function initForm() {
  const form = document.getElementById('quote-form');
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error');

  if (!form) return;

  // Real-time validation on blur
  for (const fieldId of Object.keys(validators)) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('blur', () => validateField(fieldId));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') {
          validateField(fieldId);
        }
      });
    }
  }

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (successMessage) successMessage.classList.add('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');

    if (!validateForm()) {
      if (errorMessage) errorMessage.classList.remove('hidden');
      return;
    }

    // Collect form data
    const formData = Object.fromEntries(new FormData(form));

    // Log data for future backend integration
    // To integrate with a backend, replace this console.log with:
    // fetch('/api/devis', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
    console.log('Demande de devis:', formData);

    // Show success message
    if (successMessage) successMessage.classList.remove('hidden');
    form.reset();

    // Scroll to success message
    successMessage?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
