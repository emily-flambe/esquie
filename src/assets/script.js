/**
 * Esquie Web App - Client-Side JavaScript
 * Handles user interactions, API communication, and DOM updates
 */

// Application state
let isInitialized = false;
let isLoading = false;

// DOM elements (will be populated on initialization)
let elements = {
    welcomeScreen: null,
    contentScreen: null,
    yesButton: null,
    yesButtonContent: null,
    questionText: null,
    backgroundImage: null,
    quoteElement: null,
    errorMessage: null
};

/**
 * Initialize the application
 * Sets up event listeners and initial state
 */
function initializeApp() {
    try {
        // Cache DOM elements
        elements.welcomeScreen = document.getElementById('welcome-screen');
        elements.contentScreen = document.getElementById('content-screen');
        elements.yesButton = document.getElementById('yes-button');
        elements.yesButtonContent = document.getElementById('yes-button-content');
        elements.questionText = document.getElementById('question-text');
        elements.backgroundImage = document.getElementById('background-image');
        elements.quoteElement = document.getElementById('esquie-quote');
        elements.errorMessage = document.getElementById('error-message');

        // Validate required elements exist
        if (!elements.yesButton || !elements.yesButtonContent) {
            throw new Error('Required DOM elements not found');
        }

        // Set up event listeners
        elements.yesButton.addEventListener('click', handleYesClick);
        elements.yesButtonContent.addEventListener('click', handleYesClick);
        
        // Handle keyboard navigation
        document.addEventListener('keydown', handleKeyPress);

        // Set initial state
        showWelcomeScreen();
        
        // Apply styling to initial image
        if (window.INITIAL_IMAGE && elements.backgroundImage) {
            const initialImg = elements.backgroundImage.querySelector('img');
            if (initialImg) {
                applyImageStyling(initialImg, window.INITIAL_IMAGE);
            }
        }
        
        isInitialized = true;
        console.log('Esquie app initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to initialize application. Please refresh the page.');
    }
}

/**
 * Handle "Yes" button clicks
 * Manages the flow between welcome screen and content display
 */
async function handleYesClick() {
    if (isLoading) {
        return; // Prevent multiple simultaneous requests
    }

    try {
        isLoading = true;
        updateButtonState(true);
        hideError();

        // Fetch new content from API
        const combination = await fetchRandomCombination();
        
        // Update the display
        await updateContent(combination);
        
        // Show content screen if not already visible
        if (elements.welcomeScreen && !elements.welcomeScreen.classList.contains('hidden')) {
            showContentScreen();
        }

    } catch (error) {
        console.error('Error handling yes click:', error);
        showError('Unable to load new content. Please try again.');
    } finally {
        isLoading = false;
        updateButtonState(false);
    }
}

/**
 * Fetch random quote/image combination from API
 * @returns {Promise<Object>} Object containing quote and image filename
 */
async function fetchRandomCombination() {
    try {
        const response = await fetch('/api/random', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Validate response structure
        if (!data.quote || !data.image) {
            throw new Error('Invalid API response format');
        }

        return data;

    } catch (error) {
        console.error('API request failed:', error);
        throw new Error('Failed to fetch content from server');
    }
}

/**
 * Update the content display with new quote/image combination
 * @param {Object} combination - Object containing quote and image
 */
async function updateContent(combination) {
    try {
        // Update the displayed content
        await displayCombination(combination);
        
        // Update button text for subsequent interactions
        if (elements.yesButton) {
            elements.yesButton.textContent = 'Yes';
        }
        
        // Update question text for content screen
        if (elements.questionText) {
            elements.questionText.textContent = 'Spend more time with Esquie?';
        }

    } catch (error) {
        console.error('Error updating content:', error);
        throw error;
    }
}

/**
 * Apply image-specific styling based on configuration
 * @param {HTMLImageElement} img - The image element
 * @param {string} imageName - The image filename
 */
function applyImageStyling(img, imageName) {
    const config = window.IMAGE_CONFIG || {};
    const imageConfig = config[imageName] || { objectFit: 'cover', objectPosition: 'center center' };
    
    img.style.objectFit = imageConfig.objectFit;
    img.style.objectPosition = imageConfig.objectPosition;
}

/**
 * Display the quote/image combination in the content area
 * @param {Object} combination - Object containing quote and image
 */
async function displayCombination(combination) {
    return new Promise((resolve, reject) => {
        try {
            // Update quote
            if (elements.quoteElement) {
                elements.quoteElement.textContent = combination.quote;
            }

            // Update background image
            if (elements.backgroundImage) {
                const imageUrl = `/images/${combination.image}`;
                const backgroundImg = elements.backgroundImage.querySelector('img');
                
                if (backgroundImg) {
                    // Preload image to ensure smooth display
                    const img = new Image();
                    img.onload = () => {
                        backgroundImg.src = imageUrl;
                        backgroundImg.alt = 'Esquie character image';
                        
                        // Apply image-specific styling
                        applyImageStyling(backgroundImg, combination.image);
                        
                        resolve();
                    };
                    img.onerror = () => {
                        console.error('Failed to load image:', imageUrl);
                        // Still resolve to show quote even if image fails
                        resolve();
                    };
                    img.src = imageUrl;
                } else {
                    resolve();
                }
            } else {
                resolve();
            }

        } catch (error) {
            console.error('Error displaying combination:', error);
            reject(error);
        }
    });
}

/**
 * Show the welcome screen
 */
function showWelcomeScreen() {
    if (elements.welcomeScreen) {
        elements.welcomeScreen.classList.remove('hidden');
        elements.welcomeScreen.classList.add('active');
    }
    if (elements.contentScreen) {
        elements.contentScreen.classList.add('hidden');
        elements.contentScreen.classList.remove('active');
    }
    if (elements.questionText) {
        elements.questionText.textContent = 'Do you want to spend time with Esquie?';
    }
    if (elements.yesButton) {
        elements.yesButton.textContent = 'Yes';
    }
}

/**
 * Show the content screen
 */
function showContentScreen() {
    if (elements.welcomeScreen) {
        elements.welcomeScreen.classList.add('hidden');
        elements.welcomeScreen.classList.remove('active');
    }
    if (elements.contentScreen) {
        elements.contentScreen.classList.remove('hidden');
        elements.contentScreen.classList.add('active');
    }
}

/**
 * Update button state during loading
 * @param {boolean} loading - Whether the app is currently loading
 */
function updateButtonState(loading) {
    if (elements.yesButton) {
        elements.yesButton.disabled = loading;
        elements.yesButton.textContent = loading ? 'Loading...' : 'Yes';
    }
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    if (elements.errorMessage) {
        elements.errorMessage.textContent = message;
        elements.errorMessage.classList.remove('hidden');
        elements.errorMessage.setAttribute('role', 'alert');
    }
}

/**
 * Hide error message
 */
function hideError() {
    if (elements.errorMessage) {
        elements.errorMessage.classList.add('hidden');
        elements.errorMessage.removeAttribute('role');
    }
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyPress(event) {
    // Allow Enter or Space to trigger the Yes button
    if ((event.key === 'Enter' || event.key === ' ') && 
        document.activeElement === elements.yesButton) {
        event.preventDefault();
        handleYesClick();
    }
}

/**
 * Cleanup function for potential future use
 */
function cleanup() {
    if (elements.yesButton) {
        elements.yesButton.removeEventListener('click', handleYesClick);
    }
    document.removeEventListener('keydown', handleKeyPress);
    isInitialized = false;
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}

// Export functions for potential testing or external use
window.EsquieApp = {
    initializeApp,
    handleYesClick,
    fetchRandomCombination,
    updateContent,
    displayCombination,
    cleanup
};