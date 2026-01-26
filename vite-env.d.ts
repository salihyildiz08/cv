// Removed reference to vite/client to fix type definition error

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}