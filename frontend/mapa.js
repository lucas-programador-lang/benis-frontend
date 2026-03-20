/**
 * BENIS BURGUER - GeoEngine v4.2
 * Módulo: Localização e Experiência do Cliente (Porto Velho - RO)
 */

let mapa;
let marcadorUsuario;
let marcadorLoja;

// Coordenadas exatas da Benis Burguer (Bairro Aponiã, Porto Velho)
const COORDS_LOJA = [-8.74015, -63.87498]; 

function iniciarMapa() {
    // Garante que o container existe antes de iniciar
    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    // Inicializa o mapa focado na loja
    // Adicionei 'dragging: true' para mobile, mas com 'tap: false' para não travar o scroll da página
    mapa = L.map('mapaEntrega', {
        zoomControl: true, 
        scrollWheelZoom: false,
        dragging: true,
        tap: L.Browser.mobile ? false : true
    }).setView(COORDS_LOJA, 16);

    // Camada de Mapa - Utilizando OpenStreetMap com filtro Dark via CSS
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        className: 'map-tiles-dark' // Esta classe deve estar no seu CSS (já incluímos no passo anterior)
    }).addTo(mapa);

    // Ícone Customizado (Estilo Pin Neon Laranja)
    const iconLoja = L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div class="pin-wrapper" style="position: relative; display: flex; justify-content: center; align-items: center;">
                <div class="pin-pulse" style="position: absolute; width: 40px; height: 40px; background: rgba(255, 140, 0, 0.4); border-radius: 50%; animation: pulseMap 2s infinite;"></div>
                <div class="pin-center" style="width: 15px; height: 15px; background: #ff8c00; border: 2px solid white; border-radius: 50%; z-index: 2; box-shadow: 0 0 10px #ff8c00;"></div>
            </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Marcador da Loja
    marcadorLoja = L.marker(COORDS_LOJA, { icon: iconLoja })
        .addTo(mapa)
        .bindPopup(`
            <div style="text-align:center; font-family:'Poppins', sans-serif; padding: 5px;">
                <strong style="color:#ff8c00; font-size: 14px;">Benis Burguer</strong><br>
                <span style="color:#333; font-size: 12px;">📍 Bairro Aponiã</span><br>
                <small style="color:#666;">O Brabo de PVH!</small>
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
                        radius: 7,
                        fillColor: "#007bff",
                        color: "#fff",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.9
                    }).addTo(mapa).bindPopup("Você está aqui");
                }

                // Ajusta a visão para mostrar a distância entre o cliente e a Benis
                const bounds = L.latLngBounds([COORDS_LOJA, coordsUser]);
                mapa.fitBounds(bounds, { padding: [50, 50], animate: true });
            },
            (erro) => {
                console.warn("Localização recusada ou indisponível.");
            },
            { enableHighAccuracy: true, timeout: 7000 }
        );
    }

    // Correção de renderização (força o mapa a preencher o container após o carregamento)
    setTimeout(() => {
        mapa.invalidateSize();
    }, 1500);
}

// Estilo de animação para o Pin (Inserido via JS para garantir que funcione)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes pulseMap {
        0% { transform: scale(0.5); opacity: 1; }
        100% { transform: scale(2.5); opacity: 0; }
    }
    .map-tiles-dark {
        filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) !important;
    }
`;
document.head.appendChild(styleSheet);

document.addEventListener("DOMContentLoaded", iniciarMapa);
