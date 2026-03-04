const API_URL = "https://benis-backend.onrender.com"

const phone="5569993668336"

const phone = "5569993668336"

const products = [

/* ================= LANCHES ================= */

{
category:"lanches",
name:"Misto Quente",
price:7,
description:"Pão, queijo e presunto"
},
{
category:"lanches",
name:"X-Bauru",
price:8,
description:"Pão, queijo, presunto, alface e tomate"
},
{
category:"lanches",
name:"X-Burger",
price:13,
description:"Pão, hambúrguer, queijo, presunto, alface, tomate, milho e batata"
},
{
category:"lanches",
name:"X-Salada",
price:14,
description:"Pão, hambúrguer, ovo, queijo, presunto, alface, tomate, milho e batata"
},
{
category:"lanches",
name:"X-Salada Especial",
price:17,
description:"Pão, hambúrguer, ovo, salsicha, banana, catupiry, queijo, presunto, alface, tomate, milho e batata"
},
{
category:"lanches",
name:"X-Calabresa",
price:18,
description:"Pão, hambúrguer, calabresa, ovo, queijo, presunto, milho e batata"
},
{
category:"lanches",
name:"X-Bacon",
price:19,
description:"Pão, hambúrguer, bacon, ovo, queijo, presunto, alface, tomate, milho e batata"
},
{
category:"lanches",
name:"X-Franbacon",
price:20,
description:"Pão, frango, bacon, ovo, banana, queijo, presunto, alface, tomate, milho e batata"
},
{
category:"lanches",
name:"X-Franbesa",
price:20,
description:"Pão, frango, calabresa, ovo, banana, queijo, presunto, alface, tomate, milho e batata"
},
{
category:"lanches",
name:"X-Frango",
price:18,
description:"Pão, filé de frango, ovo, queijo, presunto, alface, tomate, milho e batata"
},
{
category:"lanches",
name:"X-Turbinado",
price:20,
description:"Pão, 2 hambúrgueres, 2 ovos, 2 queijos, 2 presuntos, alface, tomate, batata e milho"
},
{
category:"lanches",
name:"X-Bagunça",
price:20,
description:"Pão, hambúrguer, calabresa, bacon, ovo, banana, queijo, presunto, alface, tomate, milho e batata"
},
{
category:"lanches",
name:"X-Tudo",
price:23,
description:"Pão, hambúrguer, frango, calabresa, bacon, salsicha, banana, catupiry, queijo, presunto, alface, tomate, milho e batata"
},
{
category:"lanches",
name:"X-Havaiano",
price:19,
description:"Pão, hambúrguer, banana, abacaxi, cheddar, queijo, presunto, alface, tomate, cebola caramelizada, milho e batata"
},
{
category:"lanches",
name:"X-Benis",
price:26,
description:"Pão, hambúrguer, frango, calabresa, bacon, salsicha, banana, abacaxi, cheddar, cebola caramelizada, queijo, presunto, alface, tomate, milho e batata"
},

/* ================= PORÇÕES ================= */

{
category:"porcoes",
name:"Batata Frita",
price:15,
description:"Porção tradicional crocante"
},
{
category:"porcoes",
name:"Batata + Cheddar + Bacon",
price:25,
description:"Batata frita com cheddar e bacon"
},

/* ================= ADICIONAIS ================= */

{category:"adicionais", name:"Hambúrguer Extra", price:5, description:"Adicional hambúrguer"},
{category:"adicionais", name:"Frango Extra", price:3, description:"Adicional frango"},
{category:"adicionais", name:"Ovo", price:2, description:"Adicional ovo"},
{category:"adicionais", name:"Bacon Extra", price:3, description:"Adicional bacon"},
{category:"adicionais", name:"Calabresa", price:3, description:"Adicional calabresa"},
{category:"adicionais", name:"Salsicha", price:2, description:"Adicional salsicha"},
{category:"adicionais", name:"Banana", price:2, description:"Adicional banana"},
{category:"adicionais", name:"Abacaxi", price:3, description:"Adicional abacaxi"},
{category:"adicionais", name:"Cheddar", price:4, description:"Adicional cheddar"},
{category:"adicionais", name:"Catupiry", price:4, description:"Adicional catupiry"},
{category:"adicionais", name:"Cebola Caramelizada", price:3, description:"Adicional cebola caramelizada"},
{category:"adicionais", name:"Queijo e Presunto", price:2, description:"Adicional queijo e presunto"},

/* ================= BEBIDAS ================= */

{category:"bebidas", name:"Coca Cola 2L", price:15, description:"Refrigerante 2 litros"},
{category:"bebidas", name:"Coca Cola 1L", price:10, description:"Refrigerante 1 litro"},
{category:"bebidas", name:"Tuchaua 2L", price:9, description:"Refrigerante 2 litros"},
{category:"bebidas", name:"Dydyo 2L", price:9, description:"Refrigerante 2 litros"},
{category:"bebidas", name:"Coca Cola Lata", price:7, description:"Refrigerante lata 350ml"}

]

let cart = []
const container = document.getElementById("products")

function renderProducts(list){
container.innerHTML=""
list.forEach(p=>{
container.innerHTML+=`
<div class="card">
<h3>${p.name}</h3>
<small>${p.description}</small>
<p>R$ ${p.price.toFixed(2)}</p>
<button onclick="addToCart('${p.name}',${p.price})">Adicionar</button>
</div>`
})
}

function filterCategory(cat){
renderProducts(products.filter(p=>p.category===cat))
}

function addToCart(name,price){
cart.push({name,price})
updateCart()
}

function updateCart(){
document.getElementById("cart-count").innerText=cart.length
const items=document.getElementById("cart-items")
items.innerHTML=""
let total=0
cart.forEach(i=>{
total+=i.price
items.innerHTML+=`<p>${i.name} - R$ ${i.price.toFixed(2)}</p>`
})
document.getElementById("total").innerText=total.toFixed(2)
}

function toggleCart(){
document.getElementById("cart-panel").classList.toggle("active")
}

function checkout(){
if(cart.length===0){alert("Carrinho vazio");return}
let msg="🍔 Pedido Benis Burguer:%0A"
let total=0
cart.forEach(i=>{
msg+=`${i.name} - R$ ${i.price.toFixed(2)}%0A`
total+=i.price
})
msg+=`%0ATotal: R$ ${total.toFixed(2)}`
window.open(`https://wa.me/${phone}?text=${msg}`)
}

renderProducts(products.filter(p=>p.category==="lanches"))
