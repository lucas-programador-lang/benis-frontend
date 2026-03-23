let mapa;
let marcadorUsuario;
const COORDS_LOJA = [-8.74015, -63.87498]; 

function iniciarMapa() {
    // Evita inicializar duplicado
    if (mapa) return; 

    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    mapa = L.map('mapaEntrega', {
        zoomControl: false, 
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        tap: !L.Browser.mobile
    }).setView(COORDS_LOJA, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Benis Burguer',
        className: 'map-tiles-dark' 
    }).addTo(mapa);

    const iconLoja = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="pin-wrapper"><div class="pin-pulse"></div><div class="pin-center"></div></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    L.marker(COORDS_LOJA, { icon: iconLoja })
        .addTo(mapa)
        .bindPopup(`<div class="map-popup-custom"><strong>Benis Burguer</strong><br>📍 Aponiã</div>`);

    // Geolocalização do Cliente
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const coordsUser = [pos.coords.latitude, pos.coords.longitude];
            marcadorUsuario = L.circleMarker(coordsUser, {
                radius: 7, fillColor: "#3b82f6", color: "#fff", weight: 2, fillOpacity: 1
            }).addTo(mapa).bindPopup("Você");

            const bounds = L.latLngBounds([COORDS_LOJA, coordsUser]);
            mapa.fitBounds(bounds, { padding: [50, 50] });
        });
    }

    // CRITICAL FIX: Força o mapa a renderizar as tiles corretamente
    setTimeout(() => { mapa.invalidateSize(); }, 500);
}
