// CARDÁPIO POR CATEGORIA

const cardapio = {

hamburguer: [

{name:"Misto Quente",preco:7},
{name:"X-Bauru",preco:8},
{name:"X-Burguer",preco:13},
{name:"X-Salada",preco:14},
{name:"X-Salada Especial",preco:17},
{name:"X-Calabresa",preco:18},
{name:"X-Bacon",preco:19},
{name:"X-Franbacon",preco:20},
{name:"X-Franbesa",preco:20},
{name:"X-Frango",preco:18},
{name:"X-Turbinado",preco:20},
{name:"X-Bagunça",preco:20},
{name:"X-Tudo",preco:23},
{name:"X-Havaiano",preco:19},
{name:"X-Benis",preco:26}

],

porcoes: [

{name:"Batata Frita",preco:15},
{name:"Batata + Cheddar + Bacon",preco:25}

],

bebidas: [

{name:"Coca Cola 2L",preco:15},
{name:"Coca Cola 1L",preco:10},
{name:"Tuchaua 2L",preco:9},
{name:"Dydyo 2L",preco:9},
{name:"Coca Cola Lata",preco:7}

],

adicionais: [

{name:"Hambúrguer extra",preco:5},
{name:"Frango extra",preco:3},
{name:"Ovo",preco:2},
{name:"Bacon",preco:3},
{name:"Calabresa",preco:3},
{name:"Salsicha",preco:2},
{name:"Banana",preco:2},
{name:"Abacaxi",preco:3},
{name:"Cheddar",preco:4},
{name:"Catupiry",preco:4},
{name:"Cebola caramelizada",preco:3}

]

}

// CARRINHO

let carrinho = []

const menu = document.getElementById("menu")

// ABRIR / FECHAR CARRINHO

function toggleCarrinho(){

const panel = document.getElementById("cartPanel")

panel.classList.toggle("open")

}

// MOSTRAR CATEGORIA

function mostrarCategoria(categoria){

menu.innerHTML=""

cardapio[categoria].forEach((p,i)=>{

let card=document.createElement("div")

card.className="card"

card.innerHTML=`

<h3>${p.name}</h3>

<p>R$ ${p.preco}</p>

<button onclick="add('${categoria}',${i})">Adicionar</button>

`

menu.appendChild(card)

})

}

// ADICIONAR ITEM

function add(cat,i){

carrinho.push(cardapio[cat][i])

render()

// animação botão carrinho

const botao=document.querySelector(".cart-button")

if(botao){

botao.style.transform="scale(1.2)"

setTimeout(()=>{

botao.style.transform="scale(1)"

},200)

}

recomendar()

}

// REMOVER ITEM

function remover(index){

carrinho.splice(index,1)

render()

}

// RENDER CARRINHO

function render(){

const cart=document.getElementById("cart")

cart.innerHTML=""

let total=0

carrinho.forEach((p,i)=>{

let li=document.createElement("li")

li.innerHTML=`

<div class="cart-info">

<span class="cart-nome">${p.name}</span>

<span class="cart-preco">R$ ${p.preco}</span>

</div>

<button class="remover-btn" onclick="remover(${i})">🗑</button>

`

cart.appendChild(li)

total+=p.preco

})

document.getElementById("total").innerText=total

// CONTADOR CARRINHO

const contador=document.getElementById("cart-count")

if(contador){

contador.innerText=carrinho.length

}

}

// IA RECOMENDAÇÃO

function recomendar(){

if(carrinho.find(p=>p.name==="X-Burguer")){

setTimeout(()=>{

alert("🔥 Combina muito com Batata Frita!")

},500)

}

}

// CUPOM

function aplicarCupom(total){

const cupom=document.getElementById("cupom").value

if(cupom==="BENIS10"){

return total*0.9

}

return total

}

// HORÁRIO RESTAURANTE

function restauranteAberto(){

const agora=new Date()

const hora=agora.getHours()

const dia=agora.getDay()

if(dia===1) return false

return hora>=19 && hora<24

}

// STATUS RESTAURANTE

function atualizarStatus(){

const aberto=restauranteAberto()

const status=document.getElementById("status")

const contador=document.getElementById("contador")

const agora=new Date()

let alvo=new Date()

if(aberto){

status.innerText="🟢 Aberto"

alvo.setHours(24,0,0)

}else{

status.innerText="🔴 Fechado"

alvo.setHours(19,0,0)

}

const diff=alvo-agora

const h=Math.floor(diff/1000/60/60)

const m=Math.floor(diff/1000/60)%60

const s=Math.floor(diff/1000)%60

contador.innerText=`${h}h ${m}m ${s}s`

}

setInterval(atualizarStatus,1000)

atualizarStatus()

// FINALIZAR PEDIDO

function checkout(){

if(!restauranteAberto()){

alert("Restaurante fechado")

return

}

if(carrinho.length===0){

alert("Carrinho vazio")

return

}

let total=0

carrinho.forEach(p=> total+=p.preco)

total=aplicarCupom(total)

let msg="Pedido Benis Burguer:%0A"

carrinho.forEach(p=>{

msg+=p.name+"%0A"

})

msg+="Total: R$"+total

window.open(

"https://wa.me/556993668336?text="+msg

)

}

// MOSTRAR HAMBURGUERES AO ABRIR

mostrarCategoria("hamburguer")
