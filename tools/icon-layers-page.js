const fs=require('fs'),path=require('path');const [dir,out]=process.argv.slice(2);
const map={"founder house.svg":"founder-house","bayt al zamen.svg":"bayt-al-zaman","fereej al asmakh.svg":"fereej-al-asmakh","ar al kutub al qatariya.svg":"dar-al-kutub","doha staduim.svg":"doha-stadium"};
const items=Object.entries(map).map(([f,n])=>({n,svg:fs.readFileSync(path.join(dir,f),'utf8')}));
fs.writeFileSync(out,`<pre id=o></pre><script>
const items=${JSON.stringify(items)};
const VB=[-170,-30,920,600],K=1.2;
async function render(svgEl){const s=new XMLSerializer().serializeToString(svgEl);const im=new Image();im.src="data:image/svg+xml;base64,"+btoa(unescape(encodeURIComponent(s)));await im.decode();
 const c=document.createElement("canvas");c.width=VB[2]*K;c.height=VB[3]*K;c.getContext("2d").drawImage(im,0,0,c.width,c.height);return c}
(async()=>{const res={},info={};
for(const {n,svg} of items){
 const variant=async(kind)=>{const doc=new DOMParser().parseFromString(svg,"image/svg+xml");const root=doc.documentElement;
  root.setAttribute("viewBox",VB.join(" "));root.setAttribute("width",VB[2]*K);root.setAttribute("height",VB[3]*K);
  const L=doc.getElementById("Layer_1");const sun=[...L.children].filter(e=>e.tagName=="circle"||e.tagName=="path");
  const groups=[...doc.querySelectorAll("g[id$='.psd']")];const sh=groups.filter(g=>/hadow/.test(g.id)),bd=groups.filter(g=>!/hadow/.test(g.id));
  if(kind!="sun")sun.forEach(e=>e.remove());
  if(kind!="shadow")sh.forEach(e=>e.remove());
  if(kind!="building")bd.forEach(e=>e.remove());
  if(kind=="shadow"){const r=doc.createElementNS("http://www.w3.org/2000/svg","rect");r.setAttribute("x",VB[0]-10);r.setAttribute("y",VB[1]-10);r.setAttribute("width",VB[2]+20);r.setAttribute("height",VB[3]+20);r.setAttribute("fill","#faf3e9");L.insertBefore(r,L.firstChild)}
  const c=await render(root);
  if(kind=="shadow"){const x=c.getContext("2d"),d=x.getImageData(0,0,c.width,c.height),p=d.data;let edge=0;
   // shadow was multiplied onto the cream page colour; turn it into a layer that only darkens cream the same way
   const CR=[250,243,233];const W0=c.width;
   for(let i=0;i<p.length;i+=4){let a=0;for(let k=0;k<3;k++)a=Math.max(a,(CR[k]-p[i+k])/CR[k]);
    // soft elliptical fade towards the layer edges (centre ~ icon middle, units of the icon artboard)
    const px=(i/4)%W0,py=((i/4)/W0)|0;const u=VB[0]+px/K,v=VB[1]+py/K;const e=Math.hypot((u-286)/430,(v-300)/270);
    const fall=e<0.72?1:e>1?0:(1-(e-0.72)/0.28)**2;a*=fall;
    if(a<0.004){p[i+3]=0;continue}const a0=a/fall;for(let k=0;k<3;k++)p[i+k]=Math.max(0,Math.min(255,CR[k]-(CR[k]-p[i+k])/a0));p[i+3]=Math.round(a*255)}
   x.putImageData(d,0,0);
   // max alpha along the canvas border (should be ~0 if shadows fade out)
   const W=c.width,H=c.height;for(let X=0;X<W;X++)for(const Y of [0,H-1])edge=Math.max(edge,p[(Y*W+X)*4+3]);for(let Y=0;Y<H;Y++)for(const X of [0,W-1])edge=Math.max(edge,p[(Y*W+X)*4+3]);
   info[n+"-shadow-edge"]=edge}
  res[n+"-"+kind+".png"]=c.toDataURL("image/png")};
 await variant("sun");await variant("building");await variant("shadow");}
res["info.txt"]="data:text/plain;base64,"+btoa(JSON.stringify(info));
document.getElementById("o").textContent=JSON.stringify(res)})().catch(e=>{document.getElementById("o").textContent=JSON.stringify({"err.txt":"data:text/plain;base64,"+btoa(String(e))})});
</script>`);
