import { readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const projectRequire = createRequire(import.meta.url);
const astroPackagePath = projectRequire.resolve('astro/package.json');
const astroRequire = createRequire(astroPackagePath);
const cookieEntry = astroRequire.resolve('cookie');
const cookiePackagePath = join(dirname(cookieEntry), '..', 'package.json');
const cookiePackage = JSON.parse(readFileSync(cookiePackagePath, 'utf8'));
const cookie = await import(pathToFileURL(cookieEntry).href);

console.log('Netlify runtime dependency check', {
  node: process.version,
  nodeOptions: process.env.NODE_OPTIONS ?? null,
  cookieEntry: realpathSync(cookieEntry),
  cookieVersion: cookiePackage.version,
  cookieType: cookiePackage.type ?? null,
  cookieExports: cookiePackage.exports ?? null,
  exportedNames: Object.keys(cookie).sort(),
});

if (typeof cookie.parseCookie !== 'function' || typeof cookie.stringifySetCookie !== 'function') {
  throw new Error('The resolved cookie package does not expose the functions Astro requires.');
}
