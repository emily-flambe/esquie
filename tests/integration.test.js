import { describe, it, expect } from 'vitest';

describe('Esquie Worker Integration Tests', () => {
  const TEST_URL = process.env.TEST_URL || 'http://localhost:8787';
  
  it('should serve the main page with correct HTML structure', async () => {
    const response = await fetch(TEST_URL);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/html');
    
    const html = await response.text();
    
    // Check for essential HTML elements
    expect(html).toContain('<title>Mon ami!</title>');
    expect(html).toContain('<img id="esquie-image"');
    expect(html).toContain('class="esquie-image"');
    expect(html).toContain('Do you want to spend time with Esquie?');
    expect(html).toContain('<button id="yes-button"');
  });
  
  it('should serve the API endpoint with valid data', async () => {
    const response = await fetch(`${TEST_URL}/api/random`);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    
    const data = await response.json();
    
    // Validate response structure
    expect(data).toHaveProperty('quote');
    expect(data).toHaveProperty('image');
    expect(typeof data.quote).toBe('string');
    expect(typeof data.image).toBe('string');
    
    // Validate image filename format
    expect(data.image).toMatch(/^esquie[1-6]\.jpg$/);
    
    // Validate quote is not empty
    expect(data.quote.length).toBeGreaterThan(0);
  });
  
  it('should serve static assets correctly', async () => {
    // Test CSS file
    const cssResponse = await fetch(`${TEST_URL}/styles.css`);
    expect(cssResponse.status).toBe(200);
    expect(cssResponse.headers.get('content-type')).toContain('text/css');
    
    const cssContent = await cssResponse.text();
    expect(cssContent).toContain(':root');
    expect(cssContent).toContain('--color-primary');
    expect(cssContent).toContain('.primary-button');
    
    // Test JavaScript file
    const jsResponse = await fetch(`${TEST_URL}/script.js`);
    expect(jsResponse.status).toBe(200);
    expect(jsResponse.headers.get('content-type')).toContain('javascript');
    
    const jsContent = await jsResponse.text();
    expect(jsContent).toContain('initializeApp');
    expect(jsContent).toContain('handleYesClick');
  });
  
  it('should serve images from the images directory', async () => {
    // Test that at least one image is accessible
    const imageResponse = await fetch(`${TEST_URL}/images/esquie1.jpg`);
    expect(imageResponse.status).toBe(200);
    expect(imageResponse.headers.get('content-type')).toMatch(/image/);
  });
  
  it('should return 404 for non-existent paths', async () => {
    const response = await fetch(`${TEST_URL}/nonexistent-path`);
    expect(response.status).toBe(404);
  });
  
  it('should handle multiple API calls consistently', async () => {
    const validImages = ['esquie1.jpg', 'esquie2.jpg', 'esquie3.jpg', 'esquie4.jpg', 'esquie5.jpg', 'esquie6.jpg'];
    const requests = Array.from({ length: 10 }, () => fetch(`${TEST_URL}/api/random`));
    
    const responses = await Promise.all(requests);
    
    for (const response of responses) {
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(validImages).toContain(data.image);
      expect(typeof data.quote).toBe('string');
      expect(data.quote.length).toBeGreaterThan(0);
    }
  });
  
  it('should have proper CORS headers for API endpoints', async () => {
    const response = await fetch(`${TEST_URL}/api/random`);
    
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(response.headers.get('content-type')).toBe('application/json');
  });
});