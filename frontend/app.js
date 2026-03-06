// PRODUTOS DO CARDÁPIO
const produtos = [

{name:"X-Burguer", preco:13},
{name:"X-Salada", preco:14},
{name:"X-Bacon", preco:19},
{name:"X-Tudo", preco:23},
{name:"Batata", preco:15}

]

// CARRINHO
let carrinho = []

// MENU
const menu = document.getElementById("menu")

// LISTAR PRODUTOS
produtos.forEach((p,i)=>{

let div = document.createElement("div")

div.className = "item"

div.innerHTML = `
${p.name} - R$ ${p.preco}
<button onclick="add(${i})">Adicionar</button>
`

menu.appendChild(div)

})

// ADICIONAR AO CARRINHO
function add(i){

carrinho.push(produtos[i])

render()

recomendar()

}

// RENDERIZAR CARRINHO
function render(){

const cart = document.getElementById("cart")

cart.innerHTML = ""

let total = 0

carrinho.forEach(p=>{

let li = document.createElement("li")

li.innerText = `${p.name} - R$ ${p.preco}`

cart.appendChild(li)

total += p.preco

})

// atualizar total
document.getElementById("total").innerText = total

}

// IA DE RECOMENDAÇÃO
function recomendar(){

// se tiver batata
if(carrinho.find(p => p.name === "Batata")){

setTimeout(()=>{

alert("🔥 Sugestão: Adicione Cheddar + Bacon na Batata!")

},500)

}

// se tiver X-Burguer
if(carrinho.find(p => p.name === "X-Burguer")){

setTimeout(()=>{

alert("🍟 Combina muito com Batata Frita!")

},500)

}

}

// FINALIZAR PEDIDO
async function checkout(){

if(carrinho.length === 0){

alert("Seu carrinho está vazio!")

return

}

let total = 0

carrinho.forEach(p=> total += p.preco)

try{

await fetch("/api",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

cliente:"Cliente",
telefone:"000",
endereco:"Porto Velho",
itens:carrinho,
total:total

})

})

alert("✅ Pedido enviado com sucesso!")

carrinho = []

render()

}catch(e){

alert("Erro ao enviar pedido")

}

}
