/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
