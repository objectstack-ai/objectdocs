/**
 * ObjectDocs
 * Copyright (c) 2026-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export function registerInitCommand(cli) {
  cli
    .command('init', 'Initialize ObjectDocs site in content/.objectdocs')
    .action(async (options) => {
      console.log('Initializing ObjectDocs...\n');
      
      const targetDir = path.resolve(process.cwd(), 'content/.objectdocs');
      
      // Check if already initialized
      if (fs.existsSync(targetDir)) {
        console.log(`⚠️  ObjectDocs already initialized at ${targetDir}`);
        console.log('   Delete the directory if you want to reinitialize.\n');
        return;
      }
      
      // Resolve the site package directory
      let siteDir;
      try {
        siteDir = path.dirname(require.resolve('@objectdocs/site/package.json'));
      } catch (e) {
        // Fallback for local development
        siteDir = path.resolve(__dirname, '../../../site');
      }
      
      console.log(`📦 Copying site from: ${siteDir}`);
      console.log(`📁 Target directory: ${targetDir}\n`);
      
      // Create target directory
      fs.mkdirSync(targetDir, { recursive: true });
      
      // Copy site files to target directory
      fs.cpSync(siteDir, targetDir, { 
        recursive: true,
        filter: (source) => {
          const basename = path.basename(source);
          // Skip node_modules, .next, and other build artifacts
          if (basename === 'node_modules' || 
              basename === '.next' || 
              basename === 'out' ||
              basename === '.turbo' ||
              basename === 'dist') {
            return false;
          }
          return true;
        }
      });
      
      console.log('✅ ObjectDocs site copied successfully!\n');
      
      // Install dependencies in the target directory
      console.log('📦 Installing dependencies...\n');
      
      const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const installProcess = spawn(npmCmd, ['install'], {
        cwd: targetDir,
        stdio: 'inherit'
      });
      
      installProcess.on('close', (code) => {
        if (code === 0) {
          console.log('\n✅ Dependencies installed successfully!');
          console.log('\n🎉 ObjectDocs initialized! You can now run:');
          console.log('   pnpm dev    - Start development server');
          console.log('   pnpm build  - Build for production\n');
        } else {
          console.error('\n❌ Failed to install dependencies');
          process.exit(code);
        }
      });
    });
}
