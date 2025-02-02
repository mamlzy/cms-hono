'use client';

import { useCallback, useEffect, useState } from 'react';
import { startCase } from '@repo/shared/lib/utils';
import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Color } from '@tiptap/extension-color';
import { Document } from '@tiptap/extension-document';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading, type Level } from '@tiptap/extension-heading';
import { Highlight } from '@tiptap/extension-highlight';
import { History } from '@tiptap/extension-history';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  ALargeSmallIcon,
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  BrushIcon,
  ChevronDownIcon,
  ImageIcon,
  IndentDecreaseIcon,
  IndentIncreaseIcon,
  ItalicIcon,
  Link2Icon,
  Link2OffIcon,
  ListIcon,
  ListOrderedIcon,
  PaintBucketIcon,
  PilcrowIcon,
  StrikethroughIcon,
  TrashIcon,
  UnderlineIcon,
} from 'lucide-react';
import { type Control, type FieldValues, type Path } from 'react-hook-form';
import sanitizeHtml from 'sanitize-html';
import { ImageResize } from 'tiptap-extension-resize-image';

import { cn } from '@/lib/utils';
import { CustomCode } from '@/components/editor/plugins/code';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FontSize, pxToEm } from './editor/plugins/font-size';
import { IndentExtension } from './editor/plugins/indent';

const colors = [
  '#61BD6D',
  '#1ABC9C',
  '#54ACD2',
  '#2C82C9',
  '#9365B8',
  '#475577',
  '#CCCCCC',
  '#41A85F',
  '#00A885',
  '#3D8EB9',
  '#2969B0',
  '#553982',
  '#28324E',
  '#000000',
  '#F7DA64',
  '#FBA026',
  '#EB6B56',
  '#E25041',
  '#A38F84',
  '#EFEFEF',
  '#FFFFFF',
  '#FAC51C',
  '#F37934',
  '#D14841',
  '#B8312F',
  '#7C706B',
  '#D1D5D8',
];

const headingLevels: Level[] = [1, 2, 3, 4, 5, 6];

const aligns = [
  { key: 'left', Icon: AlignLeftIcon },
  { key: 'center', Icon: AlignCenterIcon },
  { key: 'right', Icon: AlignRightIcon },
  { key: 'justify', Icon: AlignJustifyIcon },
] as const;

type Align = (typeof aligns)[number]['key'];

const alignmentIcons: Record<Align, React.ReactNode> = {
  left: <AlignLeftIcon />,
  center: <AlignCenterIcon />,
  right: <AlignRightIcon />,
  justify: <AlignJustifyIcon />,
};

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  mandatory?: boolean;
};

export function InputTiptap<T extends FieldValues>({
  control,
  name,
  label,
  mandatory,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label || startCase(name)}
            {mandatory && <span className='text-[#f00]'>*</span>}
          </FormLabel>
          <FormControl>
            <Tiptap
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              mandatory={mandatory}
            />
          </FormControl>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}

function Tiptap({
  value,
  onChange,
  onBlur,
  mandatory,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  mandatory?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      Bold,
      Italic,
      Underline,
      Blockquote,
      BulletList,
      CustomCode,
      CodeBlock,
      Document,
      Dropcursor,
      Gapcursor,
      HardBreak,
      Heading,
      History,
      HorizontalRule,
      ListItem,
      OrderedList,
      Paragraph,
      Strike,
      Text,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      IndentExtension.configure({
        minIndent: 0,
        maxIndent: 7,
        defaultIndent: 0,
        types: ['paragraph', 'heading'],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto'];
            const protocol = parsedUrl.protocol.replace(':', '');

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === 'string' ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              'example-phishing.com',
              'malicious-site.net',
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              'example-no-autolink.com',
              'another-no-autolink.com',
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
      ImageResize,
      Placeholder.configure({
        placeholder: 'Write something…',
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What’s the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
      }),
      //! custom
      FontSize.configure({
        defaultSize: '13px',
        step: 1,
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-4 focus:outline-none rounded-lg dark:prose-invert',
      },
    },
    onUpdate: ({ editor }) => {
      // Get the current alignment of the selected text
      const alignment =
        editor.getAttributes('heading').textAlign ||
        editor.getAttributes('paragraph').textAlign ||
        'left';

      setCurrentAlignment(alignment);

      //! onChange
      const html = editor.getHTML();

      if (mandatory) {
        const plainText = sanitizeHtml(html, { allowedTags: [] });

        if (!plainText) {
          onChange(plainText);
          return;
        }
      }

      onChange(html);
    },
    onBlur: () => {
      onBlur?.();
    },
    content: value,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const [currentAlignment, setCurrentAlignment] = useState<Align>('left');

  // Helper function to get the current indent level of the selected node(s)
  const getCurrentIndent = () => {
    if (!editor) return 0;

    const { selection } = editor.state;
    const { from, to } = selection;
    let currentIndent = 0;

    editor.state.doc.nodesBetween(from, to, (node) => {
      if (node.attrs.indent !== undefined) {
        currentIndent = node.attrs.indent;
      }
    });

    return currentIndent;
  };

  const isMinIndent = getCurrentIndent() === 0;
  const isMaxIndent = getCurrentIndent() === 7;

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    // eslint-disable-next-line no-alert
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    } catch (e: any) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    // eslint-disable-next-line no-alert
    const url = window.prompt('URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className='relative max-w-prose rounded-xl border'>
      {/* Toolbar */}
      <div className='sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-xl border-b bg-background p-2'>
        {/* Bold */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn(
                  editor.isActive('bold') && 'toolbar-button-active'
                )}
              >
                <BoldIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Bold</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Italic */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                  editor.isActive('italic') && 'toolbar-button-active'
                )}
              >
                <ItalicIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Italic</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Underline */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={cn(
                  editor.isActive('underline') && 'toolbar-button-active'
                )}
              >
                <UnderlineIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Underline</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Strike */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn(
                  editor.isActive('strike') && 'toolbar-button-active'
                )}
              >
                <StrikethroughIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Strikethrough</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Font Size */}
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='h-9 w-auto gap-1 px-2'>
                    <ALargeSmallIcon className='' /> <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className='bg-accent text-accent-foreground'>
                <p>Font Size</p>
              </TooltipContent>
              <DropdownMenuContent className='max-h-60 min-w-16 overflow-auto'>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().resetFontSize().run()}
                  >
                    Reset
                  </DropdownMenuItem>
                  {[8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96].map(
                    (size) => {
                      const pxSize = `${size}px`;
                      const emSize = pxToEm(pxSize);

                      return (
                        <DropdownMenuItem
                          key={size}
                          onClick={() =>
                            editor.chain().focus().setFontSize(pxSize).run()
                          }
                          className={cn(
                            editor.isActive('fontSize', { size: emSize }) &&
                              'toolbar-button-active'
                          )}
                        >
                          {size}
                        </DropdownMenuItem>
                      );
                    }
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </Tooltip>
          </DropdownMenu>
        </TooltipProvider>

        {/* Font Color */}
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='h-9 w-auto gap-1 px-2'>
                    <BrushIcon className='' />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className='bg-accent text-accent-foreground'>
                <p>Text Color</p>
              </TooltipContent>
              <DropdownMenuContent className='max-h-60 max-w-[calc(32px*8-10px)] overflow-auto p-2.5'>
                <div className='flex flex-wrap items-center'>
                  {colors.map((color) => (
                    <DropdownMenuItem
                      key={color}
                      onClick={() =>
                        editor.chain().focus().setColor(color).run()
                      }
                      className={cn(
                        'size-8 rounded-none border-foreground hover:border',
                        editor.isActive('textStyle', { color }) && 'border-2'
                      )}
                      style={{
                        backgroundColor: color,
                      }}
                    >
                      <span className='sr-only'>{color}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    className='flex size-8 items-center justify-center'
                    onClick={() => editor.chain().focus().unsetColor().run()}
                  >
                    <TrashIcon className='size-4' />
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </Tooltip>
          </DropdownMenu>
        </TooltipProvider>

        {/* Background Color */}
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='h-9 w-auto gap-1 px-2'>
                    <PaintBucketIcon className='' />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className='bg-accent text-accent-foreground'>
                <p>Background Color</p>
              </TooltipContent>
              <DropdownMenuContent className='max-h-60 max-w-[calc(32px*8-10px)] overflow-auto p-2.5'>
                <div className='flex flex-wrap items-center'>
                  {colors.map((color) => (
                    <DropdownMenuItem
                      key={color}
                      onClick={() =>
                        editor.chain().focus().setHighlight({ color }).run()
                      }
                      className={cn(
                        'size-8 rounded-none border-foreground hover:border',
                        editor.isActive('highlight', { color }) && 'border-2'
                      )}
                      style={{
                        backgroundColor: color,
                      }}
                    >
                      <span className='sr-only'>{color}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    className='flex size-8 items-center justify-center'
                    onClick={() =>
                      editor.chain().focus().unsetHighlight().run()
                    }
                  >
                    <TrashIcon className='size-4' />
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </Tooltip>
          </DropdownMenu>
        </TooltipProvider>

        {/* Heading & Code */}
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='h-9 w-auto gap-1 px-2'>
                    <PilcrowIcon className='' /> <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className='bg-accent text-accent-foreground'>
                <p>Paragraph Format</p>
              </TooltipContent>
              <DropdownMenuContent className='max-h-60 min-w-16 overflow-auto'>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().setParagraph().run()}
                  >
                    Normal
                  </DropdownMenuItem>
                  {headingLevels.map((level) => (
                    <DropdownMenuItem
                      key={level}
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level }).run()
                      }
                      className={cn(
                        editor.isActive('heading', { level }) &&
                          'toolbar-button-active'
                      )}
                    >
                      H{level}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={cn(
                      editor.isActive('code') && 'toolbar-button-active'
                    )}
                  >
                    Code
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </Tooltip>
          </DropdownMenu>
        </TooltipProvider>

        {/* Align */}
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='h-9 w-auto gap-1 px-2'>
                    {alignmentIcons[currentAlignment]}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className='bg-accent text-accent-foreground'>
                <p>Align</p>
              </TooltipContent>
              <DropdownMenuContent className='max-h-60 min-w-0 overflow-auto'>
                <DropdownMenuGroup>
                  {aligns.map((align) => (
                    <DropdownMenuItem
                      key={align.key}
                      onClick={() =>
                        editor.chain().focus().setTextAlign(align.key).run()
                      }
                      className={cn(
                        editor.isActive({ textAlign: align.key }) &&
                          'toolbar-button-active'
                      )}
                    >
                      <align.Icon />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </Tooltip>
          </DropdownMenu>
        </TooltipProvider>

        {/* Ordered List */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                  editor.isActive('orderedList') && 'toolbar-button-active'
                )}
              >
                <ListOrderedIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Ordered List</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Unordered List */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                  editor.isActive('bulletList') && 'toolbar-button-active'
                )}
              >
                <ListIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Unordered List</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Increase Indent */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => editor.chain().focus().increaseIndent().run()}
                disabled={isMaxIndent}
              >
                <IndentIncreaseIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Increase Indent</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Decrease Indent */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => editor.chain().focus().decreaseIndent().run()}
                disabled={isMinIndent}
              >
                <IndentDecreaseIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Decrease Indent</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Link */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={setLink}
                className={cn(
                  editor.isActive('link') && 'toolbar-button-active'
                )}
              >
                <Link2Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Insert Link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Unset Link */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
              >
                <Link2OffIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Unlink</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Image */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' size='icon' onClick={addImage}>
                <ImageIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='bg-accent text-accent-foreground'>
              <p>Image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
