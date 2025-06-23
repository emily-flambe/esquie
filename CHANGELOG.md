# Changelog

All notable changes to the Esquie web application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-23

### Added
- Initial release of Esquie web application
- Full-screen image overlay layout with Esquie character images
- Random quote and image combinations on each interaction
- Dark translucent overlay with centered text and buttons
- Per-image configuration system for optimal image positioning
- Responsive design for mobile, tablet, and desktop
- 7 curated Esquie quotes from the game
- 6 Esquie character images with individual styling
- Cloudflare Workers backend with static asset serving
- Custom favicon using esquie6.jpg
- Elegant typography with IM Fell Double Pica font
- Smooth animations and transitions
- Single "Yes" button interaction maintaining Esquie's positive nature

### Features
- **Interactive Experience**: "Do you want to spend time with Esquie?" prompt
- **Random Content**: Each click generates new quote/image combinations
- **Image Optimization**: Per-image positioning to show character properly
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Fast loading with optimized assets
- **Mobile-First**: Responsive design that works on all devices

### Technical
- Built with Cloudflare Workers
- Vanilla JavaScript (no external dependencies)
- CSS with modern features (flexbox, grid, custom properties)
- Static asset serving with proper content-type headers
- Comprehensive test suite with Vitest
- Configuration-driven image positioning system