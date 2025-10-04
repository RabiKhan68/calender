import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sien Calender',
        short_name: 'Calender',
        description: 'Your personal calender app',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/calender-icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/calender-icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});