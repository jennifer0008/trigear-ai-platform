/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DIFY_API_KEY: string
  readonly VITE_DIFY_BASE_URL: string
  readonly VITE_CHATBOT_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string
