// Cloudflare Worker - Esquie's Emotional Quotient Quotes

// Static images (no need to load dynamically)

const IMAGES = [
  'esquie1.jpg',
  'esquie2.jpg',
  'esquie3.jpg',
  'esquie4.jpg',
  'esquie5.jpg',
  'esquie6.jpg'
];

// Get a random quote from the quotes array
function getRandomQuote(quotes) {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Get a random image filename from the IMAGES array
function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * IMAGES.length);
  return IMAGES[randomIndex];
}

// Load quotes from JSON file
async function loadQuotes(env) {
  try {
    const quotesResponse = await env.ASSETS.fetch(new Request('http://localhost/quotes.json'));
    if (quotesResponse.status === 200) {
      return await quotesResponse.json();
    }
  } catch (error) {
    console.error('Error loading quotes:', error);
  }
  
  // Fallback default quotes
  return [
    'I too am "Whooo." But I\'m also "Wheee!" So the "Wheee" balances the "Whooo."',
    'Mon ami!',
    'Losing a rock is better than never having a rock!',
    'Stars are the apples of the sky.',
    'Want a hug?',
    'Esquie can be sad or bad or even rad! But never ever mad.',
    'Men trip not on mountains; they stumble upon stones.',
    'I get sad too, when I lose my stones. But I always find them again. You will find them again too.',
    'First means number one. Second means number two!'
  ];
}

// Handle API endpoint - return random quote/image combination as JSON
async function handleAPI(env) {
  const quotes = await loadQuotes(env);
  const quote = getRandomQuote(quotes);
  const image = getRandomImage();
  
  const response = {
    quote: quote,
    image: image
  };
  
  return new Response(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// Load image configuration
async function loadImageConfig(env) {
  try {
    const configResponse = await env.ASSETS.fetch(new Request('http://localhost/image-config.json'));
    if (configResponse.status === 200) {
      return await configResponse.json();
    }
  } catch (error) {
    console.error('Error loading image config:', error);
  }
  
  // Fallback default config
  return {
    "esquie1.jpg": { "objectFit": "contain", "objectPosition": "center center" },
    "esquie2.jpg": { "objectFit": "cover", "objectPosition": "center center" },
    "esquie3.jpg": { "objectFit": "cover", "objectPosition": "center center" },
    "esquie4.jpg": { "objectFit": "cover", "objectPosition": "center center" },
    "esquie5.jpg": { "objectFit": "cover", "objectPosition": "center center" },
    "esquie6.jpg": { "objectFit": "cover", "objectPosition": "center center" }
  };
}

// Handle main page - serve HTML template
async function handleMainPage(env) {
  // Get a random initial image
  const initialImage = getRandomImage();
  
  // Load image configuration
  const imageConfig = await loadImageConfig(env);
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Spend time with Esquie - Wholesome quotes and charming wisdom">
  <title>Mon ami!</title>
  <link rel="icon" type="image/jpeg" href="/images/esquie6.jpg">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="background-image" class="background-image">
    <img id="esquie-image" class="esquie-image" src="/images/${initialImage}" alt="Esquie" />
  </div>
  
  <div id="welcome-screen" class="screen active">
    <div class="overlay-container">
      <h1 id="question-text">Do you want to spend time with Esquie?</h1>
      <button id="yes-button" class="primary-button">Yes</button>
    </div>
  </div>
  
  <div id="content-screen" class="screen hidden">
    <div class="overlay-container">
      <div id="esquie-quote" class="quote"></div>
      <button id="yes-button-content" class="primary-button">Yes</button>
    </div>
  </div>
  
  <div id="error-message" class="error-message hidden">
    <div class="overlay-container">
      <div class="error-text"></div>
    </div>
  </div>
  
  <a href="https://github.com/emily-flambe/esquie" target="_blank" class="github-link" aria-label="View source on GitHub">
    <svg class="github-icon" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  </a>
  
  <script>
    // Pass initial image and config to JavaScript
    window.INITIAL_IMAGE = '${initialImage}';
    window.IMAGE_CONFIG = ${JSON.stringify(imageConfig)};
  </script>
  <script src="/script.js"></script>
</body>
</html>`;
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    }
  });
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Route handling
    if (pathname === '/') {
      return handleMainPage(env);
    } else if (pathname === '/api/random') {
      return handleAPI(env);
    }
    
    // For all other paths, serve from assets
    // The ASSETS binding serves files from src/assets/ as the root
    const response = await env.ASSETS.fetch(request);
    if (response.status === 200) {
      return response;
    }
    
    // Return 404 for any unmatched paths
    return new Response('Not found', { status: 404 });
  }
};