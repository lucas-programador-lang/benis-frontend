/**
 * MINDSET ELITE - Ultra Visual Engine v4.0
 * Módulo: Gerenciamento de Pedidos & UI Dinâmica
 */

const cardapio = {
    hamburguer: [
        { id: 1, name: "Misto Quente", preco: 7.00, desc: "Pão de forma, presunto e queijo derretido." },
        { id: 2, name: "X-Bauru", preco: 8.00, desc: "Hambúrguer, queijo e tomate suculento." },
        { id: 3, name: "X-Burguer", preco: 13.00, desc: "Pão, blend especial e muito queijo." },
        { id: 4, name: "X-Salada", preco: 14.00, desc: "Clássico com alface, tomate e maionese." },
        { id: 13, name: "X-Tudo", preco: 23.00, desc: "O gigante: tudo que você tem direito!" },
        { id: 15, name: "X-Benis", preco: 26.00, desc: "Especial da casa com molho secreto." }
    ],
    porcoes: [
        { id: 101, name: "Batata Frita", preco: 15.00, desc: "Crocantes por fora, macias por dentro." },
        { id: 102, name: "Batata + Cheddar + Bacon", preco: 25.00, desc: "A combinação perfeita e generosa." }
    ],
    bebidas: [
        { id: 201, name: "Coca Cola 2L", preco: 15.00, desc: "Gelada tamanho família." },
        { id: 205, name: "Coca Cola Lata", preco: 7.00, desc: "Refresco ideal para sua refeição." }
    ],
    adicionais: [
        { id: 301, name: "Hambúrguer extra", preco: 5.00 },
        { id: 309, name: "Cheddar", preco: 4.00 }
    ]
};

// Estado da Aplicação
let carrinho = JSON.parse(localStorage.getItem('benis_cart')) || [];
const menuContainer = document.getElementById("menu");

// Formatador de Moeda (Brasil)
const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Alternar Painel do Carrinho
function toggleCarrinho() {
    const panel = document.getElementById("cartPanel");
    panel.classList.toggle("open");
    document.body.style.overflow = panel.classList.contains("open") ? "hidden" : "auto";
}

// Renderizar Menu com Animação de Entrada
function mostrarCategoria(categoria) {
    menuContainer.innerHTML = "";
    
    // Filtro visual de categoria ativa
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    cardapio[categoria].forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card-item"; // Classe para CSS profissional
        card.style.animationDelay = `${index * 0.05}s`; // Stagger effect
        
        card.innerHTML = `
            <div class="card-info">
                <h3>${item.name}</h3>
                <p class="description">${item.desc || "Sabor incomparável Benis Burguer"}</p>
                <span class="price">${formatarMoeda(item.preco)}</span>
            </div>
            <button class="add-btn" onclick="adicionarAoCarrinho('${categoria}', ${index})">
                <i class="fas fa-plus"></i> Adicionar
            </button>
        `;
        menuContainer.appendChild(card);
    });
}

// Lógica de Adição com Feedback Visual
function adicionarAoCarrinho(cat, index) {
    const item = cardapio[cat][index];
    carrinho.push({ ...item, cartId: Date.now() });
    
    atualizarInterface();
    salvarDados();
    
    // Notificação Toast (Substitui o alert)
    mostrarToast(`${item.name} adicionado!`);
    
    // Feedback no ícone do carrinho
    const cartIcon = document.querySelector(".cart-icon-wrapper");
    cartIcon.classList.add("bump");
    setTimeout(() => cartIcon.classList.remove("bump"), 300);
}

function removerDoCarrinho(cartId) {
    carrinho = carrinho.filter(item => item.cartId !== cartId);
    atualizarInterface();
    salvarDados();
}

function atualizarInterface() {
    const cartList = document.getElementById("cartItems");
    const totalElement = document.getElementById("totalValue");
    const countElement = document.getElementById("cartCount");
    
    cartList.innerHTML = "";
    let total = 0;

    carrinho.forEach(item => {
        const li = document.createElement("li");
        li.className = "cart-item-row";
        li.innerHTML = `
            <div class="details">
                <p class="name">${item.name}</p>
                <p class="price-sm">${formatarMoeda(item.preco)}</p>
            </div>
            <button class="del-btn" onclick="removerDoCarrinho(${item.cartId})">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        cartList.appendChild(li);
        total += item.preco;
    });

    countElement.innerText = carrinho.length;
    totalElement.innerText = formatarMoeda(total);
}

// Persistência
function salvarDados() {
    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
}

// Sistema de Notificação
function mostrarToast(msg) {
    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// Horário e Status com Contagem Regressiva Otimizada
function gerenciarStatus() {
    const statusLabel = document.getElementById("statusLabel");
    const timerLabel = document.getElementById("statusTimer");
    
    const agora = new Date();
    const hora = agora.getHours();
    const dia = agora.getDay();
    
    // Aberto Terça a Domingo, 19h às 00h
    const estaAberto = (dia !== 1 && hora >= 19 && hora < 24);
    
    statusLabel.className = estaAberto ? "status-online" : "status-offline";
    statusLabel.innerHTML = estaAberto ? "● Aberto Agora" : "● Fechado no momento";
}

// Finalização via WhatsApp Profissional
function checkout() {
    if (carrinho.length === 0) return mostrarToast("Adicione itens primeiro!");

    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    let resumo = "*NOVO PEDIDO - BENIS BURGUER*%0A%0A";
    
    carrinho.forEach(item => {
        resumo += `▪️ ${item.name} - ${formatarMoeda(item.preco)}%0A`;
    });
    
    resumo += `%0A*Total: ${formatarMoeda(total)}*`;
    resumo += `%0A%0A_Enviado via App Web Oficial_`;

    const fone = "556993668336";
    window.open(`https://wa.me/${fone}?text=${resumo}`, "_blank");
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    mostrarCategoria("hamburguer");
    atualizarInterface();
    setInterval(gerenciarStatus, 1000 * 60); // Atualiza status a cada minuto
    gerenciarStatus();
});
