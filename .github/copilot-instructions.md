# ObjectDocs AI Instructions

You are an expert developer and technical writer assisting with **ObjectDocs**, a modern documentation engine built on **Next.js 14 (App Router)** and **Fumadocs**.

## Project Context & Architecture
- **Core Philosophy**: "Configuration as Code". We separate presentation (React), configuration (JSON), and content (MDX).
- **Framework**: Next.js 14+ (App Router), TypeScript, Tailwind CSS.
- **Engine**: Fumadocs (documentation middleware and UI).
- **Ecosystem**: Part of **ObjectStack**. Supports embedding ObjectUI components.

## 🛑 STRICT RULES (Critical)

1.  **NO Hardcoded Sidebars**:
    - NEVER suggest modifying React components (like `layout.tsx`) to change the sidebar or navigation structure.
    - ALWAYS instruct to modify `content/**/meta.json` to change page order or directory structure.
    - `meta.json` format: `{ "title": "...", "pages": ["page-a", "page-b"] }`.

2.  **Global Configuration**:
    - Navigation bar links, logo, and social links are defined in `config/site.json`.
    - Do not hardcode header/footer links in components.

3.  **Next.js App Router**:
    - Use Server Components by default.
    - Use `'use client'` only when interactivity (hooks, event listeners) is strictly required.
    - Use `pnpm` for package management commands.

## 📝 Documentation Writing Guidelines (MDX)

When generating or editing `.mdx` content:
- **Frontmatter**: Always include `title` and `description`.
- **Components**: Use Fumadocs standard components:
    - `<Callout type="info|warn|error">...</Callout>`
    - `<Steps>...</Steps>` for tutorials.
    - `<Cards><Card ... /></Cards>` for navigation grids.
- **Low-Code Embedding**:
    - When asked to document ObjectStack/Steedos features, prefer showing the configuration (JSON/YAML) alongside the visual component explanation.

## 🎨 UI & Styling Guidelines

- **Tailwind CSS**: Use utility classes for styling. Do not use CSS modules unless necessary.
- **Radix UI**: Use Radix primitives for interactive components if standard Fumadocs UI is insufficient.
- **Responsiveness**: Always consider mobile views (`md:`, `lg:` prefixes).

## 🛠️ Common Tasks & Solutions

- **Task**: "Add a new page to the guide."
  - **Solution**: Create `content/docs/guide/new-page.mdx` AND update `content/docs/guide/meta.json` to include `"new-page"` in the `pages` array.

- **Task**: "Change the site name."
  - **Solution**: Update the `branding.name` field in `config/site.json`.

- **Task**: "Fix the build."
  - **Solution**: Check `next.config.mjs` and ensure strict strict separation of client/server components. Verify all linked files in `meta.json` actually exist.
