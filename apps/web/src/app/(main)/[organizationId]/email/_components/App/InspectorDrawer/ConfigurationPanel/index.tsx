import { type TEditorBlock } from '../../../documents/editor/core';
import {
  setDocument,
  useDocument,
  useSelectedBlockId,
} from '../../../documents/editor/EditorContext';
import { AvatarSidebarPanel } from './input-panels/AvatarSidebarPanel';
import { ButtonSidebarPanel } from './input-panels/ButtonSidebarPanel';
import { ColumnsContainerPanel } from './input-panels/ColumnsContainerSidebarPanel';
import { ContainerSidebarPanel } from './input-panels/ContainerSidebarPanel';
import { DividerSidebarPanel } from './input-panels/DividerSidebarPanel';
import { EmailLayoutSidebarFields } from './input-panels/EmailLayoutSidebarPanel';
import { HeadingSidebarPanel } from './input-panels/HeadingSidebarPanel';
import { HtmlSidebarPanel } from './input-panels/HtmlSidebarPanel';
import { ImageSidebarPanel } from './input-panels/ImageSidebarPanel';
import { SpacerSidebarPanel } from './input-panels/SpacerSidebarPanel';
import { TextSidebarPanel } from './input-panels/TextSidebarPanel';

function renderMessage(val: string) {
  return (
    <div className='m-[3px] border border-dashed p-px'>
      <p>{val}</p>
    </div>
  );
}

export function ConfigurationPanel() {
  const document = useDocument();
  const selectedBlockId = useSelectedBlockId();

  if (!selectedBlockId) {
    return renderMessage('Click on a block to inspect.');
  }

  const block = document[selectedBlockId];
  if (!block) {
    return renderMessage(
      `Block with id ${selectedBlockId} was not found. Click on a block to reset.`
    );
  }

  const setBlock = (conf: TEditorBlock) =>
    setDocument({ [selectedBlockId]: conf });

  const { data, type } = block;

  switch (type) {
    case 'Avatar':
      return (
        <AvatarSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Button':
      return (
        <ButtonSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'ColumnsContainer':
      return (
        <ColumnsContainerPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Container':
      return (
        <ContainerSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Divider':
      return (
        <DividerSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Heading':
      return (
        <HeadingSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Html':
      return (
        <HtmlSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Image':
      return (
        <ImageSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'EmailLayout':
      return (
        <EmailLayoutSidebarFields
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Spacer':
      return (
        <SpacerSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Text':
      return (
        <TextSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    default:
      return <pre>{JSON.stringify(block, null, '  ')}</pre>;
  }
}
