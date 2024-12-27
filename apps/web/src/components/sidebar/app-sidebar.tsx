'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChevronRightIcon,
  Command,
  FileIcon,
  FolderIcon,
  // Frame,
  GalleryVerticalEnd,
  // Map,
  // PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

// import { NavProjects } from '@/components/nav-projects';
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

type SidebarNode =
  | string
  | { title: string; href: string }
  | [string, ...SidebarNode[]];

const tree: SidebarNode[] = [
  [
    'components',
    [
      'ui',
      { title: 'button.tsx', href: '/button' },
      { title: 'card.tsx', href: '/card' },
      [
        'xx',
        { title: 'button.tsx', href: '/button' },
        { title: 'card.tsx', href: '/card' },
      ],
    ],
    { title: 'header.tsx', href: '/header' },
    { title: 'footer.tsx', href: '/footer' },
    [
      'ux',
      { title: 'button.tsx', href: '/button' },
      { title: 'card.tsx', href: '/card' },
    ],
  ],
  { title: '.eslintrc.json', href: '/eslintrc' },
];

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpeg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  tree: [
    // [
    //   'app',
    //   [
    //     'api',
    //     ['hello', ['route.ts']],
    //     'page.tsx',
    //     'layout.tsx',
    //     ['blog', ['page.tsx']],
    //   ],
    // ],
    [
      'components',
      [
        'ui',
        { title: 'button.tsx', href: '/button' },
        { title: 'card.tsx', href: '/card' },
      ],
      // 'header.tsx',
      // 'footer.tsx',
    ],
    // ['lib', ['util.ts']],
    // ['public', 'favicon.ico', 'vercel.svg'],
    '.eslintrc.json',
    '.gitignore',
    'next.config.js',
    'tailwind.config.js',
    'package.json',
    'README.md',
  ],
  // projects: [
  //   {
  //     name: 'Design Engineering',
  //     url: '#',
  //     icon: Frame,
  //   },
  //   {
  //     name: 'Sales & Marketing',
  //     url: '#',
  //     icon: PieChart,
  //   },
  //   {
  //     name: 'Travel',
  //     url: '#',
  //     icon: Map,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tree.map((item, index) => (
                <Tree key={index} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function Tree({ item }: { item: SidebarNode }) {
  if (typeof item === 'string') {
    // Render a folder name or file name
    return (
      <SidebarMenuButton>
        <FolderIcon />
        {item}
      </SidebarMenuButton>
    );
  }

  if (Array.isArray(item)) {
    const [name, ...items] = item;

    return (
      <SidebarMenuItem>
        <Collapsible className='group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90'>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <ChevronRightIcon className='transition-transform' />
              <FolderIcon />
              {name}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {items.map((subItem, index) => (
                <Tree key={index} item={subItem} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  if ('title' in item && 'href' in item) {
    // Render a file link
    return (
      <SidebarMenuButton
        // href={item.href}
        className='data-[active=true]:bg-transparent'
      >
        <FileIcon />
        {item.title}
      </SidebarMenuButton>
    );
  }

  return null; // Fallback if item doesn't match any structure
}
