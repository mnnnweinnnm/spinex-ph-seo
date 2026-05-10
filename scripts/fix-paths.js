#!/usr/bin/env node
/**
 * fix-paths.js — comprehensive final cleanup
 * 1. Strip ALL breadcrumb navs from page content (they come from layout now)
 * 2. Fix all ../ paths to absolute / paths
 * 3. Strip duplicate Google Fonts links
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

// Strip any breadcrumb nav from content (breadcrumb now comes from layout)
function stripBreadcrumbNav(html) {
  return html.replace(/<nav class="breadcrumb"[^>]*>[\s\S]*?<\/nav>\s*/g, '');
}

// Strip inline sticky-cta asides
function stripStickyAside(html) {
  return html.replace(/<aside class="sticky-cta"[^>]*>[\s\S]*?<\/aside>\s*/g, '');
}

// Normalise ALL ../asset/css/js paths to absolute
function fixAssetPaths(html) {
  return html
    .replace(/href="\.\.\/css\//g, 'href="/css/')
    .replace(/src="\.\.\/css\//g, 'src="/css/')
    .replace(/href="\.\.\/assets\//g, 'href="/assets/')
    .replace(/src="\.\.\/assets\//g, 'src="/assets/')
    .replace(/srcset="\.\.\/assets\//g, 'srcset="/assets/')
    .replace(/href="\.\.\/js\//g, 'href="/js/')
    .replace(/src="\.\.\/js\//g, 'src="/js/')
    // href="../" alone → "/"
    .replace(/href="\.\.\/"/g, 'href="/"')
    // href="../category/" → "/category/"
    .replace(/href="\.\.\/([\w-]+)\/"/g, 'href="/$1/"')
    // href="../slots/jili/" (2-level deep) → "/slots/jili/"
    .replace(/href="\.\.\/([\w-]+)\/([\w-]+)\/"/g, 'href="/$1/$2/"')
    // href="../slots/jili" (no trailing slash) → "/slots/jili"
    .replace(/href="\.\.\/([\w-]+)\/([\w-]+)"/g, 'href="/$1/$2"');
}

// Strip duplicate Google Fonts links
function stripGoogleFonts(html) {
  return html.replace(/<link[^>]*fonts\.googleapis[^>]*>/g, '');
}

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html.length;

  html = stripBreadcrumbNav(html);
  html = stripStickyAside(html);
  html = fixAssetPaths(html);
  html = stripGoogleFonts(html);

  if (html.length !== before) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ ${path.relative(SRC, filePath)} (${before} → ${html.length} chars)`);
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkDir(full);
    } else if (e.name === 'index.html') {
      processFile(full);
    }
  }
}

walkDir(SRC);
console.log('\nDone.');
