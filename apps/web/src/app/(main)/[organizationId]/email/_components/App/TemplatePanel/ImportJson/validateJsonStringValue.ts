import {
  EditorConfigurationSchema,
  type TEditorConfiguration,
} from '../../../documents/editor/core';

type TResult =
  | { error: string; data?: undefined }
  | { data: TEditorConfiguration; error?: undefined };

export function validateTextAreaValue(value: string): TResult {
  let jsonObject;
  try {
    jsonObject = JSON.parse(value);
  } catch {
    return { error: 'Invalid json' };
  }

  const parseResult = EditorConfigurationSchema.safeParse(jsonObject);
  if (!parseResult.success) {
    return { error: 'Invalid JSON schema' };
  }

  if (!parseResult.data.root) {
    return { error: 'Missing "root" node' };
  }

  return { data: parseResult.data };
}
