// Smoothly fade out the loader once the page is fully loaded
window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0'; // Start fading the loader
    setTimeout(() => {
        loader.style.display = 'none'; // Completely hide it after 0.5s
    }, 500); // 500ms = fade-out duration
});

// FinisherHeader Particle Background Animation
"use strict";

(function (t) {
    // 🔺 Calculate height of a triangle from angle and base width (used for skewing the canvas)
    function calculateTriangleHeight(angle, base) {
        var radians = 0.017453 * Math.abs(angle); // Convert degrees to radians
        var slope = Math.tan(radians);            // Calculate slope (rise over run)
        return Math.ceil(base * slope);           // Return height using trigonometry
    }

    // Convert HEX color string to RGB object
    function parseColor(hex) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {   // Validate hex format
            c = hex.substring(1).split("");           // Remove '#' and split into characters
            if (c.length === 3) {                     // Expand shorthand format to full
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = "0x" + c.join("");                    // Convert to hex number
            return { r: (c >> 16) & 255, g: (c >> 8) & 255, b: 255 & c }; // Extract RGB values
        }
        return { r: 0, g: 0, b: 0 }; // Return black as fallback
    }

    // Particle Constructor
    var Particle = function (color, posIndex, o) {
        this.o = o;                       // Store options
        //this.r = parseColor(color);    // Convert color to RGB (commented out)
        this.d = this.randomDirection(); // Initial direction for pulsing (+1 or -1)
        //this.h = this.randomShape();   // Random shape type: c (circle), s (square), t (triangle) (commented out)
        this.s = Math.abs(this.randomFromRange(this.o.size)); // Set size within range
        this.setPosition(posIndex);      // Place particle in specific quadrant
        this.vx = this.randomFromRange(this.o.speed.x) * this.randomDirection(); // Horizontal velocity
        this.vy = this.randomFromRange(this.o.speed.y) * this.randomDirection(); // Vertical velocity
    };

    // Particle prototype (methods)
    Particle.prototype = {
        // Set initial position based on one of four screen quadrants
        setPosition: function (posIndex) {
            var pos = this.randomPosition();
            var hw = pos.halfWidth, hh = pos.halfHeight;
            if (posIndex == 3) { this.x = pos.x + hw; this.y = pos.y; }
            else if (posIndex == 2) { this.x = pos.x; this.y = pos.y + hh; }
            else if (posIndex == 1) { this.x = pos.x + hw; this.y = pos.y + hh; }
            else { this.x = pos.x; this.y = pos.y; }
        },

        // Generate a random position within top-left quadrant
        randomPosition: function () {
            var hw = this.o.c.w / 2, hh = this.o.c.h / 2;
            return { x: Math.random() * hw, y: Math.random() * hh, halfWidth: hw, halfHeight: hh };
        },

        // Generate random float in given range
        randomFromRange: function (range) {
            if (range.min === range.max) return range.min;
            return Math.random() * (range.max - range.min) + range.min;
        },

        // Return 1 or -1 randomly to determine direction
        randomDirection: function () { return Math.random() > 0.5 ? 1 : -1; },

        // Pick a random shape (currently unused)
        randomShape: function () {
            var s = this.o.shapes;
            return s[Math.floor(Math.random() * s.length)];
        },

        // Return RGBA string from RGB object and opacity value
        getRGBA: function (color, alpha) {
            return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        },

        // Animate a single particle and draw it to canvas
        animate: function (ctx, width, height) {
            // Handle pulsing animation for size
            if (this.o.size.pulse) {
                this.s += this.o.size.pulse * this.d;
                if (this.s > this.o.size.max || this.s < this.o.size.min) this.d *= -1;
                this.s = Math.abs(this.s);
            }

            // Update position
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off canvas edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            ctx.beginPath(); // Start drawing path

            // Set blending mode if enabled
            if (this.o.blending && this.o.blending !== "none") {
                ctx.globalCompositeOperation = this.o.blending;
            }

            // Create radial gradient for glowing effect
            var centerColor = this.getRGBA(this.r, this.o.opacity.center);
            var edgeColor = this.getRGBA(this.r, this.o.opacity.edge);
            var radius = { c: this.s / 2, t: 0.577 * this.s, s: 0.707 * this.s }[this.h] || this.s;
            var gradient = ctx.createRadialGradient(this.x, this.y, 0.01, this.x, this.y, radius);
            gradient.addColorStop(0, centerColor);
            gradient.addColorStop(1, edgeColor);
            ctx.fillStyle = gradient;

            // Draw the appropriate shape
            var halfSize = this.s / 2;
            if (this.h === "c") {
                ctx.arc(this.x, this.y, halfSize, 0, 2 * Math.PI); // Circle
            } else if (this.h === "s") {
                ctx.moveTo(this.x - halfSize, this.y - halfSize);
                ctx.lineTo(this.x + halfSize, this.y - halfSize);
                ctx.lineTo(this.x + halfSize, this.y + halfSize);
                ctx.lineTo(this.x - halfSize, this.y + halfSize); // Square
            } else if (this.h === "t") {
                var heightTriangle = calculateTriangleHeight(30, halfSize);
                ctx.moveTo(this.x - halfSize, this.y + heightTriangle);
                ctx.lineTo(this.x + halfSize, this.y + heightTriangle);
                ctx.lineTo(this.x, this.y - 2 * heightTriangle); // Triangle
            }

            ctx.closePath();
            ctx.fill(); // Apply gradient fill
        }
    };

    // FinisherHeader class constructor
    var FinisherHeader = function (options) {
        this.c = document.createElement("canvas"); // Create canvas element
        this.x = this.c.getContext("2d");          // Get 2D drawing context
        this.c.setAttribute("id", "finisher-canvas"); // Set ID for styling

        // Append canvas to the specified container element
        this.getElement(options.className).appendChild(this.c);

        // Add resize handler with debounce
        var resizeTimeout;
        t.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(this.resize.bind(this), 150); // Wait before resizing
        }, false);

        this.init(options); // Initialize with given options
        t.requestAnimationFrame(this.animate.bind(this)); // Start animation loop
    };

    FinisherHeader.prototype = {
        // Get container DOM element by class name
        getElement: function (className) {
            var elements = document.getElementsByClassName(className || "finisher-header");
            if (!elements.length) throw new Error("No .finisher-header element found");
            return elements[0];
        },

        // Resize canvas to match parent dimensions and apply skew transform
        resize: function () {
            var el = this.getElement(this.o.className);
            this.o.c = { w: el.clientWidth, h: el.clientHeight }; // Save width/height
            this.c.width = this.o.c.w;
            this.c.height = this.o.c.h;

            var skewOffset = calculateTriangleHeight(this.o.skew, this.o.c.w / 2);
            var transformStyle = `skewY(${this.o.skew}deg) translateY(-${skewOffset}px)`;

            // Apply styles and transform to canvas
            this.c.style.cssText = `
                position:absolute;z-index:-1;top:0;left:0;right:0;bottom:0;
                -webkit-transform:${transformStyle};transform:${transformStyle};
                outline:1px solid transparent;
                background-color:rgba(${this.bc.r},${this.bc.g},${this.bc.b},1);
            `;
        },

        // Initialize all options, canvas, and particles
        init: function (options) {
            this.o = options;
            this.bc = parseColor(this.o.colors.background); // Set background color
            this.ps = []; // Clear particle array
            this.resize(); // Fit canvas to container
            this.createParticles(); // Generate particles
        },

        // Generate multiple particles with alternating quadrant placement
        createParticles: function () {
            var i = 0;
            this.ps = [];
            this.o.ac = t.innerWidth < 600 && this.o.count > 5 ? Math.round(this.o.count / 2) : this.o.count;
            for (var s = 0; s < this.o.ac; s++) {
                var p = new Particle(this.o.colors.particles[i], s % 4, this.o);
                if (++i >= this.o.colors.particles.length) i = 0;
                this.ps[s] = p;
            }
        },

        // Main animation loop: clear canvas and redraw all particles
        animate: function () {
            t.requestAnimationFrame(this.animate.bind(this)); // Schedule next frame
            this.x.clearRect(0, 0, this.o.c.w, this.o.c.h); // Clear canvas
            for (var i = 0; i < this.o.ac; i++) {
                this.ps[i].animate(this.x, this.o.c.w, this.o.c.h); // Animate particle
            }
        }
    };

    // Expose FinisherHeader globally
    t.FinisherHeader = FinisherHeader;
})(window);


// Web-like Particle Network using particles.js
particlesJS("particles-js", {
    particles: {
        number: {
            value: 80,                         // Number of particles
            density: { enable: true, value_area: 800 } // Enable spatial density
        },
        color: { value: "#00ffff" },          // Particle color: neon cyan
        shape: {
            type: "circle",                   // Shape type
            stroke: { width: 0, color: "#000000" } // Stroke (none)
        },
        opacity: {
            value: 0.8,                       // Opacity of each particle
            random: false                     // Uniform opacity
        },
        size: {
            value: 3,                         // Base size
            random: true                      // Randomize individual sizes
        },
        line_linked: {
            enable: true,                     // Enable connecting lines
            distance: 150,                    // Max distance for link
            color: "#00ffff",                 // Line color
            opacity: 0.4,                     // Line opacity
            width: 1                          // Line width
        },
        move: {
            enable: true,                     // Allow movement
            speed: 0.6,                       // Particle speed
            direction: "none",                // Random movement
            random: false,
            straight: false,
            out_mode: "out",                  // Exit screen when out of bounds
            bounce: false                     // No bouncing
        }
    },
    interactivity: {
        detect_on: "window",                  // Track interactivity on full window
        events: {
            onhover: { enable: true, mode: "grab" },   // Attract lines on hover
            onclick: { enable: false, mode: "push" },  // No action on click
            resize: true                               // Recalculate on resize
        },
        modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } }, // Grab effect config
            push: { particles_nb: 4 }                             // Push config (disabled)
        }
    },
    retina_detect: true // Support high-DPI screens
});
