  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('intro-screen').style.display = 'none';
    }, 3000); // Total time for animation + fade
  });

  setTimeout(() => {
    document.getElementById('intro-screen').classList.add('fade-out');
  }, 6000); // Trigger fade-out AFTER intro animation