// @ts-check
import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),

	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@': path.resolve(projectRoot, './src'),
			},
		},
	},

	integrations: [react()],
});
