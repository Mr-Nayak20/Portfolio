import {defineConfig} from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import {notes, studies} from './web/site/data.js';

function rewritePretty(req) {
  const pathOnly = (req.url || '').split('?')[0];
  if (/^\/works\/[a-z0-9-]+\/?$/.test(pathOnly)) req.url = '/study.html';
  else if (/^\/blog\/[a-z0-9-]+\/?$/.test(pathOnly)) req.url = '/article.html';
}

export default defineConfig({
  root: 'web',
  publicDir: 'public',
  appType: 'mpa',
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/examples': {target: 'http://127.0.0.1:5190', changeOrigin: true},
      '/src': {target: 'http://127.0.0.1:5190', changeOrigin: true},
      '/img': {target: 'http://127.0.0.1:5190', changeOrigin: true},
      '/models': {target: 'http://127.0.0.1:5190', changeOrigin: true},
      '/draco': {target: 'http://127.0.0.1:5190', changeOrigin: true}
    }
  },
  plugins: [{
    name: 'portfolio-routes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => { rewritePretty(req); next(); });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => { rewritePretty(req); next(); });
    },
    closeBundle() {
      const dist = path.resolve('dist');
      const study = fs.readFileSync(path.join(dist, 'study.html'), 'utf8');
      const article = fs.readFileSync(path.join(dist, 'article.html'), 'utf8');
      for (const s of studies) {
        const dir = path.join(dist, 'works', s.slug);
        fs.mkdirSync(dir, {recursive: true});
        fs.writeFileSync(path.join(dir, 'index.html'), study);
      }
      for (const n of notes) {
        const dir = path.join(dist, 'blog', n.slug);
        fs.mkdirSync(dir, {recursive: true});
        fs.writeFileSync(path.join(dir, 'index.html'), article);
      }
    }
  }],
  optimizeDeps: {exclude: ['@xenova/transformers']},
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      input: {
        portfolio: path.resolve('web/index.html'),
        virality: path.resolve('web/virality/index.html'),
        fizzi: path.resolve('web/fizzi/index.html'),
        substance: path.resolve('web/substance/index.html'),
        sleepy: path.resolve('web/sleepy/index.html'),
        nocturne: path.resolve('web/nocturne/index.html'),
        velocity: path.resolve('web/velocity/index.html'),
        brief: path.resolve('web/tools/brief/index.html'),
        tone: path.resolve('web/tools/tone/index.html'),
        sight: path.resolve('web/tools/sight/index.html'),
        voice: path.resolve('web/tools/voice/index.html'),
        about: path.resolve('web/about/index.html'),
        services: path.resolve('web/services/index.html'),
        serviceWeb: path.resolve('web/services/websites/index.html'),
        serviceSoft: path.resolve('web/services/software/index.html'),
        serviceAi: path.resolve('web/services/ai/index.html'),
        serviceWrite: path.resolve('web/services/writing/index.html'),
        works: path.resolve('web/works/index.html'),
        study: path.resolve('web/study.html'),
        clients: path.resolve('web/clients/index.html'),
        blog: path.resolve('web/blog/index.html'),
        article: path.resolve('web/article.html'),
        jobs: path.resolve('web/jobs/index.html'),
        archives: path.resolve('web/archives/index.html'),
        contact: path.resolve('web/contact/index.html'),
        privacy: path.resolve('web/privacy-policy/index.html'),
        terms: path.resolve('web/terms-of-use/index.html'),
        cookies: path.resolve('web/cookie-policy/index.html')
      }
    }
  }
});
