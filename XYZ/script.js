document.addEventListener('DOMContentLoaded', function() {
    const flashlight = document.getElementById('flashlight');
    const gif2 = document.getElementById('cursor');
    const lightball = document.getElementById('lightball');
    const moving = document.getElementById('moving');
    const ccgif = document.getElementById('ccgif');
    const customCursor = document.getElementById('cursor');
    const centerElements = document.querySelectorAll('#center-torrylin, #center-huly-hill');
    const stackContainerMida = document.querySelector('.stack-container-mida');
    const stackContainerClava = document.querySelector('.stack-container-clava');
    const spans = document.querySelectorAll('.clavamage1');
    const container = document.querySelector('.stack-container-cairn, .stack-container-clava, .stack-container-topbar, .stack-container-topbar-gob, .stack-container-huly, .text-clava');
    const stackContainerTopbar = document.querySelector('.stack-container-topbar, .stack-container-topbar-gob, .stack-container-huly, .text-clava');
    const titleIndex = document.getElementById('title-index');
    
    let clickCount = 0;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const easing = 0.5; // Adjust this value for more or less smoothness

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;

    let throttleTimeout;
     let hoverTimeout;
    const scrollFactor = 4;

    ////lightbox

    ///title

    // Initial fade out after page loads (slow fade over 10 seconds)
      // Initial behavior: Stay for 3s, then fade out over 10s
    setTimeout(() => {
        titleIndex.style.transition = 'opacity 6s ease';
        titleIndex.style.opacity = '0';
    }, 3000); // Wait 3s before starting fade-out

    // Hover handler (only works when opacity is 0)
    titleIndex.addEventListener('mouseenter', function() {
        if (titleIndex.style.opacity === '0') {
            clearTimeout(hoverTimeout); // Cancel any pending fade-outs
            
            // Fade in over 3s, stay for 3s, then fade out over 3s
            titleIndex.style.transition = 'opacity 3s ease';
            titleIndex.style.opacity = '1';
            
            hoverTimeout = setTimeout(() => {
                titleIndex.style.transition = 'opacity 3s ease';
                titleIndex.style.opacity = '0';
            }, 6000); // 3s (visible) + 3s (fade-out delay)
        }
    });

    // Optional: If mouse leaves during fade-out, keep it visible
    titleIndex.addEventListener('mouseleave', function() {
        if (parseFloat(titleIndex.style.opacity) > 0 && parseFloat(titleIndex.style.opacity) < 1) {
            clearTimeout(hoverTimeout);
            titleIndex.style.opacity = '1';
            hoverTimeout = setTimeout(() => {
                titleIndex.style.transition = 'opacity 3s ease';
                titleIndex.style.opacity = '0';
            }, 6000);
        }
    });

    // Smooth cursor movement using requestAnimationFrame
    function updateCursorPosition() {
        currentX = lerp(currentX, targetX, easing);
        currentY = lerp(currentY, targetY, easing);
        customCursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
        requestAnimationFrame(updateCursorPosition);
    }

    // Linear interpolation for smooth movement
    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    // Update target position on mouse move
    document.addEventListener('mousemove', (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
    });

    // Update target position on touch move
    document.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        targetX = touch.clientX;
        targetY = touch.clientY;
    }, { passive: false });

    // Start the cursor update loop
    updateCursorPosition();

    // Make floating elements draggable using jQuery UI
    $(function() {
        $(".drag, .floating2").draggable({
            containment: "document", // Ensure the element can be dragged across the entire document
            scroll: true, // Allow scrolling when dragging
            start: function(event, ui) {
                $(this).css("z-index", 1000); // Ensure the element is on top while dragging
                isDragging = true;
            },
            stop: function(event, ui) {
                $(this).css("z-index", ""); // Reset z-index after dragging
                isDragging = false;
            },
            drag: function(event, ui) {
                // Adjust position based on scroll
                const scrollTop = $(window).scrollTop();
                const scrollLeft = $(window).scrollLeft();
                ui.position.top += scrollTop;
                ui.position.left += scrollLeft;
            },
            cursorAt: { top: 0, left: 0 }, // Ensure the cursor is at the top-left corner of the element
            cancel: "" // Exclude elements with the ID 'flying-object' from being draggable
        });

        // Prevent default behavior on touch devices
        $(".drag").on("touchstart", function(e) {
            e.preventDefault();
        });
    });

    // Function to get random position within the viewport
    function getRandomPosition(element) {
        const width = window.innerWidth - element.offsetWidth;
        const height = window.innerHeight - element.offsetHeight;
        const randomX = Math.floor(Math.random() * width);
        const randomY = Math.floor(Math.random() * height);
        return { x: randomX, y: randomY };
    }

    // Function to move elements to random position
    function moveElements() {
        if (isDragging) return; // Do not move elements if dragging is in progress
        const floatingElements = document.querySelectorAll('.floating');
        floatingElements.forEach(element => {
            const { x, y } = getRandomPosition(element);
            element.style.transition = 'transform 100s linear'; // Slow movement
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    function updateCursorPosition() {
        currentX = lerp(currentX, targetX, easing);
        currentY = lerp(currentY, targetY, easing);
        customCursor.style.left = `${currentX}px`;
        customCursor.style.top = `${currentY}px`;
        requestAnimationFrame(updateCursorPosition);
    }

    // Make the custom cursor follow the mouse pointer with smoothness and delay
    document.addEventListener('mousemove', (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
    });

    // Make the custom cursor follow the touch events with smoothness and delay
    document.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        targetX = touch.clientX;
        targetY = touch.clientY;
    }, { passive: false });

    // Start the cursor update loop
    updateCursorPosition();

    // Make flashlight follow the mouse pointer with smoothness and delay
    document.addEventListener('mousemove', (event) => {
        const mouse_x = event.clientX;
        const mouse_y = event.clientY;

        // Position gif2 exactly at the cursor position
        gif2.style.left = `${mouse_x}px`;
        gif2.style.top = `${mouse_y}px`;
    });

    // Make flashlight follow the touch events with smoothness and delay
    document.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        const mouse_x = touch.clientX;
        const mouse_y = touch.clientY;

        // Position flashlight
        flashlight.style.transform = `translate(calc(${mouse_x}px - 50vw), calc(${mouse_y}px - 50vh))`;

        // Position gif2 exactly at the cursor position
        gif2.style.left = `${mouse_x}px`;
        gif2.style.top = `${mouse_y}px`;
    }, { passive: false });

    // Blue Shape
    let shapes = [
        {
            d: "M103.282 106.887C86.9027 116.343 67.4176 100.107 49.3389 100.107C27.1917 96.2337 11.9448 95.5429 4.14227 82.0286C-3.63497 68.558 3.33273 60.3388 11.746 40.6551C18.3771 26.4301 13.8465 13.7435 30.2844 4.25305C45.8602 -4.73961 60.315 3.47591 75.327 4.25305C93.4767 5.19262 103.334 5.76637 111.484 19.8833C118.599 32.2059 108.865 38.6913 103.282 53.0424C97.1792 68.7303 121.251 96.5123 103.282 106.887Z",
        },
        {
            d: "M76.5 72.9999C60.1205 82.4567 55.0787 103 37 103C14.8528 99.1264 26.8025 82.0143 19 68.4999C11.2227 55.0293 -5.91326 55.6837 2.49998 36C9.1311 21.7749 16.9011 25.4903 33.339 15.9999C48.9148 7.00721 38.488 0.22286 53.5 1C72 4 63.8496 6.38298 72 20.4999C79.1145 32.8226 82.083 28.1488 76.5 42.4999C70.397 58.1878 94.4691 62.6254 76.5 72.9999Z",
        },
    ];

    anime({
        targets: ".stage-1",
        d: [{ value: shapes[0].d }, { value: shapes[1].d }],
        duration: 10000,
        direction: "alternate",
        autoplay: true,
        easing: "linear",
        elasticity: 500,
        loop: true,
    });

    anime({
        targets: "#blob",
        fill: "#36454F",
        duration: 15000,
        rotate: 360,
        autoplay: true,
        easing: "linear",
        loop: true,
    });

    anime({
        targets: "#T1",
        duration: 15000,
        fill: "#EAE1C7",
        rotate: 360,
        autoplay: true,
        easing: "linear",
        loop: true,
    });

    anime({
        targets: "#T2",
        duration: 15000,
        rotate: -360,
        autoplay: true,
        easing: "easeInOutQuart",
        loop: true,
    });

    anime({
        targets: "#T3",
        duration: 15000,
        fill: "#301934",
        rotate: 360,
        autoplay: true,
        easing: "linear",
        loop: true,
    });

    anime({
        targets: "#T4",
        duration: 15000,
        fill: "#301934",
        rotate: -360,
        autoplay: true,
        easing: "linear",
        loop: true,
    });

    anime({
        targets: "#T5",
        duration: 15000,
        fill: "#301934",
        rotate: -360,
        autoplay: true,
        easing: "linear",
        loop: true,
    });

    anime({
        targets: "#T6",
        duration: 30000,
        fill: "#301934",
        rotate: 360,
        autoplay: true,
        easing: "linear",
        loop: true,
    });

    // Function to update z-index
    function updateZIndex(value) {
        $(".drag, .floating").each(function() {
            $(this).css("z-index", value);
        });
        $("#zIndexValue").text(value);
    }

    // Initialize z-index slider
    $("#zIndexSlider").on("input", function() {
        const value = $(this).val();
        updateZIndex(value);
    });

    // Initial move to start all floating elements at the same time
    moveElements();

    // Move elements to random positions every 30 seconds
    setInterval(moveElements, 30000);

    // Save cursor position before unloading the page
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('cursorPosition', JSON.stringify({ x: targetX, y: targetY }));
    });

    // Retrieve and apply cursor position on page load
    const savedPosition = JSON.parse(localStorage.getItem('cursorPosition'));
    if (savedPosition) {
        targetX = savedPosition.x;
        targetY = savedPosition.y;
        currentX = targetX;
        currentY = targetY;
        customCursor.style.left = `${currentX}px`;
        customCursor.style.top = `${currentY}px`;
    }

    // Initial z-index value
    updateZIndex($("#zIndexSlider").val());

    // Function to update text color based on background
    function updateTextColor() {
        const backgroundColor = document.body.style.backgroundColor;
        const backgroundImage = document.body.style.backgroundImage;
        const textElements = document.querySelectorAll('#text-torrylin p, #text-torrylin h1, #text-torrylin h2, #text-torrylin h3, #text-torrylin h4, #text-torrylin h5, #text-torrylin h6, #text-torrylin a, #text-torrylin span, #text-torrylin div');

        textElements.forEach(element => {
            if (backgroundColor === 'rgb(249, 246, 238)' && !backgroundImage) {
                element.style.color = 'black'; // Original text color
            } else {
                element.style.color = '#FFFFF0'; // Change text color to white
            }
        });
    }

    // Add event listener for double-click on images
    document.querySelectorAll('.stack img, .roll img').forEach(img => {
        img.addEventListener('dblclick', function(event) {
            if (!isDragging) {
                const currentBackground = document.body.style.backgroundImage;
                const newBackground = `url(${this.src})`;

                // Normalize the background image URL for comparison
                const normalizedCurrentBackground = currentBackground ? currentBackground.replace(/url\(['"]?(.*?)['"]?\)/, '$1') : '';
                const normalizedNewBackground = newBackground.replace(/url\(['"]?(.*?)['"]?\)/, '$1');

                // Check if the image is vertical
                const isVertical = this.naturalHeight > this.naturalWidth;

                if (normalizedCurrentBackground === normalizedNewBackground) {
                    document.body.style.backgroundImage = '';
                    document.body.style.backgroundColor = '#F9F6EE'; // Revert to original background color
                    document.body.style.backgroundRepeat = ''; // Reset background repeat
                    document.body.style.backgroundSize = isVertical ? '25%' : '35%'; // Reset background size

                } else {
                    document.body.style.backgroundImage = newBackground;
                    document.body.style.backgroundSize = isVertical ? '25%' : '35%'; // Set background size
                    document.body.style.backgroundPosition = 'center';
                    document.body.style.backgroundRepeat = 'no-repeat'; // Ensure no repeat

                }
                updateTextColor(); // Update text color based on background
            }
        });
    });

    // Add event listener for click on .roll .dragon images
    document.querySelectorAll('.roll .dragon').forEach(img => {
        img.addEventListener('click', function(event) {
            if (!isDragging) {
                const currentBackground = document.body.style.backgroundImage;
                const newBackground = `url(${this.src})`;

                // Normalize the background image URL for comparison
                const normalizedCurrentBackground = currentBackground ? currentBackground.replace(/url\(['"]?(.*?)['"]?\)/, '$1') : '';
                const normalizedNewBackground = newBackground.replace(/url\(['"]?(.*?)['"]?\)/, '$1');

                // Check if the image is vertical
                const isVertical = this.naturalHeight > this.naturalWidth;

                if (normalizedCurrentBackground === normalizedNewBackground) {
                    document.body.style.backgroundImage = '';
                    document.body.style.backgroundColor = '#F9F6EE'; // Revert to original background color
                    document.body.style.backgroundRepeat = ''; // Reset background repeat
                    document.body.style.backgroundSize = isVertical ? '25%' : '35%'; // Reset background size

                } else {
                    document.body.style.backgroundImage = newBackground;
                    document.body.style.backgroundSize = isVertical ? '25%' : '35%'; // Set background size
                    document.body.style.backgroundPosition = 'center';
                    document.body.style.backgroundRepeat = 'no-repeat'; // Ensure no repeat

                }
                updateTextColor(); // Update text color based on background
            }
        });
    });

    // Add event listener for double-click on #center elements
    centerElements.forEach(element => {
        element.addEventListener('dblclick', function() {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '#F9F6EE'; // Revert to original background color
            document.body.style.backgroundRepeat = ''; // Reset background repeat
            document.body.classList.remove('grayscale'); // Remove grayscale effect
            updateTextColor(); // Update text color based on background
        });
    });

    // Add event listener for click on .papy elements
    document.querySelectorAll('.papy').forEach(papy => {
        papy.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default behavior of the link
            if (!isDragging) {
                const img = this.querySelector('img');
                if (img) {
                    const currentBackground = document.body.style.backgroundImage;
                    const newBackground = `url(${img.src})`;

                    // Normalize the background image URL for comparison
                    const normalizedCurrentBackground = currentBackground ? currentBackground.replace(/url\(['"]?(.*?)['"]?\)/, '$1') : '';
                    const normalizedNewBackground = newBackground.replace(/url\(['"]?(.*?)['"]?\)/, '$1');

                    // Check if the image is vertical
                    const isVertical = img.naturalHeight > img.naturalWidth;

                    if (normalizedCurrentBackground === normalizedNewBackground) {
                        document.body.style.backgroundImage = '';
                        document.body.style.backgroundColor = '#F9F6EE'; // Revert to original background color
                        document.body.style.backgroundRepeat = ''; // Reset background repeat
                        document.body.style.backgroundSize = isVertical ? '25%' : '35%'; // Reset background size

                    } else {
                        document.body.style.backgroundImage = newBackground;
                        document.body.style.backgroundSize = isVertical ? '25%' : '35%'; // Set background size
                        document.body.style.backgroundPosition = 'center';
                        document.body.style.backgroundRepeat = 'no-repeat'; // Ensure no repeat

                    }
                    updateTextColor(); // Update text color based on background
                }
            }
        });
    });

    // Dragging to scroll for .stack-container-mida
    if (stackContainerMida) {
        stackContainerMida.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.pageY - stackContainerMida.offsetTop;
            scrollTop = stackContainerMida.scrollTop;
        });

        stackContainerMida.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        stackContainerMida.addEventListener('mouseup', () => {
            isDragging = false;
        });

        stackContainerMida.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const y = e.pageY - stackContainerMida.offsetTop;
            const walk = (y - startY) * 1; // Adjust the multiplier for faster/slower scrolling
            stackContainerMida.scrollTop = scrollTop - walk;
        });

        // Touch events for dragging to scroll for .stack-container-mida
        stackContainerMida.addEventListener('touchstart', (e) => {
            isDragging = true;
            startY = e.touches[0].pageY - stackContainerMida.offsetTop;
            scrollTop = stackContainerMida.scrollTop;
        });

        stackContainerMida.addEventListener('touchend', () => {
            isDragging = false;
        });

        stackContainerMida.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const y = e.touches[0].pageY - stackContainerMida.offsetTop;
            const walk = (y - startY) * 1; // Adjust the multiplier for faster/slower scrolling
            stackContainerMida.scrollTop = scrollTop - walk;
        });
    }

    // Dragging to scroll for .stack-container-clava
    /*if (stackContainerClava) {
        stackContainerClava.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - stackContainerClava.offsetLeft;
            scrollLeft = stackContainerClava.scrollLeft;
        });

        stackContainerClava.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        stackContainerClava.addEventListener('mouseup', () => {
            isDragging = false;
        });

        stackContainerClava.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - stackContainerClava.offsetLeft;
            const walk = (x - startX) * 1; // Adjust the multiplier for faster/slower scrolling
            stackContainerClava.scrollLeft = scrollLeft - walk;
        });

        // Touch events for dragging to scroll for .stack-container-clava
        stackContainerClava.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - stackContainerClava.offsetLeft;
            scrollLeft = stackContainerClava.scrollLeft;
        });

        stackContainerClava.addEventListener('touchend', () => {
            isDragging = false;
        });

        stackContainerClava.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.touches[0].pageX - stackContainerClava.offsetLeft;
            const walk = (x - startX) * 1; // Adjust the multiplier for faster/slower scrolling
            stackContainerClava.scrollLeft = scrollLeft - walk;
        });
    }*/

    //// scroll

    container.addEventListener('wheel', (event) => {
        if (throttleTimeout) return;
        throttleTimeout = setTimeout(() => {
            throttleTimeout = null;
        }, 100);

        if (event.deltaY !== 0) {
            event.preventDefault();
            container.scrollLeft += event.deltaY * scrollFactor;
        }
    });

    // Prevent vertical scroll when horizontally scrolling inside .stack-container-topbar
    if (stackContainerTopbar) {
        let isMouseOverTopbar = false;

        // Ensure vertical scrolling is enabled by default
        document.body.style.overflowY = 'auto';

        // Detect when the mouse enters the .stack-container-topbar
        stackContainerTopbar.addEventListener('mouseenter', () => {
            isMouseOverTopbar = true;
            document.body.style.overflowY = 'hidden'; // Disable vertical scroll on body
        });

        // Detect when the mouse leaves the .stack-container-topbar
        stackContainerTopbar.addEventListener('mouseleave', () => {
            isMouseOverTopbar = false;
            document.body.style.overflowY = 'auto'; // Re-enable vertical scroll on body
        });

        // Ensure vertical scrolling is re-enabled if the mouse leaves without entering
        document.addEventListener('mousemove', (event) => {
            if (!isMouseOverTopbar && !stackContainerTopbar.contains(event.target)) {
                document.body.style.overflowY = 'auto'; // Re-enable vertical scroll on body
            }
        });

         function updateCursorPosition() {
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        currentX = lerp(currentX, targetX + scrollX, easing);
        currentY = lerp(currentY, targetY + scrollY, easing);

        customCursor.style.left = `${currentX}px`;
        customCursor.style.top = `${currentY}px`;
        requestAnimationFrame(updateCursorPosition);
    }

    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    // Update target position on mouse move
    document.addEventListener('mousemove', (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
    });

    // Update target position on touch move
    document.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        targetX = touch.clientX;
        targetY = touch.clientY;
    }, { passive: false });

    // Start the cursor update loop
    updateCursorPosition();

    // Adjust cursor position on scroll
    document.addEventListener('scroll', () => {
        // No need to manually adjust here since updateCursorPosition already accounts for scroll
    });
    }


});
