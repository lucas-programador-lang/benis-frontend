/**
 * BENIS BURGUER - Map Engine v1.4 (Elite Edition)
 * Focado na região do Aponiã - Porto Velho/RO
 */

let mapa;
let marcadorUsuario;
window.enderecoEntrega = "Não selecionado no mapa"; 

const COORDS_LOJA = [-8.74015, -63.87498]; 
const GOOGLE_MAPS_URL = `https://www.google.com/maps?q=${COORDS_LOJA[0]},${COORDS_LOJA[1]}`;

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
        maxZoom: 19
    }).addTo(mapa);

    const iconLoja = L.divIcon({
        className: 'custom-pin-container',
        html: `<div class="pin-wrapper"><div class="pin-pulse"></div><div class="pin-center" style="background:#ff8c00; border:2px solid #fff; border-radius:50%; width:12px; height:12px;"></div></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const marcadorLoja = L.marker(COORDS_LOJA, { icon: iconLoja }).addTo(mapa);

    marcadorLoja.bindPopup(`
        <div onclick="window.open('${GOOGLE_MAPS_URL}', '_blank')" style="cursor: pointer; text-align:center;">
            <strong style="color: #ff8c00;">Benis Burguer</strong><br>
            <span style="color: #333;">📍 R. Paulo Fortes, 6245</span><br>
            <small style="color: #3b82f6;">➔ Abrir no Google Maps</small>
        </div>
    `, { closeButton: false }).openPopup();

    mapa.on('click', (e) => processarLocalizacao(e.latlng.lat, e.latlng.lng));

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => processarLocalizacao(pos.coords.latitude, pos.coords.longitude, true),
            () => { console.warn("GPS negado."); },
            { enableHighAccuracy: true }
        );
    }
}

async function processarLocalizacao(lat, lng, centralizar = false) {
    if (marcadorUsuario) mapa.removeLayer(marcadorUsuario);
    
    marcadorUsuario = L.circleMarker([lat, lng], {
        radius: 10, fillColor: "#3b82f6", color: "#fff", weight: 3, fillOpacity: 1
    }).addTo(mapa);

    if (centralizar) {
        mapa.setView([lat, lng], 16);
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        const rua = data.address.road || "Rua não identificada";
        const bairro = data.address.suburb || data.address.neighbourhood || "Aponiã";
        window.enderecoEntrega = `${rua}, ${data.address.house_number || 'S/N'} - ${bairro}`;

        marcadorUsuario.bindPopup(`<b>Entregar em:</b><br>${window.enderecoEntrega}`).openPopup();
    } catch (error) {
        window.enderecoEntrega = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
    }
}

// Inicia apenas quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', iniciarMapa);
