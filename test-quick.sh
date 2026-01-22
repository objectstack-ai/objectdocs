#!/bin/bash
# Quick test script for CI/CD environments
# Tests basic build functionality without running servers

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_section() {
    echo ""
    echo "================================================"
    echo -e "${BLUE}$1${NC}"
    echo "================================================"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

TEST_DIR="/tmp/objectdocs-quick-test-$(date +%s)"

# Cleanup on exit
cleanup() {
    if [ -d "$TEST_DIR" ]; then
        rm -rf "$TEST_DIR"
    fi
}
trap cleanup EXIT

main() {
    print_section "ObjectDocs Quick Build Test"
    
    # Create test project
    mkdir -p "$TEST_DIR"
    cd "$TEST_DIR"
    
    pnpm init -y
    print_success "Initialized project"
    
    # Install CLI from workspace
    MONOREPO_ROOT="/home/runner/work/objectdocs/objectdocs"
    pnpm add -D "$MONOREPO_ROOT/packages/cli"
    print_success "Installed @objectdocs/cli"
    
    # Configure scripts
    pnpm pkg set scripts.build="objectdocs build"
    
    # Initialize ObjectDocs
    pnpm objectdocs init
    print_success "Initialized ObjectDocs"
    
    # Create minimal content
    mkdir -p content/docs
    
    cat > content/docs.site.json << 'EOF'
{
  "branding": {
    "name": "Test Site"
  }
}
EOF
    
    cat > content/docs/meta.json << 'EOF'
{
  "pages": ["index"]
}
EOF
    
    cat > content/docs/index.mdx << 'EOF'
---
title: Test
description: Test page
---
# Test Page
EOF
    
    print_success "Created content"
    
    # Run build
    print_section "Running Build"
    if pnpm build; then
        print_success "Build completed successfully"
    else
        print_error "Build failed"
        exit 1
    fi
    
    # Check build output
    if [ -d "content/.objectdocs/.next" ] || [ -d ".next" ]; then
        print_success "Build output exists"
    else
        print_error "Build output not found"
        exit 1
    fi
    
    print_section "Summary"
    echo -e "${GREEN}✅ Quick build test passed!${NC}"
}

main "$@"
