/**
 * BENIS BURGUER - Map & Delivery Engine v1.3 (Elite Edition)
 * Sincronizado com: HTML/CSS v4.9
 * Focado na região do Aponiã - Porto Velho/RO
 */

let mapa;
let marcadorUsuario;
// Coordenadas exatas para a Rua Paulo Fortes, Aponiã
const COORDS_LOJA = [-8.74015, -63.87498]; 

function iniciarMapa() {
    // 1. Prevenção de duplicidade e verificação de elemento
    if (mapa) {
        setTimeout(() => { mapa.invalidateSize(); }, 300);
        return;
    }

    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    // 2. Inicialização do Leaflet (Configurações Premium)
    mapa = L.map('mapaEntrega', {
        zoomControl: false, // Removido para manter o visual limpo
        scrollWheelZoom: false,
        dragging: true,
        tap: true,
        attributionControl: false
    }).setView(COORDS_LOJA, 16);

    // 3. Camada de mapa (TileLayer)
    // Aplicamos a classe 'map-tiles-dark' para o filtro CSS funcionar
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        className: 'map-tiles-dark' 
    }).addTo(mapa);

    // 4. Ícone Customizado (Pin Pulsante Laranja)
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

    // 5. Marcador da Loja com Popup Estilizado
    L.marker(COORDS_LOJA, { icon: iconLoja })
        .addTo(mapa)
        .bindPopup(`
            <div class="map-popup-custom" style="text-align: center; padding: 5px;">
                <strong style="color: #ff8c00; font-size: 1.1rem; display: block; margin-bottom: 5px;">Benis Burguer</strong>
                <span style="color: #fff; font-size: 0.9rem;">📍 R. Paulo Fortes, 6245</span><br>
                <small style="color: rgba(255,255,255,0.6);">Bairro Aponiã - Porto Velho</small>
            </div>
        `, {
            className: 'custom-leaflet-popup',
            closeButton: false
        });

    // 6. Localização do Cliente (Estilo Google Maps)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coordsUser = [pos.coords.latitude, pos.coords.longitude];
                
                // Marcador azul para o usuário
                marcadorUsuario = L.circleMarker(coordsUser, {
                    radius: 7,
                    fillColor: "#3b82f6", // Azul vibrante
                    color: "#fff",
                    weight: 2,
                    fillOpacity: 1
                }).addTo(mapa).bindPopup("Você está aqui");

                // Enquadra a visão para mostrar a distância entre o cliente e a Benis
                const bounds = L.latLngBounds([COORDS_LOJA, coordsUser]);
                mapa.fitBounds(bounds, { padding: [100, 100], maxZoom: 15 });
            },
            (error) => {
                console.log("Geolocalização não ativada pelo usuário.");
            },
            { enableHighAccuracy: true }
        );
    }

    // 7. Correção de renderização (Importante para containers dinâmicos)
    setTimeout(() => { 
        mapa.invalidateSize(); 
    }, 800);
}

// Inicialização automática vinculada ao loader do index.html
// O mapa é chamado dentro do script de load do index.html para evitar travamentos
