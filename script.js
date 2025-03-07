
        // DOM Elements
        const body = document.body;
        const colorPicker = document.getElementById('colorPicker');
        const redSlider = document.getElementById('redSlider');
        const greenSlider = document.getElementById('greenSlider');
        const blueSlider = document.getElementById('blueSlider');
        const redValue = document.getElementById('redValue');
        const greenValue = document.getElementById('greenValue');
        const blueValue = document.getElementById('blueValue');
        const randomButton = document.getElementById('randomButton');
        const resetButton = document.getElementById('resetButton');
        const saveButton = document.getElementById('saveButton');
        const colorCode = document.getElementById('colorCode');
        const rgbCode = document.getElementById('rgbCode');
        const savedColorsContainer = document.getElementById('savedColors');
        
        // Initial values
        const defaultColor = '#4CAF50';
        
        // Functions
        function updateColorFromRGB() {
            const r = parseInt(redSlider.value);
            const g = parseInt(greenSlider.value);
            const b = parseInt(blueSlider.value);
            
            // Update color values display
            redValue.textContent = r;
            greenValue.textContent = g;
            blueValue.textContent = b;
            
            // Convert RGB to HEX
            const hexColor = rgbToHex(r, g, b);
            
            // Update color picker
            colorPicker.value = hexColor;
            
            // Update background color
            body.style.backgroundColor = hexColor;
            
            // Update color info
            colorCode.textContent = hexColor;
            rgbCode.textContent = `rgb(${r}, ${g}, ${b})`;
        }
        
        function updateColorFromHex(hex) {
            // Convert HEX to RGB
            const rgb = hexToRgb(hex);
            
            // Update sliders
            redSlider.value = rgb.r;
            greenSlider.value = rgb.g;
            blueSlider.value = rgb.b;
            
            // Update values
            redValue.textContent = rgb.r;
            greenValue.textContent = rgb.g;
            blueValue.textContent = rgb.b;
            
            // Update background color
            body.style.backgroundColor = hex;
            
            // Update color info
            colorCode.textContent = hex;
            rgbCode.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }
        
        function generateRandomColor() {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            
            redSlider.value = r;
            greenSlider.value = g;
            blueSlider.value = b;
            
            updateColorFromRGB();
        }
        
        function resetColor() {
            updateColorFromHex(defaultColor);
        }
        
        function saveColor() {
            const currentColor = colorPicker.value;
            
            // Create color swatch
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = currentColor;
            swatch.setAttribute('data-color', currentColor);
            swatch.title = currentColor;
            
            // Add click event to apply color
            swatch.addEventListener('click', function() {
                updateColorFromHex(this.getAttribute('data-color'));
            });
            
            // Add to saved colors
            savedColorsContainer.appendChild(swatch);
        }
        
        // Helper functions
        function rgbToHex(r, g, b) {
            return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        }
        
        function hexToRgb(hex) {
            // Remove # if present
            hex = hex.replace(/^#/, '');
            
            // Parse hex values
            const bigint = parseInt(hex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            
            return { r, g, b };
        }
        
        // Event listeners
        colorPicker.addEventListener('input', function() {
            updateColorFromHex(this.value);
        });
        
        redSlider.addEventListener('input', updateColorFromRGB);
        greenSlider.addEventListener('input', updateColorFromRGB);
        blueSlider.addEventListener('input', updateColorFromRGB);
        
        randomButton.addEventListener('click', generateRandomColor);
        resetButton.addEventListener('click', resetColor);
        saveButton.addEventListener('click', saveColor);
        
        // Copy to clipboard functionality
        const copyButtons = document.querySelectorAll('.copy-btn');
        const copyNotification = document.getElementById('copyNotification');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get the target element ID
                const targetId = this.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                
                // Create a temporary textarea element to copy from
                // Use the modern Clipboard API if available
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(targetElement.textContent)
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                        // Fallback to the old method if modern API fails
                        fallbackCopyToClipboard(targetElement.textContent);
                    });
                } else {
                    // Fallback for browsers that don't support the Clipboard API
                    fallbackCopyToClipboard(targetElement.textContent);
                }
                
                function fallbackCopyToClipboard(text) {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';  // Avoid scrolling to bottom
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    
                    try {
                        document.execCommand('copy');
                    } catch (err) {
                        console.error('Fallback: Could not copy text: ', err);
                    }
                    
                    document.body.removeChild(textarea);
                }
                
                // The textarea is already removed in the fallback function
                
                // Show notification
                copyNotification.style.opacity = '1';
                
                // Hide notification after 2 seconds
                setTimeout(() => {
                    copyNotification.style.opacity = '0';
                }, 2000);
            });
        });
        
        // Initialize
        resetColor();