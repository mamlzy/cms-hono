import { Extension } from '@tiptap/core';

export type IndentOptions = {
  minIndent: number;
  maxIndent: number;
  defaultIndent: number;
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      setIndent: (indent: number) => ReturnType;
      increaseIndent: () => ReturnType;
      decreaseIndent: () => ReturnType;
    };
  }
}

export const IndentExtension = Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      minIndent: 0,
      maxIndent: 7,
      defaultIndent: 0,
      types: ['paragraph', 'heading'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndent,
            parseHTML: (element) =>
              parseInt(element.getAttribute('data-indent') || '0', 10),
            renderHTML: (attributes) => ({
              'data-indent': attributes.indent,
              style: `margin-left: ${attributes.indent * 40}px;`,
            }),
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setIndent:
        (indent) =>
        ({ chain }) => {
          return chain().setMark('indent', { indent }).run();
        },
      increaseIndent:
        () =>
        ({ chain, state }) => {
          const { selection } = state;
          const { from, to } = selection;
          const { tr } = state;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent =
                node.attrs.indent || this.options.defaultIndent;
              const newIndent = Math.min(
                currentIndent + 1,
                this.options.maxIndent
              );
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: newIndent,
              });
            }
          });

          return chain()
            .command(({ dispatch }) => {
              if (dispatch) dispatch(tr);
              return true;
            })
            .run();
        },
      decreaseIndent:
        () =>
        ({ chain, state }) => {
          const { selection } = state;
          const { from, to } = selection;
          const { tr } = state;

          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent =
                node.attrs.indent || this.options.defaultIndent;
              const newIndent = Math.max(
                currentIndent - 1,
                this.options.minIndent
              );
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: newIndent,
              });
            }
          });

          return chain()
            .command(({ dispatch }) => {
              if (dispatch) dispatch(tr);
              return true;
            })
            .run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.increaseIndent(),
      'Shift-Tab': () => this.editor.commands.decreaseIndent(),
    };
  },
});
