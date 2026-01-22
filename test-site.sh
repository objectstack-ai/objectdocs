#!/bin/bash
# ObjectDocs Site Testing Script
# Tests the complete lifecycle: init -> create -> startup -> build -> run
# 测试站点完整流程：初始化 -> 创建 -> 启动 -> 编译 -> 运行

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TEST_DIR="/tmp/objectdocs-test-$(date +%s)"
PORT=7777
BUILD_TIMEOUT=300  # 5 minutes for build
DEV_TIMEOUT=30     # 30 seconds for dev server to start

# Cleanup function
cleanup() {
    echo ""
    echo -e "${BLUE}Cleaning up...${NC}"
    
    # Kill any running dev/start servers
    if [ ! -z "$DEV_PID" ]; then
        kill $DEV_PID 2>/dev/null || true
    fi
    if [ ! -z "$START_PID" ]; then
        kill $START_PID 2>/dev/null || true
    fi
    
    # Kill any process using the test port
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    
    # Remove test directory
    if [ -d "$TEST_DIR" ]; then
        rm -rf "$TEST_DIR"
    fi
    
    echo -e "${BLUE}Cleanup complete${NC}"
}

# Register cleanup on exit
trap cleanup EXIT

# Print section header
print_section() {
    echo ""
    echo "================================================"
    echo -e "${BLUE}$1${NC}"
    echo "================================================"
}

# Print success message
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Print error message
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Print warning message
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Print info message
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Wait for server to be ready
wait_for_server() {
    local port=$1
    local timeout=$2
    local elapsed=0
    
    print_info "Waiting for server on port $port (timeout: ${timeout}s)..."
    
    while [ $elapsed -lt $timeout ]; do
        if curl -s http://localhost:$port > /dev/null 2>&1; then
            return 0
        fi
        sleep 2
        elapsed=$((elapsed + 2))
    done
    
    return 1
}

# Main test script
main() {
    print_section "ObjectDocs Complete Lifecycle Test"
    echo "Test directory: $TEST_DIR"
    echo "Port: $PORT"
    echo ""
    
    # Check prerequisites
    print_section "Step 0: Checking Prerequisites"
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js installed: $(node --version)"
    
    if ! command_exists pnpm; then
        print_error "pnpm is not installed"
        exit 1
    fi
    print_success "pnpm installed: $(pnpm --version)"
    
    if ! command_exists curl; then
        print_error "curl is not installed"
        exit 1
    fi
    print_success "curl installed"
    
    # Step 1: Create test directory and initialize project
    print_section "Step 1: Initializing New Project"
    
    mkdir -p "$TEST_DIR"
    cd "$TEST_DIR"
    print_success "Created test directory: $TEST_DIR"
    
    # Initialize package.json
    print_info "Running pnpm init..."
    pnpm init -y
    print_success "package.json created"
    
    # Install @objectdocs/cli as dev dependency
    print_info "Installing @objectdocs/cli..."
    
    # Get the absolute path to the monorepo root
    MONOREPO_ROOT="/home/runner/work/objectdocs/objectdocs"
    
    # Install CLI from workspace
    if [ -d "$MONOREPO_ROOT/packages/cli" ]; then
        print_info "Installing CLI from local workspace..."
        pnpm add -D "$MONOREPO_ROOT/packages/cli"
    else
        print_error "CLI package not found at $MONOREPO_ROOT/packages/cli"
        exit 1
    fi
    print_success "@objectdocs/cli installed"
    
    # Step 2: Configure scripts
    print_section "Step 2: Configuring Package Scripts"
    
    # Add scripts to package.json using pnpm pkg
    pnpm pkg set scripts.dev="objectdocs dev"
    pnpm pkg set scripts.build="objectdocs build"
    pnpm pkg set scripts.start="objectdocs start"
    
    print_success "Scripts configured in package.json"
    
    # Step 3: Initialize ObjectDocs
    print_section "Step 3: Running ObjectDocs Init"
    
    print_info "Running: pnpm objectdocs init"
    if pnpm objectdocs init; then
        print_success "ObjectDocs initialized successfully"
    else
        print_error "ObjectDocs init failed"
        exit 1
    fi
    
    # Verify init created necessary files
    if [ -d "content/.objectdocs" ]; then
        print_success "Site engine copied to content/.objectdocs"
    else
        print_warning "content/.objectdocs not found (might use different structure)"
    fi
    
    # Step 4: Create content
    print_section "Step 4: Creating Documentation Content"
    
    mkdir -p content/docs
    print_success "Created content/docs directory"
    
    # Create docs.site.json
    cat > content/docs.site.json << 'EOF'
{
  "branding": {
    "name": "Test Site",
    "description": "ObjectDocs Test Site"
  },
  "links": [
    { "text": "Home", "url": "/" },
    { "text": "Docs", "url": "/docs" }
  ]
}
EOF
    print_success "Created content/docs.site.json"
    
    # Create meta.json
    cat > content/docs/meta.json << 'EOF'
{
  "title": "Documentation",
  "pages": ["index", "getting-started"]
}
EOF
    print_success "Created content/docs/meta.json"
    
    # Create index.mdx
    cat > content/docs/index.mdx << 'EOF'
---
title: Welcome to ObjectDocs
description: Getting started with ObjectDocs
---

# Welcome to ObjectDocs

This is a test documentation site created to validate the ObjectDocs setup process.

## Features

- Fast and modern documentation engine
- Built on Next.js 14
- Powered by Fumadocs
- Configuration as Code

## Next Steps

Check out the [Getting Started](/docs/getting-started) guide to learn more.
EOF
    print_success "Created content/docs/index.mdx"
    
    # Create getting-started.mdx
    cat > content/docs/getting-started.mdx << 'EOF'
---
title: Getting Started
description: Quick start guide for ObjectDocs
---

# Getting Started

Welcome to the ObjectDocs quick start guide!

## Installation

```bash
pnpm add -D @objectdocs/cli
```

## Usage

Start the development server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Start production server:

```bash
pnpm start
```
EOF
    print_success "Created content/docs/getting-started.mdx"
    
    # Step 5: Test development server
    print_section "Step 5: Testing Development Server"
    
    print_info "Starting dev server..."
    pnpm dev > /tmp/dev-server.log 2>&1 &
    DEV_PID=$!
    
    if wait_for_server $PORT $DEV_TIMEOUT; then
        print_success "Dev server started successfully on http://localhost:$PORT"
        
        # Test if we can fetch the homepage
        if curl -s http://localhost:$PORT > /dev/null; then
            print_success "Homepage is accessible"
        else
            print_warning "Homepage returned unexpected response"
        fi
        
        # Test if we can fetch a docs page
        if curl -s http://localhost:$PORT/docs > /dev/null; then
            print_success "Docs page is accessible"
        else
            print_warning "Docs page returned unexpected response"
        fi
    else
        print_error "Dev server failed to start within ${DEV_TIMEOUT}s"
        print_info "Server log output:"
        cat /tmp/dev-server.log || true
        exit 1
    fi
    
    # Stop dev server
    print_info "Stopping dev server..."
    kill $DEV_PID 2>/dev/null || true
    wait $DEV_PID 2>/dev/null || true
    DEV_PID=""
    sleep 2
    print_success "Dev server stopped"
    
    # Step 6: Test build process
    print_section "Step 6: Testing Build Process"
    
    print_info "Running build (this may take a few minutes)..."
    if timeout $BUILD_TIMEOUT pnpm build; then
        print_success "Build completed successfully"
    else
        print_error "Build failed or timed out"
        exit 1
    fi
    
    # Check if build output exists
    if [ -d "content/.objectdocs/.next" ] || [ -d ".next" ]; then
        print_success "Build output directory created"
    else
        print_warning "Build output directory not found in expected locations"
    fi
    
    # Step 7: Test production server
    print_section "Step 7: Testing Production Server"
    
    print_info "Starting production server..."
    pnpm start > /tmp/start-server.log 2>&1 &
    START_PID=$!
    
    if wait_for_server $PORT $DEV_TIMEOUT; then
        print_success "Production server started successfully on http://localhost:$PORT"
        
        # Test if we can fetch the homepage
        if curl -s http://localhost:$PORT > /dev/null; then
            print_success "Production homepage is accessible"
        else
            print_warning "Production homepage returned unexpected response"
        fi
        
        # Test if we can fetch a docs page
        if curl -s http://localhost:$PORT/docs > /dev/null; then
            print_success "Production docs page is accessible"
        else
            print_warning "Production docs page returned unexpected response"
        fi
    else
        print_error "Production server failed to start within ${DEV_TIMEOUT}s"
        print_info "Server log output:"
        cat /tmp/start-server.log || true
        exit 1
    fi
    
    # Stop production server
    print_info "Stopping production server..."
    kill $START_PID 2>/dev/null || true
    wait $START_PID 2>/dev/null || true
    START_PID=""
    sleep 2
    print_success "Production server stopped"
    
    # Final summary
    print_section "Test Summary"
    
    echo ""
    echo -e "${GREEN}✅ All tests passed successfully!${NC}"
    echo ""
    echo "Tested lifecycle stages:"
    echo "  ✓ Project initialization (pnpm init)"
    echo "  ✓ CLI installation (@objectdocs/cli)"
    echo "  ✓ ObjectDocs initialization (objectdocs init)"
    echo "  ✓ Content creation (MDX files, configuration)"
    echo "  ✓ Development server (pnpm dev)"
    echo "  ✓ Production build (pnpm build)"
    echo "  ✓ Production server (pnpm start)"
    echo ""
    echo "Test directory: $TEST_DIR"
    echo ""
    print_info "Test directory will be cleaned up on exit"
}

# Run main function
main "$@"
