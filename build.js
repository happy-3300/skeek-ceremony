// Inlines all assets into one offline HTML file: skeek-ceremony.html
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/^\s*<link rel="preload"[^>]*>\n/gm, '');
html = html.replace(/assets\/([\w\/-]+\.png)/g, (_, f) =>
  'data:image/png;base64,' + fs.readFileSync('assets/' + f).toString('base64'));
fs.writeFileSync('skeek-ceremony.html', html);
console.log('skeek-ceremony.html', (html.length / 1e6).toFixed(1) + ' MB');
