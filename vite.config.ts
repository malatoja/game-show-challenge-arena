import { defineConfig } from 'vite';
import reactVitest from '@vitejs/plugin-react';
import { vitePlugin as remix } from "@remix-run/dev";
import path from 'path';
import { installGlobals } from "@remix-run/node";
installGlobals();

export default defineConfig({
  plugins: [remix()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '~': path.resolve(__dirname, './app'),
    },
  },
});