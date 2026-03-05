const API_URL = "https://benis-backend.onrender.com"

let token = localStorage.getItem("token")
let currentUser = JSON.parse(localStorage.getItem("user"))
let cart = []
let currentProduct = null

document.addEventListener("DOMContentLoaded", () => {
renderProducts()
updateTopUser()
loadHistory()
})

/* ================= USUÁRIO ================= */

function updateTopUser(){
const userInfo = document.getElementById("user-info")

if(userInfo && currentUser){
userInfo.innerText = "Olá, " + currentUser.name
}
}

/* ================= PRODUTOS ================= */

const products = [

/* LANCHES */

{category:"🍔 Lanches",name:"Misto Quente",price:7,description:"Queijo e presunto"},
{category:"🍔 Lanches",name:"X-Bauru",price:8,description:"Queijo e salada"},
{category:"🍔 Lanches",name:"X-Burger",price:13,description:"Clássico tradicional"},
{category:"🍔 Lanches",name:"X-Salada",price:14,description:"Com ovo"},
{category:"🍔 Lanches",name:"X-Calabresa",price:18,description:"Calabresa especial"},
{category:"🍔 Lanches",name:"X-Bacon",price:19,description:"Muito bacon"},
{category:"🍔 Lanches",name:"X-Tudo",price:23,description:"Completo"},
{category:"🍔 Lanches",name:"X-Benis",price:26,description:"Especial da casa"},

/* PORÇÕES */

{category:"🍟 Porções",name:"Batata Frita",price:15,description:"Crocante"},
{category:"🍟 Porções",name:"Batata Cheddar Bacon",price:25,description:"Cheddar + bacon"},

/* BEBIDAS */

{category:"🥤 Bebidas",name:"Coca 2L",price:15,description:"2 litros"},
{category:"🥤 Bebidas",name:"Coca Lata",price:7,description:"350ml"}

]

const adicionais = [

{name:"Bacon Extra",price:3},
{name:"Cheddar",price:4},
{name:"Catupiry",price:4},
{name:"Ovo",price:2}

]

/* ================= RENDER CARDÁPIO ================= */

function renderProducts(){

const container = document.getElementById("products")

if(!container) return

container.innerHTML=""

const categories = [...new Set(products.map(p => p.category))]

categories.forEach(cat => {

container.innerHTML += `<h2 class="category-title">${cat}</h2>`

products
.filter(p => p.category === cat)
.forEach(p => {

container.innerHTML += `

<div class="card">

<h3>${p.name}</h3>

<small>${p.description}</small>

<p>R$ ${p.price.toFixed(2)}</p>

<button onclick="openProduct('${p.name}',${p.price})">
Adicionar
</button>

</div>

`

})

})

}

/* ================= LOGIN ================= */

async function handleAuth(){

const email = document.getElementById("auth-email").value
const password = document.getElementById("auth-pass").value

if(!email || !password){
alert("Preencha email e senha")
return
}

try{

const response = await fetch(`${API_URL}/login`,{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email,password})

})

const data = await response.json()

if(data.error){
alert(data.error)
return
}

token = data.token
currentUser = data.user

localStorage.setItem("token",token)
localStorage.setItem("user",JSON.stringify(currentUser))

updateTopUser()

alert("Login realizado!")

loadHistory()

}catch(err){

alert("Erro ao conectar com servidor")

}

}

/* ================= MODAL PRODUTO ================= */

function openProduct(name,price){

if(document.getElementById("product-modal")) return

currentProduct = {name,price}

let extrasHTML = adicionais.map(a=>`

<label>

<input type="checkbox" value="${a.name}" data-price="${a.price}">

${a.name} (+R$ ${a.price})

</label>

`).join("")

document.body.insertAdjacentHTML("beforeend",`

<div class="modal-bg" id="product-modal" style="display:flex">

<div class="modal">

<h2>${name}</h2>

<p>Preço base: R$ ${price}</p>

${extrasHTML}

<label>Quantidade:

<input type="number" id="qty" value="1" min="1">

</label>

<button onclick="addProductToCart()">Adicionar ao carrinho</button>

<button class="close" onclick="closeProduct()">Cancelar</button>

</div>

</div>

`)

}

function closeProduct(){

const modal = document.getElementById("product-modal")

if(modal) modal.remove()

}

/* ================= ADICIONAR AO CARRINHO ================= */

function addProductToCart(){

let qty = parseInt(document.getElementById("qty").value)

let selected = document.querySelectorAll("#product-modal input:checked")

let extras=[]

selected.forEach(s=>{

extras.push({

name:s.value,
price:Number(s.dataset.price)

})

})

cart.push({

name:currentProduct.name,
price:currentProduct.price,
extras,
quantity:qty

})

closeProduct()

updateCart()

}

/* ================= ATUALIZA CARRINHO ================= */

function updateCart(){

const items=document.getElementById("cart-items")

if(!items) return

items.innerHTML=""

let total=0

cart.forEach((item,index)=>{

let extraTotal = item.extras.reduce((s,e)=>s+e.price,0)

let itemTotal = (item.price + extraTotal) * item.quantity

total+=itemTotal

items.innerHTML+=`

<div class="cart-item">

<div>

<strong>${item.name}</strong>

<br>

${item.quantity}x

</div>

<div>

R$ ${itemTotal.toFixed(2)}

<button onclick="removeItem(${index})">❌</button>

</div>

</div>

`

})

document.getElementById("total").innerText=total.toFixed(2)

document.getElementById("cart-count").innerText=cart.length

}

function removeItem(index){

cart.splice(index,1)

updateCart()

}

function toggleCart(){

document.getElementById("cart-panel").classList.toggle("active")

}

/* ================= CHECKOUT ================= */

async function checkout(){

if(cart.length===0){

alert("Carrinho vazio")

return

}

if(!token){

alert("Faça login antes de finalizar")

return

}

let total=0

cart.forEach(item=>{

let extraTotal=item.extras.reduce((s,e)=>s+e.price,0)

total+=(item.price+extraTotal)*item.quantity

})

const order={

items:cart,
total,
address:currentUser?.address

}

try{

const response = await fetch(`${API_URL}/orders`,{

method:"POST",

headers:{

"Content-Type":"application/json",
"Authorization":token

},

body:JSON.stringify(order)

})

if(response.status===401){

alert("Sessão expirada. Faça login novamente.")

localStorage.clear()

location.reload()

return

}

alert("Pedido enviado com sucesso!")

cart=[]

updateCart()

loadHistory()

}catch(err){

alert("Erro ao enviar pedido")

}

}

/* ================= HISTÓRICO ================= */

async function loadHistory(){

if(!token) return

try{

const response = await fetch(`${API_URL}/orders/user`,{

headers:{ "Authorization":token }

})

if(response.status!==200) return

const orders = await response.json()

const history = document.getElementById("history")

if(!history) return

history.innerHTML=""

orders.forEach(o=>{

history.innerHTML+=`

<div class="cart-item">

Pedido: R$ ${o.total.toFixed(2)}

<br>

Status: ${o.status}

</div>

`

})

}catch(err){

console.log("Erro histórico",err)

}

}
