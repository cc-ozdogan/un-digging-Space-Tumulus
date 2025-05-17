// cursor.js
document.addEventListener('DOMContentLoaded', function() {
    const customCursor = document.getElementById('cursor');
    const flashlight = document.getElementById('flashlight');

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'cursor-toggle';
    toggleButton.className = 'cursor-toggle-btn';
    toggleButton.innerHTML = `
        <span class="toggle-text">Disable Custom Cursor</span>
        <span class="toggle-icon">🖱️</span>
    `;
    document.body.appendChild(toggleButton);

    // Load the CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'cursor-toggle.css';
    document.head.appendChild(link);

    // Initialize positions
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const easing = 0.15;
    let animationFrameId = null;
    let isCursorEnabled = true;

    // Get cursor dimensions
    const cursorRect = customCursor.getBoundingClientRect();
    const cursorWidth = cursorRect.width;
    const cursorHeight = cursorRect.height;

    // Set up cursor styles for optimal performance
    customCursor.style.position = 'fixed';
    customCursor.style.pointerEvents = 'none';
    customCursor.style.willChange = 'transform';
    customCursor.style.transform = 'translate(0, 0)';
    customCursor.style.marginLeft = `-${cursorWidth / 2}px`;
    customCursor.style.marginTop = `-${cursorHeight / 2}px`;

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

        targetX = x - (cursorWidth / 2);
        targetY = y - (cursorHeight / 2);

        // Use your original positioning method to prevent offset
        customCursor.style.left = `${x - (cursorWidth / 2)}px`;
        customCursor.style.top = `${y - (cursorHeight / 2)}px`;

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

        if (isCursorEnabled) {
            // Enable cursor
            customCursor.style.display = 'block';
            toggleButton.classList.remove('disabled');
            toggleButton.querySelector('.toggle-text').textContent = 'Disable Custom Cursor';
            toggleButton.querySelector('.toggle-icon').textContent = '🖱️';
            document.body.classList.remove('custom-cursor-disabled');

            // Restart animation if needed
            if (!animationFrameId) {
                updateCursorPosition();
            }
        } else {
            // Disable cursor
            customCursor.style.display = 'none';
            toggleButton.classList.add('disabled');
            toggleButton.querySelector('.toggle-text').textContent = 'Enable Custom Cursor';
            toggleButton.querySelector('.toggle-icon').textContent = '🚫';
            document.body.classList.add('custom-cursor-disabled');

            // Cancel animation frame
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    toggleButton.addEventListener('click', toggleCursor);

    // Start animation loop
    updateCursorPosition();

    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        } else if (isCursorEnabled) {
            updateCursorPosition();
        }
    });
});
