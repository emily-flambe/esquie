import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('CSS File Debug Tests', () => {
  it('should have a non-empty CSS file in assets', () => {
    const cssPath = join(process.cwd(), 'src/assets/styles.css');
    const cssContent = readFileSync(cssPath, 'utf8');
    
    console.log('CSS file size:', cssContent.length, 'characters');
    console.log('CSS file starts with:', cssContent.substring(0, 200));
    
    expect(cssContent.length).toBeGreaterThan(100);
    expect(cssContent).toContain(':root');
    expect(cssContent).toContain('--color-primary');
  });

  it('should have a non-empty JavaScript file in assets', () => {
    const jsPath = join(process.cwd(), 'src/assets/script.js');
    const jsContent = readFileSync(jsPath, 'utf8');
    
    console.log('JS file size:', jsContent.length, 'characters');
    console.log('JS file starts with:', jsContent.substring(0, 200));
    
    expect(jsContent.length).toBeGreaterThan(100);
    expect(jsContent).toContain('initializeApp');
  });

  it('should list all files in assets directory', () => {
    const { readdirSync, statSync } = require('fs');
    const assetsPath = join(process.cwd(), 'src/assets');
    
    console.log('Contents of src/assets:');
    const files = readdirSync(assetsPath);
    files.forEach(file => {
      const filepath = join(assetsPath, file);
      const stats = statSync(filepath);
      console.log(`  ${file} (${stats.isDirectory() ? 'dir' : 'file'}, ${stats.size} bytes)`);
    });
    
    expect(files).toContain('styles.css');
    expect(files).toContain('script.js');
  });
});