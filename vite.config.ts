import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: {
        failOnError: false,
        retryCount: 3,
        retryDelay: 1000,
      },
      spa: {
        enabled: true,
        prerender: {
          retryCount: 3,
          retryDelay: 1000,
        },
      },
    }),
    viteReact(),
  ],
})
