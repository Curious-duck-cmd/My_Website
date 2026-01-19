// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Use './' to ensure relative paths work on your domain
  define: {
    'process.env': {} 
  }
})