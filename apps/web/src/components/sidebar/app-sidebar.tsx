'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ChevronRightIcon,
  DatabaseIcon,
  FolderIcon,
  type LucideIcon,
} from 'lucide-react';

import { NavUser } from '@/components/sidebar/nav-user';
import { TeamSwitcher } from '@/components/sidebar/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from '@/components/sidebar/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const user = {
  name: 'shadcn',
  email: 'm@example.com',
  avatar: '/avatars/shadcn.jpeg',
};

type SidebarNode = {
  title: string;
  icon?: LucideIcon;
} & (
  | { href?: never; items: SidebarNode[] } // parent
  | { href: string; items?: never } // child
);

const sidebarData = {
  main: [
    {
      title: 'components',
      icon: DatabaseIcon,
      items: [
        {
          title: 'ui',
          icon: FolderIcon,
          items: [
            { title: 'button.tsx', href: '/button' },
            { title: 'card.tsx', href: '/card' },
            {
              title: 'xx',
              icon: FolderIcon,
              items: [
                { title: 'button.tsx', href: '/button' },
                { title: 'card.tsx', href: '/card' },
              ],
            },
          ],
        },
      ],
    },
    { title: 'header.tsx', href: '/header' },
    { title: 'footer.tsx', href: '/footer' },
    {
      title: 'ux',
      icon: FolderIcon,
      items: [
        { title: 'button.tsx', href: '/button' },
        { title: 'card.tsx', href: '/card' },
      ],
    },
    { title: '.eslintrc.json', href: '/eslintrc' },
  ],
} satisfies Record<string, SidebarNode[]>;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarData.main.map((item, index) => (
                <Tree key={index} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function Tree({ item }: { item: SidebarNode }) {
  if (item.items && item.items?.length > 0) {
    // render a dropdown with nested items
    return (
      <SidebarMenuItem>
        <Collapsible className='group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90'>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              {item.icon ? (
                <item.icon className='mr-2' />
              ) : (
                <FolderIcon className='mr-2' />
              )}
              {item.title}
              <ChevronRightIcon className='ml-auto transition-transform duration-200' />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem, index) => (
                <Tree key={index} item={subItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  if (item.href) {
    // render a file link
    return (
      <SidebarMenuButton asChild>
        <Link href={item.href} className='data-[active=true]:bg-transparent'>
          {item.icon && <item.icon className='mr-2' />}
          {item.title}
        </Link>
      </SidebarMenuButton>
    );
  }

  return null; // fallback for unsupported structures
}
