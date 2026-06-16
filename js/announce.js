// announceForScreenReader helper: writes short announcements into an aria-live region
function announceForScreenReader(text, politeness = 'polite') {
  var live = document.getElementById('live-region');
  if (!live) return;
  try {
    live.setAttribute('aria-live', politeness);
    // Clear then set to ensure many screen readers detect the change
    live.textContent = '';
    setTimeout(function() { live.textContent = text; }, 50);
  } catch (e) {
    console.warn('announceForScreenReader failed', e);
  }
}

// Example helper used by call controls
function toggleButtonState(btn, onText, offText) {
  var isOn = btn.getAttribute('aria-pressed') === 'true';
  var newState = (!isOn).toString();
  btn.setAttribute('aria-pressed', newState);
  var announcement = (newState === 'true') ? onText : offText;
  announceForScreenReader(announcement, 'polite');
}

// Export in browser global for demo usage
window.announceForScreenReader = announceForScreenReader;
window.toggleButtonState = toggleButtonState;
