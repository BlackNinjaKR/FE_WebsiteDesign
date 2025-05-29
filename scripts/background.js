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
        var radians = 0.017453 * Math.abs(angle); // Convert angle to radians
        var slope = Math.tan(radians);
        return Math.ceil(base * slope); // Height = base * tan(angle)
    }

    // Convert HEX color string to RGB object
    function parseColor(hex) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split("");
            if (c.length === 3) { c = [c[0], c[0], c[1], c[1], c[2], c[2]]; }
            c = "0x" + c.join(""); // Parse to number
            return { r: (c >> 16) & 255, g: (c >> 8) & 255, b: 255 & c };
        }
        return { r: 0, g: 0, b: 0 }; // Fallback to black
    }

    // Particle Constructor
    var Particle = function (color, posIndex, o) {
        this.o = o;                       // Options object
        //this.r = parseColor(color);      // RGB color
        this.d = this.randomDirection(); // Direction multiplier for pulsing
        //this.h = this.randomShape();     // Shape type: c, s, t
        this.s = Math.abs(this.randomFromRange(this.o.size)); // Size
        this.setPosition(posIndex);      // Initial position
        this.vx = this.randomFromRange(this.o.speed.x) * this.randomDirection(); // X velocity
        this.vy = this.randomFromRange(this.o.speed.y) * this.randomDirection(); // Y velocity
    };

    // Particle Methods
    Particle.prototype = {
        // Set initial position based on quadrant (0–3)
        setPosition: function (posIndex) {
            var pos = this.randomPosition();
            var hw = pos.halfWidth, hh = pos.halfHeight;
            if (posIndex == 3) { this.x = pos.x + hw; this.y = pos.y; }
            else if (posIndex == 2) { this.x = pos.x; this.y = pos.y + hh; }
            else if (posIndex == 1) { this.x = pos.x + hw; this.y = pos.y + hh; }
            else { this.x = pos.x; this.y = pos.y; }
        },

        // Generate a random position in the top-left quadrant
        randomPosition: function () {
            var hw = this.o.c.w / 2, hh = this.o.c.h / 2;
            return { x: Math.random() * hw, y: Math.random() * hh, halfWidth: hw, halfHeight: hh };
        },

        // Get random value within a range
        randomFromRange: function (range) {
            if (range.min === range.max) return range.min;
            return Math.random() * (range.max - range.min) + range.min;
        },

        // Randomly return 1 or -1 (used for direction)
        randomDirection: function () { return Math.random() > 0.5 ? 1 : -1; },

        // Pick a random shape from the shape list
        randomShape: function () {
            var s = this.o.shapes;
            return s[Math.floor(Math.random() * s.length)];
        },

        // Convert RGB color to RGBA with opacity
        getRGBA: function (color, alpha) {
            return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        },

        // Animate and draw the particle
        animate: function (ctx, width, height) {
            // Handle size pulsing if enabled
            if (this.o.size.pulse) {
                this.s += this.o.size.pulse * this.d;
                if (this.s > this.o.size.max || this.s < this.o.size.min) this.d *= -1;
                this.s = Math.abs(this.s);
            }

            // Move particle
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off canvas edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Start drawing
            ctx.beginPath();

            // Optional blending mode
            if (this.o.blending && this.o.blending !== "none") {
                ctx.globalCompositeOperation = this.o.blending;
            }

            // Create radial gradient glow
            var centerColor = this.getRGBA(this.r, this.o.opacity.center);
            var edgeColor = this.getRGBA(this.r, this.o.opacity.edge);
            var radius = { c: this.s / 2, t: 0.577 * this.s, s: 0.707 * this.s }[this.h] || this.s;
            var gradient = ctx.createRadialGradient(this.x, this.y, 0.01, this.x, this.y, radius);
            gradient.addColorStop(0, centerColor);
            gradient.addColorStop(1, edgeColor);
            ctx.fillStyle = gradient;

            // Draw shape based on type
            var halfSize = this.s / 2;
            if (this.h === "c") {
                ctx.arc(this.x, this.y, halfSize, 0, 2 * Math.PI);
            } else if (this.h === "s") {
                ctx.moveTo(this.x - halfSize, this.y - halfSize);
                ctx.lineTo(this.x + halfSize, this.y - halfSize);
                ctx.lineTo(this.x + halfSize, this.y + halfSize);
                ctx.lineTo(this.x - halfSize, this.y + halfSize);
            } else if (this.h === "t") {
                var heightTriangle = calculateTriangleHeight(30, halfSize);
                ctx.moveTo(this.x - halfSize, this.y + heightTriangle);
                ctx.lineTo(this.x + halfSize, this.y + heightTriangle);
                ctx.lineTo(this.x, this.y - 2 * heightTriangle);
            }

            ctx.closePath();
            ctx.fill();
        }
    };

    // FinisherHeader class
    var FinisherHeader = function (options) {
        this.c = document.createElement("canvas"); // Create canvas element
        this.x = this.c.getContext("2d");          // 2D context
        this.c.setAttribute("id", "finisher-canvas");

        // Append to container element
        this.getElement(options.className).appendChild(this.c);

        // Handle resizing
        var resizeTimeout;
        t.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(this.resize.bind(this), 150);
        }, false);

        this.init(options); // Initialize options
        t.requestAnimationFrame(this.animate.bind(this)); // Start animation loop
    };

    FinisherHeader.prototype = {
        // Get container element by class name
        getElement: function (className) {
            var elements = document.getElementsByClassName(className || "finisher-header");
            if (!elements.length) throw new Error("No .finisher-header element found");
            return elements[0];
        },

        // Resize canvas to fit container and apply skew transform
        resize: function () {
            var el = this.getElement(this.o.className);
            this.o.c = { w: el.clientWidth, h: el.clientHeight };
            this.c.width = this.o.c.w;
            this.c.height = this.o.c.h;

            var skewOffset = calculateTriangleHeight(this.o.skew, this.o.c.w / 2);
            var transformStyle = `skewY(${this.o.skew}deg) translateY(-${skewOffset}px)`;

            this.c.style.cssText = `
                position:absolute;z-index:-1;top:0;left:0;right:0;bottom:0;
                -webkit-transform:${transformStyle};transform:${transformStyle};
                outline:1px solid transparent;
                background-color:rgba(${this.bc.r},${this.bc.g},${this.bc.b},1);
            `;
        },

        // Setup and initialize particles
        init: function (options) {
            this.o = options;
            this.bc = parseColor(this.o.colors.background);
            this.ps = [];
            this.resize();
            this.createParticles();
        },

        // Create multiple particles based on screen size
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

        // Animation loop
        animate: function () {
            t.requestAnimationFrame(this.animate.bind(this));
            this.x.clearRect(0, 0, this.o.c.w, this.o.c.h);
            for (var i = 0; i < this.o.ac; i++) {
                this.ps[i].animate(this.x, this.o.c.w, this.o.c.h);
            }
        }
    };

    // Register FinisherHeader to global window
    t.FinisherHeader = FinisherHeader;
})(window);


// Web-like Particle Network using particles.js
particlesJS("particles-js", {
    particles: {
        number: {
            value: 80,
            density: { enable: true, value_area: 800 }
        },
        color: { value: "#00ffff" }, // Bright neon cyan
        shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" }
        },
        opacity: {
            value: 0.8,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#00ffff", // Cyan web lines
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "window",
        events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: false, mode: "push" },
            resize: true
        },
        modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});
