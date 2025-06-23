# TODO List for Esquie v1.0+

## 🚨 High Priority

### CI/CD Issues
- **Fix unit tests in GitHub Actions** 
  - Unit tests pass locally but fail in CI environment
  - Investigation needed for CI-specific environment issues
  - Currently skipped in `.github/workflows/test-and-deploy.yml`
  - Related files: `tests/*.test.js`, `vitest.config.js`

## 🔧 Technical Improvements

### Testing
- [ ] Investigate and fix CI test failures
- [ ] Add integration tests that run against deployed environments
- [ ] Add visual regression tests for image positioning
- [ ] Add performance tests for page load times

### Performance
- [ ] Optimize image sizes (consider WebP format)
- [ ] Add image preloading for smoother transitions
- [ ] Implement service worker for offline support
- [ ] Add CDN optimization for global delivery

### Features
- [ ] Add keyboard shortcuts (space bar for next quote)
- [ ] Add subtle animation between quote transitions
- [ ] Consider adding sound effects (optional, toggleable)
- [ ] Add share functionality for favorite combinations

### Accessibility
- [ ] Add screen reader announcements for new quotes
- [ ] Test with various assistive technologies
- [ ] Add high contrast mode support
- [ ] Ensure keyboard navigation is complete

## 📝 Documentation
- [ ] Create deployment guide for Cloudflare Workers
- [ ] Add troubleshooting section for common issues
- [ ] Document image positioning configuration in detail
- [ ] Add contributing guidelines

## 🎨 Design Enhancements
- [ ] Consider adding subtle parallax effects
- [ ] Add loading animations for quote/image transitions
- [ ] Experiment with different overlay styles
- [ ] Consider seasonal themes or special occasions

---

*This TODO list should be regularly updated as features are completed and new requirements emerge.*