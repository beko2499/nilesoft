import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const pages = [
  ['index.html', 'https://www.nilesoft.tech/'],
  ['about.html', 'https://www.nilesoft.tech/about.html'],
  ['contact.html', 'https://www.nilesoft.tech/contact.html'],
  ['services.html', 'https://www.nilesoft.tech/services.html'],
  ['work.html', 'https://www.nilesoft.tech/work.html'],
  ['abubkr.html', 'https://www.nilesoft.tech/abubkr.html'],
];

for (const [file, expectedCanonical] of pages) {
  const html = await readFile(join(projectRoot, file), 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];

  if (canonical !== expectedCanonical) {
    throw new Error(`Unexpected canonical URL in ${file}: ${canonical ?? 'missing'}`);
  }
  if (!jsonLd) throw new Error(`Missing JSON-LD in ${file}`);
  JSON.parse(jsonLd);
  if (!html.includes('/nilesoft-favicon-v2-48.png')) throw new Error(`Missing versioned favicon in ${file}`);
  if (!html.includes('/nilesoft-logo-v2-512.png')) throw new Error(`Missing versioned organization logo in ${file}`);
}

console.log(`SEO metadata verified on ${pages.length} canonical pages.`);
