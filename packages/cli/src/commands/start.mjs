/**
 * ObjectDocs
 * Copyright (c) 2026-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export function registerStartCommand(cli) {
  cli.command('start [dir]', 'Start the production server')
    .action((dir) => {
      // 1. Resolve Next.js App directory - use local .objectdocs first
      let nextAppDir = path.resolve(process.cwd(), 'content/.objectdocs');
      
      if (!fs.existsSync(nextAppDir)) {
        console.log('⚠️  ObjectDocs site not found at content/.objectdocs');
        console.log('   Run "objectdocs init" first to initialize the site.\n');
        process.exit(1);
      }

      // 2. Check config
      let isStatic = false;
      try {
        const configPath = path.resolve(process.cwd(), 'content/docs.site.json');
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          if (config.build?.output === 'export') {
            isStatic = true;
          }
        }
      } catch (e) {
        // ignore
      }

      if (isStatic || (dir && dir !== 'out')) {
        // Static Mode
        const targetDir = dir ? path.resolve(process.cwd(), dir) : path.resolve(process.cwd(), 'out');
        console.log(`Serving static site from: ${targetDir}`);
        
        const child = spawn('npx', ['serve', targetDir], {
          stdio: 'inherit',
          shell: true
        });
        
        child.on('error', (err) => {
          console.error('Failed to start server:', err);
        });
      } else {
        // Dynamic Mode (Next.js start)
        console.log('Starting Next.js production server...');
        console.log(`  Engine: ${nextAppDir}`);
        
        const docsDir = path.resolve(process.cwd(), 'content/docs');

        const env = {
          ...process.env,
          DOCS_DIR: docsDir
        };


        const child = spawn('npm', ['start'], {
          cwd: nextAppDir,
          stdio: 'inherit',
          env: env
        });
      }
    });
}
