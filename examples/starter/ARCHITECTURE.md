# Architecture Notes for @objectdocs/site Reference

This document explains how the ObjectDocs CLI references and uses `@objectdocs/site`, and potential alternative approaches for different deployment scenarios.

## Current Approach

### How It Works

The CLI (`@objectdocs/cli`) depends on `@objectdocs/site` as a regular npm dependency:

```json
// packages/cli/package.json
{
  "dependencies": {
    "@objectdocs/site": "workspace:*"  // Converted to "0.2.11" when published
  }
}
```

When commands run (dev, build, start), they resolve the site package location:

```javascript
// packages/cli/src/commands/dev.mjs
let nextAppDir;
try {
  nextAppDir = path.dirname(require.resolve('@objectdocs/site/package.json'));
} catch (e) {
  // Fallback for local development
  nextAppDir = path.resolve(__dirname, '../../../site');
}
```

This approach:
- ✅ Works in monorepo (falls back to relative path)
- ✅ Works when installed from npm (resolves from node_modules)
- ✅ Keeps the site package decoupled from user projects
- ✅ Allows easy updates via npm

### Published Package Structure

When `@objectdocs/site` is published, it includes:

```
@objectdocs/site/
├── package.json
├── next.config.mjs
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── [lang]/docs/[[...slug]]/page.tsx
├── lib/
├── middleware.ts
├── source.config.ts
└── ...
```

The CLI runs Next.js commands (dev, build, start) directly in this package directory.

## Why This Approach Works

1. **Clean Separation**: User projects only need content, not Next.js config
2. **Easy Updates**: Update CLI → automatically updates site engine
3. **Consistent Behavior**: All users get the same site functionality
4. **Simple Setup**: No need to scaffold Next.js files

## Potential Issues and Solutions

### Issue 1: Vercel Cannot Find @objectdocs/site

**Symptom**: Build fails with "Cannot find module '@objectdocs/site'"

**Cause**: 
- CLI package.json has incorrect dependency reference
- npm/pnpm didn't resolve workspace reference correctly during publish

**Solution**:
- Verify published CLI has correct dependency: `npm view @objectdocs/cli dependencies`
- Should show `"@objectdocs/site": "0.2.11"` not `"workspace:*"`
- If incorrect, republish with proper workspace protocol resolution

### Issue 2: Next.js Config Not Found

**Symptom**: "Could not find next.config.js"

**Cause**: 
- Package files filter excludes necessary files
- .gitignore accidentally ignores published files

**Solution**:
- Add `files` field to site package.json:
  ```json
  {
    "files": [
      "app",
      "lib",
      "public",
      "*.mjs",
      "*.ts",
      "*.tsx",
      "*.json"
    ]
  }
  ```

### Issue 3: Build Output Not Found

**Symptom**: Build succeeds but .next directory is empty

**Cause**: CLI copies build output, but paths are incorrect

**Solution**: Already handled in build.mjs with proper path resolution

## Alternative Approaches Considered

### Approach 1: Copy Site Files to User Project (Rejected)

**Idea**: CLI scaffolds entire Next.js app in user's project

**Pros**:
- More transparent (users see all files)
- No node_modules dependency resolution needed

**Cons**:
- ❌ Much harder to update (users have modified files)
- ❌ Breaks "configuration as code" philosophy
- ❌ Huge initial scaffolding
- ❌ Users need to understand Next.js

**Verdict**: Rejected - goes against core philosophy

### Approach 2: Bundle Site in CLI (Rejected)

**Idea**: Bundle @objectdocs/site directly into CLI package

**Pros**:
- Single package to install
- No dependency resolution issues

**Cons**:
- ❌ Huge package size
- ❌ Can't update site without updating CLI
- ❌ Makes development harder

**Verdict**: Rejected - poor developer experience

### Approach 3: Peer Dependency (Rejected)

**Idea**: Make @objectdocs/site a peer dependency

**Pros**:
- User explicitly installs site package
- Version control flexibility

**Cons**:
- ❌ More complex setup for users
- ❌ Can lead to version mismatches
- ❌ Defeats purpose of simple CLI

**Verdict**: Rejected - too complex for users

### Approach 4: Dynamic Import (Possible Future)

**Idea**: Download site package on first run if not present

**Pros**:
- Smaller initial CLI package
- Can cache multiple versions

**Cons**:
- Complex implementation
- Slower first run
- Network dependency

**Verdict**: Consider for future if other issues arise

## Current Solution: Hybrid Approach ✅

The current approach (dependency + fallback) is optimal:

```javascript
let nextAppDir;
try {
  // Production: resolve from node_modules
  nextAppDir = path.dirname(require.resolve('@objectdocs/site/package.json'));
} catch (e) {
  // Development: fallback to monorepo
  nextAppDir = path.resolve(__dirname, '../../../site');
}
```

**Why it's best**:
- ✅ Works in both development and production
- ✅ Simple for users (just install CLI)
- ✅ Easy to update
- ✅ Clean separation of concerns
- ✅ Standard npm dependency resolution

## Vercel-Specific Considerations

Vercel deploys work because:

1. **Dependency Resolution**: Vercel runs `pnpm install` which installs `@objectdocs/cli` and its dependencies (including `@objectdocs/site`)

2. **Build Command**: `pnpm build` → `objectdocs build` resolves site from node_modules

3. **Node Modules**: All packages are available in Vercel's build environment

4. **Output**: Build copies .next to project root, which Vercel deploys

**No special configuration needed!**

## Testing Standalone Installation

To verify the approach works outside the monorepo:

```bash
# Create test directory
mkdir /tmp/test-objectdocs
cd /tmp/test-objectdocs

# Install CLI from npm
pnpm init
pnpm add -D @objectdocs/cli

# Verify site is installed
ls -la node_modules/@objectdocs/site

# Create content
mkdir -p content/docs
echo '{"pages":["index"]}' > content/docs/meta.json
echo '---\ntitle: Test\n---\n# Test' > content/docs/index.mdx

# Test
pnpm exec objectdocs build
```

## Recommendations

1. **For maintainers**: Keep the current approach, ensure proper publishing

2. **For users**: Just install `@objectdocs/cli`, everything else is automatic

3. **For Vercel**: No special configuration needed, standard Next.js deployment works

4. **For debugging**: Check that `@objectdocs/site` is in `node_modules` and has all app files

## Conclusion

The current architecture is sound. Any deployment issues are likely due to:
- Incorrect package publishing (workspace:* not resolved)
- User project configuration errors
- Network/registry issues

The `example` folder demonstrates the correct setup and can be used to validate deployments.
