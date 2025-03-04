import React from 'react';

type SidebarPanelProps = {
  title: string;
  children: React.ReactNode;
};
export function BaseSidebarPanel({ title, children }: SidebarPanelProps) {
  return (
    <div>
      <p className='mb-5 font-medium'>{title}</p>
      <div className='mb-[3px] flex flex-col gap-5'>{children}</div>
    </div>
  );
}
