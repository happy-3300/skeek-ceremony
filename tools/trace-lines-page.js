// builds a page that traces the building lines out of the 3x background and renders the lit layer at 1x
const fs=require('fs');const bg=fs.readFileSync(process.argv[2]).toString('base64');
fs.writeFileSync(process.argv[3],`<pre id=o></pre><script>(async()=>{
const im=new Image();im.src="data:image/png;base64,${bg}";await im.decode();
const W=im.width,H=im.height,OW=2064,OH=2752;
const c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");x.drawImage(im,0,0);
const d=x.getImageData(0,0,W,H),p=d.data;
const C=[250,243,233],Lc=[209,137,88];const D=[Lc[0]-C[0],Lc[1]-C[1],Lc[2]-C[2]];const DD=D[0]*D[0]+D[1]*D[1]+D[2]*D[2];
let n=0;const rb=new Uint8ClampedArray(p.length);
for(let i=0;i<p.length;i+=4){const v0=p[i]-C[0],v1=p[i+1]-C[1],v2=p[i+2]-C[2];
 let t=(v0*D[0]+v1*D[1]+v2*D[2])/DD;let a=0;
 if(t>0.02){if(t>1)t=1;const e0=v0-t*D[0],e1=v1-t*D[1],e2=v2-t*D[2];const dist=Math.sqrt(e0*e0+e1*e1+e2*e2);
  if(dist<${process.argv[4]||3})a=t}
 const mag=Math.sqrt(v0*v0+v1*v1+v2*v2);if(a===0&&mag>6){rb[i+3]=Math.min(255,mag*8)}
 // solid amber, alpha = line coverage
 p[i]=255;p[i+1]=143;p[i+2]=31;p[i+3]=Math.round(a*255);if(a>0.5)n++}
x.putImageData(d,0,0);
const rc=document.createElement("canvas");rc.width=W;rc.height=H;rc.getContext("2d").putImageData(new ImageData(rb,W,H),0,0);
// downscale 3x -> 1.5x -> 1x
const step=(src,w,h)=>{const n=document.createElement("canvas");n.width=w;n.height=h;const g=n.getContext("2d");g.imageSmoothingQuality="high";g.drawImage(src,0,0,w,h);return n};
const core=step(step(c,Math.round(W/1.5),Math.round(H/1.5)),OW,OH);
const out=document.createElement("canvas");out.width=OW;out.height=OH;const o=out.getContext("2d");
o.globalAlpha=.8;o.filter="blur(10px)";o.drawImage(core,0,0);o.drawImage(core,0,0);o.drawImage(core,0,0);o.filter="blur(5px)";o.drawImage(core,0,0);o.drawImage(core,0,0);
o.globalAlpha=1;o.filter="blur(1.5px)";o.drawImage(core,0,0);o.drawImage(core,0,0);
o.globalAlpha=1;o.filter="none";o.drawImage(core,0,0);
// thin warm highlight in the middle of each line
const hl=document.createElement("canvas");hl.width=OW;hl.height=OH;const h=hl.getContext("2d");h.drawImage(core,0,0);
const hd=h.getImageData(0,0,OW,OH),q=hd.data;for(let i=0;i<q.length;i+=4){const a=q[i+3]/255;q[i]=255;q[i+1]=218;q[i+2]=160;q[i+3]=a>.75?Math.round((a-.75)*4*230):0}
h.putImageData(hd,0,0);o.drawImage(hl,0,0);
const rm=step(step(rc,Math.round(W/1.5),Math.round(H/1.5)),OW,OH);o.globalCompositeOperation="destination-out";o.drawImage(rm,0,0);o.globalCompositeOperation="source-over";
document.getElementById("o").textContent=JSON.stringify({"lines-lit.png":out.toDataURL("image/png"),"info.txt":"data:text/plain;base64,"+btoa("solid line px "+n)})})()</script>`);
