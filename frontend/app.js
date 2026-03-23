/**
 * BENIS BURGUER - Elite Logic Engine v4.2.1
 * Módulo: UI Dinâmica, Sistema de Cupons & Checkout WhatsApp
 * Local: Porto Velho - RO
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
    adicionais: [
        { id: 301, name: "Hambúrguer Extra", preco: 5.00, desc: "Turbine seu pedido.", img: "extra-meat.png" },
        { id: 302, name: "Cheddar", preco: 4.00, desc: "Cremosidade extra.", img: "extra-cheddar.png" },
        { id: 303, name: "Bacon", preco: 3.00, desc: "Crocância máxima.", img: "extra-bacon.png" },
        { id: 304, name: "Cebola Caramelizada", preco: 3.00, desc: "Toque agridoce.", img: "extra-onion.png" }
    ]
};

// --- ESTADO GLOBAL ---
let carrinho = JSON.parse(localStorage.getItem('benis_cart')) || [];
let descontoPercentual = 0;
let cupomAtivo = "";

const CUPONS_VALIDOS = {
    "PRIMEIRACOMPRA": 10,
    "BENIS15": 15,
    "PORTOWEST": 5
};

// --- UTILITÁRIOS ---
const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- INTERFACE ---

function toggleCarrinho() {
    const panel = document.getElementById("cartPanel");
    const overlay = document.getElementById("cartOverlay");
    if (panel) panel.classList.toggle("open");
    if (overlay) overlay.classList.toggle("active");
}

function mostrarCategoria(categoria) {
    const menuContainer = document.getElementById("menu");
    if (!menuContainer) return;

    menuContainer.style.opacity = "0";
    
    setTimeout(() => {
        menuContainer.innerHTML = "";
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const catAttr = btn.getAttribute('data-cat');
            btn.classList.toggle('active', catAttr === categoria);
        });

        cardapio[categoria].forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "card-item";
            
            card.innerHTML = `
                <div class="card-image-box">
                    <img src="img/${item.img || 'default.png'}" alt="${item.name}" onerror="this.src='logo.png'">
                </div>
                <div class="card-info">
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                    <div class="card-footer">
                        <span class="price-tag">${formatarMoeda(item.preco)}</span>
                    </div>
                </div>
                <button class="add-btn" onclick="adicionarAoCarrinho('${categoria}', ${index}, event)">
                    <i class="fas fa-plus"></i> Adicionar
                </button>
            `;
            menuContainer.appendChild(card);
        });
        menuContainer.style.opacity = "1";
    }, 200);
}

// --- LÓGICA DO CARRINHO ---

function adicionarAoCarrinho(cat, index, event) {
    const item = cardapio[cat][index];
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-check"></i> Adicionado';
    btn.style.background = "#25d366";
    
    carrinho.push({ 
        ...item, 
        cartId: Date.now() + Math.random(),
        timestamp: new Date()
    });
    
    atualizarInterface();
    salvarDados();
    mostrarToast(`${item.name} adicionado!`);

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = "";
    }, 1000);
}

function removerDoCarrinho(cartId) {
    carrinho = carrinho.filter(item => item.cartId !== cartId);
    atualizarInterface();
    salvarDados();
}

function aplicarCupom() {
    const input = document.getElementById('cupom');
    const btn = document.getElementById('btnAplicarCupom');
    if (!input) return;

    const codigo = input.value.toUpperCase().trim();

    if (CUPONS_VALIDOS[codigo]) {
        descontoPercentual = CUPONS_VALIDOS[codigo];
        cupomAtivo = codigo;
        
        btn.innerHTML = `<i class="fas fa-check"></i> ${descontoPercentual}%`;
        btn.style.background = "#22c55e";
        input.disabled = true;
        
        atualizarInterface();
        mostrarToast(`Desconto de ${descontoPercentual}% aplicado! 🏷️`);
    } else {
        input.classList.add('error-shake');
        mostrarToast("Cupom inválido! ❌");
        setTimeout(() => input.classList.remove('error-shake'), 500);
    }
}

function atualizarInterface() {
    const cartList = document.getElementById("cartItems");
    const totalElement = document.getElementById("totalValue");
    const countElement = document.getElementById("cartCount");
    const fabTotal = document.getElementById("cartFabTotal");

    if (!cartList) return;

    if (carrinho.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fas fa-shopping-basket"></i>
                <p>O que vamos comer hoje?</p>
            </div>`;
    } else {
        cartList.innerHTML = "";
        carrinho.forEach(item => {
            const div = document.createElement("div");
            div.className = "cart-item-elite"; // Classe corrigida para bater com o CSS
            div.innerHTML = `
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <span>${formatarMoeda(item.preco)}</span>
                </div>
                <button class="btn-remove-item" onclick="removerDoCarrinho(${item.cartId})" aria-label="Remover item">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartList.appendChild(div);
        });
    }

    const subtotal = carrinho.reduce((acc, i) => acc + i.preco, 0);
    const valorDesconto = (subtotal * descontoPercentual) / 100;
    const totalFinal = subtotal - valorDesconto;

    if (countElement) countElement.innerText = carrinho.length;
    if (totalElement) totalElement.innerText = formatarMoeda(totalFinal);
    if (fabTotal) fabTotal.innerText = formatarMoeda(totalFinal);
    
    const fab = document.getElementById("cartToggle");
    if (fab) {
        if (carrinho.length > 0) fab.style.display = "flex";
    }
}

function salvarDados() {
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
}

// --- FEEDBACK E STATUS ---

function mostrarToast(msg) {
    const existing = document.querySelector('.toast-elite');
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast-elite";
    toast.style.position = "fixed";
    toast.style.bottom = "120px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "rgba(0,0,0,0.8)";
    toast.style.backdropFilter = "blur(10px)";
    toast.style.color = "white";
    toast.style.padding = "12px 25px";
    toast.style.borderRadius = "100px";
    toast.style.zIndex = "3000";
    toast.style.fontSize = "14px";
    toast.style.border = "1px solid rgba(255,255,255,0.1)";

    toast.innerHTML = `<i class="fas fa-fire" style="color: #ff8c00; margin-right: 8px;"></i> ${msg}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function verificarStatusLoja() {
    const dot = document.getElementById("statusLabel");
    const text = document.getElementById("statusText");
    const timer = document.getElementById("statusTimer");
    
    const agora = new Date();
    const hora = agora.getHours();
    const dia = agora.getDay();
    
    // Aberto de Terça (2) a Domingo (0), 18h às 00h (Porto Velho Time)
    const estaAberto = (dia !== 1 && hora >= 18 && hora < 24);
    
    if (dot && text) {
        dot.className = estaAberto ? "status-dot online" : "status-dot offline";
        text.innerText = estaAberto ? "Aceitando Pedidos" : "Restaurante Fechado";
        if (timer) timer.innerText = estaAberto ? "Entrega estimada: 30-50 min" : "Abrimos às 18:00";
    }
}

// --- CHECKOUT ---

function checkout() {
    if (carrinho.length === 0) {
        mostrarToast("Adicione algo gostoso primeiro! 😋");
        return;
    }

    const subtotal = carrinho.reduce((acc, i) => acc + i.preco, 0);
    const totalFinal = subtotal - (subtotal * descontoPercentual / 100);

    let msg = "*🍔 NOVO PEDIDO - BENIS BURGUER*%0A";
    msg += "━━━━━━━━━━━━━━━━━━━━%0A";
    
    carrinho.forEach((item, index) => {
        msg += `*${index + 1}.* ${item.name} _(${formatarMoeda(item.preco)})_%0A`;
    });
    
    msg += "━━━━━━━━━━━━━━━━━━━━%0A";
    if (cupomAtivo) msg += `*Cupom:* ${cupomAtivo} (-${descontoPercentual}%)%0A`;
    msg += `*TOTAL: ${formatarMoeda(totalFinal)}*%0A%0A`;
    msg += "📍 _Vou enviar meu endereço e forma de pagamento abaixo..._";

    const fone = "556993668336";
    window.open(`https://wa.me/${fone}?text=${msg}`, "_blank");
}

// --- INIT ---

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => mostrarCategoria(btn.dataset.cat));
    });

    verificarStatusLoja();
    atualizarInterface();
    mostrarCategoria("hamburguer");
});
