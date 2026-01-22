# ObjectDocs

<div align="center">
  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js">
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript">
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
    </a>
    <a href="https://fumadocs.vercel.app">
      <img src="https://img.shields.io/badge/Powered_by-Fumadocs-purple?style=flat-square" alt="Fumadocs">
    </a>
  </p>

  <h3>Next-Gen Documentation Engine for the Low-Code Era.</h3>
  <p>Configuration as Code. Interactive Components. Enterprise Ready.</p>

  <br />

  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fobjectstack-ai%2Fobjectdocs">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
</div>

---

## 📖 Introduction

**ObjectDocs** is a modern, metadata-driven documentation engine architected for the **ObjectStack** ecosystem. Built on top of **Next.js 14 (App Router)** and **Fumadocs**, it redefines how enterprise documentation is maintained.

Unlike traditional static site generators, ObjectDocs adopts a strict **Separation of Concerns** philosophy:
* **Presentation**: Handled by a standardized, logic-free React layer provided by `@objectdocs/site`.
* **Configuration**: Defined purely in JSON (`docs.site.json`, `meta.json`).
* **Content**: Written in MDX with native support for low-code components.

This architecture allows developers and technical writers to manage complex, multi-product documentation sites without touching a single line of UI code.

## ✨ Key Features

* **🚀 Metadata-Driven Architecture**
    Control navigation, sidebars, SEO, and branding entirely via `docs.site.json` and local `meta.json` files. Zero React knowledge required for content maintainers.

* **🧩 Low-Code Native**
    Seamlessly embed live, interactive components directly within your Markdown.

* **🤖 AI Translation**
    Built-in CLI command to automatically translate documentation using OpenAI.

* **🎨 Enterprise-Grade UI**
    Polished interface built on **Radix UI** and **Tailwind CSS**, featuring automatic dark mode, spotlight effects, and accessible primitives out of the box.

## 🚀 Quick Start

### Option 1: In Any Existing Project (Recommended)

Initialize ObjectDocs in any existing GitHub project without polluting the root directory:

```bash
cd your-existing-project
npx @objectdocs/cli init
```

This will:
- Create `content/package.json` with necessary scripts
- Copy the site engine to `content/.objectdocs`
- Install dependencies in `content/.objectdocs/node_modules`
- Automatically add `content/.objectdocs` and `content/node_modules` to `.gitignore`
- Keep your project root clean and unpolluted

Then add content and start the server:

```bash
mkdir -p content/docs

cat > content/docs/index.mdx << 'EOF'
---
title: Welcome
description: My new docs site
---

# Hello World

Welcome to ObjectDocs!
EOF

cat > content/docs/meta.json << 'EOF'
{
  "pages": ["index"]
}
EOF

# Start the development server
cd content && npm run dev
```

Visit http://localhost:7777 to see your site.

### Option 2: New Standalone Project

For a new dedicated documentation project:

```bash
mkdir my-docs
cd my-docs
npm init -y
npm install -D @objectdocs/cli
```

Add scripts to your root `package.json`:

```json
{
  "scripts": {
    "dev": "cd content && npm run dev",
    "build": "cd content && npm run build",
    "start": "cd content && npm run start"
  }
}
```

Initialize ObjectDocs:

```bash
npm run init
# or
npx objectdocs init
```

Then follow the same steps as Option 1 to add content.

## 🏗️ Project Structure

ObjectDocs enforces a clear directory structure to ensure maintainability at scale:

```text
.
├── content/               # [Data Layer] All documentation files
│   ├── package.json       # npm scripts (dev, build, start)
│   ├── .objectdocs/       # Site engine (auto-generated, gitignored)
│   ├── docs.site.json     # Global settings (Nav, Logo, Branding)
│   └── docs/
│       ├── meta.json      # Directory structure & sorting control
│       └── index.mdx      # Documentation content
├── package.json           # (Optional) Root project package.json
└── ...
```

**Key Points:**
- All documentation-related files are in `content/`
- `content/.objectdocs/` is auto-generated and gitignored
- Your project root remains clean
- Perfect for adding docs to any existing project

## ⚙️ Configuration

ObjectDocs is designed to be "Configuration as Code".

### Global Config (`content/docs.site.json`)

Manage global navigation, branding, and feature flags:

```json
{
  "branding": {
    "name": "ObjectStack",
    "logo": {
       "light": "/logo.svg",
       "dark": "/logo-dark.svg"
    }
  },
  "links": [
    { "text": "Guide", "url": "/docs" },
    { "text": "GitHub", "url": "https://github.com/objectstack-ai", "icon": "github" }
  ]
}
```

### Sidebar Control (`content/**/meta.json`)

Control the sidebar order and structure using local metadata files in each directory:

```json
{
  "title": "Getting Started",
  "pages": [
    "introduction",
    "---Installation---",
    "quick-start",
    "configuration"
  ]
}
```

## 📦 Packages

This repository is a monorepo managed by pnpm workspaces:

- **[@objectdocs/cli](./packages/cli)**: The command-line interface for building and developing sites.
- **[@objectdocs/site](./packages/site)**: The core Next.js application template.

## 📚 Examples

- **[examples/starter](./examples/starter)**: A complete starter template demonstrating the recommended project structure. Includes comprehensive documentation on architecture, testing, and deployment guides. Ready for production use on Vercel and other platforms.

## 🧪 Testing

ObjectDocs includes comprehensive test scripts to validate the complete lifecycle:

```bash
# Quick build test (recommended for CI)
pnpm test:quick

# Full lifecycle test (includes server startup tests)
pnpm test:site
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
