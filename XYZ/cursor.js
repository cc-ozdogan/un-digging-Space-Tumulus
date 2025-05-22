document.addEventListener('DOMContentLoaded', function() {
    // Feature detection for requestAnimationFrame and cancelAnimationFrame
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
            return window.webkitRequestAnimationFrame ||
                   window.mozRequestAnimationFrame ||
                   window.oRequestAnimationFrame ||
                   window.msRequestAnimationFrame ||
                   function(callback) {
                       window.setTimeout(callback, 1000 / 60);
                   };
        })();
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = (function() {
            return window.webkitCancelAnimationFrame ||
                   window.mozCancelAnimationFrame ||
                   window.oCancelAnimationFrame ||
                   window.msCancelAnimationFrame ||
                   function(id) {
                       window.clearTimeout(id);
                   };
        })();
    }

    // Check if the elements exist before proceeding
    const customCursor = document.getElementById('cursor');
    const flashlight = document.getElementById('flashlight');

    if (!customCursor) {
        console.error('Custom cursor element not found');
        return;
    }

    // Create toggle button with just the mouse icon
    const toggleButton = document.createElement('button');
    toggleButton.id = 'cursor-toggle';
    toggleButton.className = 'cursor-toggle-btn';
    toggleButton.innerHTML = '🖱️'; // Just the mouse icon
    document.body.appendChild(toggleButton);

    // Load the CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './XYZ/style.css';
    document.head.appendChild(link);

    // Initialize positions
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const easing = 0.15;
    let animationFrameId = null;
    let isCursorEnabled = localStorage.getItem('cursorEnabled') !== 'false'; // Load from localStorage

    // Apply initial state
    if (!isCursorEnabled) {
        customCursor.style.display = 'none';
        toggleButton.textContent = '🚫'; // Prohibited icon
        document.body.classList.add('custom-cursor-disabled');
    }

    // Smooth linear interpolation
    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    // Optimized position update
    function updateCursorPosition() {
        if (!isCursorEnabled) return;

        currentX = lerp(currentX, targetX, easing);
        currentY = lerp(currentY, targetY, easing);

        // Use your original positioning method to prevent offset
        customCursor.style.left = `${currentX}px`;
        customCursor.style.top = `${currentY}px`;

        animationFrameId = requestAnimationFrame(updateCursorPosition);
    }

    // Update target position
    function updateTargetPosition(x, y) {
        if (!isCursorEnabled) return;

        targetX = x;
        targetY = y;

        // Use your original positioning method to prevent offset
        customCursor.style.left = `${x}px`;
        customCursor.style.top = `${y}px`;

        if (flashlight) {
            flashlight.style.transform = `translate(calc(${x}px - 50vw), calc(${y}px - 50vh))`;
        }
    }

    // Event handlers
    function handleMouseMove(e) {
        updateTargetPosition(e.clientX, e.clientY);
    }

    function handleTouchMove(e) {
        const touch = e.touches[0];
        updateTargetPosition(touch.clientX, touch.clientY);
    }

    // Toggle cursor visibility
    function toggleCursor() {
        isCursorEnabled = !isCursorEnabled;

        // Save state to localStorage
        localStorage.setItem('cursorEnabled', isCursorEnabled);

        if (isCursorEnabled) {
            // Enable cursor
            customCursor.style.display = 'block';
            toggleButton.textContent = '🖱️'; // Mouse icon
            document.body.classList.remove('custom-cursor-disabled');

            // Restart animation if needed
            if (!animationFrameId) {
                updateCursorPosition();
            }
        } else {
            // Disable cursor
            customCursor.style.display = 'none';
            toggleButton.textContent = '🚫'; // Prohibited icon
            document.body.classList.add('custom-cursor-disabled');

            // Cancel animation frame
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
    }

    // Add event listeners with passive event listener support check
    const passiveSupported = (function() {
        let passiveSupported = false;
        try {
            const options = Object.defineProperty({}, 'passive', {
                get: function() {
                    passiveSupported = true;
                }
            });
            window.addEventListener('test', null, options);
        } catch (err) {}
        return passiveSupported;
    })();

    const eventOptions = passiveSupported ? { passive: true } : false;

    // Function to clean up event listeners and animation
    function cleanupCursor() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        document.removeEventListener('mousemove', handleMouseMove, eventOptions);
        document.removeEventListener('touchmove', handleTouchMove, eventOptions);
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, eventOptions);
    document.addEventListener('touchmove', handleTouchMove, eventOptions);
    toggleButton.addEventListener('click', toggleCursor);

    // Start animation loop
    if (isCursorEnabled) {
        updateCursorPosition();
    }

    // Clean up on page unload or navigation
    window.addEventListener('beforeunload', cleanupCursor);
    window.addEventListener('pagehide', cleanupCursor);

    // Handle visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            cleanupCursor();
        } else if (isCursorEnabled) {
            updateCursorPosition();
        }
    });

    // Handle potential memory leaks in older IE
    if (window.attachEvent) {
        window.attachEvent('onunload', cleanupCursor);
    }

    // Reinitialize cursor when coming back to the page
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) { // Page was loaded from cache
            if (isCursorEnabled) {
                // Reattach event listeners
                document.addEventListener('mousemove', handleMouseMove, eventOptions);
                document.addEventListener('touchmove', handleTouchMove, eventOptions);
                updateCursorPosition();
            }
        }
    });
});
