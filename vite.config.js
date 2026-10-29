import {defineConfig} from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import {notes, studies} from './web/site/data.js';

function rewritePretty(req) {
  const pathOnly = (req.url || '').split('?')[0];
  if (/^\/blog\/[a-z0-9-]+\/?$/.test(pathOnly)) req.url = '/article.html';
}

export default defineConfig({
  root: 'web',
  publicDir: 'public',
  appType: 'mpa',
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true
  },
  plugins: [{
    name: 'portfolio-routes',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = (req.url || '').match(/^\/works\/([a-z0-9-]+)\/?(?:\?.*)?$/);
        if (match && studies.some(study => study.slug === match[1])) { res.writeHead(302, {Location: `/examples/${match[1]}/`}); res.end(); return; }
        rewritePretty(req); next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = (req.url || '').match(/^\/works\/([a-z0-9-]+)\/?(?:\?.*)?$/);
        if (match && studies.some(study => study.slug === match[1])) { res.writeHead(302, {Location: `/examples/${match[1]}/`}); res.end(); return; }
        rewritePretty(req); next();
      });
    },
    closeBundle() {
      const dist = path.resolve('dist');
      const article = fs.readFileSync(path.join(dist, 'article.html'), 'utf8');
      for (const s of studies) {
        const dir = path.join(dist, 'works', s.slug);
        fs.mkdirSync(dir, {recursive: true});
        fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/examples/${s.slug}/"><title>Opening ${s.name}</title></head><body><a href="/examples/${s.slug}/">Open ${s.name}</a></body></html>`);
      }
      for (const n of notes) {
        const dir = path.join(dist, 'blog', n.slug);
        fs.mkdirSync(dir, {recursive: true});
        fs.writeFileSync(path.join(dir, 'index.html'), article);
      }
    }
  }],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      input: {
        ...Object.fromEntries(studies.map(s => ['world-' + s.slug, path.resolve('web/examples/' + s.slug + '/index.html')])),
        portfolio: path.resolve('web/index.html'),
        virality: path.resolve('web/virality/index.html'),
        fizzi: path.resolve('web/fizzi/index.html'),
        substance: path.resolve('web/substance/index.html'),
        sleepy: path.resolve('web/sleepy/index.html'),
        nocturne: path.resolve('web/nocturne/index.html'),
        velocity: path.resolve('web/velocity/index.html'),
        about: path.resolve('web/about/index.html'),
        services: path.resolve('web/services/index.html'),
        serviceWeb: path.resolve('web/services/websites/index.html'),
        serviceSoft: path.resolve('web/services/software/index.html'),
        serviceAi: path.resolve('web/services/ai/index.html'),
        serviceWrite: path.resolve('web/services/writing/index.html'),
        works: path.resolve('web/works/index.html'),
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
