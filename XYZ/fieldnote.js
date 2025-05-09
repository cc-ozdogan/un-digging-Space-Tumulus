document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleButton');
    
    // Track toggle state
    let lettersVisible = false;
    
    // Function to process and wrap ASCII text
    function processAsciiContainer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const asciiText = container.querySelector('.ii, .iii'); // Look for either class
        if (!asciiText) return;
        
        // Wrap each alphabetic character in a span with class 'letter'
        const textContent = asciiText.textContent;
        let wrappedContent = '';
        
        for (let i = 0; i < textContent.length; i++) {
            const char = textContent[i];
            // Only wrap alphabetic characters (a-z, A-Z)
            if (/[a-zA-Z?£şİ]/.test(char)) {
                wrappedContent += `<span class="letter">${char}</span>`;
            } else {
                wrappedContent += char;
            }
        }
        
        asciiText.innerHTML = wrappedContent;
        
        // Add the container to our list of toggleable elements
        return container;
    }
    
    // Process all ASCII containers on the page
    const asciiContainers = [
        processAsciiContainer('asc4'),
        processAsciiContainer('asc5'),
        processAsciiContainer('asc6'),
        processAsciiContainer('asc7'),
        processAsciiContainer('asc8')
        // Add more container IDs as needed
    ].filter(Boolean); // Remove any undefined/null values
    
    // Toggle functionality
    toggleButton.addEventListener('click', function() {
        lettersVisible = !lettersVisible;
        
        // Toggle all containers
        asciiContainers.forEach(container => {
            container.classList.toggle('show-letters', lettersVisible);
        });
        
        // Optional: Change button image based on state
        // toggleButton.querySelector('img').src = lettersVisible ? '03-active.png' : '03.png';
    });
    
    // Optional: Add keyboard accessibility
    toggleButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleButton.click();
        }
    });
});