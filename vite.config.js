// import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // plugins: [eslint()]
  resolve: {
    alias: {
      '@assets': path.join(__dirname, '/src/assets')
    }
  }
});
