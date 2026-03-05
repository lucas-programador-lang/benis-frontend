let carrinho=[]
let total=0

function add(nome,preco){

carrinho.push({nome,preco})

total+=preco

render()

}

function render(){

let lista=document.getElementById("cart")

lista.innerHTML=""

carrinho.forEach(i=>{

let li=document.createElement("li")

li.innerText=i.nome+" - R$"+i.preco

lista.appendChild(li)

})

document.getElementById("total").innerText=total

}

function pedido(){

let aberto=verificarHorario()

if(!aberto){

alert("Restaurante fechado")

return

}

let texto="Pedido:%0A"

carrinho.forEach(i=>{

texto+=i.nome+" R$"+i.preco+"%0A"

})

texto+="Total: R$"+total

window.open("https://wa.me/556993668336?text="+texto)

}

function verificarHorario(){

let agora=new Date()

let hora=agora.getHours()

if(hora>=19 && hora<=23){

document.getElementById("status").innerText="🟢 Aberto"

return true

}

document.getElementById("status").innerText="🔴 Fechado"

return false

}

verificarHorario()
