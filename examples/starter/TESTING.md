# Testing Outside Monorepo

To properly test the example as a standalone project (simulating a real user's setup), you need to test it outside the monorepo context.

## Why This Matters

Inside the monorepo:
- pnpm workspace resolution may interfere
- Dependencies might resolve to workspace packages instead of npm
- The test doesn't accurately represent a user's experience

## How to Test Properly

### Method 1: Test in a separate directory

1. Copy the example folder to a location outside the monorepo:

```bash
# From the monorepo root
cp -r example /tmp/objectdocs-test
cd /tmp/objectdocs-test
```

2. Install dependencies fresh:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
```

### Method 2: Test via npm pack (Recommended for CI)

This method is closer to how users would install from npm:

1. Build and pack the CLI package:

```bash
cd packages/cli
pnpm pack
# This creates objectdocs-cli-0.2.11.tgz
```

2. Create a test directory:

```bash
mkdir /tmp/test-standalone
cd /tmp/test-standalone
```

3. Initialize and install from the packed tarball:

```bash
pnpm init
pnpm add -D ../path/to/objectdocs-cli-0.2.11.tgz
```

4. Copy the content structure:

```bash
cp -r /path/to/examples/starter/content .
```

5. Add scripts to package.json and test.

### Method 3: Test with published npm version

Once the packages are published to npm:

```bash
mkdir /tmp/test-npm
cd /tmp/test-npm
pnpm init
pnpm add -D @objectdocs/cli
# Copy content directory
pnpm dev
```

## Verifying Correct Behavior

When testing outside the monorepo, verify:

1. ✅ `@objectdocs/cli` installs from npm (or tarball)
2. ✅ `@objectdocs/site` is pulled as a dependency of the CLI
3. ✅ Development server starts without errors
4. ✅ Build completes successfully
5. ✅ Generated output is correct (.next or out directory)
6. ✅ Production server runs without issues

## Common Issues

### Issue: "Cannot find module '@objectdocs/site'"

This happens when:
- The CLI package.json has `workspace:*` for `@objectdocs/site`
- Solution: Ensure published version has proper version number

### Issue: Different behavior in monorepo vs standalone

This is expected due to workspace resolution. Always test in standalone mode before release.

## Automated Testing Script

Create this script for CI/CD testing:

```bash
#!/bin/bash
set -e

echo "Testing ObjectDocs standalone installation..."

# Create temp directory
TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

# Initialize project
npm init -y

# Install CLI
npm install -D @objectdocs/cli@latest

# Create content structure
mkdir -p content/docs
cat > content/docs.site.json << 'EOF'
{
  "branding": { "name": "Test Site" }
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
# Test
EOF

# Add scripts
npm pkg set scripts.dev="objectdocs dev"
npm pkg set scripts.build="objectdocs build"

# Test build
echo "Running build..."
npm run build

echo "✅ Standalone test passed!"
```

Save as `test-standalone.sh` and run with `bash test-standalone.sh`.
