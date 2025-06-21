import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './',          // ← 新增：所有资源都按相对路径引用
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
