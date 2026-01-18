/**
 * ObjectDocs
 * Copyright (c) 2026-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { coreLoader, platformLoader } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';

export const { GET } = createSearchAPI('advanced', {
  indexes: [
    ...coreLoader.getPages().map((page) => ({
      title: page.data.title || '',
      description: page.data.description || '',
      url: page.url,
      id: page.url,
      structuredData: (page.data as any).structuredData,
    })),
    ...platformLoader.getPages().map((page) => ({
      title: page.data.title || '',
      description: page.data.description || '',
      url: page.url,
      id: page.url,
      structuredData: (page.data as any).structuredData,
    })),
  ],
});
