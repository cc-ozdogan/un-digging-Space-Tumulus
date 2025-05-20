document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    const audio = document.getElementById('ambient-sound-02');

    // Set initial volume (optional)
    audio.volume = 0.2; // 20% volume

    // Initialize to "muted" state
    let isPlaying = false;

    // Toggle audio playback
    toggleButton.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().catch(error => {
                console.error("Playback failed:", error);
            });
            // Change image to "playing" version
            toggleButton.innerHTML = '<img src="./IMG/whistles/03.png" alt="Toggle Text">';
            isPlaying = true;
        } else {
            audio.pause();
            // Revert to original image (muted)
            toggleButton.innerHTML = '<img src="./IMG/whistles/03.png" alt="Toggle Text">';
            isPlaying = false;
        }
    });
});
