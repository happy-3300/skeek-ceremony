// Builds the single offline page from src.html: every asset inlined.
//   index.html          - what the live site serves (with offline saving for the iPad home-screen app)
//   skeek-ceremony.html - identical copy, the file that goes in the zip
//   sw.js               - offline saving, versioned by the page's content
const fs = require('fs'), crypto = require('crypto');
let html = fs.readFileSync('src.html', 'utf8');
html = html.replace(/^\s*<link rel="preload"[^>]*>\n/gm, '');
html = html.replace(/assets\/([\w\/-]+\.png)/g, (_, f) =>
  'data:image/png;base64,' + fs.readFileSync('assets/' + f).toString('base64'));
fs.writeFileSync('index.html', html);
fs.writeFileSync('skeek-ceremony.html', html);
const version = 'skeek-' + crypto.createHash('sha1').update(html).update(fs.readFileSync('app-icon.png')).update(fs.readFileSync('manifest.webmanifest')).digest('hex').slice(0, 10);
fs.writeFileSync('sw.js', fs.readFileSync('sw-template.js', 'utf8').replace('__VERSION__', version));
console.log('index.html + skeek-ceremony.html', (html.length / 1e6).toFixed(1) + ' MB,', version);
