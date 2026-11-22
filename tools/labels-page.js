// Renders the designer's name labels (SVG with live text) to PNGs at SCALE x their artboard size.
// Needs the fonts visible to Chrome: run Chrome with FONTCONFIG_FILE=assets-3x/fonts/fonts.conf.
// usage: node tools/labels-page.js <label-svg-dir> <out.html> [scale] [arabicEmbolden]
const fs = require('fs'), path = require('path');
const [dir, out, scale = '3', arW = ''] = process.argv.slice(2);
const items = fs.readdirSync(dir).filter(f => f.endsWith('.svg')).map(f => {
  let s = fs.readFileSync(path.join(dir, f), 'utf8');
  // Only Brando Arabic *Text* (regular) is available; the design uses SemiBold. Embolden it with a thin
  // outline in the text colour (EMB = outline width in artboard units).
  if (arW) s = s.replace(/(font-family: BrandoArabic-SemiBold, 'Brando Arabic';)/g, `$1 stroke: #00383a; stroke-width: ${arW}px; stroke-linejoin: round; paint-order: stroke;`);
  return { name: f.replace(/\.svg$/, '.png'), svg: s };
});
fs.writeFileSync(out, `<!doctype html><meta charset="utf-8"><pre id="o"></pre><script>
const S=${Number(scale)}, items=${JSON.stringify(items)};
(async()=>{const res={};
for(const it of items){
  const vb=it.svg.match(/viewBox="([^"]+)"/)[1].split(/\\s+/).map(Number);
  const W=Math.ceil(vb[2]*S),H=Math.ceil(vb[3]*S);
  const svg=it.svg.replace('<svg ','<svg width="'+W+'" height="'+H+'" ');
  // inline SVG in the document (so local fonts load), then rasterise via foreignObject-free path: draw into canvas through a blob image
  const img=new Image(); img.src=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  await img.decode(); await new Promise(r=>setTimeout(r,300));
  const c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').drawImage(img,0,0,W,H);
  res[it.name]=c.toDataURL('image/png');
}
document.getElementById('o').textContent=JSON.stringify(res);})();
</script>`);
