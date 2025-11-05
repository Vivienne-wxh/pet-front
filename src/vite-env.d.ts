/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv & {
    readonly MODE: string;
    readonly PROD: boolean;
    readonly DEV: boolean;
    readonly SSR: boolean;
  };
}

