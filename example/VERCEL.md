# Vercel Deployment Guide

This guide explains how to deploy the ObjectDocs example project (or any CLI-created project) to Vercel.

## Prerequisites

- A Vercel account (free tier works)
- A GitHub/GitLab/Bitbucket repository (or use Vercel CLI)
- Node.js 18+ configured in Vercel

## Deployment Methods

### Method 1: Via Vercel Dashboard (Recommended)

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-docs.git
   git push -u origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Configure project settings:
     - **Framework Preset**: Next.js (auto-detected)
     - **Root Directory**: `.` (or `example` if in monorepo)
     - **Build Command**: `pnpm build` (auto-detected from package.json)
     - **Output Directory**: `.next` (auto-detected)
     - **Install Command**: `pnpm install`

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your site

### Method 2: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from example directory**
   ```bash
   cd example
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Configure settings (or use defaults)

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Configuration

### vercel.json (Optional)

The example includes a `vercel.json` file with recommended settings:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

These settings help Vercel auto-detect the correct build configuration.

### Environment Variables

If using AI translation or other features:

1. Go to Project Settings → Environment Variables
2. Add required variables:
   - `OPENAI_API_KEY` (for translation)
   - `OPENAI_BASE_URL` (optional, for custom endpoints)

### Build Settings

Vercel auto-detects Next.js projects. If you need custom settings:

- **Framework**: Next.js
- **Node.js Version**: 18.x or 20.x
- **Package Manager**: pnpm (recommended) or npm
- **Build Command**: `pnpm build` or `objectdocs build`
- **Output Directory**: `.next`

## Troubleshooting Vercel Deployment

### Issue 1: "Cannot find module '@objectdocs/site'"

**Cause**: The CLI package.json uses `workspace:*` reference instead of npm version.

**Solution**: 
- Ensure `@objectdocs/cli` package.json has proper dependency:
  ```json
  {
    "dependencies": {
      "@objectdocs/site": "^0.2.11"  // NOT "workspace:*"
    }
  }
  ```
- Republish the CLI package if needed

### Issue 2: Build fails with "Module not found"

**Cause**: Missing dependencies or incorrect package resolution.

**Solution**:
```bash
# Clear lock file and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue 3: "next: command not found"

**Cause**: The CLI can't locate Next.js from `@objectdocs/site`.

**Solution**: 
- Check that `@objectdocs/site` is properly installed as a dependency of `@objectdocs/cli`
- Verify the CLI's require.resolve logic in dev.mjs and build.mjs

### Issue 4: Site builds but pages are blank

**Cause**: Content directory not found or `DOCS_DIR` env var incorrect.

**Solution**:
- Ensure `content/docs/` exists with proper structure
- Check that `meta.json` and `.mdx` files are committed
- Verify frontmatter in MDX files is correct

### Issue 5: Deployment succeeds but runtime errors

**Cause**: Production build has different behavior than dev.

**Solution**:
- Test production build locally first:
  ```bash
  pnpm build
  pnpm start
  ```
- Check Vercel function logs in dashboard
- Verify all dependencies are in `dependencies` not `devDependencies`

## Verifying Successful Deployment

After deployment, verify:

1. ✅ Site loads at the Vercel URL
2. ✅ All pages are accessible
3. ✅ Navigation works (sidebar, header links)
4. ✅ Dark mode toggle works
5. ✅ Search functionality works (if enabled)
6. ✅ Images and assets load correctly
7. ✅ No console errors in browser

## Production Optimization

### 1. Static Site Generation (SSG)

For better performance, configure static export in `content/docs.site.json`:

```json
{
  "build": {
    "output": "export"
  }
}
```

This generates static HTML files that deploy faster and cost less.

### 2. Image Optimization

Place images in the `public/` directory and reference them with absolute paths:

```markdown
![Logo](/images/logo.png)
```

### 3. Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Continuous Deployment

Once connected to Git:

1. **Automatic Deploys**: Push to main branch triggers production deployment
2. **Preview Deploys**: Pull requests get preview URLs
3. **Rollback**: Easy rollback to previous deployments in dashboard

## Cost Considerations

- **Free Tier**: Suitable for documentation sites
  - 100GB bandwidth/month
  - Serverless function execution
  - Automatic HTTPS

- **Pro Tier**: For larger sites or teams
  - 1TB bandwidth/month
  - Advanced analytics
  - Team collaboration

## Next Steps

- Configure custom domain
- Set up preview deployments for PRs
- Add analytics (Vercel Analytics or Google Analytics)
- Optimize images and assets
- Set up monitoring and alerts

## Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Open an issue in the ObjectDocs repository
4. Contact Vercel support (Pro tier)

## Example Deployment URLs

After deployment, your site will be available at:
- Production: `https://your-project.vercel.app`
- Custom Domain: `https://docs.yourcompany.com` (if configured)
- Preview: `https://your-project-git-branch.vercel.app` (for branches)
