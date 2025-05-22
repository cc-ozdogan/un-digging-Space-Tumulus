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
    toggleButton.innerHTML = '🖱️';
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
    let isCursorEnabled = localStorage.getItem('cursorEnabled') !== 'false';
    let isPageActive = true;

    // Smooth linear interpolation
    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    // Optimized position update
    function updateCursorPosition() {
        if (!isCursorEnabled || !isPageActive) return;

        currentX = lerp(currentX, targetX, easing);
        currentY = lerp(currentY, targetY, easing);

        customCursor.style.left = `${currentX}px`;
        customCursor.style.top = `${currentY}px`;

        animationFrameId = requestAnimationFrame(updateCursorPosition);
    }

    // Update target position
    function updateTargetPosition(x, y) {
        if (!isCursorEnabled || !isPageActive) return;

        targetX = x;
        targetY = y;

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
        localStorage.setItem('cursorEnabled', isCursorEnabled);

        if (isCursorEnabled) {
            customCursor.style.display = 'block';
            toggleButton.textContent = '🖱️';
            document.body.classList.remove('custom-cursor-disabled');

            if (!animationFrameId && isPageActive) {
                updateCursorPosition();
            }
        } else {
            customCursor.style.display = 'none';
            toggleButton.textContent = '🚫';
            document.body.classList.add('custom-cursor-disabled');

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

    // Function to clean up cursor
    function cleanupCursor() {
        isPageActive = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        document.removeEventListener('mousemove', handleMouseMove, eventOptions);
        document.removeEventListener('touchmove', handleTouchMove, eventOptions);
    }

    // Function to initialize cursor
    function initCursor() {
        if (!isPageActive) {
            isPageActive = true;

            // Reset cursor position to current mouse position
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: window.innerWidth / 2,
                clientY: window.innerHeight / 2
            });
            handleMouseMove(mouseEvent);

            // Reattach event listeners
            document.addEventListener('mousemove', handleMouseMove, eventOptions);
            document.addEventListener('touchmove', handleTouchMove, eventOptions);

            // Force immediate update if cursor is enabled
            if (isCursorEnabled) {
                updateCursorPosition();
            }
        }
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, eventOptions);
    document.addEventListener('touchmove', handleTouchMove, eventOptions);
    toggleButton.addEventListener('click', toggleCursor);

    // Start animation loop if enabled
    if (isCursorEnabled) {
        updateCursorPosition();
    }

    // Enhanced visibility handling
    let visibilityTimeout;
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            cleanupCursor();
            clearTimeout(visibilityTimeout);
        } else {
            // Small delay to ensure page is fully visible
            visibilityTimeout = setTimeout(initCursor, 50);
        }
    });

    // Handle page show (including from cache)
    window.addEventListener('pageshow', function() {
        initCursor();
    });

    // Handle focus events
    window.addEventListener('focus', function() {
        setTimeout(initCursor, 50);
    });

    // Handle beforeunload
    window.addEventListener('beforeunload', function() {
        cleanupCursor();
    });

    // For older browsers
    if (window.attachEvent) {
        window.attachEvent('onunload', cleanupCursor);
        window.attachEvent('onfocus', function() {
            setTimeout(initCursor, 50);
        });
    }

    // Add CSS for smoother transitions
    const style = document.createElement('style');
    style.textContent = `
        #cursor {
            transition: transform 0.05s ease-out;
            will-change: transform;
            pointer-events: none;
            z-index: 99999;
            position: fixed;
        }
    `;
    document.head.appendChild(style);
});
