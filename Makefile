# ObjectDocs Development Tasks
# Run with: make <target> or pnpm run <script>

.PHONY: help install dev build test test-quick test-full clean

# Default target
help:
	@echo "ObjectDocs Development Tasks"
	@echo ""
	@echo "Available targets:"
	@echo "  install     - Install all dependencies"
	@echo "  dev         - Start development server"
	@echo "  build       - Build the site"
	@echo "  test        - Run all tests"
	@echo "  test-quick  - Run quick build test"
	@echo "  test-full   - Run full lifecycle test"
	@echo "  clean       - Clean build artifacts"
	@echo ""

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

test: test-quick test-full

test-quick:
	@echo "Running quick build test..."
	bash test-quick.sh

test-full:
	@echo "Running full lifecycle test..."
	bash test-site.sh

clean:
	rm -rf node_modules
	rm -rf .next
	rm -rf content/.objectdocs
	rm -rf packages/*/node_modules
	rm -rf examples/*/node_modules
	find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.tsbuildinfo" -delete 2>/dev/null || true
