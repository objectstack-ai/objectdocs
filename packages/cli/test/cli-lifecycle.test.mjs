/**
 * ObjectDocs CLI Lifecycle Integration Tests
 *
 * Verifies the complete end-user workflow:
 *   1. Initialize a new project repository
 *   2. Run `objectdocs init` to scaffold the documentation site
 *   3. Create documentation content (MDX files, meta.json, config)
 *   4. Run `objectdocs build` to produce a production build
 *
 * These tests use a shared temporary directory and run sequentially
 * to mirror the real user experience.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync, execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_PATH = path.resolve(__dirname, '../bin/cli.mjs');
const MONOREPO_ROOT = path.resolve(__dirname, '../../..');

/** Shared temporary directory for all tests in this suite */
let testDir;

/**
 * Helper: run a CLI command inside the test project directory.
 * Inherits stdio so build/install output is visible in CI logs.
 */
function runCli(args, options = {}) {
  const { cwd = testDir, env: extraEnv = {}, timeout = 300_000 } = options;
  return execFileSync(process.execPath, [CLI_PATH, ...args], {
    cwd,
    timeout,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });
}

describe('CLI Lifecycle: init → content → build', () => {
  beforeAll(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'objectdocs-test-'));
  });

  afterAll(() => {
    if (testDir && fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  // ------------------------------------------------------------------
  // Step 1: The CLI binary loads and prints help without errors
  // ------------------------------------------------------------------
  it('should display help information', () => {
    const output = execFileSync(process.execPath, [CLI_PATH, '--help'], {
      encoding: 'utf-8',
      timeout: 10_000,
    });

    expect(output).toContain('init');
    expect(output).toContain('dev');
    expect(output).toContain('build');
    expect(output).toContain('start');
  });

  // ------------------------------------------------------------------
  // Step 2: Initialize a fresh project with `objectdocs init`
  // ------------------------------------------------------------------
  it('should initialize a new project with objectdocs init', () => {
    // Create a minimal package.json (simulating `npm init -y`)
    fs.writeFileSync(
      path.join(testDir, 'package.json'),
      JSON.stringify({ name: 'test-project', version: '1.0.0' }, null, 2),
    );

    // Run init
    runCli(['init']);

    // --- Assertions ---

    // .fumadocs directory must be created
    const fumadocsDir = path.join(testDir, 'content', '.fumadocs');
    expect(fs.existsSync(fumadocsDir)).toBe(true);

    // .fumadocs should contain a package.json (the site engine)
    expect(fs.existsSync(path.join(fumadocsDir, 'package.json'))).toBe(true);

    // content/package.json should be created with dev/build/start scripts
    const contentPkg = JSON.parse(
      fs.readFileSync(path.join(testDir, 'content', 'package.json'), 'utf-8'),
    );
    expect(contentPkg.scripts).toBeDefined();
    expect(contentPkg.scripts.dev).toContain('.fumadocs');
    expect(contentPkg.scripts.build).toContain('.fumadocs');
    expect(contentPkg.scripts.start).toContain('.fumadocs');

    // .gitignore should include content/.fumadocs
    const gitignore = fs.readFileSync(path.join(testDir, '.gitignore'), 'utf-8');
    expect(gitignore).toContain('content/.fumadocs');

    // node_modules should be installed inside .fumadocs
    expect(fs.existsSync(path.join(fumadocsDir, 'node_modules'))).toBe(true);
  });

  // ------------------------------------------------------------------
  // Step 3: Running init again should detect existing installation
  // ------------------------------------------------------------------
  it('should detect already-initialized project on second init', () => {
    const output = execFileSync(process.execPath, [CLI_PATH, 'init'], {
      cwd: testDir,
      encoding: 'utf-8',
      timeout: 30_000,
    });

    expect(output).toContain('already initialized');
  });

  // ------------------------------------------------------------------
  // Step 4: Create documentation content
  // ------------------------------------------------------------------
  it('should allow creating documentation content', () => {
    const docsDir = path.join(testDir, 'content', 'docs');
    fs.mkdirSync(docsDir, { recursive: true });

    // Site configuration
    const siteConfig = {
      branding: { name: 'Test Docs Site' },
    };
    fs.writeFileSync(
      path.join(testDir, 'content', 'docs.site.json'),
      JSON.stringify(siteConfig, null, 2),
    );

    // Navigation meta
    const meta = { pages: ['index', 'getting-started'] };
    fs.writeFileSync(
      path.join(docsDir, 'meta.json'),
      JSON.stringify(meta, null, 2),
    );

    // Index page
    fs.writeFileSync(
      path.join(docsDir, 'index.mdx'),
      [
        '---',
        'title: Welcome',
        'description: Welcome to the test documentation site',
        '---',
        '',
        '# Welcome',
        '',
        'This is the home page of the test documentation site.',
      ].join('\n'),
    );

    // Getting Started page
    fs.writeFileSync(
      path.join(docsDir, 'getting-started.mdx'),
      [
        '---',
        'title: Getting Started',
        'description: Quick start guide',
        '---',
        '',
        '# Getting Started',
        '',
        'Follow these steps to get up and running.',
      ].join('\n'),
    );

    // --- Assertions ---
    expect(fs.existsSync(path.join(docsDir, 'meta.json'))).toBe(true);
    expect(fs.existsSync(path.join(docsDir, 'index.mdx'))).toBe(true);
    expect(fs.existsSync(path.join(docsDir, 'getting-started.mdx'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'content', 'docs.site.json'))).toBe(true);

    const savedMeta = JSON.parse(
      fs.readFileSync(path.join(docsDir, 'meta.json'), 'utf-8'),
    );
    expect(savedMeta.pages).toEqual(['index', 'getting-started']);
  });

  // ------------------------------------------------------------------
  // Step 5: Build the documentation site
  // ------------------------------------------------------------------
  it('should build the documentation site successfully', () => {
    // Run build
    runCli(['build']);

    // The build should create a .next directory inside .fumadocs
    const nextDir = path.join(testDir, 'content', '.fumadocs', '.next');
    expect(fs.existsSync(nextDir)).toBe(true);

    // The build command copies .next to the project root
    const rootNextDir = path.join(testDir, '.next');
    expect(fs.existsSync(rootNextDir)).toBe(true);
  });

  // ------------------------------------------------------------------
  // Step 6: Migrate markdown files to MDX
  // ------------------------------------------------------------------
  it('should migrate markdown files to MDX format', () => {
    // Create a sample markdown file at the project root
    const mdContent = [
      '# My Guide',
      '',
      'This is a comprehensive guide for getting started.',
      '',
      '## Installation',
      '',
      '```bash',
      'npm install my-lib',
      '```',
      '',
      '## Usage',
      '',
      'Import and use the library.',
    ].join('\n');
    fs.writeFileSync(path.join(testDir, 'GUIDE.md'), mdContent);

    // Run migrate
    runCli(['migrate', 'GUIDE.md', '--output', 'content/docs']);

    // Verify the MDX file was created
    const mdxPath = path.join(testDir, 'content', 'docs', 'guide.mdx');
    expect(fs.existsSync(mdxPath)).toBe(true);

    // Verify frontmatter was added
    const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
    expect(mdxContent).toContain('---');
    expect(mdxContent).toContain('title: "My Guide"');
    expect(mdxContent).toContain('description:');

    // Verify the H1 heading is removed (it's in frontmatter now)
    expect(mdxContent).not.toMatch(/^# My Guide$/m);

    // Verify meta.json was updated
    const meta = JSON.parse(
      fs.readFileSync(path.join(testDir, 'content', 'docs', 'meta.json'), 'utf-8'),
    );
    expect(meta.pages).toContain('guide');
  });
});
