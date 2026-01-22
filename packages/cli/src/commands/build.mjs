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

export function registerBuildCommand(cli) {
  cli
    .command('build [dir]', 'Build static documentation site')
    .action(async (dir, options) => {
      // 1. Resolve user's docs directory
      const docsDir = dir ? path.resolve(process.cwd(), dir) : path.resolve(process.cwd(), 'content/docs');
      
      // 2. Resolve the Next.js App directory - use local .objectdocs first
      let nextAppDir = path.resolve(process.cwd(), 'content/.objectdocs');
      
      if (!fs.existsSync(nextAppDir)) {
        console.log('⚠️  ObjectDocs site not found at content/.objectdocs');
        console.log('   Run "objectdocs init" first to initialize the site.\n');
        process.exit(1);
      }

      // Copy user config and assets to nextAppDir
      const userConfigPath = path.resolve(process.cwd(), 'content/docs.site.json');
      if (fs.existsSync(userConfigPath)) {
        console.log(`  Copying config from ${userConfigPath}`);
        fs.cpSync(userConfigPath, path.join(nextAppDir, 'docs.site.json'));
      }
      
      const userPublicPath = path.resolve(process.cwd(), 'public');
      if (fs.existsSync(userPublicPath)) {
        console.log(`  Copying public assets from ${userPublicPath}`);
        const targetPublicDir = path.join(nextAppDir, 'public');
        if (!fs.existsSync(targetPublicDir)) {
          fs.mkdirSync(targetPublicDir, { recursive: true });
        }
        fs.cpSync(userPublicPath, targetPublicDir, { recursive: true, force: true });
      }

      console.log(`Building docs site...`);
      console.log(`  Engine: ${nextAppDir}`);
      console.log(`  Content: ${docsDir}`);
      
      const env = {
        ...process.env,
        DOCS_DIR: docsDir
      };

      const nextCmd = 'npm'; 
      const args = ['run', 'build'];

      const child = spawn(nextCmd, args, {
        stdio: 'inherit',
        env,
        cwd: nextAppDir // CRITICAL: Run in the Next.js app directory
      });

      child.on('close', (code) => {
        if (code === 0) {
          // Copy output to project root
          const src = path.join(nextAppDir, 'out');
          const dest = path.join(process.cwd(), 'out');
          
          if (fs.existsSync(src)) {
            console.log(`\nMoving build output to ${dest}...`);
            if (fs.existsSync(dest)) {
                fs.rmSync(dest, { recursive: true, force: true });
            }
            fs.cpSync(src, dest, { recursive: true });
            console.log(`Build successfully output to: ${dest}`);
          } else {
            // Check for .next directory (dynamic build)
            const srcNext = path.join(nextAppDir, '.next');
            const destNext = path.join(process.cwd(), '.next');
            
            if (fs.existsSync(srcNext) && srcNext !== destNext) {
               console.log(`\nCopying .next build output to ${destNext}...`);
               if (fs.existsSync(destNext)) {
                   fs.rmSync(destNext, { recursive: true, force: true });
               }
               // Use copy instead of symlink to ensure compatibility with Vercel
               // dereference: true ensures we copy the actual files instead of symlinks, preventing broken links
               fs.cpSync(srcNext, destNext, { 
                   recursive: true, 
                   dereference: true,
                   filter: (source) => {
                       try {
                           if (fs.lstatSync(source).isSymbolicLink()) {
                               try {
                                   fs.statSync(source);
                                   return true;
                               } catch (e) {
                                   try {
                                        const target = fs.readlinkSync(source);
                                        console.warn(`  Warning: Skipping broken symlink: ${path.basename(source)} -> ${target}`);
                                   } catch(err) {}
                                   return false;
                               }
                           }
                           return true;
                       } catch (e) {
                           return false;
                       }
                   }
               });
               console.log(`Build successfully copied to: ${destNext}`);
            } else {
               console.log(`\nNo 'out' directory generated in ${src}.`);
               console.log(`This is expected if 'output: export' is disabled.`);
            }
          }
        }
        process.exit(code);
      });

    });
}
