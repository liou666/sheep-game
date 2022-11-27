/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'
import Unocss from 'unocss/vite'

export default defineConfig({
  plugins: [
    Unocss({}),
    React(),
    Pages(),
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
        'ahooks',
        'react-i18next',
      ],
      dts: true,
      dirs: [
        './src/hooks',
      ],
    })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  // build: {
  //   rollupOptions: {
  //     external: ['ahooks'],
  //   },
  // },
})
