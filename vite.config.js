import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n'],
      dts: './auto-imports.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
