// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: 'static',

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

  integrations: [icon()],
  adapter: netlify(),
});