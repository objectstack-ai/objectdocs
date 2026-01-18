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
