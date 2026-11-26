// Před buildem vytvoří pro každý pokoj stránku /s/<pokoj>/ s OG obrázkem pro sdílení výsledku kvízu
// (Facebook, Instagram, WhatsApp… čtou jen statické meta tagy). Člověka stránka rovnou přesměruje do kalendáře.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const SITE = (process.env.VITE_SITE_URL || 'https://advent.oroom.cz').replace(/\/$/, '');
const results = JSON.parse(readFileSync('src/data/quizResults.json', 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

for (const [room, r] of Object.entries(results)) {
  const title = `Náš pokoj OROOM: ${r.name} – ${r.sub}`;
  const desc = `${r.headline} Zjistěte, která destinace OROOM je napsaná pro vás. Adventní kalendář OROOM Brno.`;
  const html = `<!doctype html>
<html lang="cs"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<meta property="og:type" content="website" /><meta property="og:locale" content="cs_CZ" />
<meta property="og:title" content="${esc(title)}" /><meta property="og:description" content="${esc(desc)}" />
<meta property="og:image" content="${SITE}/og/${room}.jpg" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
<meta property="og:url" content="${SITE}/s/${room}/" /><meta name="twitter:card" content="summary_large_image" />
<meta http-equiv="refresh" content="0; url=/?hra=kviz" />
</head><body><p><a href="/?hra=kviz">Adventní kalendář OROOM Brno</a></p><script>location.replace('/?hra=kviz');</script></body></html>
`;
  mkdirSync(`public/s/${room}`, { recursive: true });
  writeFileSync(`public/s/${room}/index.html`, html);
}
console.log('share pages:', Object.keys(results).length, 'site:', SITE);
