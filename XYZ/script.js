document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const flashlight = document.getElementById('flashlight');
    const lightball = document.getElementById('lightball');
    const moving = document.getElementById('moving');
    const ccgif = document.getElementById('ccgif');
    const centerElements = document.querySelectorAll('#center-torrylin, #center-huly-hill');
    const stackContainerMida = document.querySelector('.stack-container-mida');
    const stackContainerClava = document.querySelector('.stack-container-clava');
    const spans = document.querySelectorAll('.clavamage1');
    const container = document.querySelector('.stack-container-cairn, .stack-container-clava, .stack-container-topbar, .stack-container-topbar-gob, .stack-container-huly, .text-clava');
    const stackContainerTopbar = document.querySelector('.stack-container-topbar, .stack-container-topbar-gob, .stack-container-huly, .text-clava');

    // State Variables
    let clickCount = 0;
    let isDragging = false;
    let startX = 0, startY = 0;
    let scrollLeft = 0, scrollTop = 0;
    let throttleTimeout;
    const scrollFactor = 4;

    // Event Listeners for flashlight (keeping only what's needed)
    document.addEventListener('mousemove', (event) => {
        flashlight.style.transform = `translate(calc(${event.clientX}px - 50vw), calc(${event.clientY}px - 50vh))`;
    });

    document.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        flashlight.style.transform = `translate(calc(${touch.clientX}px - 50vw), calc(${touch.clientY}px - 50vh))`;
    }, { passive: false });

    // Draggable Elements
    $(function() {
        $(".drag, .floating2").draggable({
            containment: "document",
            scroll: true,
            start: function() {
                $(this).css("z-index", 1000);
                isDragging = true;
            },
            stop: function() {
                $(this).css("z-index", "");
                isDragging = false;
            },
            drag: function(event, ui) {
                const scrollTop = $(window).scrollTop();
                const scrollLeft = $(window).scrollLeft();
                ui.position.top += scrollTop;
                ui.position.left += scrollLeft;
            },
            cursorAt: { top: 0, left: 0 },
            cancel: ""
        });

        $(".drag").on("touchstart", function(e) {
            e.preventDefault();
        });
    });

    // Floating Elements
    function getRandomPosition(element) {
        const width = window.innerWidth - element.offsetWidth;
        const height = window.innerHeight - element.offsetHeight;
        return {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        };
    }

    function moveElements() {
        if (isDragging) return;
        const floatingElements = document.querySelectorAll('.floating');
        floatingElements.forEach(element => {
            const { x, y } = getRandomPosition(element);
            element.style.transition = 'transform 100s linear';
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Anime.js Animations
    const shapes = [
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

    anime({ targets: "#blob", fill: "#36454F", duration: 15000, rotate: 360, easing: "linear", loop: true });
    anime({ targets: "#T1", duration: 15000, fill: "#EAE1C7", rotate: 360, easing: "linear", loop: true });
    anime({ targets: "#T2", duration: 15000, rotate: -360, easing: "easeInOutQuart", loop: true });
    anime({ targets: "#T3", duration: 15000, fill: "#301934", rotate: 360, easing: "linear", loop: true });
    anime({ targets: "#T4", duration: 15000, fill: "#301934", rotate: -360, easing: "linear", loop: true });
    anime({ targets: "#T5", duration: 15000, fill: "#301934", rotate: -360, easing: "linear", loop: true });
    anime({ targets: "#T6", duration: 30000, fill: "#301934", rotate: 360, easing: "linear", loop: true });

    // Z-Index Control
    function updateZIndex(value) {
        $(".drag, .floating").each(function() {
            $(this).css("z-index", value);
        });
        $("#zIndexValue").text(value);
    }

    $("#zIndexSlider").on("input", function() {
        const value = $(this).val();
        updateZIndex(value);
    });

    // Background and Text Color Functions
    function updateTextColor() {
        const backgroundColor = document.body.style.backgroundColor;
        const backgroundImage = document.body.style.backgroundImage;
        const textElements = document.querySelectorAll('#text-torrylin p, #text-torrylin h1, #text-torrylin h2, #text-torrylin h3, #text-torrylin h4, #text-torrylin h5, #text-torrylin h6, #text-torrylin a, #text-torrylin span, #text-torrylin div');

        textElements.forEach(element => {
            if (backgroundColor === 'rgb(249, 246, 238)' && !backgroundImage) {
                element.style.color = 'black';
            } else {
                element.style.color = '#FFFFF0';
            }
        });
    }

    function toggleBackground(img) {
        const currentBackground = document.body.style.backgroundImage;
        const newBackground = `url(${img.src})`;
        const isVertical = img.naturalHeight > img.naturalWidth;
        const normalizedCurrent = currentBackground?.replace(/url\(['"]?(.*?)['"]?\)/, '$1') || '';
        const normalizedNew = newBackground.replace(/url\(['"]?(.*?)['"]?\)/, '$1');

        if (normalizedCurrent === normalizedNew) {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '#F9F6EE';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundSize = isVertical ? '25%' : '35%';
        } else {
            document.body.style.backgroundImage = newBackground;
            document.body.style.backgroundSize = isVertical ? '25%' : '35%';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        }
        updateTextColor();
    }

    // Event Listeners for Background Changes
    document.querySelectorAll('.stack img, .roll img').forEach(img => {
        img.addEventListener('dblclick', function() {
            if (!isDragging) toggleBackground(this);
        });
    });

    document.querySelectorAll('.roll .dragon').forEach(img => {
        img.addEventListener('click', function() {
            if (!isDragging) toggleBackground(this);
        });
    });

    centerElements.forEach(element => {
        element.addEventListener('dblclick', function() {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '#F9F6EE';
            document.body.style.backgroundRepeat = '';
            document.body.classList.remove('grayscale');
            updateTextColor();
        });
    });

    document.querySelectorAll('.papy').forEach(papy => {
        papy.addEventListener('click', function(event) {
            event.preventDefault();
            if (!isDragging) {
                const img = this.querySelector('img');
                if (img) toggleBackground(img);
            }
        });
    });

    // Dragging to Scroll for Stack Containers
    if (stackContainerMida) {
        stackContainerMida.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.pageY - stackContainerMida.offsetTop;
            scrollTop = stackContainerMida.scrollTop;
        });

        stackContainerMida.addEventListener('mouseleave', () => { isDragging = false; });
        stackContainerMida.addEventListener('mouseup', () => { isDragging = false; });

        stackContainerMida.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const y = e.pageY - stackContainerMida.offsetTop;
            const walk = (y - startY);
            stackContainerMida.scrollTop = scrollTop - walk;
        });

        stackContainerMida.addEventListener('touchstart', (e) => {
            isDragging = true;
            startY = e.touches[0].pageY - stackContainerMida.offsetTop;
            scrollTop = stackContainerMida.scrollTop;
        });

        stackContainerMida.addEventListener('touchend', () => { isDragging = false; });

        stackContainerMida.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const y = e.touches[0].pageY - stackContainerMida.offsetTop;
            const walk = (y - startY);
            stackContainerMida.scrollTop = scrollTop - walk;
        });
    }

    // Horizontal Scrolling
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

    // Vertical Scroll Control
    if (stackContainerTopbar) {
        let isMouseOverTopbar = false;
        document.body.style.overflowY = 'auto';

        stackContainerTopbar.addEventListener('mouseenter', () => {
            isMouseOverTopbar = true;
            document.body.style.overflowY = 'hidden';
        });

        stackContainerTopbar.addEventListener('mouseleave', () => {
            isMouseOverTopbar = false;
            document.body.style.overflowY = 'auto';
        });

        document.addEventListener('mousemove', (event) => {
            if (!isMouseOverTopbar && !stackContainerTopbar.contains(event.target)) {
                document.body.style.overflowY = 'auto';
            }
        });
    }

    // Initialize Functions
    moveElements();
    setInterval(moveElements, 30000);
    updateZIndex($("#zIndexSlider").val());
});
