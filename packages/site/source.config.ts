import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { siteConfig } from './lib/site-config';
import path from 'node:path';
import fs from 'node:fs';

function resolveContentDir(dir: string) {
  if (process.env.DOCS_DIR && dir === 'content/docs') return process.env.DOCS_DIR;

  // Try local first (Root deployment)
  if (fs.existsSync(path.resolve(dir))) return dir;
  
  // Try parent (Monorepo/Vercel deployment where CWD is packages/site)
  const parentDir = path.join('../..', dir);
  if (fs.existsSync(path.resolve(parentDir))) return parentDir;

  return dir;
}

const docsDir = resolveContentDir('content/docs');

// Define multiple roots for the documentation
export const core = defineDocs({
  dir: path.join(docsDir, 'core'),
});

export const platform = defineDocs({
  dir: path.join(docsDir, 'platform'),
});

// Export combined docs for backward compatibility
export const docs = core.docs;
export const meta = core.meta;

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      theme: siteConfig.content.codeBlock.theme,
    }
  }
});

