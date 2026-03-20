/**
 * BENIS BURGUER - Elite Logic Engine v4.2
 * Módulo: UI Dinâmica, Sistema de Cupons & Checkout WhatsApp
 */

const cardapio = {
    hamburguer: [
        { id: 1, name: "Misto Quente", preco: 7.00, desc: "Pão, queijo e presunto." },
        { id: 2, name: "X-Bauru", preco: 8.00, desc: "Pão, queijo, presunto, alface e tomate." },
        { id: 3, name: "X-Burguer", preco: 13.00, desc: "Pão, hambúrguer, queijo, presunto, alface, tomate, milho e batata." },
        { id: 4, name: "X-Salada", preco: 14.00, desc: "Pão, hambúrguer, ovo, queijo, presunto, alface, tomate, milho e batata." },
        { id: 5, name: "X-Salada Especial", preco: 17.00, desc: "Hambúrguer, ovo, salsicha, banana, catupiry e muito mais!" },
        { id: 6, name: "X-Calabresa", preco: 18.00, desc: "Pão, hambúrguer, calabresa, ovo e complementos." },
        { id: 7, name: "X-Bacon", preco: 19.00, desc: "Pão, hambúrguer, bacon crocante, ovo e complementos." },
        { id: 8, name: "X-Havaino", preco: 19.00, desc: "Hambúrguer, banana, abacaxi, cheddar e cebola caramelizada." },
        { id: 9, name: "X-Benis", preco: 26.00, desc: "O Brabo: Frango, calabresa, bacon, salsicha, banana e cheddar." }
    ],
    porcoes: [
        { id: 101, name: "Batata Frita", preco: 15.00, desc: "Porção individual crocante." },
        { id: 102, name: "Batata + Cheddar + Bacon", preco: 25.00, desc: "A favorita da galera." }
    ],
    bebidas: [
        { id: 201, name: "Coca Cola 2L", preco: 15.00, desc: "Gelada tamanho família." },
        { id: 202, name: "Coca Cola 1L", preco: 10.00, desc: "Ideal para dividir." },
        { id: 203, name: "Tuchaua 2L", preco: 9.00, desc: "O sabor da nossa região." },
        { id: 204, name: "Dydyo 2L", preco: 9.00, desc: "Clássico de Porto Velho." },
        { id: 205, name: "Coca Cola Lata", preco: 7.00, desc: "Refresco geladinho." }
    ],
    adicionais: [
        { id: 301, name: "Hambúrguer Extra", preco: 5.00, desc: "Turbine seu pedido." },
        { id: 302, name: "Cheddar", preco: 4.00, desc: "Cremosidade extra." },
        { id: 303, name: "Bacon", preco: 3.00, desc: "Crocância máxima." },
        { id: 304, name: "Cebola Caramelizada", preco: 3.00, desc: "Toque agridoce." }
    ]
};

// --- VARIÁVEIS DE ESTADO ---
let carrinho = JSON.parse(localStorage.getItem('benis_cart')) || [];
let descontoPercentual = 0;
let cupomAtivo = "";

const CUPONS_VALIDOS = {
    "PRIMEIRACOMPRA": 10,
    "BENIS15": 15,
    "PORTOWEST": 5
};

const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- INTERFACE E NAVEGAÇÃO ---

function toggleCarrinho() {
    const panel = document.getElementById("cartPanel");
    const overlay = document.getElementById("cartOverlay");
    panel.classList.toggle("open");
    if (overlay) overlay.classList.toggle("active");
}

function mostrarCategoria(categoria) {
    const menuContainer = document.getElementById("menu");
    if (!menuContainer) return;
    
    menuContainer.innerHTML = "";
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        const catAttr = btn.getAttribute('data-cat') || btn.getAttribute('data-category');
        if(catAttr === categoria) btn.classList.add('active');
    });

    cardapio[categoria].forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card-item";
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
            <div class="card-info">
                <h3>${item.name}</h3>
                <p class="description">${item.desc || "O melhor de Porto Velho"}</p>
                <span class="price">${formatarMoeda(item.preco)}</span>
            </div>
            <button class="add-btn" onclick="adicionarAoCarrinho('${categoria}', ${index})">
                <i class="fas fa-cart-plus"></i> Adicionar
            </button>
        `;
        menuContainer.appendChild(card);
    });
}

// --- LÓGICA DO CARRINHO ---

function adicionarAoCarrinho(cat, index) {
    const item = cardapio[cat][index];
    carrinho.push({ ...item, cartId: Date.now() + Math.random() });
    
    atualizarInterface();
    salvarDados();
    mostrarToast(`${item.name} no carrinho!`);
}

function removerDoCarrinho(cartId) {
    carrinho = carrinho.filter(item => item.cartId !== cartId);
    atualizarInterface();
    salvarDados();
}

function aplicarCupom() {
    const input = document.getElementById('cupom');
    const btn = document.querySelector('.apply-btn');
    const codigo = input.value.toUpperCase().trim();

    if (CUPONS_VALIDOS[codigo]) {
        descontoPercentual = CUPONS_VALIDOS[codigo];
        cupomAtivo = codigo;
        
        btn.innerHTML = "✅ Ativo";
        btn.style.background = "#25d366";
        input.disabled = true;
        
        atualizarInterface();
        mostrarToast(`Cupom ${codigo} aplicado!`);
    } else {
        mostrarToast("Cupom inválido! ❌");
        input.value = "";
    }
}

function atualizarInterface() {
    const cartList = document.getElementById("cartItems");
    const subtotalElement = document.getElementById("subtotalValue");
    const totalElement = document.getElementById("totalValue");
    const countElement = document.getElementById("cartCount");
    const fabLabel = document.getElementById("cartFabTotal");

    if (!cartList) return;

    cartList.innerHTML = "";
    let subtotal = 0;

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item-row";
        div.innerHTML = `
            <div class="details">
                <p class="name">${item.name}</p>
                <p class="price-sm">${formatarMoeda(item.preco)}</p>
            </div>
            <button onclick="removerDoCarrinho(${item.cartId})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartList.appendChild(div);
        subtotal += item.preco;
    });

    const valorDesconto = (subtotal * descontoPercentual) / 100;
    const totalFinal = subtotal - valorDesconto;

    if (countElement) countElement.innerText = carrinho.length;
    if (subtotalElement) subtotalElement.innerText = formatarMoeda(subtotal);
    if (totalElement) totalElement.innerText = formatarMoeda(totalFinal);
    if (fabLabel) fabLabel.innerText = formatarMoeda(totalFinal);
}

function salvarDados() {
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
}

// --- STATUS E FEEDBACK ---

function mostrarToast(msg) {
    const toast = document.createElement("div");
    toast.className = "toast-elite";
    toast.style.cssText = `
        position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
        background: var(--gradient-glow); color: white; padding: 12px 25px;
        border-radius: 50px; z-index: 4000; font-weight: 600; font-size: 14px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px);
        animation: fadeInUp 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-hamburger"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function gerenciarStatus() {
    const dot = document.getElementById("statusLabel");
    const text = document.getElementById("statusText");
    const timer = document.getElementById("statusTimer");
    
    const agora = new Date();
    const hora = agora.getHours();
    const dia = agora.getDay();
    
    // Aberto Terça (2) a Domingo (0), das 18h às 00h (PVH)
    const estaAberto = (dia !== 1 && hora >= 18 && hora < 24);
    
    if (dot && text) {
        dot.className = estaAberto ? "status-dot online" : "status-dot offline";
        text.innerText = estaAberto ? "Aberto Agora" : "Fechado no momento";
        if (timer) timer.innerText = estaAberto ? "Peça o seu agora!" : "Abrimos às 18:00";
    }
}

// --- CHECKOUT WHATSAPP ---

function checkout() {
    if (carrinho.length === 0) {
        mostrarToast("Seu carrinho está vazio!");
        return;
    }

    let subtotal = carrinho.reduce((acc, item) => acc + item.preco, 0);
    let valorDesconto = (subtotal * descontoPercentual) / 100;
    let totalFinal = subtotal - valorDesconto;

    let msg = "*🍔 NOVO PEDIDO - BENIS BURGUER*%0A";
    msg += "------------------------------%0A";
    
    carrinho.forEach(item => {
        msg += `▪️ *${item.name}* (${formatarMoeda(item.preco)})%0A`;
    });
    
    msg += "------------------------------%0A";
    msg += `*Subtotal:* ${formatarMoeda(subtotal)}%0A`;
    if(cupomAtivo) msg += `*Cupom:* ${cupomAtivo} (-${descontoPercentual}%)%0A`;
    msg += `*TOTAL: ${formatarMoeda(totalFinal)}*%0A%0A`;
    msg += "📍 _Vou enviar minha localização a seguir..._";

    window.open(`https://wa.me/556993668336?text=${msg}`, "_blank");
}

// --- INICIALIZAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    // Evento de clique na Navbar
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const categoria = btn.getAttribute('data-cat') || btn.getAttribute('data-category');
            mostrarCategoria(categoria);
        });
    });

    // Evento do botão de Cupom
    const btnCupom = document.querySelector('.apply-btn');
    if(btnCupom) btnCupom.onclick = aplicarCupom;

    mostrarCategoria("hamburguer");
    atualizarInterface();
    gerenciarStatus();
    
    // Timer para o Loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1200);
});
