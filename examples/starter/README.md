# ObjectDocs Starter Template

This is a **starter template** that demonstrates how a documentation site created with the ObjectDocs CLI works. It's designed to serve as both a learning resource and a deployment-ready template.

## 📋 Purpose

This starter template serves multiple purposes:

1. **Quick Start Reference**: Get up and running with ObjectDocs quickly
2. **Deployment Guide**: Demonstrate the correct setup for production deployments
3. **Best Practices**: Show recommended structure and configuration
4. **Testing Reference**: Validate that CLI-created projects work correctly

## 🎯 Key Features

- **Complete Documentation**: Includes comprehensive guides on architecture, testing, and deployment
- **Ready-to-Deploy**: Configured for deployment on Vercel and other platforms
- **Workspace Integration**: Uses workspace dependencies for development
- **Production Representative**: Mirrors exactly how a user would create a project

## 📁 Project Structure

```
examples/starter/
├── content/
│   ├── package.json          # Project configuration and scripts
│   ├── .fumadocs/            # Site engine (created by init command, gitignored)
│   ├── docs.site.json        # Global site configuration
│   ├── public/               # Static assets (logos, images)
│   └── docs/
│       ├── meta.json         # Sidebar navigation structure
│       ├── index.mdx         # Home page
│       ├── getting-started.mdx
│       └── configuration.mdx
└── README.md                 # This file
```

**Key Points:**
- All project files are in `content/`
- `content/package.json` manages dependencies and scripts
- `content/.fumadocs/` is gitignored and not committed

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Navigate to the content directory:

```bash
cd examples/starter/content
```

2. Install dependencies:

```bash
pnpm install
```

3. Initialize ObjectDocs:

```bash
pnpm objectdocs init
```

This command will:
- Copy the `@objectdocs/site` engine to `.fumadocs`
- Install dependencies in `.fumadocs/node_modules`
- Prepare your project for development

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at [http://localhost:7777](http://localhost:7777).

### Building

Build the project for production:

```bash
npm run build
```

This will generate the production build in the `.fumadocs/.next` directory.

### Production Server

Start the production server:

```bash
npm run start
```

## 🌐 Deploying to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy from the content directory:

```bash
cd examples/starter/content
vercel
```

### Method 2: Using GitHub Integration

1. Push this starter to your GitHub repository
2. Import the project in Vercel
3. Set the **Root Directory** to `examples/starter/content`
4. Vercel will auto-detect Next.js settings

### Vercel Configuration

This project includes a `vercel.json` file with Next.js framework detection. Vercel will automatically:
- Detect the Next.js framework
- Use `pnpm build` (via `objectdocs build`) as the build command
- Use the `.next` directory as the output

For more details on Vercel deployment, see [VERCEL.md](./VERCEL.md).

## ✅ Testing Checklist

Use this checklist to validate the starter works correctly:

- [ ] `pnpm install` completes without errors
- [ ] `pnpm objectdocs init` initializes the site successfully
- [ ] `pnpm dev` starts the development server
- [ ] All pages load correctly in the browser
- [ ] Navigation works (sidebar, header links)
- [ ] `pnpm build` completes successfully
- [ ] `pnpm start` serves the production build
- [ ] Deployment to Vercel succeeds
- [ ] Deployed site is fully functional

## 🔧 Troubleshooting

### Issue: "Cannot find module '@objectdocs/site'"

**Solution**: Make sure you're in the monorepo and using workspace references correctly.

### Issue: Vercel build fails

**Possible causes**:
1. Incorrect workspace configuration
2. Missing or incorrect `package.json` scripts
3. Node.js version incompatibility

**Solution**: 
- Check that `package.json` uses `"@objectdocs/cli": "workspace:*"`
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

This starter template is part of the ObjectDocs project. If you find issues or have improvements:

1. Test your changes in this example first
2. Ensure deployment still works
3. Submit a PR with clear description

## 📄 License

MIT - Same as the main ObjectDocs project
