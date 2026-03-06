let mapa
let marcador

function iniciarMapa(){

mapa = L.map('mapaEntrega').setView([-8.76077,-63.8999],13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'© OpenStreetMap'
}).addTo(mapa)

if(navigator.geolocation){

navigator.geolocation.watchPosition(posicao => {

const lat = posicao.coords.latitude
const lng = posicao.coords.longitude

if(!marcador){

marcador = L.marker([lat,lng]).addTo(mapa)
.setPopup("Entregador aqui")
.openPopup()

}else{

marcador.setLatLng([lat,lng])

}

mapa.setView([lat,lng],15)

})

}

}

document.addEventListener("DOMContentLoaded", iniciarMapa)
