import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import express from 'express';
import jdoodleApi from './api/jdoodle';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    middlewareMode: true,
    setup: (app) => {
      app.use('/api/jdoodle', jdoodleApi);
    },
  },
  preview: {
    port: 3000,
    setup: (app) => {
      app.use('/api/jdoodle', jdoodleApi);
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          ui: ['@radix-ui/react-icons', '@radix-ui/react-dialog']
        }
      }
    }
  }
});
