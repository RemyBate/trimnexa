import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(projectRoot, './src'),
		},
	},
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node',
		setupFiles: ['./vitest.setup.ts'],
		// These integration tests hit Prisma + Better Auth and can take longer
		// on local machines (especially when PostgreSQL is under load).
		hookTimeout: 30_000,
		testTimeout: 30_000,
	},
});
