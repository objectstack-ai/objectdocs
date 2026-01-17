# ObjectDocs

<div align="center">
<p>
<a href="[https://nextjs.org](https://nextjs.org)"><img src="[https://img.shields.io/badge/Next.js-14-black](https://www.google.com/search?q=https://img.shields.io/badge/Next.js-14-black)" alt="Next.js"></a>
<a href="[https://www.typescriptlang.org/](https://www.typescriptlang.org/)"><img src="[https://img.shields.io/badge/TypeScript-5.0-blue](https://www.google.com/search?q=https://img.shields.io/badge/TypeScript-5.0-blue)" alt="TypeScript"></a>
<a href="[https://tailwindcss.com/](https://tailwindcss.com/)"><img src="[https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8](https://www.google.com/search?q=https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8)" alt="Tailwind CSS"></a>
<a href="[https://fumadocs.vercel.app](https://fumadocs.vercel.app)"><img src="[https://img.shields.io/badge/Powered_by-Fumadocs-purple](https://www.google.com/search?q=https://img.shields.io/badge/Powered_by-Fumadocs-purple)" alt="Fumadocs"></a>
</p>

<h3>Next-Gen Documentation Engine for the Low-Code Era.</h3>
<p>Configuration as Code. Interactive Components. Enterprise Ready.</p>
</div>

---

## 📖 Introduction

**ObjectDocs** is a modern documentation site generator built on top of **Next.js (App Router)** and **Fumadocs**.

Unlike traditional static site generators, ObjectDocs adopts a strict **Metadata-Driven Architecture**. We completely separate the **Presentation Layer** (React), **Configuration Layer** (JSON), and **Content Layer** (MDX). This allows developers and technical writers to manage complex, multi-product documentation sites purely through configuration files, without touching a single line of UI code.

It is designed specifically for the **Low-Code ecosystem**, with native support for embedding **Amis** and **Steedos** components directly into your Markdown.

## ✨ Key Features

* **🚀 Metadata-Driven Core**: Control navigation, sidebars, SEO, and branding entirely via `site.json` and `meta.json`.
* **🧩 Low-Code Native**: Embed live, interactive **Amis/Steedos** components directly in MDX.
* **🗂️ Multi-Product Architecture**: Native support for "Root Toggle" to manage documentation for multiple products (e.g., Core vs. UI) in one repo.
* **🎨 Enterprise UI**: Built on **Radix UI** and **Tailwind CSS**, featuring dark mode, spotlight effects, and accessible primitives.
* **⚡ High Performance**: Powered by Next.js App Router and ISR (Incremental Static Regeneration).

## 🏗️ Architecture

ObjectDocs enforces a strict separation of concerns to ensure maintainability:

```text
.
├── content/            # [Data] Raw Content
│   └── docs/           
│       ├── meta.json   # Directory structure & sorting
│       └── index.mdx   # Documentation files
└── app/                # [View] Logic-free Rendering Layer
    └── layout.tsx      # Consumes config/site.json to render UI
├── objectdocs.json     # Global settings (Nav, Logo, SEO, Features)

```

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/objectstack-ai/objectdocs.git
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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚙️ Configuration

ObjectDocs is controlled by a single file: `config/site.json`. You don't need to modify React components to change the look and feel.

### Global Config (`config/site.json`)

```json
{
  "branding": {
    "name": "ObjectDocs",
    "logo": "/logo.svg"
  },
  "navigation": [
    { "text": "Guide", "url": "/docs" },
    { "text": "Components", "url": "/docs/components" },
    { "text": "GitHub", "url": "https://github.com/...", "external": true }
  ],
  "features": {
    "search": true,
    "darkMode": true,
    "rootToggle": true
  }
}

```

### Directory Structure (`content/**/meta.json`)

Control the sidebar order and structure using local metadata files:

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

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=MIT) file for details.