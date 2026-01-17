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
* **Presentation**: Handled by a standardized, logic-free React layer.
* **Configuration**: Defined purely in JSON (`site.json`, `meta.json`).
* **Content**: Written in MDX with native support for low-code components.

This architecture allows developers and technical writers to manage complex, multi-product documentation sites without touching a single line of UI code.

## ✨ Key Features

* **🚀 Metadata-Driven Architecture**
    Control navigation, sidebars, SEO, and branding entirely via `objectdocs.json` and local `meta.json` files. Zero React knowledge required for content maintainers.

* **🧩 Low-Code Native**
    Seamlessly embed live, interactive **Amis** and **Steedos** components directly within your Markdown. Perfect for showcasing live demos of low-code configurations.

* **🗂️ Multi-Product Support**
    Native implementation of "Root Toggle" modes, allowing you to host documentation for multiple products (e.g., `ObjectQL` vs. `ObjectUI`) within a single monorepo and domain.

* **🎨 Enterprise-Grade UI**
    Polished interface built on **Radix UI** and **Tailwind CSS**, featuring automatic dark mode, spotlight effects, and accessible primitives out of the box.

* **⚡ Edge Performance**
    Powered by Next.js App Router and ISR (Incremental Static Regeneration), ensuring instant page loads and excellent SEO.

## 🏗️ Architecture

ObjectDocs enforces a clear directory structure to ensure maintainability at scale:

```text
.
├── content/               # [Data Layer] Raw Content
│   └── docs/
│       ├── meta.json      # Directory structure & sorting control
│       └── index.mdx      # Documentation content
├── config/                # [Config Layer]
│   └── site.json          # Global settings (Nav, Logo, Branding)
└── app/                   # [View Layer] Logic-free Rendering
    └── layout.tsx         # Consumes config to render UI

```

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone [https://github.com/objectstack-ai/objectdocs.git](https://github.com/objectstack-ai/objectdocs.git)
cd objectdocs

```

### 2. Install dependencies

```bash
pnpm install

```

### 3. Run development server

```bash
pnpm dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## ⚙️ Configuration

ObjectDocs is designed to be "Configuration as Code".

### Global Config (`config/site.json`)

Manage global navigation, branding, and feature flags:

```json
{
  "branding": {
    "name": "ObjectStack",
    "logo": "/logo.svg"
  },
  "navigation": [
    { "text": "Guide", "url": "/docs" },
    { "text": "Reference", "url": "/docs/api" },
    { "text": "GitHub", "url": "[https://github.com/objectstack-ai](https://github.com/objectstack-ai)", "external": true }
  ],
  "features": {
    "search": true,
    "darkMode": true,
    "rootToggle": true
  }
}

```

### Sidebar Control (`content/**/meta.json`)

Control the sidebar order and structure using local metadata files in each directory:

```json
{
  "title": "Getting Started",
  "root": true,
  "pages": [
    "introduction",
    "---Installation---",
    "quick-start",
    "configuration"
  ]
}

```

## 🛠️ Tech Stack

* **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
* **Core Engine**: [Fumadocs](https://fumadocs.vercel.app/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Package Manager**: [pnpm](https://pnpm.io/)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=MIT) file for details.
