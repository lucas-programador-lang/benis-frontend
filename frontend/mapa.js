/**
 * BENIS BURGUER - GeoEngine v4.3
 * Módulo: Localização e Experiência do Cliente (Porto Velho - RO)
 * Sincronizado com Loader e Layout Premium
 */

let mapa;
let marcadorUsuario;
let marcadorLoja;

// Coordenadas exatas da Benis Burguer (Bairro Aponiã, R. Paulo Fortes)
const COORDS_LOJA = [-8.74015, -63.87498]; 

function iniciarMapa() {
    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    // Inicializa o mapa focado na brasa
    mapa = L.map('mapaEntrega', {
        zoomControl: false, 
        scrollWheelZoom: false,
        dragging: true,
        tap: L.Browser.mobile ? false : true
    }).setView(COORDS_LOJA, 16);

    // Camada Dark Mode Premium
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Benis Burguer',
        className: 'map-tiles-dark' 
    }).addTo(mapa);

    // Ícone Neon Laranja (Pin Customizado)
    const iconLoja = L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div class="pin-wrapper">
                <div class="pin-pulse"></div>
                <div class="pin-center"></div>
            </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Marcador da Loja com Popup Elite
    marcadorLoja = L.marker(COORDS_LOJA, { icon: iconLoja })
        .addTo(mapa)
        .bindPopup(`
            <div class="map-popup-custom">
                <strong>Benis Burguer</strong>
                <span>📍 Bairro Aponiã</span><br>
                <small>Aberto até as 00h</small>
            </div>
        `);

    // Rastreio de Localização do Cliente
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                const { latitude, longitude } = posicao.coords;
                const coordsUser = [latitude, longitude];

                if (!marcadorUsuario) {
                    marcadorUsuario = L.circleMarker(coordsUser, {
                        radius: 8,
                        fillColor: "#3b82f6", // Azul para destacar o cliente
                        color: "#fff",
                        weight: 3,
                        opacity: 1,
                        fillOpacity: 1
                    }).addTo(mapa).bindPopup("Você está aqui!");
                }

                // Ajusta o zoom para mostrar a distância entre o cliente e a Benis
                const bounds = L.latLngBounds([COORDS_LOJA, coordsUser]);
                mapa.fitBounds(bounds, { padding: [50, 50], animate: true });
            },
            () => {
                console.warn("GPS: Acesso negado. Mantendo foco na loja.");
                mapa.setView(COORDS_LOJA, 16);
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }

    // CRITICAL: Força o Leaflet a renderizar após o Loader sumir
    setTimeout(() => {
        mapa.invalidateSize();
    }, 1500);
}

// Estilos dinâmicos para manter o arquivo CSS limpo
const styleMap = document.createElement("style");
styleMap.innerText = `
    .map-tiles-dark {
        filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) !important;
    }
    
    .pin-wrapper { position: relative; display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; }
    .pin-pulse { 
        position: absolute; width: 100%; height: 100%; 
        background: rgba(255, 140, 0, 0.4); border-radius: 50%; 
        animation: pulseMap 2s infinite ease-out; 
    }
    .pin-center { 
        width: 14px; height: 14px; background: #ff8c00; 
        border: 2px solid #fff; border-radius: 50%; z-index: 2; 
        box-shadow: 0 0 15px rgba(255, 140, 0, 0.8); 
    }
    
    .leaflet-popup-content-wrapper {
        background: rgba(10, 10, 10, 0.9) !important;
        backdrop-filter: blur(8px);
        color: #fff !important;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 15px !important;
        padding: 5px;
    }
    .leaflet-popup-tip { background: rgba(10, 10, 10, 0.9) !important; }
    .map-popup-custom { text-align: center; font-family: 'Poppins', sans-serif; padding: 5px; }
    .map-popup-custom strong { color: #ff8c00; display: block; font-size: 1.1rem; }
    .map-popup-custom small { opacity: 0.7; }

    @keyframes pulseMap {
        0% { transform: scale(0.5); opacity: 1; }
        100% { transform: scale(2.8); opacity: 0; }
    }
`;
document.head.appendChild(styleMap);

// Inicializa o mapa após o carregamento da página
document.addEventListener("DOMContentLoaded", () => {
    // Pequeno delay para garantir que o container #mapaEntrega já tenha dimensões
    setTimeout(iniciarMapa, 300);
});
