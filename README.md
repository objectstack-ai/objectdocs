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

### 1. Create a new project

Initialize your documentation site structure:

```bash
mkdir my-docs
cd my-docs
pnpm init
pnpm add -D @objectdocs/cli
```

### 2. Configure scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "objectdocs dev",
    "build": "objectdocs build",
    "start": "objectdocs start"
  }
}
```

### 3. Add content

Create the basic directory structure:

```bash
mkdir -p content/docs
```

Create `content/docs/index.mdx`:

```mdx
---
title: Welcome
description: My new docs site
---

# Hello World

Welcome to ObjectDocs!
```

Create `content/docs/meta.json`:

```json
{
  "pages": ["index"]
}
```

### 4. Start the server

```bash
pnpm dev
```

Visit http://localhost:7777 to see your site.

## 🏗️ Project Structure

ObjectDocs enforces a clear directory structure to ensure maintainability at scale:

```text
.
├── content/               # [Data Layer] Raw Content
│   ├── docs.site.json     # Global settings (Nav, Logo, Branding)
│   └── docs/
│       ├── meta.json      # Directory structure & sorting control
│       └── index.mdx      # Documentation content
├── package.json
└── ...
```

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

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
