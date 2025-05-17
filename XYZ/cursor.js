document.addEventListener('DOMContentLoaded', function () {
    const customCursor = document.getElementById('cursor');
    const flashlight = document.getElementById('flashlight');

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const easing = 0.15;

    function lerp(start, end, t) {
        return start + (end - start) * t;
    }

    function updateCursorPosition() {
        currentX = lerp(currentX, targetX, easing);
        currentY = lerp(currentY, targetY, easing);

        // No need to subtract offset since CSS centers it
        customCursor.style.left = `${currentX}px`;
        customCursor.style.top = `${currentY}px`;

        requestAnimationFrame(updateCursorPosition);
    }

    function updateTargetPosition(x, y) {
        targetX = x;
        targetY = y;

        // Also instantly update left/top for instant sync
        customCursor.style.left = `${x}px`;
        customCursor.style.top = `${y}px`;

        flashlight.style.transform = `translate(calc(${x}px - 50vw), calc(${y}px - 50vh))`;
    }

    document.addEventListener('mousemove', (e) => {
        updateTargetPosition(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        updateTargetPosition(touch.clientX, touch.clientY);
    }, { passive: true });

    updateCursorPosition();


    
});
