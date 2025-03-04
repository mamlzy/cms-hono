'use client';

import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import prettierPluginHtml from 'prettier/plugins/html';
import { format } from 'prettier/standalone';
import { codeToHtml } from 'shiki';

import type { TEditorConfiguration } from '../../../documents/editor/core';

export async function html(
  value: TEditorConfiguration,
  theme: string
): Promise<string> {
  const code = renderToStaticMarkup(value, { rootBlockId: 'root' });

  const prettyCode = await format(code, {
    parser: 'html',
    plugins: [prettierPluginHtml],
  });

  return codeToHtml(prettyCode, {
    theme: theme === 'light' ? 'github-light' : 'github-dark',
    lang: 'html',
  });
}

export async function json(
  value: TEditorConfiguration,
  theme: string
): Promise<string> {
  return codeToHtml(JSON.stringify(value, null, 2), {
    theme: theme === 'light' ? 'github-light' : 'github-dark',
    lang: 'json',
  });
}
