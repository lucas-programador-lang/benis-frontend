/**
 * BENIS BURGUER - Gourmet Logic & Map Engine v6.9 (Elite Edition)
 * Localidade: Porto Velho, RO - 2026
 * Sincronizado: app.js + Horários Oficiais + Cardápio Atualizado
 */

// --- 1. CONFIGURAÇÕES E ESTADO GLOBAL ---
let carrinho = [];
let descontoAtivo = 0; 
let mapa;
let marcadorUsuario;
// Variável global para capturar o endereço do mapa
window.enderecoEntrega = "Não selecionado no mapa (Informe ao atendente)"; 

const COORDS_LOJA = [-8.74015, -63.87498]; // Porto Velho - Aponiã

// Inicialização segura do Carrinho via LocalStorage
try {
    const savedCart = localStorage.getItem('benis_cart');
    carrinho = savedCart ? JSON.parse(savedCart) : [];
} catch (e) {
    console.error("Erro ao carregar carrinho:", e);
    carrinho = [];
}

const cardapio = {
    hamburguer: [
        { id: 1, name: "Misto Quente", preco: 7.00, desc: "Pão, queijo e presunto.", img: "misto.png" },
        { id: 2, name: "X-Bauru", preco: 8.00, desc: "Pão, queijo, presunto, alface e tomate.", img: "bauru.png" },
        { id: 3, name: "X-Burguer", preco: 13.00, desc: "Pão, hambúrguer, queijo, presunto, alface, tomate, milho e batata.", img: "xburguer.png" },
        { id: 4, name: "X-Salada", preco: 14.00, desc: "Pão, hambúrguer, ovo, queijo, presunto, alface, tomate, milho e batata.", img: "xsalada.png" },
        { id: 5, name: "X-Salada Especial", preco: 17.00, desc: "Pão, hambúrguer, ovo, salsicha, banana, catupiry, queijo, presunto, alface, tomate, milho e batata.", img: "especial.png" },
        { id: 6, name: "X-Calabresa", preco: 18.00, desc: "Pão, hambúrguer, calabresa, ovo, queijo, presunto, milho e batata.", img: "xcalabresa.png" },
        { id: 7, name: "X-Bacon", preco: 19.00, desc: "Pão, hambúrguer, bacon, ovo, queijo, presunto, alface, tomate, milho e batata.", img: "xbacon.png" },
        { id: 8, name: "X-Franbacon", preco: 20.00, desc: "Pão, frango, bacon, ovo, banana, queijo, presunto, alface, tomate, milho e batata.", img: "franbacon.png" },
        { id: 9, name: "X-Franbesa", preco: 20.00, desc: "Pão, frango, calabresa, ovo, banana, queijo, presunto, alface, tomate, milho e batata.", img: "franbesa.png" },
        { id: 10, name: "X-Frango", preco: 18.00, desc: "Pão, filé de frango, ovo, queijo, presunto, alface, tomate, milho e batata.", img: "xfrango.png" },
        { id: 11, name: "X-Turbinado", preco: 20.00, desc: "Pão, 2 hambúrgueres, 2 ovos, 2 queijos, 2 presuntos, alface, tomate, batata e milho.", img: "turbinado.png" },
        { id: 12, name: "X-Bagunça", preco: 20.00, desc: "Pão, hambúrguer, calabresa, bacon, ovo, banana, queijo, presunto, alface, tomate, milho e batata.", img: "bagunca.png" },
        { id: 13, name: "X-Tudo", preco: 23.00, desc: "Pão, hambúrguer, frango, calabresa, bacon, salsicha, banana, catupiry, queijo, presunto, alface, tomate, milho e batata.", img: "xtudo.png" },
        { id: 14, name: "X-Havaiano", preco: 19.00, desc: "Pão, hambúrguer, banana, abacaxi, cheddar, queijo, presunto, alface, tomate, cebola caramelizada, milho e batata.", img: "havaiano.png" },
        { id: 15, name: "X-Benis", preco: 26.00, desc: "Pão, hambúrguer, frango, calabresa, bacon, salsicha, banana, abacaxi, cheddar, cebola caramelizada, queijo, presunto, alface, tomate, milho e batata.", img: "xbenis.png" }
    ],
    porcoes: [
        { id: 101, name: "Batata Frita", preco: 15.00, desc: "Porção de batata frita crocante.", img: "batata.png" },
        { id: 102, name: "Batata + Cheddar + Bacon", preco: 25.00, desc: "Batata frita com cobertura de cheddar e bacon.", img: "batatacompleta.png" }
    ],
    bebidas: [
        { id: 201, name: "Coca Cola 2L", preco: 15.00, desc: "Refrigerante 2 Litros.", img: "coca2l.png" },
        { id: 202, name: "Coca Cola 1L", preco: 10.00, desc: "Refrigerante 1 Litro.", img: "coca1l.png" },
        { id: 203, name: "Tuchaua 2L", preco: 9.00, desc: "Guaraná regional 2 Litros.", img: "tuchaua.png" },
        { id: 204, name: "Dydyo 2L", preco: 9.00, desc: "Guaraná regional 2 Litros.", img: "dydyo.png" },
        { id: 205, name: "Coca Cola em Lata", preco: 7.00, desc: "Refrigerante lata 350ml.", img: "cocalata.png" },
        { id: 206, name: "Sucos Naturais", preco: 7.00, desc: "Suco de fruta natural 400ml.", img: "suco.png" }
    ],
    extras: [
        { id: 301, name: "Hambúrguer Extra", preco: 5.00, desc: "Adicional de carne.", img: "carne.png" },
        { id: 302, name: "Frango Extra", preco: 3.00, desc: "Adicional de frango.", img: "frango_extra.png" },
        { id: 303, name: "Ovo Extra", preco: 2.00, desc: "Adicional de ovo.", img: "ovo.png" },
        { id: 304, name: "Bacon Extra", preco: 3.00, desc: "Adicional de bacon.", img: "bacon.png" },
        { id: 305, name: "Calabresa Extra", preco: 3.00, desc: "Adicional de calabresa.", img: "calabresa.png" },
        { id: 306, name: "Cheddar Extra", preco: 4.00, desc: "Adicional de cheddar.", img: "cheddar.png" },
        { id: 307, name: "Cebola Caramelizada", preco: 3.00, desc: "Adicional de cebola.", img: "cebola.png" }
    ]
};

const formatarMoeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- 2. ENGINE DO MAPA (COM GEOCODIFICAÇÃO) ---
function iniciarMapa() {
    if (mapa) return;
    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement) return;

    mapa = L.map('mapaEntrega', { zoomControl: false, attributionControl: false }).setView(COORDS_LOJA, 15);
    
    // Camada Dark Premium do CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapa);

    const iconLoja = L.divIcon({
        className: 'custom-pin-container',
        html: `<div class="pin-wrapper"><div class="pin-pulse"></div><div class="pin-center" style="background:#ff8c00; border:2px solid #fff; border-radius:50%; width:12px; height:12px;"></div></div>`,
        iconSize: [40, 40], iconAnchor: [20, 20]
    });

    L.marker(COORDS_LOJA, { icon: iconLoja }).addTo(mapa)
        .bindPopup(`<strong style="color:#ff8c00;">Benis Burguer</strong><br>Aponiã - Porto Velho`).openPopup();

    mapa.on('click', (e) => processarLocalizacao(e.latlng.lat, e.latlng.lng));

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            processarLocalizacao(pos.coords.latitude, pos.coords.longitude, true);
        }, (err) => console.warn("Geolocalização negada. Use o clique no mapa."));
    }

    setTimeout(() => mapa.invalidateSize(), 500);
}

async function processarLocalizacao(lat, lng, centralizar = false) {
    if (marcadorUsuario) mapa.removeLayer(marcadorUsuario);
    
    marcadorUsuario = L.circleMarker([lat, lng], {
        radius: 8, fillColor: "#3b82f6", color: "#fff", weight: 2, fillOpacity: 0.9
    }).addTo(mapa);

    if (centralizar) {
        mapa.setView([lat, lng], 16);
    }

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        const rua = data.address.road || data.address.pedestrian || 'Rua não identificada';
        const bairro = data.address.suburb || data.address.neighbourhood || 'Bairro não identificado';
        window.enderecoEntrega = `${rua}, ${data.address.house_number || 'S/N'} - ${bairro}`;
        marcadorUsuario.bindPopup(`<b>Entregar aqui:</b><br>${window.enderecoEntrega}`).openPopup();
    } catch (e) {
        window.enderecoEntrega = `Coordenadas: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
}

// --- 3. LÓGICA DO CARRINHO ---
function adicionarAoCarrinho(cat, id, event) {
    const itemOriginal = cardapio[cat].find(p => p.id === id);
    if (!itemOriginal) return;

    // Feedback visual no botão
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> ADICIONADO';
    btn.style.background = "#22c55e";
    btn.style.color = "#fff";
    
    const itemExistente = carrinho.find(i => i.id === id);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...itemOriginal, quantidade: 1 });
    }

    salvarEAtualizar();
    
    setTimeout(() => { 
        btn.innerHTML = originalContent;
        btn.style.background = "";
        btn.style.color = "";
    }, 1000);
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

    list.innerHTML = carrinho.length ? "" : `<div style="text-align:center; padding:40px; opacity:0.5; font-size:0.9rem;">Sua sacola está vazia.</div>`;

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item-elite";
        div.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.quantidade}x ${item.name}</h4>
                <p>${formatarMoeda(item.preco * item.quantidade)}</p>
            </div>
            <button class="btn-remove" onclick="removerDoCarrinho(${item.id})">
                <i class="fas fa-trash-alt"></i>
            </button>`;
        list.appendChild(div);
    });

    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    const totalFinal = Math.max(0, subtotal - descontoAtivo);
    const cartCount = carrinho.reduce((acc, i) => acc + i.quantidade, 0);

    if (document.getElementById("subtotalValue")) document.getElementById("subtotalValue").innerText = formatarMoeda(subtotal);
    if (document.getElementById("totalValue")) document.getElementById("totalValue").innerText = formatarMoeda(totalFinal);
    if (document.getElementById("cartCount")) document.getElementById("cartCount").innerText = cartCount;
    
    const cartFab = document.getElementById("cartToggle");
    if (cartFab) {
        cartFab.style.display = carrinho.length > 0 ? "flex" : "none";
        const fabTotal = document.getElementById("cartFabTotal");
        if (fabTotal) fabTotal.innerText = `Ver sacola • ${formatarMoeda(totalFinal)}`;
    }
}

// --- 4. SISTEMA DE CUPOM ---
function aplicarCupom() {
    const cupomInput = document.getElementById("cupom");
    if (!cupomInput) return;
    
    const cupom = cupomInput.value.toUpperCase().trim();
    const discountRow = document.getElementById("discountRow");

    if (cupom === "BENIS10") {
        descontoAtivo = 10.00;
        if (discountRow) discountRow.style.display = "flex";
        const discVal = document.getElementById("discountValue");
        if (discVal) discVal.innerText = `- ${formatarMoeda(descontoAtivo)}`;
        alert("Cupom BENIS10 aplicado: R$ 10,00 de desconto!");
    } else {
        alert("Cupom inválido ou expirado.");
        descontoAtivo = 0;
        if (discountRow) discountRow.style.display = "none";
    }
    salvarEAtualizar();
}

// --- 5. CATEGORIAS ---
function mostrarCategoria(categoria) {
    const grid = document.getElementById("menu");
    if (!grid) return;
    grid.innerHTML = "";
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === categoria);
    });

    cardapio[categoria].forEach(item => {
        const card = document.createElement("div");
        card.className = "card-item";
        card.innerHTML = `
            <div class="card-image-box">
                <img src="img/${item.img}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300/111/fff?text=${item.name}'">
            </div>
            <div class="card-info">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <span class="price-tag">${formatarMoeda(item.preco)}</span>
            </div>
            <button class="add-btn" onclick="adicionarAoCarrinho('${categoria}', ${item.id}, event)">
                <i class="fas fa-plus"></i> <span>ADICIONAR</span>
            </button>`;
        grid.appendChild(card);
    });
}

// --- 6. CHECKOUT WHATSAPP ---
function checkout() {
    if (!carrinho.length) return;
    
    let msg = "🍔 *NOVO PEDIDO - BENIS BURGUER* 🍔\n";
    msg += "━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    carrinho.forEach(item => {
        msg += `✅ *${item.quantidade}x ${item.name}*\n`;
        msg += `   Subtotal: ${formatarMoeda(item.preco * item.quantidade)}\n\n`;
    });

    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    const totalFinal = subtotal - descontoAtivo;
    
    msg += "━━━━━━━━━━━━━━━━━━━━━━\n";
    if (descontoAtivo > 0) msg += `🎁 *DESCONTO:* - ${formatarMoeda(descontoAtivo)}\n`;
    msg += `💰 *TOTAL DO PEDIDO:* ${formatarMoeda(totalFinal)}\n\n`;
    
    msg += "📍 *ENDEREÇO DE ENTREGA:* \n";
    msg += `🗺️ ${window.enderecoEntrega}\n\n`;
    msg += "*Observação:* (Informe o número da casa e ponto de referência aqui)";

    const fone = "556993668336"; 
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`, "_blank");
}

function toggleCarrinho() { 
    const panel = document.getElementById("cartPanel");
    if (panel) panel.classList.toggle("open");
}

// --- 7. CONTROLE DE HORÁRIO ---
function verificarStatusLoja() {
    const agora = new Date();
    const diaSemana = agora.getDay();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const tempoAbertura = 19 * 60; // 19:00
    const tempoFechamento = (23 * 60) + 59; // 23:59
    const tempoAtual = (hora * 60) + minutos;

    const statusText = document.getElementById("statusText");
    const statusDot = document.querySelector(".status-dot");

    if (diaSemana === 1) { // Segunda fechado
        if (statusText) statusText.innerText = "Fechado • Abre Terça às 19:00";
        statusDot?.classList.remove("online");
    } else if (tempoAtual >= tempoAbertura && tempoAtual <= tempoFechamento) {
        if (statusText) statusText.innerText = "Aberto • No Braseiro";
        statusDot?.classList.add("online");
    } else {
        if (statusText) statusText.innerText = `Fechado • Abre às 19h`;
        statusDot?.classList.remove("online");
    }
}

// --- BOOTSTRAP ---
window.addEventListener('DOMContentLoaded', () => {
    verificarStatusLoja();
    atualizarInterface();
    mostrarCategoria("hamburguer");
    iniciarMapa();

    // Fechar sacola ao clicar fora (em telas mobile)
    document.addEventListener('click', (e) => {
        const panel = document.getElementById("cartPanel");
        const cartToggle = document.getElementById("cartToggle");
        if (panel && panel.classList.contains("open") && !panel.contains(e.target) && !cartToggle.contains(e.target)) {
            toggleCarrinho();
        }
    });

    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 800);
        }, 1000);
    }
});
