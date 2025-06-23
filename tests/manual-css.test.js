import { describe, it, expect } from 'vitest';

describe('Manual CSS Server Test', () => {
  it('should serve CSS when server is running manually', async () => {
    try {
      const response = await fetch('http://localhost:8787/styles.css');
      
      console.log('CSS Response Status:', response.status);
      console.log('CSS Content-Type:', response.headers.get('content-type'));
      
      if (response.status === 200) {
        const cssContent = await response.text();
        console.log('CSS Content Length:', cssContent.length);
        console.log('CSS Content Preview:', cssContent.substring(0, 200));
        
        expect(cssContent.length).toBeGreaterThan(100);
        expect(cssContent).toContain(':root');
      } else {
        console.log('CSS not served - Status:', response.status);
        expect(response.status).toBe(200);
      }
    } catch (error) {
      console.log('Error fetching CSS:', error.message);
      console.log('Make sure server is running: npx wrangler dev --local');
      throw error;
    }
  });

  it('should serve JS when server is running manually', async () => {
    try {
      const response = await fetch('http://localhost:8787/script.js');
      
      console.log('JS Response Status:', response.status);
      console.log('JS Content-Type:', response.headers.get('content-type'));
      
      if (response.status === 200) {
        const jsContent = await response.text();
        console.log('JS Content Length:', jsContent.length);
        console.log('JS Content Preview:', jsContent.substring(0, 200));
        
        expect(jsContent.length).toBeGreaterThan(100);
        expect(jsContent).toContain('initializeApp');
      }
    } catch (error) {
      console.log('Error fetching JS:', error.message);
      throw error;
    }
  });
});