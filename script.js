const produtos=[

{name:"X-Burguer",preco:13},

{name:"X-Salada",preco:14},

{name:"X-Calabresa",preco:18},

{name:"X-Bacon",preco:19},

{name:"X-Frango",preco:18},

{name:"X-Tudo",preco:23},

{name:"Batata Frita",preco:15},

{name:"Coca Cola 2L",preco:15}

]

let carrinho=[]

const menu=document.getElementById("menu")

produtos.forEach((p,i)=>{

let div=document.createElement("div")

div.className="item"

div.innerHTML=

`${p.name} - R$${p.preco}

<button onclick="add(${i})">Adicionar</button>`

menu.appendChild(div)

})


function add(i){

carrinho.push(produtos[i])

render()

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


function aberto(){

const agora=new Date()

const h=agora.getHours()

const d=agora.getDay()

if(d==1)return false

return h>=19 && h<=23

}


function finalizar(){

if(!aberto()){

alert("Estamos fechados")

return

}

let mensagem="Pedido Benis Burguer%0A"

carrinho.forEach(p=>{

mensagem+=p.name+"%0A"

})

window.open(

"https://wa.me/556993668336?text="+mensagem

)

}
