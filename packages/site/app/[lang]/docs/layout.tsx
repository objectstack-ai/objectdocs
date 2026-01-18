import { coreLoader, platformLoader } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { siteConfig } from '@/lib/site-config';
import { 
  Box, 
  Layers, 
  Package, 
  Blocks, 
  Component, 
  Database,
  Settings,
  Zap,
  Code,
  FileText
} from 'lucide-react';

// Icon mapping for dynamic icon rendering
// Supports common icons for documentation products
const iconMap: Record<string, typeof Box> = {
  Box,
  Layers,
  Package,
  Blocks,
  Component,
  Database,
  Settings,
  Zap,
  Code,
  FileText,
};

// Map of root names to their loaders
const loaderMap: Record<string, typeof coreLoader> = {
  'core': coreLoader,
  'platform': platformLoader,
};

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
  children: ReactNode;
}) {
  const { lang, slug = [] } = await params;
  
  // Determine the current root from the URL
  // The first slug segment indicates which root we're viewing (core, platform, etc.)
  const currentRoot = slug.length > 0 ? slug[0] : 'core';
  
  // Get the appropriate loader for the current root
  const currentLoader = loaderMap[currentRoot] || coreLoader;
  
  // Get the page tree for the current root
  const tree = currentLoader.pageTree[lang];
  
  // Build tabs/root toggle options from products config if available
  const rootToggleTabs = siteConfig.products && siteConfig.products.length > 0 
    ? siteConfig.products.map(product => {
        const Icon = iconMap[product.icon] || Box;
        return {
          title: product.title,
          description: product.description,
          url: `/${lang}${product.url}`,
          icon: (
            <div className="bg-gradient-to-br from-primary/80 to-primary p-1 rounded-md text-primary-foreground">
              <Icon className="size-4" />
            </div>
          ),
        };
      })
    : siteConfig.layout.sidebar.tabs && siteConfig.layout.sidebar.tabs.length > 0 
      ? siteConfig.layout.sidebar.tabs.map(tab => ({
          title: tab.title,
          url: `/${lang}${tab.url}`,
          description: tab.description,
        }))
      : undefined;
  
  return (
    <DocsLayout
      tree={tree}
      {...baseOptions}
      sidebar={{
        enabled: siteConfig.layout.sidebar.enabled,
        prefetch: siteConfig.layout.sidebar.prefetch,
        collapsible: siteConfig.layout.sidebar.collapsible,
        defaultOpenLevel: siteConfig.layout.sidebar.defaultOpenLevel,
        tabs: rootToggleTabs,
        footer: siteConfig.layout.sidebar.footer ? (
           <div className="p-4 text-xs text-muted-foreground border-t">
             {siteConfig.layout.sidebar.footer.html ? (
                <div dangerouslySetInnerHTML={{ __html: siteConfig.layout.sidebar.footer.html }} />
             ) : (
                siteConfig.layout.sidebar.footer.text
             )}
           </div>
        ) : undefined,
        banner: siteConfig.layout.sidebar.banner ? (
          <div className="-mx-2 -mt-2 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 text-card-foreground text-sm">
            <a href={siteConfig.layout.sidebar.banner.url} className="block font-medium">
              {siteConfig.layout.sidebar.banner.text}
            </a>
          </div>
        ) : undefined
      }}
    >
      {children}
    </DocsLayout>
  );
}

