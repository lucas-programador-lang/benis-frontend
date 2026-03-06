const produtos=[

{name:"X-Burguer",preco:13},

{name:"X-Salada",preco:14},

{name:"X-Bacon",preco:19},

{name:"X-Tudo",preco:23},

{name:"Batata",preco:15}

]

let carrinho=[]

const menu=document.getElementById("menu")

produtos.forEach((p,i)=>{

let div=document.createElement("div")

div.innerHTML=

`${p.name} - R$${p.preco}
<button onclick="add(${i})">+</button>`

menu.appendChild(div)

})

function add(i){

carrinho.push(produtos[i])

render()

}

function render(){

const cart=document.getElementById("cart")

cart.innerHTML=""

carrinho.forEach(p=>{

let li=document.createElement("li")

li.innerText=p.name

cart.appendChild(li)

})

}

async function checkout(){

await fetch("/api",{

method:"POST",

body:JSON.stringify({

cliente:"cliente",

telefone:"000",

endereco:"Porto Velho",

itens:carrinho,

total:100

})

})

alert("Pedido enviado")

}
