// Cloudflare Worker - Esquie's Emotional Quotient Quotes

// Static quotes and images (no need to load dynamically)
const QUOTES = [
  'I too am "Whooo." But I\'m also "Wheee!" So the "Wheee" balances the "Whooo."',
  'Mon ami!',
  'Losing a rock is better than never having a rock!',
  'Stars are the apples of the sky.',
  'Want a hug?',
  'Esquie can be sad or bad or even rad! But never ever mad.',
  'Men trip not on mountains; they stumble upon stones.'
];

const IMAGES = [
  'esquie1.jpg',
  'esquie2.jpg',
  'esquie3.jpg',
  'esquie4.jpg',
  'esquie5.jpg',
  'esquie6.jpg'
];

// Get a random quote from the QUOTES array
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[randomIndex];
}

// Get a random image filename from the IMAGES array
function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * IMAGES.length);
  return IMAGES[randomIndex];
}

// Handle API endpoint - return random quote/image combination as JSON
async function handleAPI() {
  const quote = getRandomQuote();
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
    <img src="/images/${initialImage}" alt="Esquie" />
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
      return handleAPI();
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