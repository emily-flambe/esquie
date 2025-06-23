import { describe, it, expect } from 'vitest';

describe('Esquie Worker Unit Tests', () => {
  it('should test worker functions directly', async () => {
    // Test that we can import the worker module
    const worker = await import('../src/index.js');
    expect(worker).toBeDefined();
    expect(typeof worker.default).toBe('object');
  });

  it('should validate asset files exist', async () => {
    // Import filesystem module to check files exist
    const fs = await import('fs/promises');
    
    // Check that essential assets exist
    const cssPath = 'src/assets/styles.css';
    const jsPath = 'src/assets/script.js';
    const quotesPath = 'src/assets/quotes.json';
    
    await expect(fs.access(cssPath)).resolves.not.toThrow();
    await expect(fs.access(jsPath)).resolves.not.toThrow();
    await expect(fs.access(quotesPath)).resolves.not.toThrow();
  });

  it('should validate quotes.json structure', async () => {
    const fs = await import('fs/promises');
    const quotesData = await fs.readFile('src/assets/quotes.json', 'utf-8');
    const quotes = JSON.parse(quotesData);
    
    expect(Array.isArray(quotes)).toBe(true);
    expect(quotes.length).toBeGreaterThan(0);
    
    // Each quote should be a string
    quotes.forEach(quote => {
      expect(typeof quote).toBe('string');
      expect(quote.length).toBeGreaterThan(0);
    });
  });

  it('should validate image-config.json structure', async () => {
    const fs = await import('fs/promises');
    const configData = await fs.readFile('src/assets/image-config.json', 'utf-8');
    const config = JSON.parse(configData);
    
    // Should be an object with image filenames as keys
    expect(typeof config).toBe('object');
    expect(config).not.toBe(null);
    
    const imageKeys = Object.keys(config);
    expect(imageKeys.length).toBeGreaterThan(0);
    
    // Each key should be a valid image filename
    imageKeys.forEach(filename => {
      expect(filename).toMatch(/^esquie\d+\.jpg$/);
      expect(config[filename]).toHaveProperty('objectFit');
      expect(config[filename]).toHaveProperty('objectPosition');
    });
  });
});