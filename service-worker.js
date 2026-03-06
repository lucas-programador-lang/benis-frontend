const CACHE = "benis-v1"

const urls = [
"/",
"/frontend/index.html",
"/frontend/style.css",
"/frontend/app.js",
"/frontend/mapa.js",
"/frontend/logo.png"
]

self.addEventListener("install",event=>{

event.waitUntil(

caches.open(CACHE).then(cache=>{
return cache.addAll(urls)
})

)

})

self.addEventListener("fetch",event=>{

event.respondWith(

caches.match(event.request)
.then(response=>{
return response || fetch(event.request)
})

)

})
