.PHONY: run test install help

# Default target
help:
	@echo "Available commands:"
	@echo "  make run     - Start the development server"
	@echo "  make test    - Run tests"
	@echo "  make install - Install dependencies"
	@echo "  make help    - Show this help message"

# Start development server
run:
	npm run dev

# Run tests
test:
	npm test manual-css

# Install dependencies
install:
	npm install