'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, FolderIcon, type LucideIcon } from 'lucide-react';

import { useActiveOrganization } from '@/hooks/react-query/organization.query';
import { NavUser } from '@/components/sidebar/nav-user';
import { OrganizationSwitcher } from '@/components/sidebar/team-switcher';
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

type SidebarNode = {
  title: string;
  icon?: LucideIcon | string;
} & (
  | { href?: never; items: SidebarNode[] } // parent
  | { href: string; items?: never } // child
);

const sidebarData = {
  main: [
    { title: 'Category', href: '/category', icon: '🔗' },
    { title: 'Post', href: '/post', icon: '📝' },
    { title: 'Faq', href: '/faq', icon: '🤔' },
    { title: 'Customer', href: '/customer', icon: '🤝' },
    // {
    //   title: 'ux',
    //   icon: FolderIcon,
    //   items: [
    //     { title: 'button.tsx', href: '/button' },
    //     { title: 'card.tsx', href: '/card' },
    //   ],
    // },
  ],
} satisfies Record<string, SidebarNode[]>;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function Tree({ item }: { item: SidebarNode }) {
  const { data: activeOrganization } = useActiveOrganization();

  if (!activeOrganization) return null;

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
        <Link
          href={`/${activeOrganization.id}${item.href}`}
          className='data-[active=true]:bg-transparent'
        >
          {item.icon &&
            (typeof item.icon === 'string' ? (
              <span>{item.icon}</span> // plain text (emoji)
            ) : (
              <item.icon /> // icon
            ))}
          {item.title}
        </Link>
      </SidebarMenuButton>
    );
  }

  return null; // fallback for unsupported structures
}
