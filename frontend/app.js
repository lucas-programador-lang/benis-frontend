/**
 * BENIS BURGUER - Gourmet Logic & Map Engine v6.2 (Elite Edition)
 * Status: OTIMIZADO, SEGURO & PROFISSIONAL
 * Localidade: Porto Velho, RO - 2026
 */

// --- 1. CONFIGURAÇÕES E ESTADO GLOBAL ---
let carrinho = [];
try {
    const savedCart = localStorage.getItem('benis_cart');
    carrinho = savedCart ? JSON.parse(savedCart) : [];
} catch (e) {
    console.error("Erro ao carregar carrinho:", e);
    carrinho = [];
}

let descontoPercentual = 0;
let cupomAtivo = "";
let mapa;
const COORDS_LOJA = [-8.74015, -63.87498]; 

const cardapio = {
    hamburguer: [
        { id: 1, name: "Misto Quente", preco: 7.00, desc: "Pão de hambúrguer, queijo e presunto.", img: "misto.png" },
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
        { id: 101, name: "Batata Frita", preco: 15.00, desc: "Porção individual crocante e sequinha.", img: "batata.png" },
        { id: 102, name: "Batata + Cheddar + Bacon", preco: 25.00, desc: "A favorita da galera, muito bacon!", img: "batatacompleta.png" }
    ],
    bebidas: [
        { id: 201, name: "Coca Cola 2L", preco: 15.00, desc: "Gelada tamanho família.", img: "coca2l.png" },
        { id: 202, name: "Coca Cola 1L", preco: 10.00, desc: "Ideal para dividir.", img: "coca1l.png" },
        { id: 203, name: "Tuchaua 2L", preco: 9.00, desc: "O sabor marcante da nossa região.", img: "tuchaua.png" },
        { id: 204, name: "Dydyo 2L", preco: 9.00, desc: "Clássico inconfundível de Porto Velho.", img: "dydyo.png" },
        { id: 205, name: "Coca Cola Lata", preco: 7.00, desc: "Refresco geladinho individual.", img: "cocalata.png" }
    ],
    extras: [
        { id: 301, name: "Hambúrguer Extra", preco: 5.00, desc: "Turbine seu pedido com mais carne.", img: "extra-meat.png" },
        { id: 302, name: "Cheddar Extra", preco: 4.00, desc: "Cremosidade extra para seu lanche.", img: "extra-cheddar.png" },
        { id: 303, name: "Bacon Extra", preco: 3.00, desc: "Crocância máxima adicional.", img: "extra-bacon.png" }
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
    
    // Força o mapa a renderizar corretamente após o carregamento
    setTimeout(() => { mapa.invalidateSize(); }, 800);
}

// --- 3. LÓGICA DO CARRINHO ---
function adicionarAoCarrinho(cat, id, event) {
    const itemOriginal = cardapio[cat].find(p => p.id === id);
    if (!itemOriginal) return;

    // Feedback visual no botão
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> ADICIONADO';
    btn.style.background = "var(--success)";
    btn.style.color = "#000";

    const itemExistente = carrinho.find(i => i.id === id);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...itemOriginal, quantidade: 1 });
    }

    salvarEAtualizar();
    
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = ""; // Volta para o CSS original
        btn.style.color = "";
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
        <div style="text-align:center;padding:60px;opacity:0.3;">
            <i class="fas fa-shopping-basket" style="font-size:4rem;margin-bottom:15px;display:block;"></i>
            <p style="font-weight:600;">Sua sacola está vazia.</p>
            <small>Que tal adicionar um X-Benis?</small>
        </div>`;

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item-elite";
        div.innerHTML = `
            <div style="flex-grow:1; text-align:left;">
                <h4 style="color:#fff; font-size:1rem; font-weight:700; margin-bottom:2px;">${item.quantidade}x ${item.name}</h4>
                <span style="color:var(--primary); font-weight:800; font-size:0.9rem;">${formatarMoeda(item.preco * item.quantidade)}</span>
            </div>
            <div style="display:flex; gap:8px;">
                <button class="btn-remove" onclick="removerDoCarrinho(${item.id})">
                    <i class="fas fa-minus"></i>
                </button>
            </div>`;
        list.appendChild(div);
    });

    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    const valorDesconto = subtotal * (descontoPercentual / 100);
    const totalFinal = subtotal - valorDesconto;

    // Atualiza Resumo Financeiro
    const subtotalEl = document.getElementById("subtotalValue");
    const totalEl = document.getElementById("totalValue");
    if (subtotalEl) subtotalEl.innerText = formatarMoeda(subtotal);
    if (totalEl) totalEl.innerText = formatarMoeda(totalFinal);
    
    const discRow = document.getElementById("discountRow");
    if (descontoPercentual > 0 && discRow) {
        discRow.style.display = "flex";
        document.getElementById("discountValue").innerText = `- ${formatarMoeda(valorDesconto)}`;
    } else if (discRow) {
        discRow.style.display = "none";
    }

    // Atualiza FAB (Botão flutuante)
    const cartCount = document.getElementById("cartCount");
    const cartFabTotal = document.getElementById("cartFabTotal");
    const cartToggle = document.getElementById("cartToggle");

    if (cartCount) cartCount.innerText = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
    if (cartFabTotal) cartFabTotal.innerText = `Ver sacola • ${formatarMoeda(totalFinal)}`;
    if (cartToggle) cartToggle.style.display = carrinho.length > 0 ? "flex" : "none";
}

// --- 4. NAVEGAÇÃO E SISTEMA DE CATEGORIAS ---
function mostrarCategoria(categoria) {
    const grid = document.getElementById("menu");
    if (!grid) return;
    
    // Efeito de transição suave
    grid.style.opacity = "0";
    grid.style.transform = "translateY(10px)";
    
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
                    <img src="img/${item.img}" alt="${item.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Benis+Burguer'">
                    <div class="price-badge-floating">${formatarMoeda(item.preco)}</div>
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
        grid.style.transform = "translateY(0)";
    }, 300);
}

function aplicarCupom() {
    const input = document.getElementById('cupom');
    const container = document.getElementById('couponContainer');
    if (!input) return;

    const codigo = input.value.toUpperCase().trim();
    
    if (CUPONS_VALIDOS[codigo]) {
        descontoPercentual = CUPONS_VALIDOS[codigo];
        cupomAtivo = codigo;
        if (container) container.classList.add('coupon-active');
        input.disabled = true;
        input.style.borderColor = "var(--success)";
        const btnCupom = document.getElementById('btnAplicarCupom');
        if (btnCupom) btnCupom.innerHTML = '<i class="fas fa-check"></i>';
        atualizarInterface();
    } else {
        alert("Cupom não encontrado. Verifique se digitou corretamente!");
        input.value = "";
    }
}

// --- 5. CHECKOUT (WHATSAPP ENGINE) ---
function checkout() {
    if (!carrinho.length) {
        alert("Sua sacola está vazia!");
        return;
    }
    
    let msg = "🍔 *NOVO PEDIDO - BENIS BURGUER* 🍔\n";
    msg += "━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    carrinho.forEach(item => {
        msg += `▪️ *${item.quantidade}x ${item.name}*\n`;
        msg += `   Subtotal: ${formatarMoeda(item.preco * item.quantidade)}\n\n`;
    });

    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    const totalFinal = subtotal * (1 - (descontoPercentual / 100));

    msg += "━━━━━━━━━━━━━━━━━━━━━━\n";
    if (cupomAtivo) msg += `🎟️ *Cupom:* ${cupomAtivo} (-${descontoPercentual}%)\n`;
    msg += `💰 *TOTAL A PAGAR: ${formatarMoeda(totalFinal)}*\n\n`;
    
    msg += "📍 *ENDEREÇO DE ENTREGA:* \n";
    msg += "_(Por favor, informe Rua, Número e Bairro aqui)_ \n\n";
    msg += "💳 *FORMA DE PAGAMENTO:* \n";
    msg += "_(Pix, Cartão ou Dinheiro)_";

    const fone = "556993668336"; 
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`, "_blank");
}

function toggleCarrinho() { 
    const panel = document.getElementById("cartPanel");
    if (panel) panel.classList.toggle("open"); 
}

// --- 6. INICIALIZAÇÃO E STATUS DE FUNCIONAMENTO ---
window.addEventListener('DOMContentLoaded', () => {
    // Sistema de Loader
    const loader = document.getElementById('loader');
    
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 800);
        }
        
        // Verificação de Horário (Aberto 18h às 01h)
        const agora = new Date();
        const hora = agora.getHours();
        const statusLabel = document.getElementById("statusLabel");
        const statusText = document.getElementById("statusText");

        // Regra: Aberto se for entre 18h e 23h59 OU entre 00h e 01h
        const estaAberto = (hora >= 18 || hora < 1);

        if (estaAberto) {
            statusLabel?.classList.add("online");
            statusLabel?.classList.remove("offline");
            if (statusText) statusText.innerText = "Aberta • No Braseiro";
        } else {
            statusLabel?.classList.add("offline");
            statusLabel?.classList.remove("online");
            if (statusText) statusText.innerText = "Fechada • Abre às 18:00";
        }

        atualizarInterface();
        mostrarCategoria("hamburguer");
        iniciarMapa();
    }, 1200);
});
