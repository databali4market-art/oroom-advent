import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const SITE = (process.env.VITE_SITE_URL || 'https://advent.oroom.cz').replace(/\/$/, '');

/** OG obrázek musí mít absolutní adresu (SITE_URL z prostředí). */
const ogImage = (): Plugin => ({
  name: 'og-image',
  transformIndexHtml: (html) => html.replace('content="/og/indie.jpg"', `content="${SITE}/og/indie.jpg"`),
});

// Kalendář běží v kořeni vlastní (sub)domény, proto je base '/'.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), ogImage()],
  build: { chunkSizeWarningLimit: 900 },
});
