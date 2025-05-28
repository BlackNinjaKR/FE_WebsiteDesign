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

/*(function detectDevTools() {
    let threshold = 160; // Common height of DevTools panel (px)

    const devtools = {
        isOpen: false,
        orientation: null
    };

    const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            devtools.isOpen = true;
            devtools.orientation = widthThreshold ? 'vertical' : 'horizontal';
        } else {
            devtools.isOpen = false;
        }

        if (devtools.isOpen) {
            console.clear();
            location.reload();
        }
    };

    setInterval(checkDevTools, 500);
})();*/

let devtoolsOpen = false;

function detectDevToolsBySize() {
  const threshold = 160;
  return window.outerWidth - window.innerWidth > threshold ||
         window.outerHeight - window.innerHeight > threshold;
}

function detectDevToolsByTiming() {
  const start = performance.now();
  debugger;
  return performance.now() - start > 100;
}

setInterval(() => {
  if ((detectDevToolsBySize() || detectDevToolsByTiming()) && !devtoolsOpen) {
    devtoolsOpen = true;
    document.body.innerHTML = `
      <div class="devtools-overlay">
        <h1>🚨 DevTools Detected</h1>
        <p>This code is owned by the developer and not licensed for distribution or inspection.</p>
        <p>This page is protected. Reloading...</p>
      </div>
    `;
    setTimeout(() => location.reload(), 1000);
  }
}, 1000);