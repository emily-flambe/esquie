import { describe, it, expect, beforeAll } from 'vitest';
import worker from './index.js';

describe('Esquie Worker - Image Fetching Tests', () => {
  let env;
  
  beforeAll(() => {
    // Mock the ASSETS binding
    env = {
      ASSETS: {
        fetch: async (urlOrRequest) => {
          let pathname;
          if (typeof urlOrRequest === 'string') {
            pathname = new URL(urlOrRequest).pathname;
          } else if (urlOrRequest instanceof Request) {
            pathname = new URL(urlOrRequest.url).pathname;
          } else {
            pathname = new URL(urlOrRequest.toString()).pathname;
          }
          
          // List of available images in src/assets/images
          const availableImages = [
            '/images/esquie1.jpg',
            '/images/esquie2.jpg',
            '/images/esquie3.jpg',
            '/images/esquie4.jpg',
            '/images/esquie5.jpg',
            '/images/esquie6.jpg'
          ];
          
          // Simulate CSS file
          if (pathname === '/styles.css') {
            return new Response('/* mock css */', { 
              status: 200,
              headers: { 'Content-Type': 'text/css' }
            });
          }
          
          // Simulate JS file
          if (pathname === '/script.js') {
            return new Response('/* mock js */ function initializeApp() {}', { 
              status: 200,
              headers: { 'Content-Type': 'application/javascript' }
            });
          }
          
          // Simulate image config
          if (pathname === '/image-config.json') {
            return new Response('{}', { 
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Simulate successful response for available images
          if (availableImages.includes(pathname)) {
            return new Response('image data', { status: 200 });
          }
          
          // Return 404 for non-existent images
          return new Response('Not found', { status: 404 });
        }
      }
    };
  });

  describe('Direct Image Fetching', () => {
    it('should successfully fetch esquie1.jpg from assets/images', async () => {
      const request = new Request('https://example.com/images/esquie1.jpg');
      const response = await worker.fetch(request, env, {});
      
      expect(response.status).toBe(200);
    });

    it('should successfully fetch all 6 esquie images', async () => {
      const imageNumbers = [1, 2, 3, 4, 5, 6];
      
      for (const num of imageNumbers) {
        const request = new Request(`https://example.com/images/esquie${num}.jpg`);
        const response = await worker.fetch(request, env, {});
        
        expect(response.status).toBe(200);
      }
    });

    it('should return 404 for non-existent images', async () => {
      const request = new Request('https://example.com/images/esquie99.jpg');
      const response = await worker.fetch(request, env, {});
      
      expect(response.status).toBe(404);
    });
  });

  describe('API Random Endpoint - Image References', () => {
    it('should return valid image filename from API', async () => {
      const request = new Request('https://example.com/api/random');
      const response = await worker.fetch(request, env, {});
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('application/json');
      
      const data = await response.json();
      expect(data).toHaveProperty('image');
      expect(data.image).toMatch(/^esquie[1-6]\.jpg$/);
    });

    it('should only return images that exist in assets/images', async () => {
      // Make multiple requests to ensure we're getting valid images
      const validImages = ['esquie1.jpg', 'esquie2.jpg', 'esquie3.jpg', 'esquie4.jpg', 'esquie5.jpg', 'esquie6.jpg'];
      
      for (let i = 0; i < 20; i++) {
        const request = new Request('https://example.com/api/random');
        const response = await worker.fetch(request, env, {});
        const data = await response.json();
        
        expect(validImages).toContain(data.image);
      }
    });
  });

  describe('Frontend HTML - Image Path Verification', () => {
    it('should serve HTML with correct image element structure', async () => {
      const request = new Request('https://example.com/');
      const response = await worker.fetch(request, env, {});
      
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('text/html');
      
      const html = await response.text();
      
      // Check that the HTML contains the image element
      expect(html).toContain('<img id="esquie-image"');
      expect(html).toContain('class="esquie-image"');
      expect(html).toContain('alt="Esquie"');
    });

    it('should have script that loads images from correct path', async () => {
      const request = new Request('https://example.com/script.js');
      const response = await worker.fetch(request, env, {});
      
      // If script.js exists in assets, verify it's being served
      if (response.status === 200) {
        const scriptContent = await response.text();
        
        // Check if script references the correct image path pattern
        if (scriptContent.includes('images/')) {
          expect(scriptContent).toMatch(/images\/esquie\d+\.jpg/);
        }
      }
    });
  });

  describe('Static Asset Serving', () => {
    it('should serve CSS files from assets', async () => {
      const request = new Request('https://example.com/styles.css');
      const response = await worker.fetch(request, env, {});
      
      // CSS file should be served if it exists
      if (response.status === 200) {
        expect(response.headers.get('content-type')).toContain('css');
      }
    });

    it('should serve JavaScript files from assets', async () => {
      const request = new Request('https://example.com/script.js');
      const response = await worker.fetch(request, env, {});
      
      // JS file should be served if it exists
      if (response.status === 200) {
        expect(response.headers.get('content-type')).toContain('javascript');
      }
    });
  });
});