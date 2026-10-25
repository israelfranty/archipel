/* Hors ligne : on demande toujours la version la plus récente au réseau (sans cache du navigateur),
   et on garde une copie pour jouer sans Internet. */
const C="archipel-v2",FILES=["./","index.html","musique.mp3","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>fetch(f,{cache:"no-cache"}).then(r=>r.ok&&c.put(f,r)).catch(()=>{})))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET"||u.origin!==location.origin)return;
  if(u.pathname.endsWith("version.txt"))return;
  if(u.pathname.endsWith(".mp3")){e.respondWith(caches.match("musique.mp3").then(m=>m||fetch(r)));return}
  const key=r.mode==="navigate"?"index.html":u.pathname.split("/").pop()||"index.html";
  e.respondWith(fetch(u.href,{cache:"no-cache"}).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(key,cp))}return res})
    .catch(()=>caches.match(key).then(m=>m||caches.match("index.html"))))});
