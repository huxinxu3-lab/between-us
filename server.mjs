import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let file=decodeURIComponent(url.pathname);if(file.endsWith('/'))file+='index.html';const abs=path.resolve(root,'.'+file);if(!abs.startsWith(root+path.sep)||file.includes('/.')){res.writeHead(403);return res.end('Forbidden');}const data=await fs.readFile(abs);res.writeHead(200,{'Content-Type':mime[path.extname(abs)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+server.address().port));
