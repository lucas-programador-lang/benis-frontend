/**
 * BENIS BURGUER - Gourmet Logic & Map Engine v6.0
 * Status: COMPLETO & CORRIGIDO (Agrupamento + Loader + Mapa + WhatsApp)
 * Localidade: Porto Velho, RO - 2026
 */

// --- 1. CONFIGURAÇÕES E ESTADO GLOBAL ---
let carrinho = [];
try {
    // Tenta carregar o carrinho salvo no navegador do cliente
    carrinho = JSON.parse(localStorage.getItem('benis_cart')) || [];
} catch (e) {
    carrinho = [];
}

let descontoPercentual = 0;
let cupomAtivo = "";
let mapa;

// Coordenadas exatas para a Rua Paulo Fortes, Aponiã
const COORDS_LOJA = [-8.74015, -63.87498]; 

const cardapio = {
    hamburguer: [
        { id: 1, name: "Misto Quente", preco: 7.00, desc: "Pão, queijo e presunto.", img: "misto.png" },
        { id: 2, name: "X-Bauru", preco: 8.00, desc: "Pão, queijo, presunto, alface e tomate.", img: "bauru.png" },
        { id: 3, name: "X-Burguer", preco: 13.00, desc: "Pão, hambúrguer, queijo, presunto, alface, tomate, milho e batata.", img: "xbuerger.png" },
        { id: 4, name: "X-Salada", preco: 14.00, desc: "Pão, hambúrguer, ovo, queijo, presunto, alface, tomate, milho e batata.", img: "xsalada.png" },
        { id: 5, name: "X-Salada Especial", preco: 17.00, desc: "Hambúrguer, ovo, salsicha, banana, catupiry e muito mais!", img: "especial.png" },
        { id: 6, name: "X-Calabresa", preco: 18.00, desc: "Pão, hambúrguer, calabresa, ovo e complementos.", img: "xcalabresa.png" },
        { id: 7, name: "X-Bacon", preco: 19.00, desc: "Pão, hambúrguer, bacon crocante, ovo e complementos.", img: "xbacon.png" },
        { id: 8, name: "X-Havaiano", preco: 19.00, desc: "Hambúrguer, banana, abacaxi, cheddar e cebola caramelizada.", img: "havaiano.png" },
        { id: 9, name: "X-Benis", preco: 26.00, desc: "O Brabo: Frango, calabresa, bacon, salsicha, banana e cheddar.", img: "xbenis.png" }
    ],
    porcoes: [
        { id: 101, name: "Batata Frita", preco: 15.00, desc: "Porção individual crocante.", img: "batata.png" },
        { id: 102, name: "Batata + Cheddar + Bacon", preco: 25.00, desc: "A favorita da galera.", img: "batatacompleta.png" }
    ],
    bebidas: [
        { id: 201, name: "Coca Cola 2L", preco: 15.00, desc: "Gelada tamanho família.", img: "coca2l.png" },
        { id: 202, name: "Coca Cola 1L", preco: 10.00, desc: "Ideal para dividir.", img: "coca1l.png" },
        { id: 203, name: "Tuchaua 2L", preco: 9.00, desc: "O sabor da nossa região.", img: "tuchaua.png" },
        { id: 204, name: "Dydyo 2L", preco: 9.00, desc: "Clássico de Porto Velho.", img: "dydyo.png" },
        { id: 205, name: "Coca Cola Lata", preco: 7.00, desc: "Refresco geladinho.", img: "cocalata.png" }
    ],
    extras: [
        { id: 301, name: "Hambúrguer Extra", preco: 5.00, desc: "Turbine seu pedido.", img: "extra-meat.png" },
        { id: 302, name: "Cheddar", preco: 4.00, desc: "Cremosidade extra.", img: "extra-cheddar.png" },
        { id: 303, name: "Bacon", preco: 3.00, desc: "Crocância máxima.", img: "extra-bacon.png" },
        { id: 304, name: "Cebola Caramelizada", preco: 3.00, desc: "Toque agridoce.", img: "extra-onion.png" }
    ]
};

const CUPONS_VALIDOS = { "BENIS10": 10, "APONIA": 15, "PRIMEIRACOMPRA": 5 };
const formatarMoeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- 2. ENGINE DO MAPA (v1.3 INTEGRADA) ---
function iniciarMapa() {
    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement || mapa) return;

    // Inicialização do Leaflet (Estilo Dark)
    mapa = L.map('mapaEntrega', {
        zoomControl: false, 
        scrollWheelZoom: false,
        attributionControl: false
    }).setView(COORDS_LOJA, 16);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapa);

    // Pin Customizado da Benis
    const iconLoja = L.divIcon({
        className: 'custom-pin-container',
        html: `<div class="pin-wrapper"><div class="pin-pulse"></div><div class="pin-center"></div></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    L.marker(COORDS_LOJA, { icon: iconLoja })
        .addTo(mapa)
        .bindPopup(`
            <div class="map-popup-custom">
                <strong style="color: #ff8c00;">Benis Burguer</strong><br>
                <small>📍 R. Paulo Fortes, 6245</small>
            </div>
        `, { closeButton: false });

    // Localização do Cliente
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const coordsUser = [pos.coords.latitude, pos.coords.longitude];
            L.circleMarker(coordsUser, { radius: 8, fillColor: "#3b82f6", color: "#fff", weight: 3, fillOpacity: 1 }).addTo(mapa);
            
            const bounds = L.latLngBounds([COORDS_LOJA, coordsUser]);
            mapa.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        });
    }

    setTimeout(() => { mapa.invalidateSize(); }, 500);
}

// --- 3. LOGICA DO CARRINHO (AGRUPADO) ---
function adicionarAoCarrinho(cat, id, event) {
    const itemOriginal = cardapio[cat].find(p => p.id === id);
    if (!itemOriginal) return;

    // Feedback visual
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> OK!';
    btn.classList.add('btn-success');

    // Verifica se já existe para aumentar a quantidade
    const itemExistente = carrinho.find(i => i.id === id);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...itemOriginal, quantidade: 1 });
    }

    salvarEAtualizar();

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('btn-success');
    }, 800);
}

function removerDoCarrinho(id) {
    const index = carrinho.findIndex(i => i.id === id);
    if (index !== -1) {
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade -= 1;
        } else {
            carrinho.splice(index, 1);
        }
    }
    salvarEAtualizar();
}

function salvarEAtualizar() {
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
    atualizarInterface();
}

function atualizarInterface() {
    const list = document.getElementById("cartItems");
    if (!list) return;

    list.innerHTML = carrinho.length ? "" : `
        <div style="text-align:center; padding: 40px; opacity: 0.3;">
            <i class="fas fa-shopping-basket" style="font-size: 2.5rem; margin-bottom: 10px;"></i>
            <p>Sua sacola está vazia.</p>
        </div>`;

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item-elite";
        div.innerHTML = `
            <div style="flex-grow:1; text-align:left;">
                <h4 style="color:#fff; font-size:0.95rem;">${item.quantidade}x ${item.name}</h4>
                <span style="color:var(--primary); font-weight:700;">${formatarMoeda(item.preco * item.quantidade)}</span>
            </div>
            <button class="btn-remove" onclick="removerDoCarrinho(${item.id})">
                <i class="fas fa-trash-alt"></i>
            </button>`;
        list.appendChild(div);
    });

    const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    const totalFinal = subtotal * (1 - (descontoPercentual / 100));

    // Atualiza Displays
    if (document.getElementById("totalValue")) document.getElementById("totalValue").innerText = formatarMoeda(totalFinal);
    if (document.getElementById("cartCount")) document.getElementById("cartCount").innerText = totalItens;
    if (document.getElementById("cartFabTotal")) document.getElementById("cartFabTotal").innerText = `Ver sacola (${formatarMoeda(totalFinal)})`;
    if (document.getElementById("cartToggle")) document.getElementById("cartToggle").style.display = carrinho.length > 0 ? "flex" : "none";
}

// --- 4. CUPOM & STATUS ---
function aplicarCupom() {
    const input = document.getElementById('cupom');
    const codigo = input.value.toUpperCase().trim();
    if (CUPONS_VALIDOS[codigo]) {
        descontoPercentual = CUPONS_VALIDOS[codigo];
        cupomAtivo = codigo;
        input.style.borderColor = "#22c55e";
        atualizarInterface();
        alert(`Cupom ${codigo} aplicado!`);
    } else {
        descontoPercentual = 0;
        cupomAtivo = "";
        input.style.borderColor = "#ff4d4d";
        atualizarInterface();
    }
}

function verificarStatus() {
    const dot = document.getElementById("statusLabel");
    const text = document.getElementById("statusText");
    const agora = new Date();
    const hora = agora.getHours();
    const dia = agora.getDay();
    const aberto = (dia !== 1 && hora >= 18 && hora < 24); // Fecha Segunda

    if (dot && text) {
        dot.className = aberto ? "status-dot online" : "status-dot offline";
        text.innerText = aberto ? "Aceitando Pedidos" : "Fechado no momento";
    }
}

// --- 5. RENDERIZAÇÃO E NAVEGAÇÃO ---
function mostrarCategoria(categoria) {
    const grid = document.getElementById("menu");
    if (!grid) return;

    grid.style.opacity = "0";
    setTimeout(() => {
        grid.innerHTML = "";
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cat === categoria);
        });

        cardapio[categoria].forEach(item => {
            const card = document.createElement("div");
            card.className = "card-item";
            card.innerHTML = `
                <div class="card-image-box"><img src="img/${item.img}" onerror="this.src='logo.png'"></div>
                <div class="card-info">
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                    <span class="price-tag">${formatarMoeda(item.preco)}</span>
                </div>
                <button class="add-btn" onclick="adicionarAoCarrinho('${categoria}', ${item.id}, event)">
                    <i class="fas fa-plus"></i> ADICIONAR
                </button>`;
            grid.appendChild(card);
        });
        grid.style.opacity = "1";
    }, 200);
}

function toggleCarrinho() { document.getElementById("cartPanel").classList.toggle("open"); }

function checkout() {
    if (carrinho.length === 0) return;
    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    const totalFinal = subtotal * (1 - (descontoPercentual / 100));

    let msg = "*🍔 NOVO PEDIDO - BENIS BURGUER*\n";
    msg += "━━━━━━━━━━━━━━━━━━━━\n\n";
    carrinho.forEach(item => {
        msg += `*${item.quantidade}x* ${item.name}\n`;
        msg += `   └ _${formatarMoeda(item.preco * item.quantidade)}_\n`;
    });
    msg += "\n━━━━━━━━━━━━━━━━━━━━\n";
    if (cupomAtivo) msg += `*Cupom:* ${cupomAtivo} (-${descontoPercentual}%)\n`;
    msg += `*TOTAL: ${formatarMoeda(totalFinal)}*\n\n`;
    msg += "📍 *Entrega:* (Informe seu endereço)\n💰 *Pagamento:* (Informe a forma)";

    window.open(`https://wa.me/556993668336?text=${encodeURIComponent(msg)}`, "_blank");
}

// --- 6. INICIALIZAÇÃO FINAL ---
document.addEventListener('DOMContentLoaded', () => {
    // CORREÇÃO DO LOADER: Esconde o loader quando tudo carregar
    const loader = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.style.transition = "opacity 0.6s ease";
            loader.style.opacity = "0";
            setTimeout(() => { loader.style.display = "none"; }, 600);
        }, 1200); // 1.2s para garantir o visual
    }

    verificarStatus();
    atualizarInterface();
    mostrarCategoria("hamburguer");
    setTimeout(iniciarMapa, 2000);

    // Fechar carrinho ao clicar fora
    document.addEventListener('click', (e) => {
        const panel = document.getElementById("cartPanel");
        const fab = document.getElementById("cartToggle");
        if (panel?.classList.contains('open') && !panel.contains(e.target) && !fab.contains(e.target)) {
            toggleCarrinho();
        }
    });
});
