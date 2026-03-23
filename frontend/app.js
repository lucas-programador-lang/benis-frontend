/**
 * BENIS BURGUER - Gourmet Logic Engine v5.2 (Elite Edition)
 * Sincronizado com: style.css v5.2
 * Localidade: Porto Velho, RO - 2026
 */

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

let carrinho = JSON.parse(localStorage.getItem('benis_cart')) || [];
let descontoPercentual = 0;
let cupomAtivo = "";

const CUPONS_VALIDOS = { "BENIS10": 10, "APONIA": 15, "PRIMEIRACOMPRA": 5 };

const formatarMoeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- EXIBIÇÃO DO MENU ---
function mostrarCategoria(categoria) {
    const grid = document.getElementById("menu");
    if (!grid) return;

    grid.style.opacity = "0";
    grid.style.transform = "translateY(15px)";

    setTimeout(() => {
        grid.innerHTML = "";
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-cat') === categoria);
        });

        const itens = cardapio[categoria] || [];
        itens.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "card-item";
            card.innerHTML = `
                <div class="card-image-box">
                    <img src="img/${item.img}" alt="${item.name}" onerror="this.src='logo.png'">
                </div>
                <div class="card-info" style="padding: 20px;">
                    <h3 style="margin-bottom: 5px;">${item.name}</h3>
                    <p style="color: var(--text-dim); font-size: 0.9rem; margin-bottom: 10px;">${item.desc}</p>
                    <span class="price-tag">${formatarMoeda(item.preco)}</span>
                </div>
                <button class="add-btn" onclick="adicionarAoCarrinho('${categoria}', ${index}, event)">
                    <i class="fas fa-plus"></i> ADICIONAR
                </button>
            `;
            grid.appendChild(card);
        });

        grid.style.opacity = "1";
        grid.style.transform = "translateY(0)";
    }, 250);
}

// --- LÓGICA DO CARRINHO ---
function atualizarInterface() {
    const list = document.getElementById("cartItems");
    const totalValue = document.getElementById("totalValue");
    const subtotalDisplay = document.getElementById("subtotalValue");
    const cartCount = document.getElementById("cartCount");
    const fabContainer = document.getElementById("cartToggle");
    const fabTotal = document.getElementById("cartFabTotal");

    if (!list) return;

    list.innerHTML = carrinho.length ? "" : `
        <div style="text-align:center; padding: 60px 20px; opacity: 0.3;">
            <i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <p>Sua sacola está vazia.</p>
        </div>`;

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item-elite"; // Sincronizado com CSS
        div.style = "display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid var(--glass-border);";
        div.innerHTML = `
            <div>
                <h4 style="font-size: 1rem;">${item.name}</h4>
                <span style="color: var(--primary); font-weight: bold;">${formatarMoeda(item.preco)}</span>
            </div>
            <button onclick="removerDoCarrinho(${item.cartId})" style="background: rgba(255,77,77,0.1); color: var(--danger); border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        list.appendChild(div);
    });

    const subtotal = carrinho.reduce((acc, i) => acc + i.preco, 0);
    const totalFinal = subtotal - (subtotal * (descontoPercentual / 100));

    if (cartCount) cartCount.innerText = carrinho.length;
    if (subtotalDisplay) subtotalDisplay.innerText = formatarMoeda(subtotal);
    if (totalValue) totalValue.innerText = formatarMoeda(totalFinal);
    if (fabTotal) fabTotal.innerText = `Ver sacola (${formatarMoeda(totalFinal)})`;
    
    if (fabContainer) {
        carrinho.length > 0 ? fabContainer.classList.add('active') : fabContainer.classList.remove('active');
    }
}

function adicionarAoCarrinho(cat, index, event) {
    const item = cardapio[cat][index];
    const btn = event.currentTarget;

    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> ADICIONADO';
    btn.style.background = "var(--success)";
    btn.style.color = "#fff";
    
    carrinho.push({ ...item, cartId: Date.now() + Math.random() });
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
    atualizarInterface();

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = "";
        btn.style.color = "";
    }, 800);
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(i => i.cartId !== id);
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
    atualizarInterface();
}

function aplicarCupom() {
    const input = document.getElementById('cupom');
    const codigo = input.value.toUpperCase().trim();

    if (CUPONS_VALIDOS[codigo]) {
        descontoPercentual = CUPONS_VALIDOS[codigo];
        cupomAtivo = codigo;
        input.style.borderColor = "var(--success)";
        atualizarInterface();
    } else {
        input.style.borderColor = "var(--danger)";
        input.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 200 });
    }
}

function toggleCarrinho() {
    document.getElementById("cartPanel").classList.toggle("open");
}

// --- CONFIGURAÇÃO DO MAPA ---
function inicializarMapa() {
    const coords = [-8.7410, -63.8745]; // Bairro Aponiã
    const mapa = L.map('mapaEntrega', { zoomControl: false }).setView(coords, 16);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(mapa);

    const pinHtml = `
        <div class="custom-pin-container">
            <div class="pin-wrapper">
                <div class="pin-pulse"></div>
                <div class="pin-center"></div>
            </div>
        </div>`;

    const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    L.marker(coords, { icon: customIcon }).addTo(mapa)
        .bindPopup('<b>Benis Burguer</b><br>R. Paulo Fortes, 6245')
        .openPopup();
}

// --- CHECKOUT WHATSAPP ---
function checkout() {
    if (!carrinho.length) return;

    const subtotal = carrinho.reduce((acc, i) => acc + i.preco, 0);
    const totalFinal = subtotal - (subtotal * (descontoPercentual / 100));
    
    let msg = "*🍔 NOVO PEDIDO - BENIS BURGUER*%0A";
    msg += "━━━━━━━━━━━━━━━━━━━━%0A";
    
    carrinho.forEach((item, i) => {
        msg += `*${i + 1}.* ${item.name} _(${formatarMoeda(item.preco)})_%0A`;
    });

    msg += "━━━━━━━━━━━━━━━━━━━━%0A";
    if (cupomAtivo) msg += `✅ *Cupom:* ${cupomAtivo} (-${descontoPercentual}%)%0A`;
    msg += `*TOTAL: ${formatarMoeda(totalFinal)}*%0A%0A`;
    msg += "📍 *Endereço:* (Preencha aqui)%0A";
    msg += "💰 *Pagamento:* (Dinheiro/Pix/Cartão)";

    window.open(`https://wa.me/556993668336?text=${msg}`, "_blank");
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Simulação de carregamento do Loader
    const progressBar = document.getElementById('progressBar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        if (progressBar) progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                const loader = document.getElementById("loader");
                if (loader) loader.classList.add('fade-out');
            }, 300);
        }
    }, 150);

    // Eventos de Categorias
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => mostrarCategoria(btn.dataset.cat));
    });

    atualizarInterface();
    mostrarCategoria("hamburguer");
    inicializarMapa();
});
