/**
 * BENIS BURGUER - Map & Delivery Engine v1.4 (Elite Edition)
 * Integrado com Geocodificação Reversa para WhatsApp
 * Focado na região do Aponiã - Porto Velho/RO
 */

let mapa;
let marcadorUsuario;
// Variável global para ser acessada pelo app.js no fechamento do pedido
window.enderecoEntrega = "Não selecionado no mapa"; 

const COORDS_LOJA = [-8.74015, -63.87498]; 
// URL oficial para abrir no Google Maps (Coordenadas da loja)
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${COORDS_LOJA[0]},${COORDS_LOJA[1]}`;

function iniciarMapa() {
    if (mapa) {
        setTimeout(() => { mapa.invalidateSize(); }, 300);
        return;
    }

    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    mapa = L.map('mapaEntrega', {
        zoomControl: false, 
        scrollWheelZoom: false,
        attributionControl: false
    }).setView(COORDS_LOJA, 16);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        className: 'map-tiles-dark' 
    }).addTo(mapa);

    // Ícone da Loja
    const iconLoja = L.divIcon({
        className: 'custom-pin-container',
        html: `<div class="pin-wrapper"><div class="pin-pulse"></div><div class="pin-center"></div></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // 1. CRIAR O MARCADOR DA LOJA
    const marcadorLoja = L.marker(COORDS_LOJA, { icon: iconLoja }).addTo(mapa);

    // 2. CONTEÚDO DO POPUP CLICÁVEL
    marcadorLoja.bindPopup(`
        <div class="map-popup-custom" onclick="window.open('${GOOGLE_MAPS_URL}', '_blank')" style="cursor: pointer;">
            <strong style="color: #ff8c00;">Benis Burguer</strong><br>
            <span style="color: #fff;">📍 R. Paulo Fortes, 6245</span><br>
            <small style="color: #3b82f6; display: block; margin-top: 5px;">➔ Abrir no Google Maps</small>
        </div>
    `, { closeButton: false });

    // 3. EVENTO PARA CLIQUE DIRETO NO ÍCONE (OPCIONAL)
    marcadorLoja.on('dblclick', function() {
        window.open(GOOGLE_MAPS_URL, '_blank');
    });

    // EVENTO: Clique no mapa para definir local de entrega
    mapa.on('click', function(e) {
        const { lat, lng } = e.latlng;
        processarLocalizacao(lat, lng);
    });

    // Localização Inicial do Cliente
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                processarLocalizacao(pos.coords.latitude, pos.coords.longitude, true);
            },
            () => { mapa.setView(COORDS_LOJA, 16); },
            { enableHighAccuracy: true }
        );
    }

    setTimeout(() => { mapa.invalidateSize(); }, 500);
}

/**
 * Processa as coordenadas, atualiza o marcador e busca o endereço por extenso
 */
async function processarLocalizacao(lat, lng, centralizar = false) {
    if (marcadorUsuario) mapa.removeLayer(marcadorUsuario);
    
    marcadorUsuario = L.circleMarker([lat, lng], {
        radius: 10,
        fillColor: "#3b82f6", 
        color: "#fff",
        weight: 3,
        fillOpacity: 1
    }).addTo(mapa);

    if (centralizar) {
        const bounds = L.latLngBounds([COORDS_LOJA, [lat, lng]]);
        mapa.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        const rua = data.address.road || "Rua não identificada";
        const bairro = data.address.suburb || "Aponiã";
        window.enderecoEntrega = `${rua}, ${data.address.house_number || 'S/N'} - ${bairro}`;

        marcadorUsuario.bindPopup(`<b>Entregar em:</b><br>${window.enderecoEntrega}`).openPopup();
    } catch (error) {
        console.error("Erro ao obter endereço:", error);
        window.enderecoEntrega = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
    }
}

document.addEventListener('DOMContentLoaded', iniciarMapa);
