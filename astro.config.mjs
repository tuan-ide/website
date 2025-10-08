// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    fonts: [
      {
        name: "Clash Display",
        cssVariable: "--font-clash-display",
        provider: fontProviders.fontshare(),
      },
      {
        name: "Satoshi",
        cssVariable: "--font-satoshi",
        provider: fontProviders.fontshare(),
      },
    ],
  },
});
