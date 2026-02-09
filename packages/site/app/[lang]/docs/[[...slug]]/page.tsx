/**
 * ObjectDocs
 * Copyright (c) 2026-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getPageImage, source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { siteConfig } from '@/lib/site-config';

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

  const MDX = page.data.body;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.data.title,
    description: page.data.description ?? '',
    image: getPageImage(page).url,
    url: `${siteConfig.meta.url}/${lang}/docs/${slug.join('/')}`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.meta.title,
      url: siteConfig.meta.url,
    },
  };

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        enabled: siteConfig.layout.toc.enabled,
        style: siteConfig.layout.toc.depth > 2 ? 'clerk' : 'normal',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
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
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
