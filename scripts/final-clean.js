#!/usr/bin/env node
/**
 * final-clean.js
 * Clean already-refactored 11ty page fragments:
 * - preserve front matter
 * - remove original doctype/html/head/body wrappers
 * - remove duplicated original breadcrumb/header/footer/sticky CTA
 * - normalize relative URLs to absolute site-root URLs
 * - refresh breadcrumb labels in front matter
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

const LABELS = {
  'banking': 'Banking',
  'best-online-casino-philippines': 'Best Online Casino Philippines',
  'blog': 'Blog',
  'faq': 'FAQ',
  'gcash-online-casino-philippines': 'GCash Online Casino Philippines',
  'live-casino': 'Live Casino',
  'crazy-time': 'Crazy Time',
  'privacy': 'Privacy Policy',
  'promotions': 'Promotions',
  'responsible': 'Responsible Gaming',
  'slots': 'Slots',
  'fachai': 'FaChai',
  'jili': 'JILI',
  'pg-soft': 'PG Soft',
  'terms': 'Terms & Conditions'
};

function label(slug) {
  return LABELS[slug] || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function splitFrontMatter(s) {
  if (!s.startsWith('---\n')) return ['', s];
  const end = s.indexOf('\n---\n', 4);
  if (end === -1) return ['', s];
  return [s.slice(0, end + 5), s.slice(end + 5)];
}

function buildBreadcrumbFrontMatter(rel) {
  const parts = rel.split(path.sep).filter(Boolean);
  if (rel === 'index.html') return null;
  if (rel === path.join('blog', 'index.html')) return null;

  // top-level /foo/
  if (parts.length === 2) {
    const slug = parts[0];
    return `breadcrumbs:\n  - label: "${label(slug)}"`;
  }

  // nested /foo/bar/
  if (parts.length === 3) {
    const [cat, page] = parts;
    return `breadcrumbs:\n  - label: "${label(cat)}"\n    url: "/${cat}/"\n  - label: "${label(page)}"`;
  }
  return null;
}

function refreshBreadcrumbs(fm, rel) {
  const crumb = buildBreadcrumbFrontMatter(rel);
  // remove existing breadcrumbs block
  fm = fm.replace(/\nbreadcrumbs:\n(?:  - .*(?:\n    .*)?\n?)+/m, '\n');
  if (crumb) fm = fm.replace(/\n---\n$/, `\n${crumb}\n---\n`);
  return fm;
}

function cleanBody(html) {
  // remove full original document wrappers before body
  html = html.replace(/^\s*<!doctype[\s\S]*?<body[^>]*>\s*/i, '');
  html = html.replace(/^\s*<html[\s\S]*?<body[^>]*>\s*/i, '');
  html = html.replace(/^\s*<body[^>]*>\s*/i, '');

  // remove shared elements now owned by layouts/includes
  html = html.replace(/<header class="site-header"[\s\S]*?<\/header>\s*/g, '');
  html = html.replace(/<nav class="breadcrumb"[^>]*>[\s\S]*?<\/nav>\s*/g, '');
  html = html.replace(/<div class="breadcrumb"[^>]*>[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/<p class="breadcrumb"[^>]*>[\s\S]*?<\/p>\s*/g, '');
  html = html.replace(/<aside class="sticky-cta"[^>]*>[\s\S]*?<\/aside>\s*/g, '');
  html = html.replace(/<div class="sticky-cta"[^>]*>[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/<footer class="site-footer"[\s\S]*?<\/footer>\s*/g, '');

  // remove old per-page scripts; layouts own final JS now
  html = html.replace(/<script[^>]*src="[^"]*spinex\.js"[^>]*><\/script>\s*/g, '');
  html = html.replace(/<script[^>]*cloudflareinsights[^>]*>[\s\S]*?<\/script>\s*/g, '');
  html = html.replace(/<script[^>]*static\.cloudflareinsights[^>]*>[\s\S]*?<\/script>\s*/g, '');

  // remove closing wrappers
  html = html.replace(/<\/body>\s*<\/html>\s*$/i, '');
  html = html.replace(/<\/html>\s*$/i, '');
  html = html.replace(/<\/body>\s*$/i, '');
  html = html.replace(/<\/content>\s*$/i, '');

  // remove duplicated fonts/head-only links if any
  html = html.replace(/<link[^>]*fonts\.googleapis[^>]*>\s*/g, '');
  html = html.replace(/<link[^>]*rel="preconnect"[^>]*>\s*/g, '');
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>\s*/g, '');

  // normalize relative paths
  html = html
    .replace(/href="\.\.\/"/g, 'href="/"')
    .replace(/href="\.\.\/assets\//g, 'href="/assets/')
    .replace(/src="\.\.\/assets\//g, 'src="/assets/')
    .replace(/srcset="\.\.\/assets\//g, 'srcset="/assets/')
    .replace(/href="\.\.\/css\//g, 'href="/css/')
    .replace(/src="\.\.\/css\//g, 'src="/css/')
    .replace(/href="\.\.\/js\//g, 'href="/js/')
    .replace(/src="\.\.\/js\//g, 'src="/js/')
    .replace(/href="\.\.\/([\w-]+)\/([\w-]+)\/"/g, 'href="/$1/$2/"')
    .replace(/href="\.\.\/([\w-]+)\/"/g, 'href="/$1/"')
    .replace(/href="\.\.\/([\w-]+)"/g, 'href="/$1"');

  return html.trim() + '\n';
}

for (const p of sortedWalk(SRC)) {
  if (path.basename(p) !== 'index.html') continue;
  const rel = path.relative(SRC, p);
  const before = fs.readFileSync(p, 'utf8');
  let [fm, body] = splitFrontMatter(before);
  if (fm) fm = refreshBreadcrumbs(fm, rel);
  const after = (fm ? fm + '\n' : '') + cleanBody(body);
  fs.writeFileSync(p, after, 'utf8');
  console.log(`✓ ${rel}`);
}

function sortedWalk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...sortedWalk(full));
    else out.push(full);
  }
  return out.sort();
}
