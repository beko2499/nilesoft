import { cp, mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputRoot = join(projectRoot, 'dist');

const publicFiles = [
  'index.html',
  'about.html',
  'contact.html',
  'services.html',
  'work.html',
  'abubkr.html',
  'thank-you.html',
  'styles.css',
  'app.js',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  'favicon.ico',
  'favicon.svg',
  'favicon-48.png',
  'favicon-96.png',
  'favicon-192.png',
  'favicon-512.png',
  'apple-touch-icon.png',
  'nilesoft-favicon-v2.ico',
  'nilesoft-favicon-v2.svg',
  'nilesoft-favicon-v2-48.png',
  'nilesoft-favicon-v2-96.png',
  'nilesoft-favicon-v2-192.png',
  'nilesoft-logo-v2-512.png',
  'nilesoft-apple-touch-v2.png',
];

const publicDirectories = ['assets', 'demos'];
const forbiddenExtensions = new Set(['.zip', '.md', '.txt', '.py', '.ps1', '.bat']);
const canonicalPages = ['index.html', 'about.html', 'contact.html', 'services.html', 'work.html', 'abubkr.html'];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const file of publicFiles) {
  await cp(join(projectRoot, file), join(outputRoot, file));
}

for (const directory of publicDirectories) {
  await cp(join(projectRoot, directory), join(outputRoot, directory), {
    recursive: true,
    filter: (source) => !forbiddenExtensions.has(extname(source).toLowerCase()),
  });
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }))).flat();
}

const publishedFiles = await walk(outputRoot);
const forbiddenFiles = publishedFiles.filter(
  (file) => file !== join(outputRoot, 'robots.txt') && forbiddenExtensions.has(extname(file).toLowerCase()),
);
if (forbiddenFiles.length > 0) {
  throw new Error(`Private file types found in publish output: ${forbiddenFiles.join(', ')}`);
}

for (const page of canonicalPages) {
  const html = await readFile(join(outputRoot, page), 'utf8');
  if (!html.includes('rel="canonical"')) throw new Error(`Missing canonical URL in ${page}`);
  if (!html.includes('/nilesoft-favicon-v2-48.png')) throw new Error(`Missing versioned favicon in ${page}`);
  if (!html.includes('/nilesoft-logo-v2-512.png')) throw new Error(`Missing versioned organization logo in ${page}`);
}

const privateNames = ['site-source.html', 'crm-ui-concepts', 'marketing', 'brand-assets', 'tools'];
for (const name of privateNames) {
  if (publishedFiles.some((file) => file.includes(join(outputRoot, name)))) {
    throw new Error(`Private project content leaked into publish output: ${name}`);
  }
}

console.log(`Static publish output verified: ${publishedFiles.length} public files.`);
