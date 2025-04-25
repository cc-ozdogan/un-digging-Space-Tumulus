document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('ambient-sound');
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon'); // Now an <img> element

    // Set initial volume (optional)
    audio.volume = 0.2; // 20% volume

    // Initialize to "muted" state (optional: change image if you have a muted version)
    let isMuted = true;

    // Toggle play/pause ONLY on button click
    soundToggle.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().catch(error => {
                console.error("Playback failed:", error);
            });
            // Optional: Change image to "unmuted" version if available
            soundIcon.src = "./IMG/whistles/02.png"; // e.g., 02.png = sound on
            isMuted = false;
        } else {
            audio.pause();
            // Revert to original image (muted)
            soundIcon.src = "./IMG/whistles/03.png";
            isMuted = true;
        }
    });
});