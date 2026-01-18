import { coreLoader, platformLoader } from '@/lib/source';
import type { Metadata } from 'next';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/site-config';
import defaultComponents from 'fumadocs-ui/mdx';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';

// Map of root names to their loaders
const loaderMap: Record<string, typeof coreLoader> = {
  'core': coreLoader,
  'platform': platformLoader,
};

interface PageProps {
  params: Promise<{
    lang: string;
    slug?: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const { lang, slug = [] } = await params;
  
  // Determine the current root from the URL
  const currentRoot = slug.length > 0 ? slug[0] : 'core';
  
  // Get the page path (everything after the root)
  const pagePath = slug.slice(1);
  
  // Get the appropriate loader
  const currentLoader = loaderMap[currentRoot] || coreLoader;
  
  const page = currentLoader.getPage(pagePath, lang);
  
  if (!page) {
    notFound();
  }

  const pageData = page.data as any;
  const MDX = pageData.body;

  return (
    <DocsPage 
      toc={pageData.toc} 
      full={pageData.full}
      lastUpdate={siteConfig.page.showLastUpdate ? pageData.lastModified : undefined}
      tableOfContent={{
        enabled: siteConfig.layout.toc.enabled,
        style: siteConfig.layout.toc.depth > 2 ? 'clerk' : 'normal',
      }}
      editOnGithub={siteConfig.page.showEditLink ? {
        owner: siteConfig.page.repoBaseUrl.split('/')[3],
        repo: siteConfig.page.repoBaseUrl.split('/')[4],
        sha: 'main', // Defaulting to main, could be extracted
        path: siteConfig.page.repoBaseUrl.split('/').slice(7).join('/') // simplistic parsing
      } : undefined}
    >
      <DocsBody>
        <MDX components={{ ...defaultComponents, Steps, Step, Card, Cards, Callout }} />
      </DocsBody>
    </DocsPage>
  );
}


export async function generateStaticParams() {
  // Generate params for all loaders
  const coreParams = coreLoader.generateParams().map(param => ({
    ...param,
    slug: ['core', ...(param.slug || [])],
  }));
  
  const platformParams = platformLoader.generateParams().map(param => ({
    ...param,
    slug: ['platform', ...(param.slug || [])],
  }));
  
  return [...coreParams, ...platformParams];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug = [] } = await params;
  
  // Determine the current root
  const currentRoot = slug.length > 0 ? slug[0] : 'core';
  const pagePath = slug.slice(1);
  
  // Get the appropriate loader
  const currentLoader = loaderMap[currentRoot] || coreLoader;
  
  const page = currentLoader.getPage(pagePath, lang);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
