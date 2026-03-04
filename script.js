const API_URL = "https://benis-backend.onrender.com"

let currentUser = JSON.parse(localStorage.getItem("user"))
let cart = []
let currentProduct = null

/* ================= PRODUTOS ================= */

const products = [
{category:"lanches",name:"X-Burger",price:13,description:"Clássico tradicional"},
{category:"lanches",name:"X-Tudo",price:23,description:"Completo especial"},
{category:"lanches",name:"X-Benis",price:26,description:"Premium da casa"},
{category:"porcoes",name:"Batata Frita",price:15,description:"Porção crocante"},
{category:"bebidas",name:"Coca Cola 2L",price:15,description:"Refrigerante 2L"}
]

const adicionais = [
{name:"Bacon Extra",price:3},
{name:"Cheddar",price:4},
{name:"Catupiry",price:4},
{name:"Ovo",price:2}
]

const container = document.getElementById("products")

/* ================= RENDER ================= */

function renderProducts(){
container.innerHTML=""

products.forEach(p=>{
container.innerHTML+=`
<div class="card">
<h3>${p.name}</h3>
<small>${p.description}</small>
<p>R$ ${p.price.toFixed(2)}</p>
<button onclick="openProduct('${p.name}',${p.price})">
Personalizar
</button>
</div>`
})
}

renderProducts()

/* ================= MODAL PRODUTO ================= */

function openProduct(name,price){
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
<div>${extrasHTML}</div>
<label>Quantidade:
<input type="number" id="qty" value="1" min="1">
</label>
<button onclick="addProductToCart()">Adicionar</button>
<button class="close" onclick="closeProduct()">Cancelar</button>
</div>
</div>
`)
}

function closeProduct(){
document.getElementById("product-modal").remove()
}

function addProductToCart(){
let qty = parseInt(document.getElementById("qty").value)
let selected = document.querySelectorAll("#product-modal input[type=checkbox]:checked")

let extras=[]
let extraTotal=0

selected.forEach(s=>{
extras.push({name:s.value,price:Number(s.dataset.price)})
extraTotal+=Number(s.dataset.price)
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

/* ================= CARRINHO ================= */

function updateCart(){
const items=document.getElementById("cart-items")
items.innerHTML=""
let total=0

cart.forEach((item,index)=>{
let extrasText = item.extras.map(e=>e.name).join(", ")
let itemTotal = (item.price + item.extras.reduce((s,e)=>s+e.price,0)) * item.quantity
total+=itemTotal

items.innerHTML+=`
<div class="cart-item">
<div>
<p><strong>${item.name}</strong></p>
<small>${extrasText}</small>
<p>Qtd: ${item.quantity}</p>
</div>
<p>R$ ${itemTotal.toFixed(2)}</p>
<button onclick="removeItem(${index})">❌</button>
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

/* ================= LOGIN MODAL ================= */

function openLogin(){
document.getElementById("login-modal").style.display="flex"
}

function closeLogin(){
document.getElementById("login-modal").style.display="none"
}

async function handleAuth(){
const name=document.getElementById("auth-name").value
const email=document.getElementById("auth-email").value
const password=document.getElementById("auth-pass").value

if(!email||!password)return alert("Preencha os campos")

let res=await fetch(`${API_URL}/register`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,email,password})
})

let user=await res.json()
currentUser=user
localStorage.setItem("user",JSON.stringify(user))

document.getElementById("user-info").innerText="Olá, "+user.name
closeLogin()
}

/* ================= ENDEREÇO COM CEP ================= */

function openAddress(){
document.getElementById("address-modal").style.display="flex"
}

function closeAddress(){
document.getElementById("address-modal").style.display="none"
}

document.addEventListener("blur",async e=>{
if(e.target.id==="cep"){
let cep=e.target.value.replace(/\D/g,'')
if(cep.length===8){
let res=await fetch(`https://viacep.com.br/ws/${cep}/json/`)
let data=await res.json()
document.getElementById("rua").value=data.logradouro
document.getElementById("bairro").value=data.bairro
document.getElementById("cidade").value=data.localidade
}
}
},true)

async function saveAddress(){
if(!currentUser){
alert("Faça login primeiro")
return
}

currentUser.address={
rua:rua.value,
bairro:bairro.value,
cidade:cidade.value,
numero:numero.value
}

localStorage.setItem("user",JSON.stringify(currentUser))
closeAddress()
alert("Endereço salvo!")
}

/* ================= CHECKOUT ================= */

async function checkout(){

if(cart.length===0){
alert("Carrinho vazio")
return
}

if(!currentUser){
openLogin()
return
}

let total=0
cart.forEach(item=>{
total+=(item.price+item.extras.reduce((s,e)=>s+e.price,0))*item.quantity
})

const order={
userId:currentUser._id,
items:cart,
total,
status:"Recebido",
address:currentUser.address
}

await fetch(`${API_URL}/orders`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(order)
})

alert("Pedido enviado!")
cart=[]
updateCart()
}
