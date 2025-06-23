import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'child_process';

let wranglerProcess;
const SERVER_URL = 'http://localhost:8787';

describe('CSS Asset Serving Tests', () => {
  beforeAll(async () => {
    // Start wrangler dev server
    wranglerProcess = spawn('npx', ['wrangler', 'dev', '--local', '--port', '8787'], {
      stdio: 'pipe',
      cwd: process.cwd()
    });

    // Wait for server to be ready
    await new Promise((resolve) => {
      wranglerProcess.stdout.on('data', (data) => {
        if (data.toString().includes('Ready on')) {
          resolve();
        }
      });
    });

    // Give it a moment to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
  }, 30000);

  afterAll(() => {
    if (wranglerProcess) {
      wranglerProcess.kill();
    }
  });

  it('should serve CSS file with correct content-type', async () => {
    const response = await fetch(`${SERVER_URL}/styles.css`);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/text\/css/);
  });

  it('should serve CSS file with actual content', async () => {
    const response = await fetch(`${SERVER_URL}/styles.css`);
    const cssContent = await response.text();
    
    expect(cssContent).toContain(':root');
    expect(cssContent).toContain('--color-primary');
    expect(cssContent).toContain('.primary-button');
    expect(cssContent.length).toBeGreaterThan(1000); // Should be substantial CSS
  });

  it('should serve JavaScript file correctly', async () => {
    const response = await fetch(`${SERVER_URL}/script.js`);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/application\/javascript/);
  });

  it('should serve JavaScript with actual content', async () => {
    const response = await fetch(`${SERVER_URL}/script.js`);
    const jsContent = await response.text();
    
    expect(jsContent).toContain('initializeApp');
    expect(jsContent).toContain('handleYesClick');
    expect(jsContent).toContain('displayCombination');
    expect(jsContent.length).toBeGreaterThan(1000); // Should be substantial JS
  });

  it('should serve main HTML page with CSS link', async () => {
    const response = await fetch(`${SERVER_URL}/`);
    const htmlContent = await response.text();
    
    expect(response.status).toBe(200);
    expect(htmlContent).toContain('<link rel="stylesheet" href="/styles.css">');
    expect(htmlContent).toContain('<script src="/script.js">');
  });

  it('should serve images from /images/ path', async () => {
    const response = await fetch(`${SERVER_URL}/images/esquie1.jpg`);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/image\/jpeg/);
  });

  it('should return 404 for non-existent assets', async () => {
    const response = await fetch(`${SERVER_URL}/nonexistent.css`);
    
    expect(response.status).toBe(404);
  });
});