import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getGitHubPagesBase() {
  const repository = process.env.GITHUB_REPOSITORY?.split('/').pop();
  const repoName = repository || path.basename(__dirname);

  if (!repoName || repoName.endsWith('.github.io')) {
    return '/';
  }

  return `/${repoName.replace(/^\/+|\/+$/g, '')}/`;
}

export default {
  base: process.env.VITE_BASE_PATH || getGitHubPagesBase(),
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
};
