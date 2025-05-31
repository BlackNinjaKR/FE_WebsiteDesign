// Function to smoothly scroll to an element with the given ID
function scrollToSection(id) {
  // Get the target section element by its ID
  const section = document.getElementById(id);

  // If the element exists, scroll it into view smoothly
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling animation
  }
}

// Wait until the DOM content is fully loaded before running this code
document.addEventListener('DOMContentLoaded', () => {
  // Disable all text selection on the page
  document.body.style.userSelect = 'none';

  // Prevent text selection from starting (e.g., on double-click or drag)
  document.body.addEventListener('selectstart', e => e.preventDefault());

  // Prevent text selection via mouse down events
  document.body.addEventListener('mousedown', e => e.preventDefault());
});
