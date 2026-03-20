/**
 * MINDSET ELITE - GeoEngine v4.0
 * Módulo: Localização e Experiência do Cliente
 */

let mapa;
let marcadorUsuario;
let marcadorLoja;

// Coordenadas exatas da Benis Burguer (Aponiã, Porto Velho)
const COORDS_LOJA = [-8.74015, -63.87498]; 

function iniciarMapa() {
    // Garante que o container existe antes de iniciar
    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    // Inicializa o mapa focado na loja
    mapa = L.map('mapaEntrega', {
        zoomControl: false, 
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile, // Melhora UX no celular para não travar o scroll
        tap: !L.Browser.mobile
    }).setView(COORDS_LOJA, 16);

    // Camada de Mapa com Filtro Dark
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        className: 'map-tiles-dark' 
    }).addTo(mapa);

    // Ícone Customizado (Estilo Pin Neon)
    const iconLoja = L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div class="pin-container">
                <div class="pin-pulse"></div>
                <div class="pin-center"></div>
            </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Marcador da Loja
    marcadorLoja = L.marker(COORDS_LOJA, { icon: iconLoja })
        .addTo(mapa)
        .bindPopup(`
            <div style="text-align:center; color:#000; font-family:'Poppins';">
                <strong style="color:#ff8c00;">Benis Burguer</strong><br>
                Aberto das 18h às 00h
            </div>
        `);

    // Rastreio de Localização (Otimizado)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                const { latitude, longitude } = posicao.coords;
                const coordsUser = [latitude, longitude];

                if (!marcadorUsuario) {
                    marcadorUsuario = L.circleMarker(coordsUser, {
                        radius: 8,
                        fillColor: "#3388ff",
                        color: "#fff",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(mapa).bindPopup("Sua localização");
                }

                // Ajusta a visão para mostrar ambos com suavidade
                const bounds = L.latLngBounds([COORDS_LOJA, coordsUser]);
                mapa.fitBounds(bounds, { padding: [40, 40], animate: true });
            },
            (erro) => console.log("Localização desativada pelo usuário."),
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }
}

document.addEventListener("DOMContentLoaded", iniciarMapa);
