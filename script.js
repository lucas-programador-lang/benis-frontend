const API_URL = "https://benis-backend.onrender.com"
const phone = "5569993668336"

let currentUser = JSON.parse(localStorage.getItem("user"))
let cart = []

/* ================= PRODUTOS ================= */

const products = [

/* ================= LANCHES ================= */

{category:"lanches",name:"Misto Quente",price:7,description:"Pão, queijo e presunto"},
{category:"lanches",name:"X-Bauru",price:8,description:"Pão, queijo, presunto, alface e tomate"},
{category:"lanches",name:"X-Burger",price:13,description:"Hambúrguer tradicional completo"},
{category:"lanches",name:"X-Salada",price:14,description:"Hambúrguer com ovo e salada"},
{category:"lanches",name:"X-Salada Especial",price:17,description:"Especial com salsicha e banana"},
{category:"lanches",name:"X-Calabresa",price:18,description:"Hambúrguer com calabresa"},
{category:"lanches",name:"X-Bacon",price:19,description:"Hambúrguer com bacon crocante"},
{category:"lanches",name:"X-Frango",price:18,description:"Filé de frango completo"},
{category:"lanches",name:"X-Turbinado",price:20,description:"Duplo hambúrguer"},
{category:"lanches",name:"X-Bagunça",price:20,description:"Mistura especial da casa"},
{category:"lanches",name:"X-Tudo",price:23,description:"Completo com tudo"},
{category:"lanches",name:"X-Havaiano",price:19,description:"Com banana e abacaxi"},
{category:"lanches",name:"X-Benis",price:26,description:"O lanche premium da casa"},

/* ================= PORÇÕES ================= */

{category:"porcoes",name:"Batata Frita",price:15,description:"Porção crocante"},
{category:"porcoes",name:"Batata + Cheddar + Bacon",price:25,description:"Batata especial completa"},

/* ================= BEBIDAS ================= */

{category:"bebidas",name:"Coca Cola 2L",price:15,description:"Refrigerante 2L"},
{category:"bebidas",name:"Coca Cola 1L",price:10,description:"Refrigerante 1L"},
{category:"bebidas",name:"Tuchaua 2L",price:9,description:"Refrigerante 2L"},
{category:"bebidas",name:"Dydyo 2L",price:9,description:"Refrigerante 2L"},
{category:"bebidas",name:"Coca Cola Lata",price:7,description:"Refrigerante lata 350ml"}
]

/* ================= RENDER ================= */

const container = document.getElementById("products")

function renderProducts(){

container.innerHTML = ""

const categorias = ["lanches","porcoes","bebidas"]

categorias.forEach(cat=>{

const itens = products.filter(p=>p.category===cat)

container.innerHTML += `<h2 style="margin-top:40px;text-transform:uppercase">${cat}</h2>`

itens.forEach(p=>{
container.innerHTML += `
<div class="card">
<h3>${p.name}</h3>
<small>${p.description}</small>
<p>R$ ${p.price.toFixed(2)}</p>
<button onclick="addToCart('${p.name}',${p.price})">Adicionar</button>
</div>
`
})

})

}

/* ================= CARRINHO ================= */

function addToCart(name,price){
cart.push({name,price})
updateCart()
}

function removeItem(index){
cart.splice(index,1)
updateCart()
}

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

document.getElementById("total").innerText=total.toFixed(2)
document.getElementById("cart-count").innerText=cart.length
}

function toggleCart(){
document.getElementById("cart-panel").classList.toggle("active")
}

/* ================= CHECKOUT COM LOGIN OBRIGATÓRIO ================= */

async function checkout(){

if(cart.length===0){
alert("Carrinho vazio")
return
}

/* 🔐 SE NÃO ESTIVER LOGADO */
if(!currentUser){
alert("Você precisa fazer login para finalizar o pedido.")
document.getElementById("auth-screen").style.display="flex"
return
}

let total=0
cart.forEach(i=> total+=i.price)

const order={
userId: currentUser._id,
items: cart,
total: total,
status:"Recebido"
}

try{

const response=await fetch(`${API_URL}/orders`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(order)
})

if(!response.ok){
throw new Error("Erro ao salvar")
}

/* WhatsApp opcional */
let msg="🍔 Pedido Benis Burguer:%0A"
cart.forEach(i=>{
msg+=`${i.name} - R$ ${i.price.toFixed(2)}%0A`
})
msg+=`%0ATotal: R$ ${total.toFixed(2)}`
window.open(`https://wa.me/${phone}?text=${msg}`)

alert("Pedido enviado com sucesso!")

cart=[]
updateCart()

}catch(error){
console.error(error)
alert("Erro ao enviar pedido")
}

}

renderProducts()
