.PHONY: run test test-unit test-manual test-integration test-all install help

# Default target
help:
	@echo "Available commands:"
	@echo "  make run              - Start the development server"
	@echo "  make test             - Run all tests (unit + manual + integration)"
	@echo "  make test-unit        - Run unit tests only"
	@echo "  make test-manual      - Run manual tests (requires server)"
	@echo "  make test-integration - Run integration tests (requires server)"
	@echo "  make test-all         - Run all test suites"
	@echo "  make install          - Install dependencies"
	@echo "  make help             - Show this help message"

# Start development server
run:
	npm run dev

# Run all tests
test: test-unit test-manual test-integration

# Run unit tests (automated, no server required)
test-unit:
	@echo "Running unit tests..."
	npm test

# Run manual tests (requires server to be running)
test-manual:
	@echo "Running manual tests (requires server)..."
	npm run test:manual

# Run integration tests (requires server to be running)
test-integration:
	@echo "Running integration tests (requires server)..."
	npm run test:integration

# Run all test suites (alias for test)
test-all: test

# Install dependencies
install:
	npm install