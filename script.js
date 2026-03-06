
const produtos = [

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

{name:"X-Benis",preco:26},

{name:"Batata Frita",preco:15},

{name:"Batata + Cheddar + Bacon",preco:25},

{name:"Coca Cola 2L",preco:15},

{name:"Coca Cola 1L",preco:10},

{name:"Tuchaua 2L",preco:9},

{name:"Dydyo 2L",preco:9},

{name:"Coca Cola Lata",preco:7}

]


let carrinho=[]


const lista=document.getElementById("produtos")


produtos.forEach((p,i)=>{

const div=document.createElement("div")

div.className="produto"

div.innerHTML=`

<span>${p.name} - R$${p.preco}</span>

<button onclick="add(${i})">Adicionar</button>

`

lista.appendChild(div)

})


function add(i){

carrinho.push(produtos[i])

renderCart()

}


function renderCart(){

const cart=document.getElementById("cartItems")

cart.innerHTML=""

let total=0

carrinho.forEach(p=>{

const li=document.createElement("li")

li.innerText=p.name+" - R$"+p.preco

cart.appendChild(li)

total+=p.preco

})

document.getElementById("total").innerText=total

}


function aberto(){

const agora=new Date()

const hora=agora.getHours()

const dia=agora.getDay()

if(dia==1) return false

return hora>=19 && hora<=23

}


document.getElementById("checkout").onclick=()=>{

if(!aberto()){

alert("Restaurante fechado!")

return

}

let mensagem="Pedido Benis Burguer:%0A"

carrinho.forEach(p=>{

mensagem+=p.name+"%0A"

})

window.open(

"https://wa.me/556993668336?text="+mensagem

)

}


function status(){

const abertoAgora=aberto()

document.getElementById("status").innerText=

abertoAgora ? "🟢 Aberto agora" : "🔴 Fechado"

}

setInterval(status,1000)

status()
