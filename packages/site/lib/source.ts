/**
 * Object Docs
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
