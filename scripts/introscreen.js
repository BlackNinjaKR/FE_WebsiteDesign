  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('intro-screen').style.display = 'none';
    }, 4700); // Total time for animation + fade
  });

  setTimeout(() => {
    document.getElementById('intro-screen').classList.add('fade-out');
  }, 4300); // Trigger fade-out AFTER intro animation