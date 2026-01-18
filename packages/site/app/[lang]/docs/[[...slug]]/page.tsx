import { source } from '@/lib/source';
import type { Metadata } from 'next';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/site-config';
import defaultComponents from 'fumadocs-ui/mdx';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';

interface PageProps {
  params: Promise<{
    lang: string;
    slug?: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const { lang, slug = [] } = await params;
  
  const page = source.getPage(slug, lang);
  
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
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug = [] } = await params;
  const page = source.getPage(slug, lang);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
