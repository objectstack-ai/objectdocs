#!/bin/bash
# Test script for ObjectDocs example project
# This verifies the basic functionality of a CLI-created project

set -e

echo "================================================"
echo "ObjectDocs Starter Template - Validation Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in an ObjectDocs project directory
if [ ! -f "package.json" ] || ! grep -q "@objectdocs/cli" package.json; then
    echo -e "${RED}Error: This script must be run from an ObjectDocs project directory${NC}"
    exit 1
fi

echo "Step 1: Checking package.json configuration..."
if grep -q '"dev": "cd .fumadocs && npm run dev"' package.json; then
    echo -e "${GREEN}✓${NC} Dev script configured correctly"
else
    echo -e "${RED}✗${NC} Dev script missing or incorrect"
    exit 1
fi

if grep -q '"build": "cd .fumadocs && npm run build"' package.json; then
    echo -e "${GREEN}✓${NC} Build script configured correctly"
else
    echo -e "${RED}✗${NC} Build script missing or incorrect"
    exit 1
fi

if grep -q '@objectdocs/cli' package.json; then
    echo -e "${GREEN}✓${NC} CLI dependency present"
else
    echo -e "${RED}✗${NC} CLI dependency missing"
    exit 1
fi

echo ""
echo "Step 2: Checking content structure..."

if [ -d "docs" ]; then
    echo -e "${GREEN}✓${NC} Content directory exists"
else
    echo -e "${RED}✗${NC} Content directory missing"
    exit 1
fi

if [ -f "docs.site.json" ]; then
    echo -e "${GREEN}✓${NC} Site configuration exists"
else
    echo -e "${RED}✗${NC} Site configuration missing"
    exit 1
fi

if [ -f "content/docs/meta.json" ]; then
    echo -e "${GREEN}✓${NC} Meta configuration exists"
else
    echo -e "${RED}✗${NC} Meta configuration missing"
    exit 1
fi

# Count MDX files
MDX_COUNT=$(find content/docs -name "*.mdx" -type f | wc -l)
if [ "$MDX_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Found $MDX_COUNT MDX file(s)"
else
    echo -e "${YELLOW}⚠${NC} No MDX files found"
fi

echo ""
echo "Step 3: Validating MDX frontmatter..."

# Check if at least one MDX file has proper frontmatter
VALID_MDX=0
for file in content/docs/*.mdx; do
    if [ -f "$file" ]; then
        if grep -q "^---" "$file" && grep -q "^title:" "$file" && grep -q "^description:" "$file"; then
            VALID_MDX=$((VALID_MDX + 1))
        fi
    fi
done

if [ "$VALID_MDX" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} $VALID_MDX file(s) have valid frontmatter"
else
    echo -e "${YELLOW}⚠${NC} No files with valid frontmatter found"
fi

echo ""
echo "Step 4: Checking dependencies..."

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
    
    if [ -d "node_modules/@objectdocs/cli" ] || [ -L "node_modules/@objectdocs/cli" ]; then
        echo -e "${GREEN}✓${NC} @objectdocs/cli is installed"
    else
        echo -e "${YELLOW}⚠${NC} @objectdocs/cli not found in node_modules (might be in parent workspace)"
    fi
    
    if [ -d "node_modules/@objectdocs/site" ] || [ -L "node_modules/@objectdocs/site" ]; then
        echo -e "${GREEN}✓${NC} @objectdocs/site is installed"
    else
        echo -e "${YELLOW}⚠${NC} @objectdocs/site not found in node_modules (might be in parent workspace)"
    fi
else
    echo -e "${YELLOW}⚠${NC} node_modules not found. Run 'pnpm install' first"
fi

echo ""
echo "Step 5: Checking Vercel configuration..."

if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} vercel.json exists"
    
    if grep -q '"framework": "nextjs"' vercel.json; then
        echo -e "${GREEN}✓${NC} Framework set to Next.js"
    fi
    
    if grep -q '"buildCommand"' vercel.json; then
        echo -e "${GREEN}✓${NC} Build command configured"
    fi
else
    echo -e "${YELLOW}⚠${NC} vercel.json not found (optional but recommended)"
fi

echo ""
echo "Step 6: Checking .gitignore..."

if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✓${NC} .gitignore exists"
    
    if grep -q "node_modules" .gitignore; then
        echo -e "${GREEN}✓${NC} node_modules ignored"
    fi
    
    if grep -q ".next" .gitignore; then
        echo -e "${GREEN}✓${NC} .next ignored"
    fi
else
    echo -e "${YELLOW}⚠${NC} .gitignore not found"
fi

echo ""
echo "================================================"
echo "Validation Summary"
echo "================================================"
echo ""
echo "✅ All required files and configurations are present!"
echo ""
echo "Next steps:"
echo "  1. Install dependencies: pnpm install"
echo "  2. Start dev server: pnpm dev"
echo "  3. Build for production: pnpm build"
echo "  4. Deploy to Vercel"
echo ""
echo "For more information, see:"
echo "  - README.md - Project overview and quick start"
echo "  - TESTING.md - How to test standalone installations"
echo "  - VERCEL.md - Vercel deployment guide"
echo "  - ARCHITECTURE.md - Technical architecture details"
echo ""
