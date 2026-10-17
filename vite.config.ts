import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // The GitHub repository should be named exactly 'FoodStall'.
  base: '/FoodStall/',
  plugins: [react()],
  server: { host: '0.0.0.0' },
});
