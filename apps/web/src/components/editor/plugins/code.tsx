import { mergeAttributes } from '@tiptap/core';
import { Code } from '@tiptap/extension-code';

export const CustomCode = Code.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['code', 0],
    ];
  },
});
