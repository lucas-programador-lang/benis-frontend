self.addEventListener("install",e=>{

e.waitUntil(

caches.open("benis")

.then(cache=>cache.addAll([

"/",

"/index.html",

"/style.css",

"/app.js"

]))

)

})
