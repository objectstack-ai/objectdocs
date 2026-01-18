import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { siteConfig } from '@/lib/site-config';
import { Box, Layers } from 'lucide-react';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, typeof Box> = {
  Box: Box,
  Layers: Layers,
};

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  
  // Get the full page tree
  const tree = source.getPageTree(lang);
  
  // Build tabs/root toggle options from products config if available
  const rootToggleTabs = siteConfig.products && siteConfig.products.length > 0 
    ? siteConfig.products.map(product => {
        const Icon = iconMap[product.icon] || Box;
        return {
          title: product.title,
          description: product.description,
          url: product.url,
          icon: (
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-1 rounded-md text-white">
              <Icon className="size-4" />
            </div>
          ),
        };
      })
    : siteConfig.layout.sidebar.tabs && siteConfig.layout.sidebar.tabs.length > 0 
      ? siteConfig.layout.sidebar.tabs.map(tab => ({
          title: tab.title,
          url: tab.url,
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

