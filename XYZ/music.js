document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('ambient-sound');
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    
    // Set initial volume (50%)
    audio.volume = 0.5;
    
    // Function to toggle sound and update icon
    function updateSoundState() {
        if (audio.paused) {
            soundIcon.setAttribute('d', 'M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L4.27,3M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z');
        } else {
            soundIcon.setAttribute('d', 'M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z');
        }
    }
    
    // Try to autoplay when page loads
    function attemptAutoplay() {
        // First ensure the audio is loaded
        audio.load();
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(_ => {
                    // Autoplay worked
                    updateSoundState();
                })
                .catch(error => {
                    // Autoplay was prevented
                    console.log("Autoplay prevented:", error);
                    
                    // Create a subtle prompt to interact with page
                    const prompt = document.createElement('div');
                    prompt.style.position = 'fixed';
                    prompt.style.bottom = '70px';
                    prompt.style.right = '20px';
                    prompt.style.color = 'white';
                    prompt.style.backgroundColor = 'rgba(0,0,0,0.5)';
                    prompt.style.padding = '5px 10px';
                    prompt.style.borderRadius = '5px';
                    prompt.style.fontSize = '12px';
                    prompt.textContent = 'Click anywhere to play the music';
                    document.body.appendChild(prompt);
                    
                    // Enable sound on first user interaction
                    const enableSound = () => {
                        document.removeEventListener('click', enableSound);
                        document.removeEventListener('keydown', enableSound);
                        if (prompt) prompt.remove();
                        
                        // Try to play again after interaction
                        audio.play()
                            .then(() => updateSoundState())
                            .catch(e => console.log("Still couldn't play:", e));
                    };
                    
                    document.addEventListener('click', enableSound, { once: true });
                    document.addEventListener('keydown', enableSound, { once: true });
                });
        }
    }
    
    // Initialize
    soundToggle.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().catch(e => console.log("Play failed:", e));
        } else {
            audio.pause();
        }
        updateSoundState();
    });
    
    // Start attempting to play
    attemptAutoplay();
    
    // Fallback: If still not playing after 2 seconds, show muted icon
    setTimeout(() => {
        if (audio.paused) {
            updateSoundState();
        }
    }, 2000);
});