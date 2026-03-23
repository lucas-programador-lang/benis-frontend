/**
 * BENIS BURGUER - Map & Delivery Engine v1.2
 * Focado na região do Aponiã - Porto Velho/RO
 */

let mapa;
let marcadorUsuario;
const COORDS_LOJA = [-8.74015, -63.87498]; // Localização base (Aponiã)

function iniciarMapa() {
    // 1. Prevenção de duplicidade
    if (mapa) {
        setTimeout(() => { mapa.invalidateSize(); }, 200);
        return;
    }

    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    // 2. Inicialização do Leaflet com otimização mobile
    mapa = L.map('mapaEntrega', {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        tap: !L.Browser.mobile,
        attributionControl: false
    }).setView(COORDS_LOJA, 16);

    // 3. Camada de mapa (TileLayer) com filtro Dark Mode via CSS
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'map-tiles-dark' // Classe para aplicar o filtro no CSS
    }).addTo(mapa);

    // 4. Ícone Customizado da Benis Burguer (Pin Pulsante)
    const iconLoja = L.divIcon({
        className: 'custom-pin-container',
        html: `
            <div class="pin-wrapper">
                <div class="pin-pulse"></div>
                <div class="pin-center"></div>
            </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // 5. Marcador da Loja
    L.marker(COORDS_LOJA, { icon: iconLoja })
        .addTo(mapa)
        .bindPopup(`
            <div class="map-popup-custom">
                <strong style="color: #ff8c00">Benis Burguer</strong><br>
                <span>📍 Bairro Aponiã</span><br>
                <small>Porto Velho - RO</small>
            </div>
        `);

    // 6. Geolocalização do Cliente (Opcional, mas melhora a conversão)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coordsUser = [pos.coords.latitude, pos.coords.longitude];
                
                // Marcador azul estilo "Google Maps"
                marcadorUsuario = L.circleMarker(coordsUser, {
                    radius: 8,
                    fillColor: "#3b82f6",
                    color: "#fff",
                    weight: 3,
                    fillOpacity: 1
                }).addTo(mapa).bindPopup("Sua localização");

                // Ajusta o zoom para mostrar a loja e o usuário
                const bounds = L.latLngBounds([COORDS_LOJA, coordsUser]);
                mapa.fitBounds(bounds, { padding: [80, 80], maxZoom: 16 });
            },
            (error) => {
                console.warn("Geolocalização negada ou falhou.");
            },
            { enableHighAccuracy: true }
        );
    }

    // 7. FIX CRÍTICO: Força o Leaflet a recalcular o tamanho do container
    // Essencial para mapas que começam dentro de abas ou seções ocultas
    setTimeout(() => { 
        mapa.invalidateSize(); 
    }, 600);
}

// Listener para disparar o mapa assim que a seção for visível (Scroll ou Clique)
document.addEventListener('DOMContentLoaded', () => {
    // Se você tiver um botão "Ver Localização", chame iniciarMapa() nele
    // Ou use um IntersectionObserver para carregar quando o usuário chegar na seção
});
