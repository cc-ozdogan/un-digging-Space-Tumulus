 document.addEventListener('DOMContentLoaded', function() {
 const titleIndex = document.getElementById('title-index');
 let hoverTimeout;

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
});