/**
 * BENIS BURGUER - Gourmet Logic & Map Engine v6.2
 * Status: OTIMIZADO & SEGURO
 * Localidade: Porto Velho, RO - 2026
 */

// --- 1. CONFIGURAÇÕES E ESTADO GLOBAL ---
let carrinho = [];
try {
    carrinho = JSON.parse(localStorage.getItem('benis_cart')) || [];
} catch (e) {
    carrinho = [];
}

let descontoPercentual = 0;
let cupomAtivo = "";
let mapa;
const COORDS_LOJA = [-8.74015, -63.87498]; 

const cardapio = {
    hamburguer: [
        { id: 1, name: "Misto Quente", preco: 7.00, desc: "Pão, queijo e presunto.", img: "misto.png" },
        { id: 2, name: "X-Bauru", preco: 8.00, desc: "Pão, queijo, presunto, alface e tomate.", img: "bauru.png" },
        { id: 3, name: "X-Burguer", preco: 13.00, desc: "Pão, hambúrguer, queijo, presunto, alface, tomate, milho e batata.", img: "xbuerger.png" },
        { id: 4, name: "X-Salada", preco: 14.00, desc: "Pão, hambúrguer, ovo, queijo, presunto, alface, tomate, milho e batata.", img: "xsalada.png" },
        { id: 5, name: "X-Salada Especial", preco: 17.00, desc: "Hambúrguer, ovo, salsicha, banana, catupiry e complementos.", img: "especial.png" },
        { id: 6, name: "X-Calabresa", preco: 18.00, desc: "Pão, hambúrguer, calabresa, ovo e complementos.", img: "xcalabresa.png" },
        { id: 7, name: "X-Bacon", preco: 19.00, desc: "Pão, hambúrguer, bacon crocante, ovo e complementos.", img: "xbacon.png" },
        { id: 8, name: "X-Havaiano", preco: 19.00, desc: "Hambúrguer, banana, abacaxi, cheddar e cebola caramelizada.", img: "havaiano.png" },
        { id: 10, name: "X-Benis", preco: 26.00, desc: "O Brabo: Frango, calabresa, bacon, salsicha, banana e cheddar.", img: "xbenis.png" }
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
        { id: 303, name: "Bacon", preco: 3.00, desc: "Crocância máxima.", img: "extra-bacon.png" }
    ]
};

const CUPONS_VALIDOS = { "BENIS10": 10, "APONIA": 15, "PRIMEIRACOMPRA": 5 };
const formatarMoeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- 2. ENGINE DO MAPA (LEAFLET) ---
function iniciarMapa() {
    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement || mapa) return;

    mapa = L.map('mapaEntrega', {
        zoomControl: false, 
        scrollWheelZoom: false,
        attributionControl: false
    }).setView(COORDS_LOJA, 16);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapa);

    const iconLoja = L.divIcon({
        className: 'custom-pin-container',
        html: `<div class="pin-wrapper"><div class="pin-pulse"></div><div class="pin-center"></div></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    L.marker(COORDS_LOJA, { icon: iconLoja }).addTo(mapa);
    setTimeout(() => { mapa.invalidateSize(); }, 500);
}

// --- 3. LÓGICA DO CARRINHO ---
function adicionarAoCarrinho(cat, id, event) {
    const itemOriginal = cardapio[cat].find(p => p.id === id);
    if (!itemOriginal) return;

    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> ADICIONADO';
    btn.classList.add('btn-success');

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

    list.innerHTML = carrinho.length ? "" : `<div style="text-align:center;padding:40px;opacity:0.4;"><i class="fas fa-shopping-basket" style="font-size:3rem;margin-bottom:10px;"></i><p>Sua sacola está vazia.</p></div>`;

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item-elite";
        div.innerHTML = `
            <div style="flex-grow:1; text-align:left;">
                <h4 style="color:#fff; font-size:0.95rem; margin-bottom:4px;">${item.quantidade}x ${item.name}</h4>
                <span style="color:var(--primary); font-weight:700;">${formatarMoeda(item.preco * item.quantidade)}</span>
            </div>
            <button class="btn-remove" onclick="removerDoCarrinho(${item.id})">
                <i class="fas fa-minus"></i>
            </button>`;
        list.appendChild(div);
    });

    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    const valorDesconto = subtotal * (descontoPercentual / 100);
    const totalFinal = subtotal - valorDesconto;

    // Atualiza Resumo Financeiro
    document.getElementById("subtotalValue") && (document.getElementById("subtotalValue").innerText = formatarMoeda(subtotal));
    document.getElementById("totalValue") && (document.getElementById("totalValue").innerText = formatarMoeda(totalFinal));
    
    const discRow = document.getElementById("discountRow");
    if (descontoPercentual > 0) {
        discRow.style.display = "flex";
        document.getElementById("discountValue").innerText = `- ${formatarMoeda(valorDesconto)}`;
    } else {
        discRow.style.display = "none";
    }

    // Atualiza FAB e Contagem
    document.getElementById("cartCount") && (document.getElementById("cartCount").innerText = carrinho.reduce((acc, i) => acc + i.quantidade, 0));
    document.getElementById("cartFabTotal") && (document.getElementById("cartFabTotal").innerText = `Ver sacola (${formatarMoeda(totalFinal)})`);
    document.getElementById("cartToggle") && (document.getElementById("cartToggle").style.display = carrinho.length > 0 ? "flex" : "none");
}

// --- 4. NAVEGAÇÃO E STATUS ---
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
                <div class="card-image-box">
                    <img src="img/${item.img}" onerror="this.src='https://via.placeholder.com/300x200?text=Burguer'">
                </div>
                <div class="card-info">
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.desc}</p>
                    </div>
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

function aplicarCupom() {
    const input = document.getElementById('cupom');
    const container = document.getElementById('couponContainer');
    const codigo = input.value.toUpperCase().trim();
    
    if (CUPONS_VALIDOS[codigo]) {
        descontoPercentual = CUPONS_VALIDOS[codigo];
        cupomAtivo = codigo;
        container.classList.add('coupon-active');
        input.disabled = true;
        document.getElementById('btnAplicarCupom').innerHTML = '<i class="fas fa-check"></i>';
        atualizarInterface();
    } else {
        alert("Cupom inválido ou expirado.");
        input.value = "";
    }
}

function checkout() {
    if (!carrinho.length) return;
    
    let msg = "🍔 *BENIS BURGUER - NOVO PEDIDO* 🍔\n";
    msg += "--------------------------------------\n\n";
    
    carrinho.forEach(item => {
        msg += `✅ *${item.quantidade}x ${item.name}*\n`;
        msg += `   Subtotal: ${formatarMoeda(item.preco * item.quantidade)}\n\n`;
    });

    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    const totalFinal = subtotal * (1 - (descontoPercentual / 100));

    if (cupomAtivo) msg += `🎟️ *Cupom:* ${cupomAtivo} (-${descontoPercentual}%)\n`;
    msg += `\n💰 *TOTAL A PAGAR: ${formatarMoeda(totalFinal)}*`;
    msg += `\n\n📍 *Endereço de Entrega:* \n(Digite aqui seu endereço)`;

    window.open(`https://wa.me/556993668336?text=${encodeURIComponent(msg)}`, "_blank");
}

function toggleCarrinho() { 
    document.getElementById("cartPanel").classList.toggle("open"); 
}

// --- 5. INICIALIZAÇÃO ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progressBar');

    if (progressBar) progressBar.style.width = "100%";

    setTimeout(() => {
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 600);
        }
        
        // Verifica se é noite (Aberta)
        const hora = new Date().getHours();
        const statusDot = document.getElementById("statusLabel");
        const statusText = document.getElementById("statusText");
        if (hora >= 18 || hora < 1) {
            statusDot?.classList.add("online");
            if (statusText) statusText.innerText = "Aberta • No Braseiro";
        } else {
            if (statusText) statusText.innerText = "Fechada • Abre às 18:00";
        }

        atualizarInterface();
        mostrarCategoria("hamburguer");
        iniciarMapa();
    }, 1000);
});
