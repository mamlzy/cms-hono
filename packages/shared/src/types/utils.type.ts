export type OmitStrict<T, K extends keyof T> = T extends any
  ? Pick<T, Exclude<keyof T, K>>
  : never;

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type ToQueryString<T> = {
  [K in keyof T]?: T[K] extends object
    ? ToQueryString<T[K]> // Recursively handle nested objects
    : string | string[] | undefined;
};
