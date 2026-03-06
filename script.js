const produtos = [

{name:"X-Burguer",preco:13},
{name:"X-Salada",preco:14},
{name:"X-Calabresa",preco:18},
{name:"X-Bacon",preco:19},
{name:"X-Frango",preco:18},
{name:"X-Tudo",preco:23},
{name:"X-Havaíno",preco:19},
{name:"X-Benis",preco:26},

]

let carrinho=[]
let total=0

const container=document.getElementById("produtos")

produtos.forEach(p=>{

const div=document.createElement("div")

div.className="produto"

div.innerHTML=`

<h3>${p.name}</h3>

<p>R$ ${p.preco}</p>

<button onclick="add('${p.name}',${p.preco})">

Adicionar

</button>

`

container.appendChild(div)

})

function add(nome,preco){

carrinho.push({nome,preco})

total+=preco

renderCart()

}

function renderCart(){

const ul=document.getElementById("cartItems")

ul.innerHTML=""

carrinho.forEach(i=>{

const li=document.createElement("li")

li.innerText=i.nome

ul.appendChild(li)

})

document.getElementById("total").innerText=total

}

function lojaAberta(){

const agora=new Date()

const hora=agora.getHours()

return hora>=19 && hora<=23

}

function atualizarStatus(){

const status=document.getElementById("statusLoja")

if(lojaAberta()){

status.innerText="🟢 Aberto"

}else{

status.innerText="🔴 Fechado"

}

}

setInterval(atualizarStatus,1000)

document.getElementById("finalizar").onclick=()=>{

if(!lojaAberta()){

alert("A loja está fechada!")

return

}

window.open("https://wa.me/556993668336")

}
