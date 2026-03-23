/**
 * BENIS BURGUER - Gourmet Logic Engine v4.8.2 (Stable)
 * Sincronizado com: HTML/CSS v4.5 (Dark Mode Premium)
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

let carrinho = JSON.parse(localStorage.getItem('benis_cart')) || [];
let descontoPercentual = 0;
let cupomAtivo = "";

const CUPONS_VALIDOS = { "BENIS10": 10, "APONIA": 15, "PRIMEIRACOMPRA": 5 };

const formatarMoeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- RENDERIZAÇÃO DO MENU ---

function mostrarCategoria(categoria) {
    const menuContainer = document.getElementById("menu");
    if (!menuContainer) return;

    // Efeito de transição suave
    menuContainer.style.opacity = "0";
    menuContainer.style.transform = "translateY(10px)";

    setTimeout(() => {
        menuContainer.innerHTML = "";
        
        // Atualiza botões de abas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-cat') === categoria);
        });

        cardapio[categoria].forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "card-item";
            card.innerHTML = `
                <div class="card-image-box">
                    <img src="img/${item.img}" alt="${item.name}" onerror="this.src='logo.png'">
                </div>
                <div class="card-info">
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                    <span class="price-tag">${formatarMoeda(item.preco)}</span>
                </div>
                <button class="add-btn" onclick="adicionarAoCarrinho('${categoria}', ${index}, event)">
                    <i class="fas fa-plus"></i> ADICIONAR
                </button>
            `;
            menuContainer.appendChild(card);
        });

        menuContainer.style.opacity = "1";
        menuContainer.style.transform = "translateY(0)";
    }, 250);
}

// --- GERENCIAMENTO DO CARRINHO ---

function atualizarInterface() {
    const cartList = document.getElementById("cartItems");
    const totalElement = document.getElementById("totalValue");
    const countElement = document.getElementById("cartCount");
    const fabTotal = document.getElementById("cartFabTotal");
    const fabContainer = document.getElementById("cartToggle");

    if (!cartList) return;

    if (carrinho.length === 0) {
        cartList.innerHTML = `<div style="text-align:center; padding: 50px 20px; opacity: 0.3;">
            <i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 10px;"></i>
            <p>Sua sacola está vazia.</p>
        </div>`;
        if (fabContainer) fabContainer.classList.remove('active');
    } else {
        cartList.innerHTML = "";
        carrinho.forEach(item => {
            const div = document.createElement("div");
            div.className = "cart-item-elite";
            div.innerHTML = `
                <div>
                    <strong style="display:block;">${item.name}</strong>
                    <span style="color:var(--primary); font-weight:600;">${formatarMoeda(item.preco)}</span>
                </div>
                <button onclick="removerDoCarrinho(${item.cartId})" style="background:none; border:none; color:var(--danger); cursor:pointer; padding: 10px;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            cartList.appendChild(div);
        });
        if (fabContainer) fabContainer.classList.add('active');
    }

    const subtotal = carrinho.reduce((acc, i) => acc + i.preco, 0);
    const valorDesconto = subtotal * (descontoPercentual / 100);
    const totalFinal = subtotal - valorDesconto;

    if (countElement) countElement.innerText = carrinho.length;
    if (totalElement) totalElement.innerText = formatarMoeda(totalFinal);
    if (fabTotal) fabTotal.innerText = `Ver sacola (${formatarMoeda(totalFinal)})`;
}

function adicionarAoCarrinho(cat, index, event) {
    const item = cardapio[cat][index];
    const btn = event.currentTarget;

    // Feedback Visual
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> OK!';
    btn.style.background = "#22c55e";
    
    const novoItem = { 
        ...item, 
        cartId: Date.now() + Math.random() 
    };

    carrinho.push(novoItem);
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
    atualizarInterface();

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = "";
    }, 800);
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(i => i.cartId !== id);
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
    atualizarInterface();
}

function toggleCarrinho() {
    const panel = document.getElementById("cartPanel");
    if (panel) panel.classList.toggle("open");
}

function aplicarCupom() {
    const input = document.getElementById('cupom');
    const btn = document.querySelector('.input-group-glass button');
    if (!input) return;

    const codigo = input.value.toUpperCase().trim();

    if (CUPONS_VALIDOS[codigo]) {
        descontoPercentual = CUPONS_VALIDOS[codigo];
        cupomAtivo = codigo;
        input.style.borderColor = "#22c55e";
        if (btn) btn.innerHTML = '<i class="fas fa-check"></i>';
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

// --- STATUS E FINALIZAÇÃO ---

function verificarStatusLoja() {
    const dot = document.getElementById("statusLabel");
    const text = document.getElementById("statusText");
    
    const agora = new Date();
    const hora = agora.getHours();
    const dia = agora.getDay(); // 0 = Domingo, 1 = Segunda...

    // Aberto Terça a Domingo, 18h às 00h
    const aberto = (dia !== 1 && hora >= 18 && hora < 24);

    if (dot && text) {
        dot.className = aberto ? "status-dot online" : "status-dot";
        text.innerText = aberto ? "Aceitando Pedidos" : "Fechado no momento";
    }
}

function checkout() {
    if (carrinho.length === 0) return;

    const subtotal = carrinho.reduce((acc, i) => acc + i.preco, 0);
    const valorDesconto = subtotal * (descontoPercentual / 100);
    const totalFinal = subtotal - valorDesconto;
    
    let msg = "*🍔 NOVO PEDIDO - BENIS BURGUER*%0A━━━━━━━━━━━━━━━━━━━━%0A";
    
    carrinho.forEach((item, i) => {
        msg += `*${i + 1}.* ${item.name} _(${formatarMoeda(item.preco)})_%0A`;
    });

    msg += "━━━━━━━━━━━━━━━━━━━━%0A";
    if (cupomAtivo) msg += `*Cupom:* ${cupomAtivo} (-${descontoPercentual}%)%0A`;
    msg += `*TOTAL: ${formatarMoeda(totalFinal)}*%0A%0A📍 *Endereço de entrega:*%0A💰 *Forma de pagamento:*`;

    // Número de Porto Velho configurado conforme solicitado
    window.open(`https://wa.me/556993668336?text=${msg}`, "_blank");
}

// --- INICIALIZAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    // Configura eventos das abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => mostrarCategoria(btn.dataset.cat));
    });

    verificarStatusLoja();
    atualizarInterface();
    mostrarCategoria("hamburguer");
});
