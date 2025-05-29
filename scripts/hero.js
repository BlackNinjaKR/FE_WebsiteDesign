function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

    document.addEventListener('DOMContentLoaded', () => {
    document.body.style.userSelect = 'none';

    document.body.addEventListener('selectstart', e => e.preventDefault());
    document.body.addEventListener('mousedown', e => e.preventDefault());
  });