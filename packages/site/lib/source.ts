import { loader } from 'fumadocs-core/source';
import { core, platform } from '@/.source/server';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { i18n } from './i18n';

const coreSource = toFumadocsSource(core.docs, core.meta);
const platformSource = toFumadocsSource(platform.docs, platform.meta);

// Create separate loaders for each documentation root
export const coreLoader = loader({
  baseUrl: '/docs/core',
  source: coreSource,
  i18n,
});

export const platformLoader = loader({
  baseUrl: '/docs/platform',
  source: platformSource,
  i18n,
});

// Default export for backward compatibility
export const source = coreLoader;
