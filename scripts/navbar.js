// Store the initial vertical scroll position of the window
let lastScrollY = window.scrollY;

// Get a reference to the navigation bar element
const navbar = document.getElementById('navbar');

// Add an event listener that runs whenever the user scrolls the page
window.addEventListener('scroll', () => {
  // Check if the user is scrolling down
  if (window.scrollY > lastScrollY) {
    // If so, hide the navbar by adding a CSS class (e.g., moving it out of view)
    navbar.classList.add('hide');
  } else {
    // If scrolling up, show the navbar by removing the 'hide' class
    navbar.classList.remove('hide');
  }

  // Update the last known scroll position to the current position
  lastScrollY = window.scrollY;
});
