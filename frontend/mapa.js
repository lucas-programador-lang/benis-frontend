/**
 * BENIS BURGUER - Map Engine v1.4 (Elite Edition)
 * Focado na região do Aponiã - Porto Velho/RO
 */

let mapa;
let marcadorUsuario;
window.enderecoEntrega = "Não selecionado no mapa"; 

// Coordenadas precisas para R. Paulo Fortes, 6245 - Aponiã
const COORDS_LOJA = [-8.73953, -63.86025]; 
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${COORDS_LOJA[0]},${COORDS_LOJA[1]}`;

function iniciarMapa() {
    // Evita reinicialização duplicada
    if (mapa) {
        setTimeout(() => { mapa.invalidateSize(); }, 300);
        return;
    }

    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    // Inicializa o Leaflet com tema Dark
    mapa = L.map('mapaEntrega', {
        zoomControl: true, 
        scrollWheelZoom: false,
        attributionControl: false
    }).setView(COORDS_LOJA, 16);

    // Camada de mapa estilo Dark (CartoDB)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(mapa);

    // Ícone personalizado para a Loja (Pin com pulso)
    const iconLoja = L.divIcon({
        className: 'custom-pin-container',
        html: `
            <div class="pin-wrapper">
                <div class="pin-pulse" style="position: absolute; width: 40px; height: 40px; background: rgba(255, 140, 0, 0.4); border-radius: 50%; animation: pulse 2s infinite;"></div>
                <div class="pin-center" style="background:#ff8c00; border:2px solid #fff; border-radius:50%; width:16px; height:16px; position: relative; z-index: 2;"></div>
            </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const marcadorLoja = L.marker(COORDS_LOJA, { icon: iconLoja }).addTo(mapa);

    // Popup customizado para a unidade Aponiã
    marcadorLoja.bindPopup(`
        <div onclick="window.open('${GOOGLE_MAPS_URL}', '_blank')" style="cursor: pointer; text-align:center; font-family: 'Poppins', sans-serif; padding: 5px;">
            <strong style="color: #ff8c00; font-size: 1.1rem;">Benis Burguer</strong><br>
            <span style="color: #333; font-size: 0.9rem;">📍 Unidade Aponiã</span><br>
            <small style="color: #3b82f6; font-weight: 600;">➔ Tocar para GPS</small>
        </div>
    `, { closeButton: false }).openPopup();

    // Evento de clique para definir local de entrega
    mapa.on('click', (e) => processarLocalizacao(e.latlng.lat, e.latlng.lng));

    // Tenta obter localização atual do cliente automaticamente
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => processarLocalizacao(pos.coords.latitude, pos.coords.longitude, true),
            () => { console.warn("GPS negado ou indisponível."); },
            { enableHighAccuracy: true }
        );
    }
}

async function processarLocalizacao(lat, lng, centralizar = false) {
    // Remove marcador anterior se existir
    if (marcadorUsuario) mapa.removeLayer(marcadorUsuario);
    
    // Marcador de localização do usuário
    marcadorUsuario = L.circleMarker([lat, lng], {
        radius: 8, 
        fillColor: "#3b82f6", 
        color: "#fff", 
        weight: 2, 
        fillOpacity: 1
    }).addTo(mapa);

    if (centralizar) {
        mapa.setView([lat, lng], 16);
    }

    // Geocodificação reversa (Transforma lat/lng em nome de rua)
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        const rua = data.address.road || "Rua não identificada";
        const bairro = data.address.suburb || data.address.neighbourhood || "Porto Velho";
        const numero = data.address.house_number || 'S/N';
        
        window.enderecoEntrega = `${rua}, ${numero} - ${bairro}`;

        marcadorUsuario.bindPopup(`
            <div style="font-family: 'Poppins', sans-serif;">
                <b style="color: #3b82f6;">Entregar aqui:</b><br>
                <span style="color: #555;">${window.enderecoEntrega}</span>
            </div>
        `).openPopup();
        
    } catch (error) {
        console.error("Erro na geocodificação:", error);
        window.enderecoEntrega = `Coordenadas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
}

// Inicialização segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarMapa);
} else {
    iniciarMapa();
}
