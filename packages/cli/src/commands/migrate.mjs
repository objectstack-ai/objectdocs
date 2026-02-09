/**
 * ObjectDocs
 * Copyright (c) 2026-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Convert a filename or heading into a URL-friendly slug
 * @param {string} text - The text to slugify
 * @returns {string} - The slugified text
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract title from markdown content
 * Looks for the first H1 heading or uses the filename
 * @param {string} content - Markdown content
 * @param {string} filename - Fallback filename
 * @returns {string} - Extracted title
 */
function extractTitle(content, filename) {
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  // Use filename without extension as fallback
  return filename
    .replace(/\.md$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Check if a line is suitable as a description (plain text, not markup)
 * @param {string} line - The trimmed line to check
 * @returns {boolean} - True if the line is plain descriptive text
 */
function isDescriptionLine(line) {
  const nonDescriptionPrefixes = ['#', '!', '```', '-', '|', '<', '[!', '*', '>'];
  return line.length > 0 && !nonDescriptionPrefixes.some(prefix => line.startsWith(prefix));
}

/**
 * Extract description from markdown content
 * Uses the first paragraph after the H1 heading
 * @param {string} content - Markdown content
 * @returns {string} - Extracted description
 */
function extractDescription(content) {
  // Remove the H1 heading
  const withoutH1 = content.replace(/^#\s+.+$/m, '').trim();
  // Find the first non-empty paragraph
  const lines = withoutH1.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (isDescriptionLine(trimmed)) {
      // Truncate long descriptions
      return trimmed.length > 160 ? trimmed.substring(0, 157) + '...' : trimmed;
    }
  }
  return '';
}

/**
 * Convert standard markdown to MDX-compatible format
 * - Adds frontmatter (title, description)
 * - Removes the first H1 heading (title is in frontmatter)
 * - Adjusts relative image paths
 * - Converts HTML comments to MDX-safe format
 * @param {string} content - Original markdown content
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @returns {string} - MDX content with frontmatter
 */
function convertToMdx(content, title, description) {
  let mdx = content;

  // Remove the first H1 heading (will be in frontmatter)
  mdx = mdx.replace(/^#\s+.+\n*/m, '');

  // Remove HTML comments (not valid in MDX)
  mdx = mdx.replace(/<!--[\s\S]*?-->/g, '');

  // Build frontmatter
  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    '---',
  ].join('\n');

  return `${frontmatter}\n\n${mdx.trim()}\n`;
}

/**
 * Migrate a single markdown file to MDX in the docs directory
 * @param {string} sourcePath - Path to the source markdown file
 * @param {string} outputDir - Output directory for MDX files
 * @param {object} options - Migration options
 * @returns {{ slug: string, title: string } | null} - Info about the migrated file
 */
function migrateFile(sourcePath, outputDir, options = {}) {
  if (!fs.existsSync(sourcePath)) {
    console.error(`  ✗ File not found: ${sourcePath}`);
    return null;
  }

  if (fs.statSync(sourcePath).isDirectory()) {
    console.error(`  ✗ Path is a directory, not a file: ${sourcePath}`);
    return null;
  }

  const content = fs.readFileSync(sourcePath, 'utf-8');
  const filename = path.basename(sourcePath);
  const title = extractTitle(content, filename);
  const description = extractDescription(content);

  // Determine output slug
  let slug;
  if (filename.toLowerCase() === 'readme.md') {
    // Use parent directory name for README files
    const parentDir = path.basename(path.dirname(path.resolve(sourcePath)));
    slug = slugify(parentDir === '.' ? 'index' : parentDir);
  } else {
    slug = slugify(filename.replace(/\.md$/i, ''));
  }

  const outputPath = path.join(outputDir, `${slug}.mdx`);

  // Check for existing file
  if (fs.existsSync(outputPath) && !options.overwrite) {
    console.log(`  ⚠ Skipped (already exists): ${outputPath}`);
    console.log(`    Use --overwrite to replace existing files`);
    return null;
  }

  const mdxContent = convertToMdx(content, title, description);

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, mdxContent);
  console.log(`  ✓ ${sourcePath} → ${path.relative(process.cwd(), outputPath)}`);

  return { slug, title };
}

/**
 * Update meta.json to include new pages
 * @param {string} dir - Directory containing meta.json
 * @param {Array<{ slug: string, title: string }>} pages - New pages to add
 */
function updateMetaJson(dir, pages) {
  const metaPath = path.join(dir, 'meta.json');
  let meta = { title: 'Documentation', pages: [] };

  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    } catch (e) {
      console.warn(`  ⚠ Could not parse existing meta.json, creating new one`);
    }
  }

  if (!Array.isArray(meta.pages)) {
    meta.pages = [];
  }

  let added = 0;
  for (const page of pages) {
    if (!meta.pages.includes(page.slug)) {
      meta.pages.push(page.slug);
      added++;
    }
  }

  if (added > 0) {
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
    console.log(`\n  📝 Updated meta.json: added ${added} page(s)`);
  }
}

export function registerMigrateCommand(cli) {
  cli
    .command('migrate [files...]', 'Migrate markdown files to ObjectDocs MDX format')
    .option('--output <dir>', 'Output directory for MDX files', { default: 'content/docs' })
    .option('--overwrite', 'Overwrite existing files')
    .option('--no-meta', 'Skip updating meta.json')
    .action(async (files, options) => {
      console.log('📄 ObjectDocs Content Migration\n');

      // Ensure files is always an array
      if (files && !Array.isArray(files)) {
        files = [files];
      }

      if (!files || files.length === 0) {
        // Auto-detect README.md in current directory
        const readmePath = path.resolve(process.cwd(), 'README.md');
        if (fs.existsSync(readmePath)) {
          files = [readmePath];
          console.log('  Auto-detected README.md in current directory\n');
        } else {
          console.log('Usage:');
          console.log('  objectdocs migrate README.md');
          console.log('  objectdocs migrate docs/*.md');
          console.log('  objectdocs migrate README.md --output content/docs/guide');
          console.log('  objectdocs migrate README.md --overwrite\n');
          console.log('If no files are specified, migrates README.md from the current directory.');
          return;
        }
      }

      const outputDir = path.resolve(process.cwd(), options.output);
      console.log(`  Output: ${path.relative(process.cwd(), outputDir)}\n`);

      const migrated = [];

      for (const file of files) {
        const filePath = path.resolve(process.cwd(), file);
        const result = migrateFile(filePath, outputDir, {
          overwrite: options.overwrite,
        });
        if (result) {
          migrated.push(result);
        }
      }

      if (migrated.length === 0) {
        console.log('\n  No files were migrated.');
        return;
      }

      // Update meta.json unless --no-meta is set
      if (options.meta !== false) {
        updateMetaJson(outputDir, migrated);
      }

      console.log(`\n✅ Migration complete: ${migrated.length} file(s) migrated`);
    });
}
