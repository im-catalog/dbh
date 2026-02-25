import './style.css';
import { initNavigation } from './js/navigation.js';
import { initForm } from './js/form.js';
import { initAnimations } from './js/animations.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initForm();
  initAnimations();
});
