# Testing Guide

## Test Types

### Unit Tests
- **Run with**: `npm test`
- **Files**: `src/index.test.js`, `tests/worker-unit.test.js`, `tests/debug-css.test.js`
- **Purpose**: Test individual functions and validate asset files
- **Environment**: Node.js, no server required
- **CI/CD**: ✅ Runs in GitHub Actions

### Integration Tests
- **Run with**: `npm run test:integration` 
- **Files**: `tests/integration.test.js`
- **Purpose**: Test full HTTP endpoints and server behavior
- **Environment**: Requires running Cloudflare Worker server
- **CI/CD**: ❌ Excluded from CI (requires server)

### Manual Tests
- **Run with**: `npm run test:manual`
- **Files**: `tests/manual-*.test.js`
- **Purpose**: Manual testing with running server
- **Environment**: Requires `npx wrangler dev --local` running
- **CI/CD**: ❌ Excluded from CI (requires manual server setup)

## Test Strategy

The CI/CD pipeline runs only unit tests that don't require a running server. This ensures:

1. **Fast CI builds** - No need to start/stop servers
2. **Reliable tests** - No dependency on external services
3. **Core functionality validation** - Asset validation, configuration checks, and module loading

Integration and manual tests are available for local development and manual testing scenarios.

## Running Tests Locally

```bash
# Run all CI tests (unit tests only)
npm test

# Run integration tests (requires server)
npm run test:integration

# Run manual tests (requires server)  
npm run test:manual

# Start development server for integration/manual tests
npx wrangler dev --local
```

## CI/CD Configuration

The `vitest.config.js` excludes server-dependent tests:

```javascript
exclude: [
  '**/node_modules/**',
  '**/tests/manual-*.test.js',
  '**/tests/integration.test.js',
]
```

This ensures the CI pipeline only runs tests that can execute without external dependencies.