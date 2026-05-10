#!/usr/bin/env node
/**
 * refactor-htmls.js
 * Strips header/footer/sticky-cta from each HTML file in src/,
 * adds 11ty front matter, and rewrites the file.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

// Strip header: from <header class="site-header" to </header>
function stripHeader(html) {
  return html.replace(/<header class="site-header"[\s\S]*?<\/header>\n?/, '');
}

// Strip footer
function stripFooter(html) {
  return html.replace(/<footer class="site-footer"[\s\S]*?<\/footer>\n?/, '');
}

// Strip inline-style sticky-cta
function stripInlineStickyCta(html) {
  // blog/index.html has inline style version
  return html.replace(/<div class="sticky-cta"[^>]*>[\s\S]*?<\/div>\n?/, '');
}

// Strip class-based sticky-cta (before footer or at end)
function stripClassStickyCta(html) {
  return html.replace(/<div class="sticky-cta">[\s\S]*?<\/div>\n?/g, '');
}

// Strip closing </body> and </html> since layout adds them
function stripBodyClose(html) {
  return html.replace(/<\/body>\s*<\/html>\s*$/, '');
}

// Strip opening <body>
function stripBodyOpen(html) {
  return html.replace(/^<body>\s*/, '');
}

// Determine layout and canonical URL from path
function getLayoutMeta(filePath) {
  const rel = path.relative(SRC, filePath);
  const parts = rel.split(path.sep); // e.g. ['slots','index.html'] or ['index.html']
  const name = parts[0];

  // Homepage
  if (rel === 'index.html') {
    return { layout: 'home', canonical: 'https://spinex.news/', breadcrumbs: null };
  }

  // Blog index — no breadcrumb, like homepage
  if (rel === 'blog/index.html') {
    return { layout: 'subpage', canonical: 'https://spinex.news/blog/', breadcrumbs: null };
  }

  // Article pages (2 deep: category/page)
  if (parts.length === 3) {
    const [cat, page] = parts;
    const canonical = `https://spinex.news/${cat}/${page}/`;
    const pageLabel = page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ');
    return {
      layout: 'subpage',
      canonical,
      breadcrumbs: [
        { label: cat.charAt(0).toUpperCase() + cat.slice(1), url: `/${cat}/` },
        { label: pageLabel }
      ]
    };
  }

  // Top-level index pages (category listing)
  if (parts.length === 2 && name !== 'index.html') {
    const canonical = `https://spinex.news/${name}/`;
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    return {
      layout: 'subpage',
      canonical,
      breadcrumbs: [{ label }]
    };
  }

  return { layout: 'subpage', canonical: 'https://spinex.news/', breadcrumbs: null };
}

// Extract title and description from <title> and <meta name="description">
function extractMeta(html) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="(.*?)"/);
  return {
    title: titleMatch ? titleMatch[1] : 'SPINEX News',
    description: descMatch ? descMatch[1] : ''
  };
}

// Extract ogImage from og:image meta tag
function extractOgImage(html) {
  const m = html.match(/<meta property="og:image" content="(.*?)"/);
  return m ? m[1] : null;
}

function refactorFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');

  // Save head section before we destroy it
  const headMatch = html.match(/<head>[\s\S]*?<\/head>/);
  const head = headMatch ? headMatch[0] : '';
  const { title, description } = extractMeta(html);
  const ogImage = extractOgImage(html);

  // Strip layout infrastructure
  html = stripBodyOpen(html);
  html = stripHeader(html);
  html = stripInlineStickyCta(html);
  html = stripClassStickyCta(html);
  html = stripFooter(html);
  html = stripBodyClose(html);

  // Trim whitespace but preserve structure
  html = html.trim();

  const { layout, canonical, breadcrumbs } = getLayoutMeta(filePath);

  // Build front matter
  let fm = '---\n';
  fm += `layout: ${layout}\n`;
  fm += `title: "${title.replace(/"/g, '\\"')}"\n`;
  fm += `description: "${description.replace(/"/g, '\\"')}"\n`;
  fm += `canonical: "${canonical}"\n`;
  if (ogImage) fm += `ogImage: "${ogImage}"\n`;
  if (breadcrumbs) fm += `breadcrumbs:\n${breadcrumbs.map(c => (c.url ? `  - label: "${c.label}"\n    url: "${c.url}"` : `  - label: "${c.label}"`)).join('\n')}\n`;
  fm += '---\n';

  const result = fm + '\n' + html + '\n';
  fs.writeFileSync(filePath, result, 'utf8');
  console.log(`✓ ${path.relative(SRC, filePath)} → layout: ${layout}`);
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkDir(full);
    } else if (e.name === 'index.html' || e.name === 'index.njk') {
      refactorFile(full);
    }
  }
}

walkDir(SRC);
console.log('\nDone.');
