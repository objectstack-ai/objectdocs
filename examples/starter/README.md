# ObjectDocs Starter Template

This is a starter template for creating documentation sites with [ObjectDocs](https://github.com/steedos/objectdocs). It comes pre-configured with the necessary directory structure and dependencies to get you started quickly.

## Features

- **Configuration as Code**: Manage site navigation and settings via JSON.
- **MDX Support**: Write content using Markdown mixed with React components.
- **Live Preview**: Fast development server with hot reload.
- **Production Ready**: Optimized static build output.

## Getting Started

### 1. Installation

Install the dependencies:

```bash
pnpm install
```

### 2. Development

Start the development server:

```bash
pnpm docs:dev
```

Open [http://localhost:7777](http://localhost:7777) in your browser to see the result.

### 3. Building

Build the static site for production:

```bash
pnpm docs:build
```

The output will be in the `.next` or configured output directory.

## Project Structure

```bash
.
├── content/
│   ├── docs.site.json      # Global site configuration (branding, nav links)
│   └── docs/               # Documentation content root
│       ├── index.mdx       # Homepage
│       ├── guide.mdx       # Example page
│       └── meta.json       # Sidebar navigation order
├── package.json
└── README.md
```

## Customization

- **Site Name & Logo**: Edit `content/docs.site.json`.
- **Navigation Sidebar**: Edit `content/docs/meta.json` or creating new `meta.json` files in subdirectories.
- **Adding Pages**: Create new `.mdx` files in `content/docs/` and add them to the relevant `meta.json`.

## License

MIT
