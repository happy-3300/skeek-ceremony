const {spawn}=require('child_process'),fs=require('fs');
const [url,outdir]=process.argv.slice(2);
const ch=spawn('google-chrome',['--headless=new','--disable-gpu','--remote-debugging-port=9333','--user-data-dir='+outdir+'/../chprof','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{let t;for(let i=0;i<40;i++){try{t=await (await fetch('http://127.0.0.1:9333/json')).json();if(t.find(x=>x.type=='page'))break}catch{}await sleep(250)}
const page=t.find(x=>x.type=='page');const ws=new WebSocket(page.webSocketDebuggerUrl);let id=0,pend={};
ws.onmessage=e=>{const m=JSON.parse(e.data);if(pend[m.id]){pend[m.id](m);delete pend[m.id]}};
await new Promise(r=>ws.onopen=r);const send=(method,params)=>new Promise(r=>{pend[++id]=r;ws.send(JSON.stringify({id,method,params}))});
await send('Page.enable');await send('Page.navigate',{url});
let txt='';for(let i=0;i<240;i++){await sleep(500);const r=await send('Runtime.evaluate',{expression:'document.getElementById("o")?.textContent||""',returnByValue:true});txt=r.result?.result?.value||'';if(txt)break}
const j=JSON.parse(txt);fs.mkdirSync(outdir,{recursive:true});for(const [f,u] of Object.entries(j))fs.writeFileSync(outdir+'/'+f,Buffer.from(u.split(',')[1],'base64'));
ws.close();ch.kill();console.log('done',Object.keys(j))})().catch(e=>{console.error(e);ch.kill();process.exit(1)});
