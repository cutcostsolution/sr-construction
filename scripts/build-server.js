import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

await build({
  entryPoints: [resolve(rootDir, 'api', 'boot.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: resolve(rootDir, 'dist', 'boot.js'),
  target: 'node20',
  external: [
    'mysql2',
    'bcryptjs',
    'jose',
    'dotenv',
    'cookie',
    'nodemailer',
    'web-push',
    'superjson',
    'zod',
    'hono',
    '@hono/node-server',
    '@trpc/server',
    'drizzle-orm',
    'ai',
    '@ai-sdk/openai-compatible',
    'nanoid',
    'date-fns',
  ],
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

console.log('Server build complete: dist/boot.js');
