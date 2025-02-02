import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      resetFontSize: () => ReturnType;
      setFontSize: (size: string) => ReturnType;
      increaseFontSize: () => ReturnType;
      decreaseFontSize: () => ReturnType;
    };
  }
}

type FontSizeOptions = {
  defaultSize: string;
  step: number;
};

type FontSizeAttributes = {
  size: string;
};

export const FontSize = Mark.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions() {
    return {
      defaultSize: '13px',
      step: 1,
    };
  },

  addAttributes() {
    return {
      size: {
        default: this.options.defaultSize,
        parseHTML: (element: HTMLElement) =>
          element.style.fontSize || this.options.defaultSize,
        renderHTML: (attributes: FontSizeAttributes) => {
          if (!attributes.size) {
            return {};
          }
          return { style: `font-size: ${attributes.size}` };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[style*=font-size]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      resetFontSize:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name); // Removes the fontSize mark
        },
      setFontSize:
        (size: string) =>
        ({ commands }) => {
          const emSize = pxToEm(size);
          return commands.setMark(this.name, { size: emSize });
        },

      increaseFontSize:
        () =>
        ({ state, commands }) => {
          const { from, to } = state.selection;
          const marks = state.doc.rangeHasMark(from, to, this.type);
          let currentFontSize = parseInt(
            this.options.defaultSize.replace('px', ''),
            10
          );

          if (marks) {
            state.doc.nodesBetween(from, to, (node) => {
              node.marks.forEach((mark) => {
                if (mark.type.name === this.name && mark.attrs.size) {
                  currentFontSize = parseInt(
                    mark.attrs.size.replace('px', ''),
                    10
                  );
                }
              });
            });
          }

          const newFontSize = `${currentFontSize + this.options.step}px`;
          const emSize = pxToEm(newFontSize);
          return commands.setMark(this.name, { size: emSize });
        },

      decreaseFontSize:
        () =>
        ({ state, commands }) => {
          const { from, to } = state.selection;
          const marks = state.doc.rangeHasMark(from, to, this.type);
          let currentFontSize = parseInt(
            this.options.defaultSize.replace('px', ''),
            10
          );

          if (marks) {
            state.doc.nodesBetween(from, to, (node) => {
              node.marks.forEach((mark) => {
                if (mark.type.name === this.name && mark.attrs.size) {
                  currentFontSize = parseInt(
                    mark.attrs.size.replace('px', ''),
                    10
                  );
                }
              });
            });
          }

          const newFontSize = `${Math.max(1, currentFontSize - this.options.step)}px`;
          const emSize = pxToEm(newFontSize);
          return commands.setMark(this.name, { size: emSize });
        },
    };
  },
});

export const pxToEm = (size: string) => {
  const baseFontSize = 16; // Tailwind's default base font size
  const sizeInPx = parseInt(size.replace('px', ''), 10);
  const emValue = sizeInPx / baseFontSize;
  return `${emValue}em`;
};
