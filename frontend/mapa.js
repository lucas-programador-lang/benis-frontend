/**
 * MINDSET ELITE - GeoEngine v4.0
 * Módulo: Localização e Rastreio em Tempo Real
 */

let mapa;
let marcadorUsuario;
let marcadorLoja;

// Coordenadas da Benis Burguer (Aponiã, Porto Velho)
const COORDS_LOJA = [-8.7402, -63.8750]; 

function iniciarMapa() {
    // Inicializa o mapa focado na loja
    mapa = L.map('mapaEntrega', {
        zoomControl: false, // Removemos para um visual mais limpo
        scrollWheelZoom: false // Evita zoom acidental ao rolar a página
    }).setView(COORDS_LOJA, 15);

    // Camada de Mapa com Filtro Dark (via CSS inline)
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        className: 'map-tiles-dark' // Classe para aplicar o filtro no CSS
    }).addTo(mapa);

    // Ícone Personalizado para a Loja
    const iconLoja = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#ff8c00; width:15px; height:15px; border-radius:50%; border:2px solid white; box-shadow: 0 0 10px #ff8c00;'></div>",
        iconSize: [15, 15],
        iconAnchor: [7, 7]
    });

    // Marcador da Loja (Fixo)
    marcadorLoja = L.marker(COORDS_LOJA, { icon: iconLoja })
        .addTo(mapa)
        .bindPopup("<b>Benis Burguer</b><br>O melhor de PVH!")
        .openPopup();

    // Rastreio de Localização (Cliente ou Entregador)
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (posicao) => {
                const { latitude, longitude } = posicao.coords;
                const novasCoords = [latitude, longitude];

                if (!marcadorUsuario) {
                    marcadorUsuario = L.marker(novasCoords).addTo(mapa)
                        .bindPopup("Você está aqui");
                } else {
                    marcadorUsuario.setLatLng(novasCoords);
                }

                // Ajusta a visão para mostrar ambos (Loja e Usuário)
                const bounds = L.latLngBounds([COORDS_LOJA, novasCoords]);
                mapa.fitBounds(bounds, { padding: [50, 50] });
            },
            (erro) => console.warn("Erro ao obter localização:", erro.message),
            { enableHighAccuracy: true }
        );
    }
}

// Adicione este pequeno ajuste de CSS no seu style.css para o Dark Mode do Mapa
/*
.map-tiles-dark {
    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
}
*/

document.addEventListener("DOMContentLoaded", iniciarMapa);
