/**
 * BENIS BURGUER - Gourmet Logic Engine v4.7
 * Sincronizado com: HTML v4.5 + CSS v4.5
 * Local: Bairro Aponiã, Porto Velho - RO
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

let carrinho = JSON.parse(localStorage.getItem('benis_cart')) || [];
let descontoPercentual = 0;
let cupomAtivo = "";

const CUPONS_VALIDOS = { "BENIS10": 10, "APONIA": 15, "PRIMEIRACOMPRA": 5 };

const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- RENDERIZAÇÃO DO MENU ---

function mostrarCategoria(categoria) {
    const menuContainer = document.getElementById("menu");
    if (!menuContainer) return;

    menuContainer.style.opacity = "0";
    
    setTimeout(() => {
        menuContainer.innerHTML = "";
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-cat') === categoria);
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
                    <span class="price-tag">${formatarMoeda(item.preco)}</span>
                </div>
                <button class="add-btn" onclick="adicionarAoCarrinho('${categoria}', ${index}, event)">
                    <i class="fas fa-plus"></i>
                </button>
            `;
            menuContainer.appendChild(card);
        });
        menuContainer.style.opacity = "1";
    }, 250);
}

// --- GESTÃO DO CARRINHO ---

function adicionarAoCarrinho(cat, index, event) {
    const item = cardapio[cat][index];
    const btn = event.currentTarget;
    
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = "#25d366";
    
    carrinho.push({ ...item, cartId: Date.now() + Math.random() });
    
    atualizarInterface();
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));

    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-plus"></i>';
        btn.style.background = "";
    }, 800);
}

function removerDoCarrinho(cartId) {
    carrinho = carrinho.filter(i => i.cartId !== cartId);
    atualizarInterface();
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
}

function atualizarInterface() {
    const cartList = document.getElementById("cartItems"); // O container de scroll
    const totalElement = document.getElementById("totalValue");
    const countElement = document.getElementById("cartCount");
    const fabTotal = document.getElementById("cartFabTotal");
    const fabContainer = document.getElementById("cartToggle");

    if (!cartList) return;

    if (carrinho.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
                <p>Sua sacola está vazia.</p>
            </div>`;
        if (fabContainer) fabContainer.style.transform = "translateY(150%)";
    } else {
        cartList.innerHTML = "";
        carrinho.forEach(item => {
            const div = document.createElement("div");
            div.className = "cart-item-elite";
            div.innerHTML = `
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <span>${formatarMoeda(item.preco)}</span>
                </div>
                <button class="btn-remove-item" onclick="removerDoCarrinho(${item.cartId})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartList.appendChild(div);
        });
        if (fabContainer) fabContainer.style.transform = "translateY(0)";
    }

    const subtotal = carrinho.reduce((acc, i) => acc + i.preco, 0);
    const totalFinal = subtotal - (subtotal * descontoPercentual / 100);

    if (countElement) countElement.innerText = carrinho.length;
    if (totalElement) totalElement.innerText = formatarMoeda(totalFinal);
    if (fabTotal) fabTotal.innerText = `Ver sacola (${formatarMoeda(totalFinal)})`;
}

function toggleCarrinho() {
    document.getElementById("cartPanel")?.classList.toggle("open");
}

function aplicarCupom() {
    const input = document.getElementById('cupom');
    const btn = document.getElementById('btnAplicarCupom');
    const codigo = input.value.toUpperCase().trim();

    if (CUPONS_VALIDOS[codigo]) {
        descontoPercentual = CUPONS_VALIDOS[codigo];
        cupomAtivo = codigo;
        btn.innerHTML = `<i class="fas fa-check"></i> ${descontoPercentual}%`;
        btn.style.background = "#22c55e";
        input.disabled = true;
        atualizarInterface();
    } else {
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 500);
    }
}

// --- STATUS DA LOJA ---

function verificarStatusLoja() {
    const dot = document.getElementById("statusLabel");
    const text = document.getElementById("statusText");
    const timer = document.getElementById("statusTimer");
    
    const agora = new Date();
    const hora = agora.getHours();
    const dia = agora.getDay(); // 0 = Domingo, 1 = Segunda...

    // Aberto de Terça a Domingo, das 18h às 23:59h
    const estaAberto = (dia !== 1 && hora >= 18 && hora < 24);
    
    if (dot && text) {
        dot.className = estaAberto ? "status-dot online" : "status-dot offline";
        text.innerText = estaAberto ? "Aceitando Pedidos" : "Fechado no momento";
        if (timer) timer.innerText = estaAberto ? "Entrega estimada: 30-50 min" : "Abrimos às 18:00";
    }
}

// --- FINALIZAÇÃO ---

function checkout() {
    if (carrinho.length === 0) return;

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
    msg += "📍 *Endereço de Entrega:*%0A";
    msg += "_(Por favor, digite seu endereço aqui)_";

    window.open(`https://wa.me/556993668336?text=${msg}`, "_blank");
}

// --- INICIALIZAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    // Listeners das Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-cat');
            mostrarCategoria(cat);
        });
    });

    // Fechar carrinho ao clicar fora dele (UX Elite)
    document.addEventListener('click', (e) => {
        const panel = document.getElementById("cartPanel");
        const fab = document.getElementById("cartToggle");
        if (panel?.classList.contains('open') && !panel.contains(e.target) && !fab.contains(e.target)) {
            toggleCarrinho();
        }
    });

    verificarStatusLoja();
    atualizarInterface();
    mostrarCategoria("hamburguer");
});
