/**
 * BENIS BURGUER - GeoEngine v4.4 (Ultimate Sync)
 * Módulo: Localização, Distância e Experiência do Cliente
 * Local: Porto Velho - RO (Bairro Aponiã)
 */

let mapa;
let marcadorUsuario;
let marcadorLoja;
let distanciaClienteKm = 0;

// Coordenadas exatas da Benis Burguer (R. Paulo Fortes, Aponiã)
const COORDS_LOJA = [-8.74015, -63.87498]; 

function iniciarMapa() {
    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    // Inicializa o mapa com foco na Benis
    mapa = L.map('mapaEntrega', {
        zoomControl: false, 
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile, // Melhora UX mobile para não "prender" o scroll
        tap: !L.Browser.mobile
    }).setView(COORDS_LOJA, 16);

    // Camada Dark Mode Premium (OpenStreetMap com Filtro CSS)
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

    // Marcador da Loja
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

                // Cálculo de distância simples (Haversine formula via Leaflet)
                const pontoLoja = L.latLng(COORDS_LOJA);
                const pontoUser = L.latLng(coordsUser);
                distanciaClienteKm = (pontoLoja.distanceTo(pontoUser) / 1000).toFixed(1);

                if (!marcadorUsuario) {
                    marcadorUsuario = L.circleMarker(coordsUser, {
                        radius: 8,
                        fillColor: "#3b82f6", // Azul destaque
                        color: "#fff",
                        weight: 3,
                        opacity: 1,
                        fillOpacity: 1
                    }).addTo(mapa).bindPopup(`<b>Você está aqui!</b><br>A ${distanciaClienteKm}km da brasa.`);
                }

                // Ajusta o zoom para enquadrar ambos
                const bounds = L.latLngBounds([COORDS_LOJA, coordsUser]);
                mapa.fitBounds(bounds, { padding: [70, 70], animate: true });
                
                console.log(`[GEO] Cliente localizado a ${distanciaClienteKm}km`);
            },
            () => {
                console.warn("GPS: Acesso negado ou erro. Mantendo foco na loja.");
                mapa.setView(COORDS_LOJA, 16);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    // Garante que o Leaflet recalcule o tamanho após o DOM estabilizar
    setTimeout(() => {
        mapa.invalidateSize();
    }, 1000);
}

// Injeta estilos específicos do mapa para não poluir o CSS principal
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
        backdrop-filter: blur(10px); color: #fff !important;
        border: 1px solid rgba(255,255,255,0.1); border-radius: 20px !important;
    }
    .leaflet-popup-tip { background: rgba(10, 10, 10, 0.9) !important; }
    .map-popup-custom { text-align: center; font-family: 'Poppins', sans-serif; padding: 10px; }
    .map-popup-custom strong { color: #ff8c00; display: block; font-size: 1rem; }
    @keyframes pulseMap { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
`;
document.head.appendChild(styleMap);

// Inicialização inteligente
window.addEventListener("load", () => {
    // Se você tem um Loader, espere ele começar a sumir
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(iniciarMapa, 1000);
    } else {
        iniciarMapa();
    }
});
