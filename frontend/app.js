/**
 * BENIS BURGUER - Gourmet Logic Engine v5.5 (Elite Edition)
 * Sincronizado com: index.html + style.css
 * Localidade: Porto Velho, RO - 2026
 */

// --- CONFIGURAÇÕES INICIAIS ---
let carrinho = [];
try {
    carrinho = JSON.parse(localStorage.getItem('benis_cart')) || [];
} catch (e) {
    carrinho = [];
}

let descontoPercentual = 0;
let cupomAtivo = "";

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

const CUPONS_VALIDOS = { "BENIS10": 10, "APONIA": 15, "PRIMEIRACOMPRA": 5 };

const formatarMoeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// --- RENDERIZAÇÃO DO MENU ---
function mostrarCategoria(categoria) {
    const grid = document.getElementById("menu");
    if (!grid) return;

    grid.style.opacity = "0";
    grid.style.transform = "translateY(10px)";

    setTimeout(() => {
        grid.innerHTML = "";
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-cat') === categoria);
        });

        const itens = cardapio[categoria] || [];
        itens.forEach((item) => {
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
                <button class="add-btn" onclick="adicionarAoCarrinho('${categoria}', ${item.id}, event)">
                    <i class="fas fa-plus"></i> ADICIONAR
                </button>
            `;
            grid.appendChild(card);
        });
        grid.style.opacity = "1";
        grid.style.transform = "translateY(0)";
    }, 200);
}

// --- LÓGICA DO CARRINHO (AGRUPADO) ---
function adicionarAoCarrinho(cat, id, event) {
    const itemOriginal = cardapio[cat].find(p => p.id === id);
    if (!itemOriginal) return;

    // Feedback visual no botão
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> OK!';
    btn.classList.add('btn-success');

    // Lógica de agrupamento: verifica se o item já existe pelo ID
    const itemNoCarrinho = carrinho.find(i => i.id === id);

    if (itemNoCarrinho) {
        itemNoCarrinho.quantidade += 1;
    } else {
        carrinho.push({ 
            ...itemOriginal, 
            quantidade: 1 
        });
    }

    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
    atualizarInterface();

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('btn-success');
    }, 800);
}

function removerDoCarrinho(id) {
    // Procura o item no carrinho
    const index = carrinho.findIndex(i => i.id === id);
    
    if (index !== -1) {
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade -= 1; // Diminui um se houver vários
        } else {
            carrinho.splice(index, 1); // Remove do array se for o último
        }
    }

    localStorage.setItem('benis_cart', JSON.stringify(carrinho));
    atualizarInterface();
}

function atualizarInterface() {
    const list = document.getElementById("cartItems");
    const totalDisplay = document.getElementById("totalValue");
    const cartCount = document.getElementById("cartCount");
    const fabTotal = document.getElementById("cartFabTotal");
    const fabContainer = document.getElementById("cartToggle");

    if (!list) return;

    list.innerHTML = carrinho.length ? "" : `
        <div style="text-align:center; padding: 40px 20px; opacity: 0.3;">
            <i class="fas fa-shopping-basket" style="font-size: 2.5rem; margin-bottom: 10px;"></i>
            <p>Sua sacola está vazia.</p>
        </div>`;

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item-elite";
        div.innerHTML = `
            <div style="flex-grow:1; text-align:left;">
                <h4 style="font-size: 0.95rem; margin-bottom: 2px; color: #fff;">${item.quantidade}x ${item.name}</h4>
                <span style="color: var(--primary); font-weight: 700;">${formatarMoeda(item.preco * item.quantidade)}</span>
            </div>
            <button class="btn-remove" onclick="removerDoCarrinho(${item.id})" title="Remover um">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        list.appendChild(div);
    });

    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    const totalFinal = subtotal * (1 - (descontoPercentual / 100));

    if (cartCount) cartCount.innerText = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
    if (totalDisplay) totalDisplay.innerText = formatarMoeda(totalFinal);
    if (fabTotal) fabTotal.innerText = `Ver sacola (${formatarMoeda(totalFinal)})`;
    
    if (fabContainer) {
        fabContainer.style.display = carrinho.length > 0 ? "flex" : "none";
    }
}

// --- CUPOM ---
function aplicarCupom() {
    const input = document.getElementById('cupom');
    if (!input) return;
    
    const codigo = input.value.toUpperCase().trim();
    if (CUPONS_VALIDOS[codigo]) {
        descontoPercentual = CUPONS_VALIDOS[codigo];
        cupomAtivo = codigo;
        input.style.borderColor = "#22c55e";
        atualizarInterface();
        alert(`Cupom ${codigo} aplicado! Você ganhou ${descontoPercentual}% de desconto.`);
    } else {
        descontoPercentual = 0;
        cupomAtivo = "";
        input.style.borderColor = "#ff4d4d";
        atualizarInterface();
    }
}

function toggleCarrinho() {
    const panel = document.getElementById("cartPanel");
    if (panel) panel.classList.toggle("open");
}

// --- UTILIDADES ---
function verificarStatus() {
    const dot = document.getElementById("statusLabel");
    const text = document.getElementById("statusText");
    const agora = new Date();
    const hora = agora.getHours();
    const dia = agora.getDay();

    const aberto = (dia !== 1 && hora >= 18 && hora < 24);

    if (dot && text) {
        dot.className = aberto ? "status-dot online" : "status-dot offline";
        text.innerText = aberto ? "Aceitando Pedidos" : "Fechado no momento";
    }
}

function inicializarMapa() {
    const mapElement = document.getElementById('mapaEntrega');
    if (!mapElement || typeof L === 'undefined') return;

    try {
        const coords = [-8.7410, -63.8745]; 
        const mapa = L.map('mapaEntrega', { 
            zoomControl: false,
            scrollWheelZoom: false 
        }).setView(coords, 16);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(mapa);
        
        const iconCustom = L.icon({ 
            iconUrl: 'logo.png', 
            iconSize: [40, 40],
            className: 'map-marker-benis' 
        });

        L.marker(coords, { icon: iconCustom }).addTo(mapa)
            .bindPopup('<b>Benis Burguer</b><br>O Brabo de PVH')
            .openPopup();
    } catch (err) {
        console.error("Erro ao carregar o mapa:", err);
    }
}

function checkout() {
    if (carrinho.length === 0) {
        alert("Sua sacola está vazia!");
        return;
    }

    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    const totalFinal = subtotal * (1 - (descontoPercentual / 100));

    let msg = "*🍔 NOVO PEDIDO - BENIS BURGUER*\n";
    msg += "━━━━━━━━━━━━━━━━━━━━\n\n";
    
    carrinho.forEach((item, index) => {
        msg += `*${item.quantidade}x* ${item.name}\n`;
        msg += `   └ _${formatarMoeda(item.preco * item.quantidade)}_\n`;
    });

    msg += "\n━━━━━━━━━━━━━━━━━━━━\n";
    if (cupomAtivo) msg += `*Cupom:* ${cupomAtivo} (-${descontoPercentual}%)\n`;
    msg += `*TOTAL: ${formatarMoeda(totalFinal)}*\n`;
    msg += "━━━━━━━━━━━━━━━━━━━━\n\n";
    msg += "📍 *Endereço de Entrega:*\n(Escreva seu endereço aqui)\n\n";
    msg += "💰 *Forma de Pagamento:*\n(Dinheiro/Pix/Cartão)";

    const fone = "556993668336";
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`, "_blank");
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. CORREÇÃO DO LOADER: Garante que ele suma
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 1500); // Tempo para a animação do loader
    }

    // Configura botões de aba
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => mostrarCategoria(btn.dataset.cat);
    });

    verificarStatus();
    atualizarInterface();
    mostrarCategoria("hamburguer");
    
    setTimeout(inicializarMapa, 2000);

    // Fecha carrinho ao clicar fora dele
    document.addEventListener('click', (e) => {
        const panel = document.getElementById("cartPanel");
        const fab = document.getElementById("cartToggle");
        if (panel && panel.classList.contains('open') && !panel.contains(e.target) && !fab.contains(e.target)) {
            toggleCarrinho();
        }
    });
});
