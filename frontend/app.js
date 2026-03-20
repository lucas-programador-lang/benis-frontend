/**
 * BENIS BURGUER - Elite Logic Engine v4.0
 * Módulo: UI Dinâmica & Checkout WhatsApp
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
        { id: 301, name: "Hambúrguer Extra", preco: 5.00 },
        { id: 302, name: "Cheddar", preco: 4.00 },
        { id: 303, name: "Bacon", preco: 3.00 },
        { id: 304, name: "Cebola Caramelizada", preco: 3.00 }
    ]
};

let carrinho = JSON.parse(localStorage.getItem('benis_cart')) || [];
const menuContainer = document.getElementById("menu");

const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function toggleCarrinho() {
    const panel = document.getElementById("cartPanel");
    panel.classList.toggle("open");
}

function mostrarCategoria(categoria) {
    menuContainer.innerHTML = "";
    
    // Atualiza botões ativos
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('data-cat') === categoria) btn.classList.add('active');
    });

    cardapio[categoria].forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card-item";
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="card-info">
                <h3>${item.name}</h3>
                <p class="description">${item.desc || "Adicional para seu Benis"}</p>
                <span class="price">${formatarMoeda(item.preco)}</span>
            </div>
            <button class="add-btn" onclick="adicionarAoCarrinho('${categoria}', ${index})">
                <i class="fas fa-cart-plus"></i> Adicionar
            </button>
        `;
        menuContainer.appendChild(card);
    });
}

function adicionarAoCarrinho(cat, index) {
    const item = cardapio[cat][index];
    carrinho.push({ ...item, cartId: Date.now() });
    
    atualizarInterface();
    salvarDados();
    mostrarToast(`${item.name} no carrinho!`);
}

function removerDoCarrinho(cartId) {
    carrinho = carrinho.filter(item => item.cartId !== cartId);
    atualizarInterface();
    salvarDados();
}

function atualizarInterface() {
    const cartList = document.getElementById("cartItems");
    const totalElement = document.getElementById("totalValue");
    const subtotalElement = document.getElementById("subtotalValue");
    const countElement = document.getElementById("cartCount");
    const fabLabel = document.querySelector(".cart-fab-label");

    cartList.innerHTML = "";
    let total = 0;

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item-row";
        div.innerHTML = `
            <div class="details">
                <p class="name">${item.name}</p>
                <p class="price-sm">${formatarMoeda(item.preco)}</p>
            </div>
            <button class="del-btn" onclick="removerDoCarrinho(${item.cartId})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartList.appendChild(div);
        total += item.preco;
    });

    countElement.innerText = carrinho.length;
    totalElement.innerText = formatarMoeda(total);
    if(subtotalElement) subtotalElement.innerText = formatarMoeda(total);
    if(fabLabel) fabLabel.innerText = formatarMoeda(total);
}

function salvarDados() {
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
}

function mostrarToast(msg) {
    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function gerenciarStatus() {
    const dot = document.getElementById("statusLabel");
    const text = document.getElementById("statusText");
    
    const agora = new Date();
    const hora = agora.getHours();
    const dia = agora.getDay();
    
    // Aberto Terça (2) a Domingo (0), das 18h às 00h
    const estaAberto = (dia !== 1 && hora >= 18 && hora < 24);
    
    if (dot && text) {
        dot.className = estaAberto ? "status-dot online" : "status-dot offline";
        text.innerText = estaAberto ? "Aberto Agora" : "Fechado no momento";
    }
}

function checkout() {
    if (carrinho.length === 0) return mostrarToast("O carrinho está vazio!");

    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    let msg = "*NOVO PEDIDO - BENIS BURGUER*%0A";
    msg += "------------------------------%0A";
    
    carrinho.forEach(item => {
        msg += `▪️ *${item.name}* (${formatarMoeda(item.preco)})%0A`;
    });
    
    msg += "------------------------------%0A";
    msg += `*TOTAL: ${formatarMoeda(total)}*%0A%0A`;
    msg += "📍 _Por favor, envie sua localização abaixo._";

    window.open(`https://wa.me/556993668336?text=${msg}`, "_blank");
}

document.addEventListener('DOMContentLoaded', () => {
    // Configura botões de categorias
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => mostrarCategoria(btn.getAttribute('data-cat'));
    });

    mostrarCategoria("hamburguer");
    atualizarInterface();
    gerenciarStatus();
    
    // Loader fake para dar charme
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
    }, 1000);
});
