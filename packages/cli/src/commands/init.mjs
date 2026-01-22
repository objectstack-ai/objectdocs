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
      
      const contentDir = path.resolve(process.cwd(), 'content');
      const targetDir = path.resolve(contentDir, '.objectdocs');
      const contentPackageJsonPath = path.resolve(contentDir, 'package.json');
      
      // Check if already initialized
      if (fs.existsSync(targetDir)) {
        console.log(`⚠️  ObjectDocs already initialized at ${targetDir}`);
        console.log('   Delete the directory if you want to reinitialize.\n');
        return;
      }
      
      // Create content directory if it doesn't exist
      if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
        console.log(`📁 Created content directory\n`);
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
      
      // Initialize or update content/package.json
      let packageJson = {};
      if (fs.existsSync(contentPackageJsonPath)) {
        console.log('📝 Updating existing content/package.json\n');
        packageJson = JSON.parse(fs.readFileSync(contentPackageJsonPath, 'utf-8'));
      } else {
        console.log('📝 Creating content/package.json\n');
        packageJson = {
          name: 'objectdocs-content',
          version: '0.1.0',
          private: true,
          description: 'ObjectDocs documentation content'
        };
      }
      
      // Ensure scripts section exists
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      
      // Add/update ObjectDocs scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        dev: 'cd .objectdocs && npm run dev',
        build: 'cd .objectdocs && npm run build',
        start: 'cd .objectdocs && npm run start'
      };
      
      // Write package.json
      fs.writeFileSync(
        contentPackageJsonPath,
        JSON.stringify(packageJson, null, 2) + '\n'
      );
      
      console.log('✅ content/package.json configured\n');
      
      // Add to .gitignore
      const gitignorePath = path.resolve(process.cwd(), '.gitignore');
      const gitignoreEntries = ['content/.objectdocs', 'content/node_modules'];
      
      try {
        let gitignoreContent = '';
        if (fs.existsSync(gitignorePath)) {
          gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
        }
        
        const lines = gitignoreContent.split('\n').map(line => line.trim());
        const entriesToAdd = gitignoreEntries.filter(entry => !lines.includes(entry));
        
        if (entriesToAdd.length > 0) {
          const separator = gitignoreContent.trim() ? '\n\n' : '';
          const newContent = `${gitignoreContent.trim()}${separator}# ObjectDocs\n${entriesToAdd.join('\n')}\n`;
          fs.writeFileSync(gitignorePath, newContent);
          console.log(`📝 Added ${entriesToAdd.join(', ')} to .gitignore\n`);
        }
      } catch (e) {
        console.warn('⚠️  Could not update .gitignore:', e.message);
      }
      
      // Install dependencies in the target directory
      console.log('📦 Installing dependencies in content/.objectdocs...\n');
      
      const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const installProcess = spawn(npmCmd, ['install', '--legacy-peer-deps'], {
        cwd: targetDir,
        stdio: 'inherit'
      });
      
      installProcess.on('close', (code) => {
        if (code === 0) {
          console.log('\n✅ Dependencies installed successfully!');
          console.log('\n🎉 ObjectDocs initialized! You can now run:');
          console.log('   cd content && npm run dev    - Start development server');
          console.log('   cd content && npm run build  - Build for production\n');
          console.log('Or if you have npm scripts in your root package.json:');
          console.log('   npm run dev    - Start development server');
          console.log('   npm run build  - Build for production\n');
        } else {
          console.error('\n❌ Failed to install dependencies');
          process.exit(code);
        }
      });
    });
}
