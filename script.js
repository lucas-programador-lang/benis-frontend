const API_URL = "https://benis-backend.onrender.com"
const phone = "5569993668336"

let currentUser = JSON.parse(localStorage.getItem("user"))
let cart = []
let discount = 0
let isLogin = true

/* ================= SPLASH ================= */

window.onload = () => {
setTimeout(()=>{
document.getElementById("splash").style.display="none"
},2500)

if(currentUser){
document.getElementById("auth-screen").style.display="none"
document.getElementById("app").style.display="block"
loadHistory()
}
}

/* ================= AUTH ================= */

function toggleAuth(){
isLogin = !isLogin

document.getElementById("auth-title").innerText = isLogin ? "Login" : "Cadastro"
document.getElementById("auth-btn").innerText = isLogin ? "Entrar" : "Cadastrar"
document.getElementById("auth-name").style.display = isLogin ? "none" : "block"
document.getElementById("toggle-auth").innerText = isLogin
? "Não tem conta? Cadastre-se"
: "Já tem conta? Faça login"
}

async function handleAuth(){

const name = document.getElementById("auth-name").value
const email = document.getElementById("auth-email").value
const password = document.getElementById("auth-pass").value

if(!email || !password) return alert("Preencha todos os campos")

if(isLogin){

const res = await fetch(`${API_URL}/login`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email,password})
})

const user = await res.json()
if(user.error) return alert("Login inválido")

currentUser = user
localStorage.setItem("user",JSON.stringify(user))

}else{

if(!name) return alert("Digite seu nome")

await fetch(`${API_URL}/register`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,email,password})
})

alert("Cadastro realizado!")
toggleAuth()
return
}

document.getElementById("auth-screen").style.display="none"
document.getElementById("app").style.display="block"
loadHistory()
}

/* ================= PRODUTOS ================= */

const products = [
{category:"lanches",name:"X-Burger",price:13,description:"Clássico tradicional"},
{category:"lanches",name:"X-Tudo",price:23,description:"Completo especial"},
{category:"lanches",name:"X-Benis",price:26,description:"Nosso lanche premium"},
{category:"porcoes",name:"Batata Frita",price:15,description:"Porção crocante"},
{category:"bebidas",name:"Coca Cola 2L",price:15,description:"Refrigerante 2L"}
]

const container = document.getElementById("products")

function renderProducts(){
container.innerHTML=""
products.forEach(p=>{
container.innerHTML+=`
<div class="card">
<h3>${p.name}</h3>
<small>${p.description}</small>
<p>R$ ${p.price.toFixed(2)}</p>
<button onclick="addToCart('${p.name}',${p.price})">Adicionar</button>
</div>`
})
}

function addToCart(name,price){
cart.push({name,price})
updateCart()
}

function removeItem(index){
cart.splice(index,1)
updateCart()
}

/* ================= CUPOM ================= */

function applyCoupon(){
const code=document.getElementById("coupon").value.toUpperCase()

if(code==="BENIS10"){
discount=0.10
alert("Cupom aplicado! 10% OFF")
}else{
discount=0
alert("Cupom inválido")
}
updateCart()
}

/* ================= CARRINHO ================= */

function updateCart(){
const items=document.getElementById("cart-items")
items.innerHTML=""
let total=0

cart.forEach((i,index)=>{
total+=i.price
items.innerHTML+=`
<div class="cart-item">
<p>${i.name} - R$ ${i.price.toFixed(2)}</p>
<button onclick="removeItem(${index})">❌</button>
</div>
`
})

if(discount>0){
total = total - (total * discount)
}

document.getElementById("total").innerText = total.toFixed(2)
document.getElementById("cart-count").innerText = cart.length
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

let total=0
cart.forEach(i=> total+=i.price)

if(discount>0){
total = total - (total * discount)
}

const order = {
userId: currentUser._id,
items: cart,
total: total,
status:"Recebido"
}

await fetch(`${API_URL}/orders`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(order)
})

alert("Pedido enviado!")

cart=[]
updateCart()
loadHistory()

}

/* ================= HISTÓRICO ================= */

async function loadHistory(){

const res = await fetch(`${API_URL}/orders/user/${currentUser._id}`)
const orders = await res.json()

const historyDiv = document.getElementById("history")
historyDiv.innerHTML=""

orders.forEach(o=>{
historyDiv.innerHTML+=`
<p>
R$ ${o.total.toFixed(2)} -
${o.status}
</p>
`
})
}

renderProducts()
