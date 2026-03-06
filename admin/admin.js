async function carregar(){

try{

const res = await fetch("/api")

const data = await res.json()

const pedidos = data.results || data

const tabela = document.getElementById("pedidos")

tabela.innerHTML=""

let totalPedidos = 0
let faturamento = 0

pedidos.forEach(p=>{

let tr = document.createElement("tr")

tr.innerHTML = `
<td>${p.id}</td>
<td>${p.cliente}</td>
<td>R$ ${p.total}</td>
<td>${p.status}</td>
<td>
<button onclick="alterarStatus(${p.id})">
Atualizar
</button>
</td>
`

tabela.appendChild(tr)

totalPedidos++
faturamento += Number(p.total)

})

document.getElementById("totalPedidos").innerText = totalPedidos
document.getElementById("faturamento").innerText = "R$ " + faturamento

}catch(e){

console.log("Erro ao carregar pedidos", e)

}

}

function alterarStatus(id){

alert("Status atualizado para pedido "+id)

}

carregar()

// atualiza automaticamente a cada 5 segundos
setInterval(carregar,5000)
