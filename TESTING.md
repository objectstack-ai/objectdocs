# ObjectDocs Testing Guide

This document describes how to test ObjectDocs across different scenarios and environments.

## Test Scripts Overview

ObjectDocs provides multiple test scripts to validate the complete lifecycle of documentation site creation, from initialization to production deployment.

### Available Test Scripts

#### 1. `test-site.sh` - Complete Lifecycle Test

**Purpose**: Comprehensive end-to-end test covering the entire ObjectDocs workflow.

**What it tests**:
- ✅ Project initialization (`pnpm init`)
- ✅ CLI installation (`@objectdocs/cli`)
- ✅ ObjectDocs initialization (`objectdocs init`)
- ✅ Content creation (MDX files, configuration)
- ✅ Development server startup and accessibility
- ✅ Production build compilation
- ✅ Production server startup and accessibility

**Usage**:
```bash
./test-site.sh
```

**Duration**: ~2-5 minutes (includes server startup tests)

**Requirements**:
- Node.js
- pnpm
- curl (for HTTP testing)
- Available port 7777
- `timeout` command (Linux) or `gtimeout` (macOS via homebrew: `brew install coreutils`)
  - Note: Test will run without timeout protection if command is not available

**Output**: Detailed step-by-step progress with color-coded success/failure indicators.

#### 2. `test-quick.sh` - Quick Build Test

**Purpose**: Fast CI/CD-friendly test that validates build process without running servers.

**What it tests**:
- ✅ Project initialization
- ✅ CLI installation
- ✅ ObjectDocs initialization
- ✅ Content creation
- ✅ Build compilation
- ✅ Build output verification

**Usage**:
```bash
./test-quick.sh
```

**Duration**: ~1-2 minutes

**Requirements**:
- Node.js
- pnpm

**Output**: Minimal output focused on build success.

#### 3. `examples/starter/validate.sh` - Starter Template Validation

**Purpose**: Validates the example starter template structure and configuration.

**What it tests**:
- ✅ package.json configuration
- ✅ Content directory structure
- ✅ Configuration files (docs.site.json, meta.json)
- ✅ MDX frontmatter validity
- ✅ Dependencies installation
- ✅ Vercel configuration
- ✅ .gitignore setup

**Usage**:
```bash
cd examples/starter
./validate.sh
```

**Duration**: < 10 seconds

**Requirements**: None (static file validation only)

## Testing Scenarios

### 1. Local Development Testing

When working on ObjectDocs itself:

```bash
# In the monorepo root
pnpm install
pnpm build

# Run comprehensive test
./test-site.sh
```

### 2. CI/CD Testing

For automated testing in CI/CD pipelines:

```bash
# Quick test (recommended for CI)
./test-quick.sh

# Or full test if time permits
./test-site.sh
```

Add to your CI configuration:
```yaml
# .github/workflows/test.yml
- name: Run ObjectDocs tests
  run: |
    chmod +x ./test-quick.sh
    ./test-quick.sh
```

### 3. Testing Standalone Installation

To test as an end user would experience it (outside monorepo):

```bash
# Create a temporary directory
mkdir /tmp/objectdocs-standalone-test
cd /tmp/objectdocs-standalone-test

# Initialize project
pnpm init -y

# Install CLI from npm (or local tarball)
pnpm add -D @objectdocs/cli

# Configure scripts
cat > package.json << 'EOF'
{
  "name": "test-site",
  "scripts": {
    "dev": "objectdocs dev",
    "build": "objectdocs build",
    "start": "objectdocs start"
  },
  "devDependencies": {
    "@objectdocs/cli": "latest"
  }
}
EOF

# Initialize ObjectDocs
pnpm objectdocs init

# Create content
mkdir -p content/docs
# ... add your content files

# Test
pnpm build
pnpm start
```

### 4. Testing with npm pack

For pre-release testing:

```bash
# In the monorepo
cd packages/cli
pnpm pack
# Creates objectdocs-cli-X.X.X.tgz

# In a test directory
mkdir /tmp/test-tarball
cd /tmp/test-tarball
pnpm init -y
pnpm add -D ../../packages/cli/objectdocs-cli-X.X.X.tgz

# Continue with normal setup
```

## Manual Testing Checklist

When preparing for a release, manually verify:

### Development Workflow
- [ ] `pnpm objectdocs init` creates `.fumadocs` directory
- [ ] `pnpm dev` starts development server on port 7777
- [ ] Hot reload works when editing MDX files
- [ ] Hot reload works when editing `meta.json`
- [ ] Hot reload works when editing `docs.site.json`

### Build Process
- [ ] `pnpm build` completes without errors
- [ ] Build output is created in `content/.fumadocs/.next`
- [ ] No TypeScript errors
- [ ] No ESLint errors (if configured)

### Production Server
- [ ] `pnpm start` runs the production build
- [ ] All pages are accessible
- [ ] Navigation works correctly
- [ ] Search functionality works (if enabled)
- [ ] Dark mode toggle works

### Content Features
- [ ] MDX frontmatter is parsed correctly
- [ ] Code blocks render with syntax highlighting
- [ ] Callouts and custom components render
- [ ] Internal links work
- [ ] External links work
- [ ] Images load correctly

### Configuration
- [ ] Branding (name, logo) appears correctly
- [ ] Navigation links appear in header
- [ ] Sidebar structure matches `meta.json`
- [ ] SEO meta tags are generated

## Troubleshooting

### Common Test Failures

#### "Port 7777 already in use"

**Solution**:
```bash
# Kill any process using port 7777
lsof -ti:7777 | xargs kill -9

# Or use a different port
PORT=8888 ./test-site.sh
```

#### "Build timeout"

**Cause**: Build taking longer than 5 minutes.

**Solution**: Increase `BUILD_TIMEOUT` in test script or check for build errors:
```bash
cd /tmp/objectdocs-test-*
pnpm build
```

#### "Cannot find module '@objectdocs/site'"

**Cause**: CLI not finding the site package.

**Solution**: Ensure you've built the monorepo first:
```bash
cd /home/runner/work/objectdocs/objectdocs
pnpm install
pnpm build
```

#### "Dev server failed to start"

**Cause**: Port conflict or build error.

**Solution**: Check the server logs:
```bash
cat /tmp/dev-server.log
```

### Debug Mode

Run tests with verbose output:

```bash
# Enable bash debug mode
bash -x ./test-site.sh

# Or add set -x to the script temporarily
```

## Test Coverage

### What is Tested
- ✅ CLI installation and initialization
- ✅ Content creation workflow
- ✅ Development server functionality
- ✅ Production build process
- ✅ Production server functionality
- ✅ Configuration file validation
- ✅ MDX file parsing

### What is NOT Tested (Yet)
- ⚠️ Translation features (`objectdocs translate`)
- ⚠️ Interactive UI components
- ⚠️ Search functionality
- ⚠️ Browser-based E2E tests
- ⚠️ Multiple language support
- ⚠️ Theme customization

## Contributing Test Improvements

When adding new features to ObjectDocs, please:

1. **Update test scripts** if the feature affects the core workflow
2. **Add manual test steps** to this document
3. **Document new configuration** that should be validated
4. **Add edge cases** to the test suite

### Adding a New Test Script

1. Create the script in the root directory
2. Make it executable: `chmod +x test-name.sh`
3. Document it in this file
4. Add it to CI configuration if appropriate

### Test Script Standards

All test scripts should:
- Use `set -e` to exit on errors
- Include color-coded output
- Clean up temporary files on exit
- Provide clear success/failure messages
- Include a summary section
- Be idempotent (can run multiple times safely)

## References

- [examples/starter/TESTING.md](./examples/starter/TESTING.md) - Standalone testing guide
- [examples/starter/validate.sh](./examples/starter/validate.sh) - Template validation script
- [README.md](./README.md) - Main project documentation
