/**
 * ObjectDocs
 * Copyright (c) 2026-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteConfig.meta.url;

  return source.getPages().map((page) => ({
    url: `${url}${page.url}`,
    changeFrequency: 'weekly',
    priority: page.url.endsWith('/docs') ? 1.0 : 0.7,
  }));
}
