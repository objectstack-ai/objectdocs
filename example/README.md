# ObjectDocs Example Project

This is an **example project** that demonstrates how a documentation site created with the ObjectDocs CLI works in a real-world scenario. It's designed to test and validate deployment on platforms like Vercel.

## 📋 Purpose

This example serves multiple purposes:

1. **Testing Reference**: Validate that CLI-created projects can be deployed successfully
2. **Deployment Guide**: Demonstrate the correct setup for production deployments
3. **Integration Test**: Ensure `@objectdocs/cli` and `@objectdocs/site` work together correctly when installed from npm (not workspace)

## 🎯 Key Differences from `examples/starter`

- **Real npm packages**: Uses `@objectdocs/cli` from npm registry (not `workspace:*`)
- **Standalone setup**: Completely independent from the monorepo
- **Vercel-ready**: Configured for deployment on Vercel and other platforms
- **Production representative**: Mirrors exactly how a user would create a project

## 📁 Project Structure

```
example/
├── content/
│   ├── docs.site.json       # Global site configuration
│   └── docs/
│       ├── meta.json        # Sidebar navigation structure
│       ├── index.mdx        # Home page
│       ├── getting-started.mdx
│       └── configuration.mdx
├── public/                  # Static assets (logos, images)
├── package.json             # Uses @objectdocs/cli from npm
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Navigate to the example directory:

```bash
cd example
```

2. Install dependencies:

```bash
pnpm install
```

This will install `@objectdocs/cli` from npm, which in turn will pull `@objectdocs/site` as a dependency.

### Development

Start the development server:

```bash
pnpm dev
```

The site will be available at [http://localhost:7777](http://localhost:7777).

### Building

Build the project for production:

```bash
pnpm build
```

This will generate the production build in the `.next` directory.

### Production Server

Start the production server:

```bash
pnpm start
```

## 🌐 Deploying to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy from the example directory:

```bash
cd example
vercel
```

### Method 2: Using GitHub Integration

1. Push this example to your GitHub repository
2. Import the project in Vercel
3. Set the **Root Directory** to `example`
4. Vercel will auto-detect Next.js settings

### Vercel Configuration

No special configuration is needed. Vercel will automatically:
- Detect the Next.js framework
- Use `pnpm build` (via `objectdocs build`) as the build command
- Use the `.next` directory as the output

## ✅ Testing Checklist

Use this checklist to validate the example works correctly:

- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts the development server
- [ ] All pages load correctly in the browser
- [ ] Navigation works (sidebar, header links)
- [ ] `pnpm build` completes successfully
- [ ] `pnpm start` serves the production build
- [ ] Deployment to Vercel succeeds
- [ ] Deployed site is fully functional

## 🔧 Troubleshooting

### Issue: "Cannot find module '@objectdocs/site'"

**Solution**: Make sure you're using the published version of `@objectdocs/cli` from npm, not a workspace reference.

### Issue: Vercel build fails

**Possible causes**:
1. Using `workspace:*` reference instead of npm version
2. Missing or incorrect `package.json` scripts
3. Node.js version incompatibility

**Solution**: 
- Check that `package.json` uses `"@objectdocs/cli": "^0.2.11"` (or latest version)
- Ensure build script is `"build": "objectdocs build"`
- Verify Node.js version is 18+

### Issue: Broken links or missing content

**Solution**: 
- Verify all pages listed in `meta.json` have corresponding `.mdx` files
- Check that file names match exactly (case-sensitive)
- Ensure frontmatter includes both `title` and `description`

## 📝 Notes for Development

### Updating CLI Version

When a new version of `@objectdocs/cli` is published:

```bash
pnpm up @objectdocs/cli
```

### Adding New Pages

1. Create a new `.mdx` file in `content/docs/`
2. Add the page slug to `content/docs/meta.json`
3. Include proper frontmatter in the MDX file

### Customizing Branding

Edit `content/docs.site.json` to change:
- Site name
- Logo images
- Navigation links
- Build output type

## 🤝 Contributing

This example is part of the ObjectDocs project. If you find issues or have improvements:

1. Test your changes in this example first
2. Ensure deployment still works
3. Submit a PR with clear description

## 📄 License

MIT - Same as the main ObjectDocs project
