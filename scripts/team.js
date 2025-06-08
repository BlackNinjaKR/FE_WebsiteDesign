// Get a reference to the carousel container
const carousel = document.getElementById('teamCarousel');

// Set up animation for a single card
function setupCardAnimation(card) {
  const shine = card.querySelector('.shine-effect');
  if (!shine) return; // Exit if no shine element is found

  // Define animation for the shine effect
  const animation = shine.animate([
    { transform: 'translateX(-100%)', opacity: 0 },
    { transform: 'translateX(-50%)', opacity: 1 },
    { transform: 'translateX(100%)', opacity: 0 }
  ], {
    duration: 1500,
    easing: 'ease-in-out',
    fill: 'both'
  });

  animation.pause(); // Start with the animation paused

  let raf; // RequestAnimationFrame reference for reverse animation timing

  // Play the shine animation on mouse enter
  card.addEventListener('mouseenter', () => {
    cancelAnimationFrame(raf); // Cancel any ongoing reverse animation
    animation.playbackRate = 1; // Forward playback
    // Restart from beginning if already completed
    if (animation.currentTime === animation.effect.getComputedTiming().duration) {
      animation.currentTime = 0;
    }
    animation.play(); // Play animation
  });

  // Reverse the animation on mouse leave
  card.addEventListener('mouseleave', () => {
    if (animation.currentTime > 0) {
      animation.playbackRate = -1; // Reverse playback
      animation.play();
      // Gradually rewind animation until time reaches 0, then pause
      const check = () => {
        if (animation.currentTime <= 0) {
          animation.pause();
          animation.currentTime = 0;
        } else {
          raf = requestAnimationFrame(check);
        }
      };
      raf = requestAnimationFrame(check);
    }
  });

  // Automatically reset animation when the card re-enters view
  observer.observe(card);
}

// Observer to reset animations when elements re-enter the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const shine = card.querySelector('.shine-effect');
      if (shine) {
        // Trigger a reset by forcing a reflow
        shine.style.animation = 'none';
        void shine.offsetWidth;
        shine.style.animation = '';
      }
    }
  });
}, { threshold: 0.5 }); // Element must be at least 50% visible

// Initialize animation for all cards
document.querySelectorAll('.card').forEach(setupCardAnimation);


const card_no = 5
// Scroll the carousel left or right, with infinite clone support
function scrollCarousel(direction) {
  const scrollAmount = 352; // Width of card + margin/padding/gap

  if (direction > 0) {
    // Scroll right
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    setTimeout(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll - scrollAmount * 2) {
        // Clone and append the first 4 cards when near the end
        const cards = Array.from(carousel.querySelectorAll('.card')).slice(0, card_no);
        cards.forEach(card => {
          const clone = card.cloneNode(true);
          setupCardAnimation(clone); // Rebind animation to cloned card
          carousel.appendChild(clone);
        });
      }
    }, 500);

  } else {
    // Scroll left
    if (carousel.scrollLeft <= scrollAmount * 2) {
      // Clone and prepend the last 4 cards when near the beginning
      const cards = Array.from(carousel.querySelectorAll('.card'));
      const clones = cards.slice(-1*card_no).map(card => {
        const clone = card.cloneNode(true);
        setupCardAnimation(clone);
        return clone;
      });
      // Reverse order so they appear correctly when prepended
      clones.reverse().forEach(clone => {
        carousel.prepend(clone);
        carousel.scrollLeft += scrollAmount; // Adjust scroll position to prevent jump
      });
    }

    // Then scroll left
    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }
}

// Variables for drag/touch scroll support
let isDown = false;
let startX;
let scrollLeft;

// Mouse drag start
carousel.addEventListener('mousedown', (e) => {
  isDown = true;
  carousel.classList.add('dragging'); // Optional style change
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

// Cancel drag if mouse leaves the carousel
carousel.addEventListener('mouseleave', () => {
  isDown = false;
  carousel.classList.remove('dragging');
});

// End drag on mouse up
carousel.addEventListener('mouseup', () => {
  isDown = false;
  carousel.classList.remove('dragging');
});

// Handle mouse move while dragging
carousel.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.5; // Scroll distance multiplier
  carousel.scrollLeft = scrollLeft - walk;
  handleInfiniteScroll(); // Clone/prepend if necessary
});

// Touch start for mobile support
carousel.addEventListener('touchstart', (e) => {
  isDown = true;
  startX = e.touches[0].pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

// End touch
carousel.addEventListener('touchend', () => {
  isDown = false;
});

// Handle touch move
carousel.addEventListener('touchmove', (e) => {
  if (!isDown) return;
  const x = e.touches[0].pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.5;
  carousel.scrollLeft = scrollLeft - walk;
  handleInfiniteScroll();
});

// Dynamically clone cards when reaching carousel edges
function handleInfiniteScroll() {
  const scrollAmount = 320 + 32; // Estimated card width + spacing
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;

  // Clone & append cards when near the end
  if (carousel.scrollLeft >= maxScroll - scrollAmount * 2) {
    const cards = Array.from(carousel.querySelectorAll('.card')).slice(0, card_no);
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      setupCardAnimation(clone);
      carousel.appendChild(clone);
    });
  }

  // Clone & prepend cards when near the start
  if (carousel.scrollLeft <= scrollAmount * 2) {
    const cards = Array.from(carousel.querySelectorAll('.card'));
    const clones = cards.slice(-1 * card_no).map(card => {
      const clone = card.cloneNode(true);
      setupCardAnimation(clone);
      return clone;
    });
    clones.reverse().forEach(clone => {
      carousel.prepend(clone);
      carousel.scrollLeft += scrollAmount;
    });
  }
}
