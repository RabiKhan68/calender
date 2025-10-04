import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sien Calendar',
        short_name: 'Calendar',
        description: 'Your personal calendar app',
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
