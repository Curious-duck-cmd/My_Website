import { defineConfig } from 'vite'

export default defineConfig({
  // This ensures Vite looks for VITE_ variables
  define: {
    'process.env': {}
  }
})