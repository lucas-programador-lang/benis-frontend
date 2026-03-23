/**
 * BENIS BURGUER - GeoEngine v4.2.1
 * Módulo: Localização e Experiência do Cliente (Porto Velho - RO)
 */

let mapa;
let marcadorUsuario;
let marcadorLoja;

// Coordenadas exatas da Benis Burguer (Bairro Aponiã, Porto Velho)
const COORDS_LOJA = [-8.74015, -63.87498]; 

function iniciarMapa() {
    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    // Inicializa o mapa focado na loja
    mapa = L.map('mapaEntrega', {
        zoomControl: false, // Desativado para um visual mais limpo, controlado por gestos
        scrollWheelZoom: false,
        dragging: true,
        tap: L.Browser.mobile ? false : true
    }).setView(COORDS_LOJA, 15);

    // Camada de Mapa - Estilo Dark via CSS Filter
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        className: 'map-tiles-dark' 
    }).addTo(mapa);

    // Ícone Customizado (Estilo Pin Neon Laranja)
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

    // Marcador da Loja
    marcadorLoja = L.marker(COORDS_LOJA, { icon: iconLoja })
        .addTo(mapa)
        .bindPopup(`
            <div class="map-popup-custom">
                <strong>Benis Burguer</strong><br>
                <span>📍 Bairro Aponiã</span><br>
                <small>O melhor de PVH!</small>
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
                        fillColor: "#3b82f6", // Azul vibrante para o usuário
                        color: "#fff",
                        weight: 3,
                        opacity: 1,
                        fillOpacity: 1
                    }).addTo(mapa).bindPopup("Você está aqui");
                }

                // Calcula a área para mostrar ambos (Loja e Cliente)
                const bounds = L.latLngBounds([COORDS_LOJA, coordsUser]);
                mapa.fitBounds(bounds, { padding: [60, 60], animate: true });
            },
            () => console.log("GPS: Acesso negado ou offline."),
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }

    // Garante que o Leaflet recalcule o tamanho do container (evita mapa cinza)
    setTimeout(() => {
        mapa.invalidateSize();
    }, 500);
}

// Injeção de Estilos Necessários para o Mapa
const styleMap = document.createElement("style");
styleMap.innerText = `
    /* Filtro para Modo Noturno no OpenStreetMap */
    .map-tiles-dark {
        filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) !important;
    }
    
    /* Pin Customizado */
    .pin-wrapper { position: relative; display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; }
    .pin-pulse { 
        position: absolute; width: 100%; height: 100%; 
        background: rgba(255, 140, 0, 0.5); border-radius: 50%; 
        animation: pulseMap 2s infinite ease-out; 
    }
    .pin-center { 
        width: 14px; height: 14px; background: #ff8c00; 
        border: 2px solid #fff; border-radius: 50%; z-index: 2; 
        box-shadow: 0 0 15px rgba(255, 140, 0, 0.8); 
    }
    
    /* Popups Estilizados */
    .leaflet-popup-content-wrapper {
        background: rgba(20, 20, 20, 0.9) !important;
        backdrop-filter: blur(10px);
        color: #fff !important;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px !important;
    }
    .leaflet-popup-tip { background: rgba(20, 20, 20, 0.9) !important; }
    .map-popup-custom { text-align: center; font-family: 'Poppins', sans-serif; }
    .map-popup-custom strong { color: #ff8c00; display: block; margin-bottom: 2px; }

    @keyframes pulseMap {
        0% { transform: scale(0.5); opacity: 1; }
        100% { transform: scale(2.5); opacity: 0; }
    }
`;
document.head.appendChild(styleMap);

document.addEventListener("DOMContentLoaded", iniciarMapa);
