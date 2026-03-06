const produtos=[

{name:"X-Burguer",preco:13,rating:4.7},

{name:"X-Salada",preco:14,rating:4.5},

{name:"X-Bacon",preco:19,rating:4.8},

{name:"X-Tudo",preco:23,rating:4.9},

{name:"Batata",preco:15,rating:4.6}

]

let carrinho=[]

const menu=document.getElementById("menu")

produtos.forEach((p,i)=>{

let card=document.createElement("div")

card.className="card"

card.innerHTML=

`<h3>${p.name}</h3>
<div class="rating">⭐ ${p.rating}</div>
<p>R$ ${p.preco}</p>
<button onclick="add(${i})">Adicionar</button>`

menu.appendChild(card)

})

function add(i){

carrinho.push(produtos[i])

render()

recomendar()

}

function render(){

const cart=document.getElementById("cart")

cart.innerHTML=""

let total=0

carrinho.forEach(p=>{

let li=document.createElement("li")

li.innerText=p.name+" R$"+p.preco

cart.appendChild(li)

total+=p.preco

})

document.getElementById("total").innerText=total

}

function recomendar(){

if(carrinho.find(p=>p.name==="X-Burguer")){

setTimeout(()=>{

alert("🔥 Sugestão: adicione Batata!")

},500)

}

}

function aplicarCupom(total){

const cupom=document.getElementById("cupom").value

if(cupom==="BENIS10"){

return total*0.9

}

return total

}

function checkout(){

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
