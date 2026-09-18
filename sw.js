const CACHE='zb30-v1';
const CORE=['./','./index.html','./birthday.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).catch(()=>{})))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.origin!==location.origin)return;                 // never touch GitHub API calls
 e.respondWith((async()=>{
  try{
   const fresh=await fetch(r,{cache:'no-store'});
   const c=await caches.open(CACHE);c.put(r,fresh.clone());
   return fresh;
  }catch(err){
   const hit=await caches.match(r,{ignoreSearch:true});
   if(hit)return hit;
   if(r.mode==='navigate'){const idx=await caches.match('./index.html');if(idx)return idx}
   throw err;
  }
 })());
});
