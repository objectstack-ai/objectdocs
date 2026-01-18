/**
 * ObjectDocs
 * Copyright (c) 2026-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import Link from 'next/link';
import { BookOpen, Github } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  href: string;
  tooltip?: string;
  brandColor?: string;
  external?: boolean;
}

interface NavbarProps {
  logo?: React.ReactNode;
  className?: string;
}

const trinityLinks: NavLink[] = [
  {
    label: 'Data',
    href: '/objectql',
    tooltip: 'ObjectQL: The Universal Protocol',
    brandColor: 'hover:text-blue-600 dark:hover:text-blue-400',
  },
  {
    label: 'Control',
    href: '/objectos',
    tooltip: 'ObjectOS: The Business Kernel',
    brandColor: 'hover:text-purple-600 dark:hover:text-purple-400',
  },
  {
    label: 'View',
    href: '/objectui',
    tooltip: 'ObjectUI: The Projection Engine',
    brandColor: 'hover:text-green-600 dark:hover:text-green-400',
  },
];

const resourceLinks: NavLink[] = [
  {
    label: 'Protocol',
    href: 'https://protocol.objectstack.ai',
    external: true,
  },
  {
    label: 'Docs',
    href: '/docs',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
];

function NavLinkWithTooltip({
  link,
  isTrianity = false,
}: {
  link: NavLink;
  isTrianity?: boolean;
}) {
  const linkContent = (
    <Link
      href={link.href}
      className={cn(
        'transition-colors',
        isTrianity
          ? cn(
              'font-medium text-foreground/90',
              link.brandColor
            )
          : 'text-foreground/70 hover:text-foreground',
        'px-3 py-2 text-sm'
      )}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
    >
      {link.label}
    </Link>
  );

  if (link.tooltip) {
    return (
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger asChild>{linkContent}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            className="z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95"
            sideOffset={5}
          >
            {link.tooltip}
            <Tooltip.Arrow className="fill-primary" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }

  return linkContent;
}

export function Navbar({ logo, className }: NavbarProps) {
  return (
    <Tooltip.Provider>
      <nav
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          className
        )}
      >
        <div className="container flex h-16 items-center px-4">
          {/* Logo */}
          <div className="mr-6 flex items-center">{logo}</div>

          {/* Trinity Links (Core Products) - Left Side */}
          <div className="md:flex items-center gap-1 mr-auto">
            {trinityLinks.map((link) => (
              <NavLinkWithTooltip key={link.href} link={link} isTrianity />
            ))}
          </div>

          {/* Resource Links - Right Side */}
          <div className="md:flex items-center gap-1 ml-auto">
            {/* Protocol link with icon */}
            <Link
              href={resourceLinks[0].href}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground/90 hover:text-foreground transition-colors ml-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookOpen className="w-4 h-4" />
              {resourceLinks[0].label}
            </Link>

            {/* Docs and Blog */}
            {resourceLinks.slice(1).map((link) => (
              <NavLinkWithTooltip key={link.href} link={link} />
            ))}

            {/* GitHub Link */}
            <Link
              href="https://github.com/objectstack-ai"
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              <span className="hidden lg:inline">Star</span>
            </Link>
          </div>

          {/* Mobile Menu Button - TODO: Implement mobile menu */}
          <button
            className="md:hidden ml-auto p-2"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </nav>
    </Tooltip.Provider>
  );
}
