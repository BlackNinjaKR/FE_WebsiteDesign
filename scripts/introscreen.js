// When the entire page (including images, stylesheets, etc.) finishes loading
window.addEventListener('load', () => {
  // Wait for 4.7 seconds (enough time for the intro animation and fade-out)
  setTimeout(() => {
    // Completely hide the intro screen from the page
    document.getElementById('intro-screen').style.display = 'none';
  }, 4700); // Total time for intro animation + fade-out
});

// Start fade-out animation slightly before removing the intro screen
setTimeout(() => {
  // Add a CSS class that triggers a fade-out animation (defined in your stylesheet)
  document.getElementById('intro-screen').classList.add('fade-out');
}, 4300); // Trigger fade-out shortly before removal for smooth transition
