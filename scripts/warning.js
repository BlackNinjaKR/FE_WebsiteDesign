// Prevent right-click context menu from appearing
document.addEventListener('contextmenu', e => e.preventDefault());

// Disable specific keyboard shortcuts related to DevTools
document.onkeydown = function(e) {
  if (
    e.key === "F12" || // Block F12
    (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) || // Block Ctrl+Shift+I/J/C
    (e.ctrlKey && e.key === "U") // Block Ctrl+U (view source)
  ) {
    showDevToolsWarning(); // Show warning if any blocked key is pressed
    return false;
  }
};

// Detect DevTools opening using console trick with a getter on an object property
let devtoolsOpened = false;
const element = new Image();
Object.defineProperty(element, 'id', {
  get: function () {
    devtoolsOpened = true; // Flag as opened
    showDevToolsWarning(); // Trigger warning
  }
});
console.log('%c', element); // Triggers getter when DevTools console is open

// Function to show DevTools warning and reload the page after a delay
function showDevToolsWarning() {
  const warning = document.getElementById('devtools-warning');
  if (warning && !devtoolsOpened) {
    warning.style.display = 'flex'; // Show warning UI
    devtoolsOpened = true;
    setTimeout(() => {
      location.reload(); // Reload page after 3 seconds
    }, 3000);
  }
}

// Flag to prevent multiple triggers of DevTools detection
let devtoolsOpen = false;

// Detect DevTools by checking window size differences
function detectDevToolsBySize() {
  const threshold = 160; // Common DevTools panel size
  return window.outerWidth - window.innerWidth > threshold ||
         window.outerHeight - window.innerHeight > threshold;
}

// Detect DevTools by measuring execution delay caused by debugger statement
function detectDevToolsByTiming() {
  const start = performance.now();
  debugger; // Will pause if DevTools is open
  return performance.now() - start > 100; // If delay is significant, DevTools is open
}

// Regularly check if DevTools are open
setInterval(() => {
  if ((detectDevToolsBySize() || detectDevToolsByTiming()) && !devtoolsOpen) {
    devtoolsOpen = true;
    // Overwrite page with warning and reload
    document.body.innerHTML = `
      <div class="devtools-overlay">
        <h1>🚨 DevTools Detected</h1>
        <p>This code is owned by the developer and not licensed for distribution or inspection.</p>
        <p>This page is protected. Reloading...</p>
      </div>
    `;
    setTimeout(() => location.reload(), 1000); // Reload after 1 second
  }
}, 1000); // Run check every second

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
