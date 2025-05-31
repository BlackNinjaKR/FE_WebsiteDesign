const carousel = document.getElementById('teamCarousel');

// Set up animation handlers on a single card
function setupCardAnimation(card) {
  const shine = card.querySelector('.shine-effect');
  if (!shine) return;

  const animation = shine.animate([
    { transform: 'translateX(-100%)', opacity: 0 },
    { transform: 'translateX(-50%)', opacity: 1 },
    { transform: 'translateX(100%)', opacity: 0 }
  ], {
    duration: 1500,
    easing: 'ease-in-out',
    fill: 'both'
  });

  animation.pause(); // Start paused

  let raf;

  card.addEventListener('mouseenter', () => {
    cancelAnimationFrame(raf);
    animation.playbackRate = 1;
    if (animation.currentTime === animation.effect.getComputedTiming().duration) {
      animation.currentTime = 0;
    }
    animation.play();
  });

  card.addEventListener('mouseleave', () => {
    if (animation.currentTime > 0) {
      animation.playbackRate = -1;
      animation.play();
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

  // Optional: reset animation when card re-enters view
  observer.observe(card);
}

// IntersectionObserver to reset animation state
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const shine = card.querySelector('.shine-effect');

      if (shine) {
        shine.style.animation = 'none';
        void shine.offsetWidth;
        shine.style.animation = '';
      }
    }
  });
}, { threshold: 0.5 });

// Apply animation to initial cards
document.querySelectorAll('.card').forEach(setupCardAnimation);

// Carousel scroll with infinite clone support
function scrollCarousel(direction) {
  const scrollAmount = 352; // card width + gap

  if (direction > 0) {
    // Scroll right
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    setTimeout(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll - scrollAmount * 2) {
        const cards = carousel.querySelectorAll('.card');
        cards.forEach((card, index) => {
          if (index < 3) {
            const clone = card.cloneNode(true);
            setupCardAnimation(clone);
            carousel.appendChild(clone);
          }
        });
      }
    }, 500);

  } else {
    // Scroll left
    if (carousel.scrollLeft <= scrollAmount) {
      const cards = carousel.querySelectorAll('.card');
      const toClone = Array.from(cards).slice(-3).reverse();
      toClone.forEach(card => {
        const clone = card.cloneNode(true);
        setupCardAnimation(clone);
        carousel.insertBefore(clone, carousel.firstChild);
      });

      // Adjust scroll to prevent jump
      carousel.scrollLeft += scrollAmount * 3;
    }

    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }
}

let isDown = false;
let startX;
let scrollLeft;

carousel.addEventListener('mousedown', (e) => {
  isDown = true;
  carousel.classList.add('dragging');
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mouseleave', () => {
  isDown = false;
  carousel.classList.remove('dragging');
});

carousel.addEventListener('mouseup', () => {
  isDown = false;
  carousel.classList.remove('dragging');
});

carousel.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.5;
  carousel.scrollLeft = scrollLeft - walk;
  handleInfiniteScroll(); // Check if near end or beginning
});

carousel.addEventListener('touchstart', (e) => {
  isDown = true;
  startX = e.touches[0].pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('touchend', () => {
  isDown = false;
});

carousel.addEventListener('touchmove', (e) => {
  if (!isDown) return;
  const x = e.touches[0].pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.5;
  carousel.scrollLeft = scrollLeft - walk;
  handleInfiniteScroll(); // Check here too
});

function handleInfiniteScroll() {
  const scrollAmount = 320 + 32; // Approx card width + gap
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;

  if (carousel.scrollLeft >= maxScroll - scrollAmount * 2) {
    const cards = carousel.querySelectorAll('.card');
    cards.forEach((card, index) => {
      if (index < 3) {
        const clone = card.cloneNode(true);
        carousel.appendChild(clone);
      }
    });
  }

  if (carousel.scrollLeft <= scrollAmount * 2) {
    const cards = carousel.querySelectorAll('.card');
    cards.slice(-3).forEach(card => {
      const clone = card.cloneNode(true);
      carousel.prepend(clone);
      carousel.scrollLeft += scrollAmount; // Prevent jump
    });
  }
}
