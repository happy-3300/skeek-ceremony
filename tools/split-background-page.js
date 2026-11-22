// Splits the 3x background into: ribbons.png (background without the building lines)
// and lines.png (just the building lines, original colour, transparent elsewhere). Both output at 1x.
const fs=require('fs');const bg=fs.readFileSync(process.argv[2]).toString('base64');
fs.writeFileSync(process.argv[3],`<pre id=o></pre><script>(async()=>{
const im=new Image();im.src="data:image/png;base64,${bg}";await im.decode();
const W=im.width,H=im.height,OW=2064,OH=2752;
const mk=()=>{const c=document.createElement("canvas");c.width=W;c.height=H;return c};
const a=mk(),x=a.getContext("2d");x.drawImage(im,0,0);const d=x.getImageData(0,0,W,H),p=d.data;
const L=new ImageData(W,H),q=L.data;
const C=[250,243,233],Lc=[209,137,88];const D=[Lc[0]-C[0],Lc[1]-C[1],Lc[2]-C[2]];const DD=D[0]*D[0]+D[1]*D[1]+D[2]*D[2];
for(let i=0;i<p.length;i+=4){const v0=p[i]-C[0],v1=p[i+1]-C[1],v2=p[i+2]-C[2];let t=(v0*D[0]+v1*D[1]+v2*D[2])/DD;
 if(t>0.02){if(t>1)t=1;const e0=v0-t*D[0],e1=v1-t*D[1],e2=v2-t*D[2];if(Math.sqrt(e0*e0+e1*e1+e2*e2)<3){
  q[i]=Lc[0];q[i+1]=Lc[1];q[i+2]=Lc[2];q[i+3]=Math.round(t*255);p[i]=C[0];p[i+1]=C[1];p[i+2]=C[2]}}}
x.putImageData(d,0,0);const b=mk();b.getContext("2d").putImageData(L,0,0);
const step=(src,w,h)=>{const n=document.createElement("canvas");n.width=w;n.height=h;const g=n.getContext("2d");g.imageSmoothingQuality="high";g.drawImage(src,0,0,w,h);return n};
const down=c=>step(step(c,Math.round(W/1.5),Math.round(H/1.5)),OW,OH);
document.getElementById("o").textContent=JSON.stringify({"ribbons.png":down(a).toDataURL("image/png"),"lines.png":down(b).toDataURL("image/png")})})()</script>`);
