// Prevent right-click
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Disable specific keys
  document.onkeydown = function(e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
      (e.ctrlKey && e.key === "U")
    ) {
      showDevToolsWarning();
      return false;
    }
  };

  // Detect devtools opening via console trick
  let devtoolsOpened = false;
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function () {
      devtoolsOpened = true;
      showDevToolsWarning();
    }
  });
  console.log('%c', element);

  function showDevToolsWarning() {
  const warning = document.getElementById('devtools-warning');
  if (warning && !devtoolsOpened) {
    warning.style.display = 'flex';
    devtoolsOpened = true;
    setTimeout(() => {
      location.reload();
    }, 3000); // Reload after 3 seconds
  }
}
