async function carregar(){

const res = await fetch("/api")

const pedidos = await res.json()

const tabela=document.getElementById("pedidos")

pedidos.results.forEach(p=>{

let tr=document.createElement("tr")

tr.innerHTML=

`<td>${p.id}</td>
<td>${p.cliente}</td>
<td>${p.total}</td>
<td>${p.status}</td>`

tabela.appendChild(tr)

})

}

carregar()
