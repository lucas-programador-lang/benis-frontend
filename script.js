const API_URL = "https://benis-backend.onrender.com"

const phone="5569993668336"

const products=[
{category:"lanches",name:"X-Burger",price:13},
{category:"lanches",name:"X-Salada",price:14},
{category:"lanches",name:"X-Bacon",price:19},
{category:"lanches",name:"X-Tudo",price:23},
{category:"lanches",name:"X-Benis",price:26},

{category:"porcoes",name:"Batata Frita",price:15},
{category:"porcoes",name:"Batata + Cheddar + Bacon",price:25},

{category:"bebidas",name:"Coca Cola 2L",price:15},
{category:"bebidas",name:"Coca Cola 1L",price:10},
{category:"bebidas",name:"Tuchaua 2L",price:9},
{category:"bebidas",name:"Dydyo 2L",price:9}
]

let cart=[]
const container=document.getElementById("products")

function renderProducts(list){
container.innerHTML=""
list.forEach(p=>{
container.innerHTML+=`
<div class="card">
<h3>${p.name}</h3>
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
