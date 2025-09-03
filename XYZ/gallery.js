document.addEventListener('DOMContentLoaded', function() {
    lightGallery(document.querySelector('.slides'), {
        plugins: [lgZoom, lgThumbnail],
        speed: 500,
        selector: 'a'
    });
});