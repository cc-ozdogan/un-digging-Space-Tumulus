document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    let audio = document.getElementById('ambient-sound-02') || document.getElementById('ambient-sound-03');

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
            isPlaying = true;
        } else {
            audio.pause();
            isPlaying = false;
        }
    });
});
